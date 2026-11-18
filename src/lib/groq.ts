import Groq from "groq-sdk";
import https from "https";
import net from "net";

// Prevent Node 22 Happy Eyeballs 250ms ETIMEDOUT on slower Wi-Fi / mobile hotspots
if (typeof net.setDefaultAutoSelectFamilyAttemptTimeout === "function") {
  net.setDefaultAutoSelectFamilyAttemptTimeout(5000);
}

const ipv4Agent = new https.Agent({
  family: 4,
  keepAlive: true,
});

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const rawKey = process.env.GROQ_API_KEY || "";
const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

export const groq = new Groq({
  apiKey,
  httpAgent: ipv4Agent,
  maxRetries: 2,
  timeout: 30000,
});

export default groq;
