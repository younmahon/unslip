import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * ⚙️ CONFIGURATION
 */
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o"; // or "gpt-4o-mini"
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const BG_URL =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=2200&q=80"; // coffee cup background

async function queryGPT(noun) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing – set VITE_OPENAI_API_KEY");
  }
  // Improved prompt: asks GPT to correct spelling and state the corrected word!
  const prompt = `You are an expert on Standard German grammar. If the user enters a misspelled or non-existent word, do your best to guess the intended German noun, correct the spelling, and answer based on your best guess. Respond ONLY with raw JSON (no markdown fences) in the format: {"article":"der/die/das","gender":"masculine/feminine/neuter","corrected":"CorrectedGermanWord"}. What is the definite article, gender, and the correctly spelled word for "${noun}"?`;

  const res = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: "Output ONLY the JSON object" },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    }),
  });
  if (!res.ok) throw new Error("API request failed");
  const data = await res.json();
  let content = data.choices?.[0]?.message?.content?.trim();
  if (content.startsWith("```")) {
    content = content.replace(/^```[a-zA-Z]*\n/, "").replace(/```$/, "").trim();
  }
  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Could not parse response: " + content);
  }
}

export default function GermanArticleHelper() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup() {
    const noun = word.trim().toLowerCase();
    if (!noun) return;
    setLoading(true);
    setError("");
    try {
      const { article, gender, corrected } = await queryGPT(noun);
      setResult({
        article,
        gender,
        corrected: corrected || noun.charAt(0).toUpperCase() + noun.slice(1),
        original: noun.charAt(0).toUpperCase() + noun.slice(1)
      });
      setWord("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url(${BG_URL})` }}>
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20" />
      <Card className="relative w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-sm bg-white/80">
        <CardContent className="p-8 flex flex-col space-y-6">
          <h1 className="text-3xl font-semibold text-center text-emerald-800 drop-shadow-md">Which article?</h1>
          <p className="text-center text-base text-gray-700">Enter a German noun to instantly see its correct article and gender. Spelling mistakes are OK!</p>
          <div className="flex space-x-2">
            <Input value={word} placeholder="e.g. Hund" onChange={e => setWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLookup()} className="flex-1" />
            <Button onClick={handleLookup} disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : "Check"}</Button>
          </div>
          {error && <p className="text-center text-red-600 text-sm mt-2">{error}</p>}
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4">
              <p className="text-xl font-medium">{result.article} {result.corrected}</p>
              <p className="text-sm text-gray-600 italic">Genus: {result.gender}</p>
              {result.original !== result.corrected && (
                <p className="text-xs text-gray-400 italic">
                  (Best guess for: {result.original})
                </p>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
