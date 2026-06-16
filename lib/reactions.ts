export type ReactionType =
  | 'acid-base'
  | 'redox'
  | 'precipitation'
  | 'decomposition'
  | 'synthesis'
  | 'combustion'
  | 'neutralization';

export interface ReactionResult {
  products: string[];
  description: string;
  observations: string[];
  equation: string;
  reactionType: ReactionType;
  isExothermic: boolean;
  colorChange: string | null;
  precipitate: string | null;
  gasProduced: string | null;
  pHChange: number | null;
}

interface ReactionRule {
  reactants: string[]; // sorted chemical ids
  result: ReactionResult;
}

// Helper to build a canonical key from any set of reactant ids
function makeKey(ids: string[]): string {
  return [...ids].sort().join('+');
}

const REACTION_RULES: ReactionRule[] = [
  // ─── 1. HCl + NaOH → NaCl + H₂O ─────────────────────────────────────────
  {
    reactants: ['hcl', 'naoh'],
    result: {
      products: ['nacl', 'h2o'],
      description:
        'Hydrochloric acid reacts with sodium hydroxide in a classic acid-base neutralization. The H⁺ ions from HCl combine with the OH⁻ ions from NaOH to form water, and the Na⁺ and Cl⁻ ions remain in solution as sodium chloride.',
      observations: [
        'The solution becomes warm (exothermic reaction)',
        'pH decreases from strongly basic toward neutral',
        'No visible color change if no indicator is present',
        'With phenolphthalein indicator: pink solution turns colorless',
      ],
      equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: 'Pink → colorless (with phenolphthalein)',
      precipitate: null,
      gasProduced: null,
      pHChange: -7,
    },
  },

  // ─── 2. H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O ─────────────────────────────
  {
    reactants: ['h2so4', 'naoh'],
    result: {
      products: ['h2o'],
      description:
        'Sulfuric acid reacts with sodium hydroxide in a strongly exothermic neutralization. Two moles of NaOH are required to fully neutralize one mole of H₂SO₄, producing sodium sulfate and water.',
      observations: [
        'Significant heat is released – solution becomes very warm',
        'pH rises toward neutral as NaOH is added',
        'No precipitate or gas formed',
        'With phenolphthalein: remains colorless in acid, turns pink at endpoint',
      ],
      equation: 'H₂SO₄(aq) + 2 NaOH(aq) → Na₂SO₄(aq) + 2 H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: null,
      pHChange: -7,
    },
  },

  // ─── 3. AgNO₃ + NaCl → AgCl↓ + NaNO₃ ───────────────────────────────────
  {
    reactants: ['agno3', 'nacl'],
    result: {
      products: ['h2o'],
      description:
        'Silver nitrate reacts with sodium chloride in a precipitation reaction. The silver ions (Ag⁺) combine with chloride ions (Cl⁻) to form silver chloride (AgCl), an insoluble white precipitate, while sodium nitrate remains in solution.',
      observations: [
        'Immediate white precipitate forms (AgCl)',
        'Precipitate curdles and is insoluble in dilute acids',
        'Precipitate turns gray/violet in sunlight (photosensitivity)',
        'Solution remains clear around the precipitate',
      ],
      equation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Colorless → white precipitate',
      precipitate: 'AgCl (white)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 4. CuSO₄ + 2 NaOH → Cu(OH)₂↓ + Na₂SO₄ ────────────────────────────
  {
    reactants: ['cuso4', 'naoh'],
    result: {
      products: ['h2o'],
      description:
        'Copper(II) sulfate reacts with sodium hydroxide in a precipitation reaction. The blue Cu²⁺ ions react with OH⁻ ions to produce copper(II) hydroxide, a pale blue/turquoise gelatinous precipitate.',
      observations: [
        'Blue gelatinous precipitate of Cu(OH)₂ forms',
        'Solution changes from bright blue to lighter blue then pale',
        'Precipitate is soluble in excess NaOH (forming deep blue [Cu(OH)₄]²⁻)',
        'On heating, precipitate turns black (CuO formation)',
      ],
      equation: 'CuSO₄(aq) + 2 NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Blue solution → pale blue precipitate',
      precipitate: 'Cu(OH)₂ (blue/turquoise)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 5. CaCO₃ + 2 HCl → CaCl₂ + H₂O + CO₂↑ ────────────────────────────
  {
    reactants: ['caco3', 'hcl'],
    result: {
      products: ['h2o'],
      description:
        'Calcium carbonate reacts with hydrochloric acid. The carbonate ion reacts with H⁺ ions to form carbonic acid (H₂CO₃), which immediately decomposes into water and carbon dioxide gas.',
      observations: [
        'Vigorous effervescence (CO₂ bubbles) from the limestone/marble',
        'Solid CaCO₃ gradually dissolves',
        'Colorless CO₂ gas produced (turns limewater milky)',
        'Solution warms slightly',
      ],
      equation: 'CaCO₃(s) + 2 HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑',
      reactionType: 'acid-base',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'CO₂',
      pHChange: -4,
    },
  },

  // ─── 6. Mg + 2 HCl → MgCl₂ + H₂↑ ──────────────────────────────────────
  {
    reactants: ['mg', 'hcl'],
    result: {
      products: ['h2o'],
      description:
        'Magnesium metal reacts vigorously with hydrochloric acid. Magnesium is oxidized (loses electrons) while H⁺ ions are reduced to hydrogen gas. The reaction rate is notably faster than iron or zinc with HCl.',
      observations: [
        'Vigorous bubbling of H₂ gas from the metal surface',
        'Magnesium ribbon dissolves rapidly',
        'Solution becomes warm (exothermic)',
        'Metal eventually disappears completely',
        'Colorless H₂ gas is produced (flammable – squeaky pop with burning splint)',
      ],
      equation: 'Mg(s) + 2 HCl(aq) → MgCl₂(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 7. Zn + H₂SO₄ → ZnSO₄ + H₂↑ ──────────────────────────────────────
  {
    reactants: ['zn', 'h2so4'],
    result: {
      products: ['h2o'],
      description:
        'Zinc reacts with dilute sulfuric acid in a single displacement reaction. Zinc is more reactive than hydrogen, so it displaces hydrogen from the acid to form zinc sulfate and hydrogen gas.',
      observations: [
        'Steady production of hydrogen gas bubbles',
        'Zinc metal gradually dissolves',
        'Solution remains colorless (ZnSO₄ is colorless)',
        'Mild warming of the solution',
        'H₂ gas confirmed by squeaky pop test',
      ],
      equation: 'Zn(s) + H₂SO₄(aq) → ZnSO₄(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 8. Fe + 2 HCl → FeCl₂ + H₂↑ ──────────────────────────────────────
  {
    reactants: ['fe', 'hcl'],
    result: {
      products: ['h2o'],
      description:
        'Iron reacts with hydrochloric acid to produce iron(II) chloride and hydrogen gas. The reaction proceeds more slowly than with magnesium or zinc, reflecting iron\'s lower reactivity.',
      observations: [
        'Slow to moderate bubble production (H₂)',
        'Iron metal surface becomes pitted',
        'Solution gradually turns pale green (FeCl₂)',
        'Iron dissolves over time',
        'Heat is released slowly',
      ],
      equation: 'Fe(s) + 2 HCl(aq) → FeCl₂(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Colorless → pale green',
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 9. 2 KMnO₄ + 5 H₂O₂ + 3 H₂SO₄ → ... ──────────────────────────────
  {
    reactants: ['kmno4', 'h2o2'],
    result: {
      products: ['h2o'],
      description:
        'Potassium permanganate oxidizes hydrogen peroxide in an acidic redox reaction. The intense purple permanganate is reduced to colorless Mn²⁺, while H₂O₂ is oxidized to oxygen gas.',
      observations: [
        'Intense purple color of KMnO₄ fades and disappears',
        'Solution becomes colorless when all KMnO₄ is consumed',
        'Vigorous O₂ gas evolution (effervescence)',
        'Heat released – solution warms up',
        'Reaction accelerates as Mn²⁺ acts as autocatalyst',
      ],
      equation:
        '2 KMnO₄(aq) + 5 H₂O₂(aq) + 3 H₂SO₄(aq) → 2 MnSO₄(aq) + K₂SO₄(aq) + 8 H₂O(l) + 5 O₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Purple → colorless',
      precipitate: null,
      gasProduced: 'O₂',
      pHChange: null,
    },
  },

  // ─── 10. HCl + NH₃ → NH₄Cl ──────────────────────────────────────────────
  {
    reactants: ['hcl', 'nh3'],
    result: {
      products: ['nacl'],
      description:
        'Hydrogen chloride gas reacts with ammonia gas in an acid-base reaction to form ammonium chloride. When the gases meet, dense white fumes of solid NH₄Cl appear immediately.',
      observations: [
        'Dense white fumes or smoke (NH₄Cl aerosol) appear',
        'White solid deposits on cool surfaces',
        'Sharp pungent odor decreases as gases react',
        'Reaction is instantaneous when gases mix',
      ],
      equation: 'HCl(g) + NH₃(g) → NH₄Cl(s)',
      reactionType: 'synthesis',
      isExothermic: true,
      colorChange: 'Dense white smoke/fumes',
      precipitate: 'NH₄Cl (white solid)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 11. Na₂CO₃ + 2 HCl → 2 NaCl + H₂O + CO₂↑ ─────────────────────────
  {
    reactants: ['na2co3', 'hcl'],
    result: {
      products: ['nacl', 'h2o'],
      description:
        'Sodium carbonate reacts with hydrochloric acid to produce sodium chloride, water, and carbon dioxide gas. The carbonate ion acts as a base, accepting protons from the acid.',
      observations: [
        'Effervescence – CO₂ bubbles are produced',
        'Solid or dissolved Na₂CO₃ reacts readily',
        'Solution warms slightly',
        'CO₂ turns limewater milky if bubbled through it',
        'pH decreases toward neutral',
      ],
      equation: 'Na₂CO₃(aq) + 2 HCl(aq) → 2 NaCl(aq) + H₂O(l) + CO₂(g)↑',
      reactionType: 'acid-base',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'CO₂',
      pHChange: -4,
    },
  },

  // ─── 12. H₂SO₄ + 2 KOH → K₂SO₄ + 2 H₂O ────────────────────────────────
  {
    reactants: ['h2so4', 'koh'],
    result: {
      products: ['h2o'],
      description:
        'Sulfuric acid reacts with potassium hydroxide in a neutralization reaction, forming potassium sulfate and water. Two moles of KOH are needed per mole of H₂SO₄.',
      observations: [
        'Considerable heat released',
        'pH rises toward 7 as KOH is added',
        'No precipitate or gas formed',
        'Indicator color change at equivalence point',
      ],
      equation: 'H₂SO₄(aq) + 2 KOH(aq) → K₂SO₄(aq) + 2 H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: null,
      pHChange: 7,
    },
  },

  // ─── 13. CH₃COOH + NaOH → CH₃COONa + H₂O ──────────────────────────────
  {
    reactants: ['ch3cooh', 'naoh'],
    result: {
      products: ['h2o'],
      description:
        'Acetic acid (a weak acid) reacts with sodium hydroxide (a strong base) in a neutralization reaction, producing sodium acetate (a salt) and water. The equivalence point pH is above 7 due to the weak acid–strong base nature.',
      observations: [
        'Mild heat released (less than strong acid + strong base)',
        'Vinegar smell decreases as acid is consumed',
        'pH rises toward ~8.7 at equivalence point',
        'With phenolphthalein: pink color at equivalence point (above pH 8)',
      ],
      equation: 'CH₃COOH(aq) + NaOH(aq) → CH₃COONa(aq) + H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: 'Pink at endpoint with phenolphthalein',
      precipitate: null,
      gasProduced: null,
      pHChange: 8,
    },
  },

  // ─── 14. Zn + 2 HCl → ZnCl₂ + H₂↑ ─────────────────────────────────────
  {
    reactants: ['zn', 'hcl'],
    result: {
      products: ['h2o'],
      description:
        'Zinc metal reacts with hydrochloric acid in a single-displacement reaction. Zinc is oxidized and displaces hydrogen from the acid, forming zinc chloride and hydrogen gas.',
      observations: [
        'Steady bubbling of H₂ gas',
        'Zinc dissolves gradually',
        'Solution remains colorless',
        'Mild warming of the solution',
      ],
      equation: 'Zn(s) + 2 HCl(aq) → ZnCl₂(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 15. 2 H₂O₂ → 2 H₂O + O₂↑ (decomposition, catalyst) ───────────────
  {
    reactants: ['h2o2', 'kmno4'],
    result: {
      products: ['h2o'],
      description:
        'Potassium permanganate acts as a catalyst to decompose hydrogen peroxide rapidly into water and oxygen. This reaction is used to demonstrate catalytic decomposition.',
      observations: [
        'Rapid and vigorous O₂ gas evolution',
        'Dramatic foaming if soap is present (elephant toothpaste)',
        'Solution heats up rapidly',
        'Purple KMnO₄ color fades as Mn²⁺ forms',
        'Glowing splint relights in the oxygen-rich atmosphere',
      ],
      equation: '2 H₂O₂(aq) → 2 H₂O(l) + O₂(g)↑  [KMnO₄ catalyst]',
      reactionType: 'decomposition',
      isExothermic: true,
      colorChange: 'Purple → colorless',
      precipitate: null,
      gasProduced: 'O₂',
      pHChange: null,
    },
  },

  // ─── 16. NaCl + AgNO₃ (same as 3, already covered; add FeCl₃ + NaOH) ────
  // Fe + H₂SO₄ → FeSO₄ + H₂↑
  {
    reactants: ['fe', 'h2so4'],
    result: {
      products: ['h2o'],
      description:
        'Iron reacts with dilute sulfuric acid to produce iron(II) sulfate and hydrogen gas. The reaction is slower than magnesium or zinc but produces the characteristic pale-green Fe²⁺ ions.',
      observations: [
        'Slow to moderate bubbling of H₂ gas',
        'Iron surface becomes pitted and darkened',
        'Solution turns pale green (Fe²⁺ ions in FeSO₄)',
        'Mild heat released',
      ],
      equation: 'Fe(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Colorless → pale green',
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 17. Cu + H₂SO₄ (concentrated, hot) → CuSO₄ + SO₂↑ + H₂O ──────────
  {
    reactants: ['cu', 'h2so4'],
    result: {
      products: ['cuso4', 'h2o'],
      description:
        'Copper does not react with dilute sulfuric acid, but reacts with hot concentrated H₂SO₄ in a redox reaction. Copper is oxidized to Cu²⁺ and sulfate is reduced to sulfur dioxide.',
      observations: [
        'Solution turns blue (CuSO₄ formed)',
        'Pungent, choking SO₂ gas released',
        'Copper slowly dissolves in the hot acid',
        'Color change from colorless to blue',
      ],
      equation: 'Cu(s) + 2 H₂SO₄(conc., hot) → CuSO₄(aq) + SO₂(g)↑ + 2 H₂O(l)',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Colorless → blue',
      precipitate: null,
      gasProduced: 'SO₂',
      pHChange: null,
    },
  },

  // ─── 18. NaOH + CH₃COOH (again with KOH for variety) ────────────────────
  // KMnO₄ + HCl → redox
  {
    reactants: ['kmno4', 'hcl'],
    result: {
      products: ['h2o'],
      description:
        'Potassium permanganate reacts with concentrated hydrochloric acid in a redox reaction. Permanganate (Mn⁷⁺) is reduced to Mn²⁺ while chloride ions are oxidized to chlorine gas.',
      observations: [
        'Purple KMnO₄ solution decolorizes',
        'Yellow-green chlorine gas (Cl₂) is released – toxic!',
        'Pungent smell of chlorine gas',
        'Solution turns colorless/pale',
      ],
      equation:
        '2 KMnO₄(aq) + 16 HCl(aq) → 2 KCl(aq) + 2 MnCl₂(aq) + 5 Cl₂(g)↑ + 8 H₂O(l)',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Purple → colorless with green Cl₂ gas',
      precipitate: null,
      gasProduced: 'Cl₂',
      pHChange: null,
    },
  },

  // ─── 19. Ethanol combustion ───────────────────────────────────────────────
  {
    reactants: ['ethanol'],
    result: {
      products: ['h2o'],
      description:
        'Ethanol undergoes complete combustion in excess oxygen to produce carbon dioxide and water vapor. The reaction is highly exothermic and produces a clean blue flame.',
      observations: [
        'Blue flame burns cleanly',
        'Heat and light produced',
        'CO₂ and H₂O vapor released',
        'No soot produced (complete combustion)',
        'Flame temperature approximately 1,000°C',
      ],
      equation: 'C₂H₅OH(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(g)',
      reactionType: 'combustion',
      isExothermic: true,
      colorChange: 'Blue flame',
      precipitate: null,
      gasProduced: 'CO₂ and H₂O vapor',
      pHChange: null,
    },
  },

  // ─── 20. CuSO₄ + Fe → FeSO₄ + Cu (displacement) ─────────────────────────
  {
    reactants: ['cuso4', 'fe'],
    result: {
      products: ['fe', 'cuso4'],
      description:
        'Iron displaces copper from copper sulfate solution in a single displacement reaction. Iron is more reactive than copper, so it reduces Cu²⁺ ions to metallic copper while being oxidized to Fe²⁺.',
      observations: [
        'Blue CuSO₄ solution becomes pale green (FeSO₄)',
        'Reddish-brown copper metal deposits on iron surface',
        'Iron nail or strip gradually coats with copper',
        'Solution color changes from blue to green',
      ],
      equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓',
      reactionType: 'redox',
      isExothermic: false,
      colorChange: 'Blue → pale green',
      precipitate: 'Cu (reddish-brown metal)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 21. Na₂CO₃ + CaCO₃... let's do Na₂CO₃ + H₂SO₄ ─────────────────────
  {
    reactants: ['na2co3', 'h2so4'],
    result: {
      products: ['h2o'],
      description:
        'Sodium carbonate reacts with sulfuric acid to produce sodium sulfate, water, and carbon dioxide. The reaction proceeds in two stages: first forming sodium hydrogen carbonate, then decomposing.',
      observations: [
        'Vigorous CO₂ effervescence',
        'pH drops from alkaline toward neutral',
        'Mild warming of solution',
        'Solid Na₂CO₃ dissolves rapidly',
      ],
      equation: 'Na₂CO₃(aq) + H₂SO₄(aq) → Na₂SO₄(aq) + H₂O(l) + CO₂(g)↑',
      reactionType: 'acid-base',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'CO₂',
      pHChange: -5,
    },
  },

  // ─── 22. AgNO₃ + HCl → AgCl↓ + HNO₃ ────────────────────────────────────
  {
    reactants: ['agno3', 'hcl'],
    result: {
      products: ['hno3'],
      description:
        'Silver nitrate reacts with hydrochloric acid to produce a white precipitate of silver chloride and nitric acid. This is a classic test for the presence of chloride ions.',
      observations: [
        'White curdy precipitate of AgCl forms immediately',
        'Precipitate is insoluble in dilute HNO₃',
        'Precipitate turns purple/gray in sunlight (photodecomposition)',
        'Solution remains acidic',
      ],
      equation: 'AgNO₃(aq) + HCl(aq) → AgCl(s)↓ + HNO₃(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Colorless → white precipitate',
      precipitate: 'AgCl (white, curdy)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 23. Zn + CuSO₄ → ZnSO₄ + Cu ───────────────────────────────────────
  {
    reactants: ['zn', 'cuso4'],
    result: {
      products: ['cuso4'],
      description:
        'Zinc displaces copper from copper sulfate solution. Zinc is more reactive than copper and reduces Cu²⁺ to metallic copper while being oxidized to Zn²⁺.',
      observations: [
        'Blue CuSO₄ solution gradually fades to colorless',
        'Zinc surface becomes coated with reddish copper',
        'Solution becomes colorless (ZnSO₄ is colorless)',
        'Zinc dissolves as copper deposits',
      ],
      equation: 'Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)',
      reactionType: 'redox',
      isExothermic: false,
      colorChange: 'Blue → colorless',
      precipitate: 'Cu (reddish-brown)',
      gasProduced: null,
      pHChange: null,
    },
  },

  // ─── 24. Mg + H₂SO₄ → MgSO₄ + H₂↑ ─────────────────────────────────────
  {
    reactants: ['mg', 'h2so4'],
    result: {
      products: ['h2o'],
      description:
        'Magnesium reacts vigorously with dilute sulfuric acid to produce magnesium sulfate and hydrogen gas. Magnesium is highly reactive and the reaction is faster than with iron or zinc.',
      observations: [
        'Very vigorous bubbling of H₂ gas',
        'Magnesium ribbon dissolves rapidly',
        'Considerable heat released',
        'Solution warms markedly',
        'Colorless H₂ gas confirmed by squeaky pop test',
      ],
      equation: 'Mg(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'H₂',
      pHChange: null,
    },
  },

  // ─── 25. H₂O₂ decomposition (alone / with catalyst) ─────────────────────
  {
    reactants: ['h2o2'],
    result: {
      products: ['h2o'],
      description:
        'Hydrogen peroxide slowly decomposes into water and oxygen gas under normal conditions. The rate increases significantly with catalysts (MnO₂, KMnO₄, enzymes like catalase).',
      observations: [
        'Very slow O₂ gas evolution at room temperature',
        'Faster decomposition if heated or catalyst is added',
        'No visible color change',
        'Glowing splint test confirms O₂ production',
      ],
      equation: '2 H₂O₂(l) → 2 H₂O(l) + O₂(g)↑',
      reactionType: 'decomposition',
      isExothermic: true,
      colorChange: null,
      precipitate: null,
      gasProduced: 'O₂',
      pHChange: null,
    },
  },
];

// Build a lookup map for O(1) access
const REACTION_MAP = new Map<string, ReactionResult>(
  REACTION_RULES.map((rule) => [makeKey(rule.reactants), rule.result])
);

const NO_REACTION: ReactionResult = {
  products: [],
  description:
    'No reaction occurs between the selected chemicals under standard laboratory conditions. The chemicals may be incompatible or require different conditions (heat, pressure, catalyst) to react.',
  observations: ['No visible change', 'No gas produced', 'No precipitate formed', 'Temperature remains constant'],
  equation: 'No reaction',
  reactionType: 'synthesis',
  isExothermic: false,
  colorChange: null,
  precipitate: null,
  gasProduced: null,
  pHChange: null,
};

/**
 * Simulate a chemical reaction between the given reactants.
 * @param reactants Array of chemical ids (e.g. ['hcl', 'naoh'])
 * @returns ReactionResult describing what happens
 */
export function simulateReaction(reactants: string[]): ReactionResult {
  if (!reactants || reactants.length === 0) {
    return NO_REACTION;
  }

  // Try exact match with all reactants
  const key = makeKey(reactants);
  if (REACTION_MAP.has(key)) {
    return REACTION_MAP.get(key)!;
  }

  // Try pair-wise matches for sub-combinations (first pair that matches wins)
  if (reactants.length > 2) {
    for (let i = 0; i < reactants.length; i++) {
      for (let j = i + 1; j < reactants.length; j++) {
        const pairKey = makeKey([reactants[i], reactants[j]]);
        if (REACTION_MAP.has(pairKey)) {
          const result = REACTION_MAP.get(pairKey)!;
          return {
            ...result,
            description: `[Dominant reaction between ${reactants[i]} and ${reactants[j]}]: ${result.description}`,
          };
        }
      }
    }
  }

  return NO_REACTION;
}

export function getAllReactions(): ReactionRule[] {
  return REACTION_RULES;
}

export function getReactionByEquation(equation: string): ReactionResult | undefined {
  return REACTION_RULES.find((r) => r.result.equation === equation)?.result;
}

export function getReactionsByType(type: ReactionType): ReactionResult[] {
  return REACTION_RULES.filter((r) => r.result.reactionType === type).map((r) => r.result);
}
