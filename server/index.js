import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(__dirname, "../dist")));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a logistics cost optimization expert. Analyze the shipment data and return ONLY a valid JSON object — no prose, no markdown, no code fences. Start with { and end with }.

Use exactly this structure:
{"totalSpend":number,"potentialSavings":number,"savingsPercent":number,"carrierSavings":number,"modeSavings":number,"shipmentCount":number,"airCount":number,"groundCount":number,"carrierBreakdown":[{"name":string,"spend":number,"pct":number}],"monthlyTrend":[{"month":string,"spend":number}],"insights":[{"id":string,"icon":string,"title":string,"savingsAmount":number,"savingsPercent":number,"description":string,"savingsPotential":number,"easeOfExecution":number,"priority":number,"priorityLabel":string,"timeToImplement":string,"effort":string}],"actionPlan":[{"rank":number,"title":string,"description":string,"savingsAmount":number,"timeToImplement":string,"effort":string,"steps":[string]}]}

RULES: savingsPotential and easeOfExecution are integers 1-10. priority: 1=Do First, 2=Plan For, 3=Quick Win, 4=Defer. Return 5-6 insights and 5 action plan items. carrierBreakdown: top 4 carriers by spend. monthlyTrend: 12 months estimated. All amounts are realistic annual figures.`;

app.post("/api/analyze", async (req, res) => {
  const { csvData } = req.body;
  if (!csvData) return res.status(400).json({ error: "No data provided" });
  try {
    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Analyze this shipment data. Return valid JSON only:\n\n${csvData.slice(0, 8000)}` }]
    });
    const rawText = message.content.filter(b => b.type === "text").map(b => b.text).join("").trim();
    const cleaned = rawText.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/m, "").trim();
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON in response");
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    if (!parsed.insights || !parsed.actionPlan) throw new Error("Missing required fields");
    res.json(parsed);
  } catch (err) {
    console.error("Analysis error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "../dist/index.html")));
app.listen(PORT, () => console.log(`CostCompass running on port ${PORT}`));
