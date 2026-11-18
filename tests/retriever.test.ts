import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { retrieveContext, retrieveDetailedContext } from "../src/lib/rag/retriever";

describe("WHO-Inspired Clinical Protocol RAG Retriever", () => {
  it("matches cardiac emergency protocol for chest pain and shortness of breath", () => {
    const result = retrieveDetailedContext(
      "I have sudden crushing chest pain radiating to left arm and shortness of breath"
    );
    assert.ok(result.matchedProtocols.length > 0);
    assert.equal(result.highestSeverity, "emergency");
    assert.ok(result.contextText.length > 0);
  });

  it("matches relevant protocol for Roman Urdu fever symptoms", () => {
    const result = retrieveDetailedContext("Mujhe 2 din se tez bukhar hai aur thand lag rahi hai");
    assert.ok(result.matchedProtocols.length > 0);
    assert.ok(result.contextText.length > 0);
  });

  it("returns empty context without hallucinating on non-medical text", () => {
    const result = retrieveDetailedContext("hello how is the weather in Lahore today");
    assert.equal(result.matchedProtocols.length, 0);
    assert.equal(result.contextText, "");
    assert.equal(retrieveContext("hello how is the weather today"), "");
  });

  it("handles empty or whitespace inputs safely", () => {
    const result = retrieveDetailedContext("   ");
    assert.equal(result.matchedProtocols.length, 0);
    assert.equal(result.contextText, "");
  });
});
