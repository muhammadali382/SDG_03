import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkSafetyGuardrails } from "../src/lib/guardrails";

describe("Clinical Safety & Crisis Guardrails", () => {
  it("detects English self-harm and suicidal ideation", () => {
    const result = checkSafetyGuardrails("I want to end my life today");
    assert.equal(result.isSelfHarmOrCrisis, true);
    assert.ok(result.matchedKeywords.length > 0);
    assert.equal(result.recommendedHelpline?.phone, "0317-4288665");
  });

  it("detects Roman Urdu self-harm phrases", () => {
    const result = checkSafetyGuardrails("mei khud ko mar lu ga aj");
    assert.equal(result.isSelfHarmOrCrisis, true);
    assert.equal(result.recommendedHelpline?.phone, "0317-4288665");
  });

  it("detects native Urdu script self-harm phrases", () => {
    const result = checkSafetyGuardrails("میں خودکشی کرنا چاہتا ہوں");
    assert.equal(result.isSelfHarmOrCrisis, true);
    assert.equal(result.recommendedHelpline?.phone, "0317-4288665");
  });

  it("detects acute physical emergencies in English and Roman Urdu", () => {
    const cardiacEn = checkSafetyGuardrails(
      "Sudden crushing chest pain and shortness of breath"
    );
    assert.equal(cardiacEn.isAcuteMedicalEmergency, true);
    assert.equal(cardiacEn.isSelfHarmOrCrisis, false);
    assert.equal(cardiacEn.recommendedHelpline?.phone, "1122");

    const cardiacUr = checkSafetyGuardrails("mujhe seene mein dard ho raha hai");
    assert.equal(cardiacUr.isAcuteMedicalEmergency, true);
    assert.equal(cardiacUr.recommendedHelpline?.phone, "1122");
  });

  it("does not trigger false positives on benign routine symptoms", () => {
    const result = checkSafetyGuardrails(
      "I have a mild runny nose and slight headache since morning"
    );
    assert.equal(result.isSelfHarmOrCrisis, false);
    assert.equal(result.isAcuteMedicalEmergency, false);
    assert.equal(result.matchedKeywords.length, 0);
  });
});
