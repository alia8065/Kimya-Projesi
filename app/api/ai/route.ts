import { NextRequest, NextResponse } from "next/server";

const CHEMISTRY_SYSTEM_PROMPT = `You are ChemBot, an expert AI chemistry tutor for a virtual chemistry laboratory platform.
You help students understand chemistry concepts, explain reactions, predict products, and guide experiments.

Your responses should be:
- Educational and accurate
- Encouraging and supportive
- Clear and concise
- Include chemical formulas when relevant
- Mention safety considerations when appropriate
- Suitable for high school chemistry students

When explaining reactions:
- Write balanced equations
- Explain what happens step by step
- Mention color changes, precipitates, gases, temperature changes
- Connect to real-world applications

Always respond in the same language the student uses (Turkish or English).
For Turkish students, use proper chemistry terminology in Turkish.`;

const FALLBACK_RESPONSES: Record<string, string> = {
  "titration": "Titration is a quantitative analytical technique used to determine the concentration of an unknown solution. A solution of known concentration (titrant) is added to the unknown solution until the reaction is complete, indicated by an endpoint change (often via an indicator like phenolphthalein). The equivalence point is when moles of titrant equal moles of analyte. Formula: C₁V₁ = C₂V₂",
  "pH": "pH measures the acidity or basicity of a solution. pH = -log[H⁺]. A pH of 7 is neutral, below 7 is acidic, above 7 is basic. Strong acids fully dissociate (HCl → H⁺ + Cl⁻), while weak acids partially dissociate. At 25°C: pure water has pH = 7.",
  "oxidation": "Oxidation is the loss of electrons (OIL - Oxidation Is Loss). In redox reactions, the oxidizing agent gains electrons and is reduced, while the reducing agent loses electrons and is oxidized. Oxidation states help track electron transfer. Example: In CuO + H₂ → Cu + H₂O, copper goes from +2 to 0 (reduced), hydrogen goes from 0 to +1 (oxidized).",
  "default": "That's a great chemistry question! In our virtual lab, you can explore this concept by running experiments with the chemicals available. Try selecting relevant chemicals and observing the reaction. I'm here to help explain what you observe!"
};

export async function POST(req: NextRequest) {
  try {
    const { message, context, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Check for API key
    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Intelligent fallback without API key
      const lowerMsg = message.toLowerCase();
      let response = FALLBACK_RESPONSES.default;

      for (const [key, val] of Object.entries(FALLBACK_RESPONSES)) {
        if (key !== 'default' && lowerMsg.includes(key)) {
          response = val;
          break;
        }
      }

      // Add context-aware responses
      if (context?.reaction) {
        response = `Based on your reaction: ${context.reaction.equation}\n\n${context.reaction.description}\n\nObservations: ${context.reaction.observations?.join(', ') || 'See the results in the lab!'}\n\nDo you have any specific questions about this reaction?`;
      }

      if (lowerMsg.includes("why") && lowerMsg.includes("blue")) {
        response = "The blue color in your solution is likely due to Cu²⁺ ions (copper ions). Copper sulfate (CuSO₄) solution is characteristically blue because the Cu²⁺ ions absorb red and orange wavelengths of light, reflecting blue. When you add NaOH to CuSO₄, a blue precipitate of Cu(OH)₂ forms!";
      }

      if (lowerMsg.includes("precipitate") || lowerMsg.includes("çökelti")) {
        response = "A precipitate forms when two solutions are mixed and an insoluble product is created. For example, AgNO₃ + NaCl → AgCl↓ (white precipitate) + NaNO₃. The ↓ symbol indicates a precipitate. Precipitation reactions are used in analytical chemistry to identify ions!";
      }

      if (lowerMsg.includes("renk") || lowerMsg.includes("color change")) {
        response = "Color changes in reactions indicate chemical transformations. For example: Phenolphthalein is colorless in acid (pH < 8.2) and pink/magenta in base (pH > 8.2). KMnO₄ is deep purple and becomes colorless when reduced. CuSO₄ is blue and forms white CuSO₄·0H₂O when dehydrated.";
      }

      return NextResponse.json({
        response,
        model: "ChemBot (Offline Mode)",
        usage: { prompt_tokens: 0, completion_tokens: 0 }
      });
    }

    // Try Anthropic API first, then OpenAI
    if (process.env.ANTHROPIC_API_KEY) {
      const { Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const messages = [
        ...(history || []).slice(-6).map((h: { role: string; content: string }) => ({
          role: h.role as "user" | "assistant",
          content: h.content
        })),
        {
          role: "user" as const,
          content: context
            ? `Context: ${JSON.stringify(context)}\n\nStudent question: ${message}`
            : message
        }
      ];

      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: CHEMISTRY_SYSTEM_PROMPT,
        messages,
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';

      return NextResponse.json({
        response: text,
        model: response.model,
        usage: response.usage
      });
    }

    return NextResponse.json({ error: "No AI API configured" }, { status: 503 });

  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please try asking your chemistry question again, or explore the virtual lab independently!",
      error: true
    });
  }
}
