#!/usr/bin/env node
/**
 * Zero-dep handoff/v1 checker (ADR 0002 / 0004).
 * Extra fields are allowed. Missing required fields fail closed.
 *
 * Default: examples/handoff.broken.json must be rejected;
 *          examples/handoff.fixed.json must be accepted.
 *
 *   node scripts/validate-handoff.mjs
 *   node scripts/validate-handoff.mjs path/to/envelope.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const LAYERS = new Set(["brain", "worker", "ops"]);
const KINDS = new Set([
  "assign",
  "result",
  "ops_event",
  "hitl_request",
  "hitl_decision",
]);
const WRITE_POLICIES = new Set(["hitl", "deny", "allowlist"]);
const RESULT_STATUSES = new Set(["ok", "blocked", "needs_hitl", "failed"]);

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * @param {unknown} envelope
 * @returns {string[]}
 */
export function validateHandoff(envelope) {
  const errors = [];

  if (!isObject(envelope)) {
    return ["envelope must be a JSON object"];
  }

  if (envelope.schema !== "handoff/v1") {
    errors.push('schema must be "handoff/v1"');
  }

  for (const field of ["id", "correlation_id", "goal"]) {
    if (!isNonEmptyString(envelope[field])) {
      errors.push(`${field} must be a non-empty string`);
    }
  }

  if (envelope.parent_id !== null && !isNonEmptyString(envelope.parent_id)) {
    errors.push("parent_id must be a string or null");
  }

  if (!KINDS.has(envelope.kind)) {
    errors.push(
      `kind must be one of ${[...KINDS].join(", ")} (got ${JSON.stringify(envelope.kind)})`,
    );
  }

  for (const side of ["from", "to"]) {
    const actor = envelope[side];
    if (!isObject(actor)) {
      errors.push(`${side} must be { layer, role }`);
      continue;
    }
    if (!LAYERS.has(actor.layer)) {
      errors.push(
        `${side}.layer must be one of ${[...LAYERS].join(", ")} (got ${JSON.stringify(actor.layer)})`,
      );
    }
    if (!isNonEmptyString(actor.role)) {
      errors.push(`${side}.role must be a non-empty string (worker scope, not a vendor name)`);
    }
  }

  if (!WRITE_POLICIES.has(envelope.write_policy)) {
    errors.push(
      `write_policy must be hitl | deny | allowlist (HITL on writes; got ${JSON.stringify(envelope.write_policy)})`,
    );
  }

  if (!isObject(envelope.inputs) || !Array.isArray(envelope.inputs.refs)) {
    errors.push("inputs.refs must be an array (pointers, not a transcript blob)");
  }

  if (!isObject(envelope.budget) || !Array.isArray(envelope.budget.tools)) {
    errors.push("budget.tools must be an array (empty means no tools)");
  }

  if (!Array.isArray(envelope.acceptance)) {
    errors.push("acceptance must be an array");
  }

  const observability = envelope.observability;
  if (!isObject(observability) || !isNonEmptyString(observability.trace_id)) {
    errors.push("observability.trace_id is required (ops cannot bind eval rows without it)");
  }

  if (envelope.kind === "result") {
    if (!RESULT_STATUSES.has(envelope.status)) {
      errors.push(
        `result.status must be one of ${[...RESULT_STATUSES].join(", ")} (got ${JSON.stringify(envelope.status)})`,
      );
    }

    const proposed = Array.isArray(envelope.proposed_writes)
      ? envelope.proposed_writes
      : [];

    if (proposed.length > 0 && envelope.status !== "needs_hitl") {
      errors.push(
        "HITL on writes: non-empty proposed_writes requires status needs_hitl (do not apply)",
      );
    }

    if (
      envelope.write_policy === "hitl" &&
      envelope.status === "ok" &&
      proposed.length > 0
    ) {
      errors.push(
        "HITL on writes: status ok under write_policy hitl cannot carry proposed_writes",
      );
    }

    if (
      envelope.write_policy === "hitl" &&
      envelope.status === "ok" &&
      isObject(envelope.inputs) &&
      Array.isArray(envelope.inputs.refs) &&
      envelope.inputs.refs.length === 0
    ) {
      errors.push(
        "HITL on writes: status ok under write_policy hitl with empty inputs.refs is unreconstructable (silent write)",
      );
    }
  }

  if (
    isObject(envelope.inputs) &&
    isObject(envelope.inputs.inline) &&
    Object.prototype.hasOwnProperty.call(envelope.inputs.inline, "blob")
  ) {
    errors.push("inputs.inline.blob is a transcript dump; use inputs.refs (ADR 0004)");
  }

  return errors;
}

/**
 * @param {string} filePath
 * @returns {{ errors: string[], envelope: unknown }}
 */
function readAndValidate(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const envelope = JSON.parse(raw);
  return { errors: validateHandoff(envelope), envelope };
}

/**
 * @returns {number}
 */
function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(here, "..");
  const extra = process.argv.slice(2);

  if (extra.length > 0) {
    let failed = false;
    for (const rel of extra) {
      const filePath = path.resolve(rel);
      const { errors } = readAndValidate(filePath);
      if (errors.length === 0) {
        console.log(`${rel}: ACCEPTED`);
      } else {
        failed = true;
        console.log(`${rel}: REJECTED`);
        for (const error of errors) {
          console.log(`  - ${error}`);
        }
      }
    }
    return failed ? 1 : 0;
  }

  const brokenPath = path.join(root, "examples", "handoff.broken.json");
  const fixedPath = path.join(root, "examples", "handoff.fixed.json");

  if (!fs.existsSync(brokenPath) || !fs.existsSync(fixedPath)) {
    console.error("Missing examples/handoff.broken.json or examples/handoff.fixed.json");
    return 1;
  }

  const broken = readAndValidate(brokenPath);
  const fixed = readAndValidate(fixedPath);
  let failed = false;

  if (broken.errors.length === 0) {
    failed = true;
    console.log("examples/handoff.broken.json: ACCEPTED (expected REJECTED)");
  } else {
    console.log("examples/handoff.broken.json: REJECTED (expected)");
    for (const error of broken.errors) {
      console.log(`  - ${error}`);
    }
  }

  if (fixed.errors.length > 0) {
    failed = true;
    console.log("examples/handoff.fixed.json: REJECTED (expected ACCEPTED)");
    for (const error of fixed.errors) {
      console.log(`  - ${error}`);
    }
  } else {
    console.log("examples/handoff.fixed.json: ACCEPTED (expected)");
  }

  if (failed) {
    console.error("Handoff fixture expectations failed.");
    return 1;
  }

  console.log("OK");
  return 0;
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  process.exit(main());
}
