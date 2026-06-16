import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert AI chemistry tutor for a virtual chemistry laboratory platform called ChemLab AI.
You help students from preparatory class through grade 12 understand chemistry concepts.

Your responses should be:
- Scientifically accurate and precise
- Clear and educational, appropriate for the student's grade level
- Concise but complete (2-5 sentences typically)
- Include chemical formulas, equations, or examples when relevant
- Encouraging and supportive

Topics you excel at: atomic structure, periodic table, chemical bonding, acids and bases,
thermochemistry, reaction kinetics, electrochemistry, organic chemistry, titration,
electrolysis, galvanic cells, redox reactions, stoichiometry, solutions, and laboratory techniques.

When discussing reactions, include the balanced equation if relevant.
When explaining observations (like color changes), explain the underlying chemistry.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context, mode } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback: rule-based chemistry responses
      const response = generateChemistryResponse(message, context, mode);
      return NextResponse.json({ response });
    }

    // Try Anthropic Claude API
    if (process.env.ANTHROPIC_API_KEY) {
      const contextPart = context ? `\n\nLab context: ${context}` : '';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: message + contextPart }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.content?.[0]?.text || 'I could not generate a response.';
        return NextResponse.json({ response: text });
      }
    }

    // Try OpenAI fallback
    if (process.env.OPENAI_API_KEY) {
      const contextPart = context ? `\n\nLab context: ${context}` : '';
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          max_tokens: 512,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message + contextPart },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content || 'I could not generate a response.';
        return NextResponse.json({ response: text });
      }
    }

    // Final fallback
    const response = generateChemistryResponse(message, context, mode);
    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    const response = generateChemistryResponse('general', '', 'free-lab');
    return NextResponse.json({ response });
  }
}

function generateChemistryResponse(message: string, context: string, mode: string): string {
  const msg = message.toLowerCase();

  if (msg.includes('hcl') && msg.includes('naoh')) {
    return 'HCl + NaOH → NaCl + H₂O\n\nThis is an acid-base neutralization reaction. The strong acid (HCl) reacts completely with the strong base (NaOH) to produce sodium chloride (common salt) and water. The reaction is exothermic, releasing about 57.3 kJ/mol of heat. The resulting solution is neutral (pH ≈ 7) at the equivalence point.';
  }
  if (msg.includes('blue') || msg.includes('mavi')) {
    return 'The blue color you observe is most likely due to Cu²⁺ ions (copper(II) ions) in solution. Copper sulfate (CuSO₄) solutions are characteristically blue due to the [Cu(H₂O)₆]²⁺ complex absorbing red wavelengths of light and reflecting blue. If you added NaOH, a blue precipitate of Cu(OH)₂ would form.';
  }
  if (msg.includes('oxidation state') || msg.includes('oxidasyon')) {
    return 'Oxidation states are formal charges assigned to atoms based on electronegativity. Key rules: pure elements = 0; monoatomic ions = their charge; H is +1 (except in metal hydrides where it\'s -1); O is -2 (except in peroxides where it\'s -1). In CuSO₄: Cu is +2, S is +6, O is -2. In KMnO₄: K is +1, O is -2, so Mn must be +7.';
  }
  if (msg.includes('ph') || msg.includes('acid') || msg.includes('base')) {
    return 'pH = -log[H⁺]. The pH scale runs from 0 to 14: pH < 7 is acidic, pH = 7 is neutral, pH > 7 is basic (alkaline). Strong acids (HCl, H₂SO₄, HNO₃) fully dissociate; weak acids (CH₃COOH, H₂CO₃) partially dissociate. Strong bases (NaOH, KOH) fully dissociate. When an acid and base neutralize each other, they form a salt and water.';
  }
  if (msg.includes('conduct') || msg.includes('elektrik') || msg.includes('iletken')) {
    return 'Electrical conductivity in solutions is due to the movement of ions. When ionic compounds dissolve in water (like NaCl → Na⁺ + Cl⁻), they create ions that carry electrical current. Polar covalent molecules like HCl also ionize in water. Pure water has very low conductivity. Strong electrolytes (NaCl, HCl, NaOH) conduct better than weak electrolytes (acetic acid, ammonia).';
  }
  if (msg.includes('titration') || msg.includes('titrasyon')) {
    return 'Titration is a quantitative technique where a solution of known concentration (titrant) is slowly added to one of unknown concentration (analyte) until the reaction is complete (equivalence point). For acid-base titrations: M₁V₁ = M₂V₂ at the equivalence point. Indicators like phenolphthalein (colorless→pink in base) help determine the endpoint. The choice of indicator depends on the equivalence point pH.';
  }
  if (msg.includes('electrolysis') || msg.includes('elektroliz')) {
    return 'Electrolysis uses electrical energy to drive non-spontaneous reactions. At the cathode (negative): cations gain electrons (reduction). At the anode (positive): anions lose electrons (oxidation). Faraday\'s Law: m = MIt/nF, where m=mass deposited, M=molar mass, I=current, t=time, n=electrons transferred, F=96485 C/mol. Applications include electroplating, aluminum production, and water splitting.';
  }
  if (msg.includes('galvanic') || msg.includes('cell') || msg.includes('pil')) {
    return 'A galvanic (voltaic) cell converts chemical energy to electrical energy via spontaneous redox reactions. The anode (oxidation, negative terminal) and cathode (reduction, positive terminal) are connected by a salt bridge that maintains electrical neutrality. E°cell = E°cathode - E°anode. For a Zn-Cu cell: E°cell = +0.34V - (-0.76V) = +1.10V. A positive E°cell means the reaction is spontaneous.';
  }
  if (msg.includes('organic') || msg.includes('organik')) {
    return 'Organic chemistry studies carbon-containing compounds. Carbon is unique — it forms 4 bonds and can chain with other carbons. Hydrocarbons: alkanes (CₙH₂ₙ₊₂, single bonds), alkenes (CₙH₂ₙ, double bond), alkynes (CₙH₂ₙ₋₂, triple bond). Functional groups determine reactivity: -OH (alcohol), -COOH (carboxylic acid), -CHO (aldehyde), -CO- (ketone), -NH₂ (amine). IUPAC naming follows systematic rules based on the parent chain.';
  }
  if (msg.includes('precipitate') || msg.includes('çökelti')) {
    return 'A precipitate forms when two aqueous solutions are mixed and produce an insoluble product. Example: AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq). The white AgCl precipitate is used to test for chloride ions. Other examples: Cu(OH)₂ (blue, from CuSO₄ + NaOH), BaSO₄ (white, from Ba²⁺ + SO₄²⁻), Fe(OH)₃ (rust-brown). Solubility rules help predict whether a precipitate will form.';
  }
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('nedir') || msg.includes('açıkla')) {
    if (context?.includes('reaction')) {
      return `I'll explain the reaction in your current experiment.\n\n${context}\n\nIn chemistry, reactions occur when reactant bonds break and new product bonds form. The driving forces include formation of stable products, release of energy (exothermic), production of gas or precipitate, and formation of water. The enthalpy change (ΔH) tells us whether energy is released (ΔH < 0, exothermic) or absorbed (ΔH > 0, endothermic).`;
    }
  }

  const defaults = [
    'Chemistry is the study of matter and its transformations. Every substance around us — from the water we drink to the air we breathe — is made of atoms bonded together. Chemical reactions break and form these bonds, converting reactants into new products with different properties.',
    'Great question! In chemistry, we use the mole concept to count atoms and molecules. One mole = 6.022 × 10²³ particles (Avogadro\'s number). This allows us to relate macroscopic measurements (grams) to the atomic scale. Molarity (M) = moles of solute per liter of solution.',
    'The periodic table organizes elements by atomic number. Elements in the same group share similar properties because they have the same number of valence electrons. Trends: atomic radius increases down a group; electronegativity and ionization energy increase across a period from left to right.',
    'Ask me specific questions about reactions, concepts, or observations in your experiment! I can explain color changes, gas formation, precipitates, pH changes, energy changes, and much more.',
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}
