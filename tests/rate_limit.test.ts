import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkRateLimit } from "../src/lib/rate_limit";

describe("In-Memory Sliding Window Rate Limiter", () => {
  it("allows requests within the configured window and blocks excess calls", () => {
    const key = `test-limit-${Date.now()}`;
    const r1 = checkRateLimit(key, 2, 60_000);
    const r2 = checkRateLimit(key, 2, 60_000);
    const r3 = checkRateLimit(key, 2, 60_000);

    assert.equal(r1.allowed, true);
    assert.equal(r2.allowed, true);
    assert.equal(r3.allowed, false);
    assert.ok(r3.retryAfterSeconds > 0);
  });

  it("isolates limits across distinct keys", () => {
    const keyA = `test-iso-a-${Date.now()}`;
    const keyB = `test-iso-b-${Date.now()}`;

    assert.equal(checkRateLimit(keyA, 1, 60_000).allowed, true);
    assert.equal(checkRateLimit(keyA, 1, 60_000).allowed, false);
    assert.equal(checkRateLimit(keyB, 1, 60_000).allowed, true);
  });
});
