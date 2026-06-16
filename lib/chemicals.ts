export type PhysicalState = 'solid' | 'liquid' | 'gas';
export type HazardLevel = 'low' | 'medium' | 'high';

export interface ChemicalProperties {
  meltingPoint?: number; // °C
  boilingPoint?: number; // °C
  density?: number;      // g/cm³
  pH?: number;
  solubility?: string;
  color?: string;
}

export type ChemicalCategory = 'acid' | 'base' | 'salt' | 'metal' | 'organic' | 'indicator' | 'oxidizer' | 'solvent' | 'other';

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  molecularWeight: number; // g/mol
  physicalState: PhysicalState;
  color: string;
  hazardLevel: HazardLevel;
  hazards: string[];
  uses: string[];
  properties: ChemicalProperties;
  description: string;
  category: ChemicalCategory;
  solutionColor?: string;
}

export const CHEMICALS: Chemical[] = [
  {
    id: 'hcl',
    name: 'Hydrochloric Acid',
    formula: 'HCl',
    molecularWeight: 36.46,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Highly corrosive to skin and eyes',
      'Toxic if inhaled',
      'Reacts violently with bases',
      'Releases hydrogen gas with metals',
    ],
    uses: [
      'pH adjustment in industry',
      'Cleaning and etching metals',
      'Production of PVC',
      'Food processing (dilute form)',
      'Stomach acid simulation in labs',
    ],
    properties: {
      meltingPoint: -27.32,
      boilingPoint: 110,
      density: 1.18,
      pH: 0,
      solubility: 'Miscible with water',
    },
    description:
      'Hydrochloric acid is a strong mineral acid formed by dissolving hydrogen chloride gas in water. It is one of the most commonly used acids in chemical laboratories and industrial processes.',
    category: 'acid',
  },
  {
    id: 'h2so4',
    name: 'Sulfuric Acid',
    formula: 'H₂SO₄',
    molecularWeight: 98.08,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Extremely corrosive – causes severe chemical burns',
      'Highly exothermic when diluted with water',
      'Dehydrating agent – reacts with organic matter',
      'Toxic fumes at elevated temperatures',
    ],
    uses: [
      'Lead-acid batteries',
      'Production of fertilizers (phosphoric acid)',
      'Petroleum refining',
      'Metal processing and pickling',
      'Production of dyes and explosives',
    ],
    properties: {
      meltingPoint: 10.31,
      boilingPoint: 337,
      density: 1.84,
      pH: -3,
      solubility: 'Miscible with water (highly exothermic)',
    },
    description:
      'Sulfuric acid is a highly corrosive strong mineral acid with the chemical formula H₂SO₄. It is the most widely produced chemical in the world and is used in a vast range of industrial and laboratory applications.',
    category: 'acid',
  },
  {
    id: 'naoh',
    name: 'Sodium Hydroxide',
    formula: 'NaOH',
    molecularWeight: 40.00,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'high',
    hazards: [
      'Highly corrosive to skin and eyes',
      'Causes severe chemical burns on contact',
      'Reacts violently with acids',
      'Absorbs CO₂ and moisture from air',
    ],
    uses: [
      'Soap and detergent manufacturing',
      'Paper production',
      'Drain cleaners',
      'Food preparation (e.g., pretzels, noodles)',
      'pH regulation in water treatment',
    ],
    properties: {
      meltingPoint: 318,
      boilingPoint: 1388,
      density: 2.13,
      pH: 14,
      solubility: '111 g/100 mL water (20°C)',
    },
    description:
      'Sodium hydroxide, also known as lye or caustic soda, is a strong inorganic base. It is a white solid ionic compound consisting of sodium cations and hydroxide anions.',
    category: 'base',
  },
  {
    id: 'koh',
    name: 'Potassium Hydroxide',
    formula: 'KOH',
    molecularWeight: 56.11,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'high',
    hazards: [
      'Strongly corrosive',
      'Causes serious burns to skin and eyes',
      'Reacts exothermically with acids',
      'Hygroscopic – absorbs atmospheric moisture',
    ],
    uses: [
      'Manufacturing of soft soaps and detergents',
      'Alkaline batteries',
      'Electrolyte in fuel cells',
      'Food additive (E525)',
      'Production of potassium carbonate',
    ],
    properties: {
      meltingPoint: 360,
      boilingPoint: 1327,
      density: 2.04,
      pH: 14,
      solubility: '121 g/100 mL water (25°C)',
    },
    description:
      'Potassium hydroxide is an inorganic compound with the formula KOH. It is a strong base, similar to sodium hydroxide, and is used in a wide range of industrial and laboratory applications.',
    category: 'base',
  },
  {
    id: 'agno3',
    name: 'Silver Nitrate',
    formula: 'AgNO₃',
    molecularWeight: 169.87,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'medium',
    hazards: [
      'Oxidizing agent – fire hazard with combustibles',
      'Causes black stains on skin and clothing',
      'Corrosive to eyes and mucous membranes',
      'Harmful if ingested',
    ],
    uses: [
      'Photography (silver halide films)',
      'Medical applications (antiseptic)',
      'Qualitative analysis for chloride ions',
      'Production of other silver compounds',
      'Hair dyeing and coloring',
    ],
    properties: {
      meltingPoint: 212,
      boilingPoint: 444,
      density: 4.35,
      pH: 5,
      solubility: '256 g/100 mL water (25°C)',
    },
    description:
      'Silver nitrate is an inorganic compound with the formula AgNO₃. It is a versatile reagent widely used in qualitative chemical analysis, particularly to detect halide ions, and in photography.',
    category: 'salt',
  },
  {
    id: 'cuso4',
    name: 'Copper(II) Sulfate',
    formula: 'CuSO₄',
    molecularWeight: 159.61,
    physicalState: 'solid',
    color: 'blue',
    hazardLevel: 'medium',
    hazards: [
      'Irritant to skin and eyes',
      'Toxic if ingested in large amounts',
      'Harmful to aquatic organisms',
      'Avoid inhalation of dust',
    ],
    uses: [
      'Fungicide and algaecide in agriculture',
      'Electroplating processes',
      'Qualitative tests for reducing sugars',
      'Animal feed supplement',
      'Production of Bordeaux mixture',
    ],
    properties: {
      meltingPoint: 110,
      boilingPoint: 560,
      density: 3.60,
      pH: 3.5,
      solubility: '20.7 g/100 mL water (25°C)',
    },
    description:
      'Copper(II) sulfate pentahydrate is the most common form of copper sulfate, featuring a vivid blue color. It is used in agriculture, chemistry labs, and electroplating.',
    category: 'salt',
  },
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    molecularWeight: 58.44,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Generally safe in small quantities',
      'High intake can be harmful (cardiovascular effects)',
      'Mild irritant to eyes',
    ],
    uses: [
      'Food seasoning and preservation',
      'De-icing roads',
      'Manufacture of chlorine and sodium hydroxide',
      'Saline solutions in medicine',
      'Water treatment',
    ],
    properties: {
      meltingPoint: 801,
      boilingPoint: 1413,
      density: 2.165,
      pH: 7,
      solubility: '36 g/100 mL water (25°C)',
    },
    description:
      'Sodium chloride, commonly known as table salt, is an ionic compound with the formula NaCl. It is essential for human life and is one of the most abundant minerals on Earth.',
    category: 'salt',
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    formula: 'C₂H₅OH',
    molecularWeight: 46.07,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Highly flammable',
      'Central nervous system depressant',
      'Vapor can form explosive mixtures',
      'Irritant to eyes and respiratory tract',
    ],
    uses: [
      'Alcoholic beverages',
      'Antiseptic and disinfectant',
      'Solvent in pharmaceuticals and cosmetics',
      'Biofuel (gasohol)',
      'Laboratory solvent',
    ],
    properties: {
      meltingPoint: -114.1,
      boilingPoint: 78.4,
      density: 0.789,
      pH: 7,
      solubility: 'Miscible with water',
    },
    description:
      'Ethanol, also called ethyl alcohol, is a volatile, flammable, colorless liquid with the formula C₂H₅OH. It is the alcohol found in alcoholic beverages and is widely used as a solvent, antiseptic, and fuel.',
    category: 'organic',
  },
  {
    id: 'methanol',
    name: 'Methanol',
    formula: 'CH₃OH',
    molecularWeight: 32.04,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Highly toxic – causes blindness and death if ingested',
      'Highly flammable',
      'Absorbed through skin',
      'CNS depressant and metabolic poison',
    ],
    uses: [
      'Production of formaldehyde',
      'Fuel and fuel additive',
      'Solvent in industrial processes',
      'Production of acetic acid',
      'Antifreeze in pipelines',
    ],
    properties: {
      meltingPoint: -97.6,
      boilingPoint: 64.7,
      density: 0.792,
      pH: 7,
      solubility: 'Miscible with water',
    },
    description:
      'Methanol, also known as methyl alcohol or wood alcohol, is the simplest alcohol. It is a light, volatile, colorless, flammable liquid with a distinctive odor, but is extremely toxic to humans.',
    category: 'organic',
  },
  {
    id: 'ch3cooh',
    name: 'Acetic Acid',
    formula: 'CH₃COOH',
    molecularWeight: 60.05,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Corrosive in concentrated form',
      'Flammable',
      'Pungent vinegar odor',
      'Irritant to skin and eyes',
    ],
    uses: [
      'Main component of vinegar (5–8%)',
      'Production of vinyl acetate monomer',
      'Solvent in chemical synthesis',
      'Food additive and preservative',
      'Production of cellulose acetate',
    ],
    properties: {
      meltingPoint: 16.6,
      boilingPoint: 118.1,
      density: 1.049,
      pH: 2.4,
      solubility: 'Miscible with water',
    },
    description:
      'Acetic acid is a weak organic acid with the formula CH₃COOH. It is the main component of vinegar (after water) and is one of the simplest carboxylic acids, widely used in chemical synthesis.',
    category: 'acid',
  },
  {
    id: 'h2o',
    name: 'Distilled Water',
    formula: 'H₂O',
    molecularWeight: 18.02,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'low',
    hazards: [
      'No significant hazards under normal conditions',
    ],
    uses: [
      'Universal solvent in chemistry',
      'Cooling systems',
      'Laboratory reagent preparation',
      'Medical applications',
      'Steam generation',
    ],
    properties: {
      meltingPoint: 0,
      boilingPoint: 100,
      density: 1.00,
      pH: 7,
      solubility: 'N/A – reference solvent',
    },
    description:
      'Water is the most abundant compound on Earth and is essential for all known life. Distilled water has had impurities removed through distillation and is used as the standard solvent in most chemical experiments.',
    category: 'solvent',
  },
  {
    id: 'nh3',
    name: 'Ammonia',
    formula: 'NH₃',
    molecularWeight: 17.03,
    physicalState: 'gas',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Toxic gas – irritates respiratory system',
      'Corrosive to mucous membranes and eyes',
      'Flammable in high concentrations',
      'Reacts violently with strong oxidizers',
    ],
    uses: [
      'Fertilizer production (Haber process)',
      'Cleaning agent (household ammonia)',
      'Refrigerant (R-717)',
      'Production of explosives and dyes',
      'pH adjustment in industrial processes',
    ],
    properties: {
      meltingPoint: -77.7,
      boilingPoint: -33.4,
      density: 0.000771,
      pH: 11.6,
      solubility: '31.5 g/100 mL water (25°C)',
    },
    description:
      'Ammonia is a compound of nitrogen and hydrogen with the formula NH₃. It is a colorless gas with a characteristic pungent odor and is one of the most widely produced industrial chemicals in the world.',
    category: 'base',
  },
  {
    id: 'na2co3',
    name: 'Sodium Carbonate',
    formula: 'Na₂CO₃',
    molecularWeight: 105.99,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Irritant to skin, eyes, and respiratory tract',
      'Mild alkaline – can cause minor burns in concentrated solution',
    ],
    uses: [
      'Glass manufacturing (soda ash)',
      'Water softening',
      'Laundry detergent (washing soda)',
      'Paper and textile manufacturing',
      'pH buffer in analytical chemistry',
    ],
    properties: {
      meltingPoint: 851,
      boilingPoint: 1600,
      density: 2.54,
      pH: 11.6,
      solubility: '21.5 g/100 mL water (20°C)',
    },
    description:
      'Sodium carbonate (soda ash or washing soda) is a sodium salt of carbonic acid with the formula Na₂CO₃. It is a white, odorless powder widely used in manufacturing and as a water softener.',
    category: 'salt',
  },
  {
    id: 'caco3',
    name: 'Calcium Carbonate',
    formula: 'CaCO₃',
    molecularWeight: 100.09,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Generally safe',
      'Dust may irritate eyes and respiratory tract',
    ],
    uses: [
      'Antacid medication',
      'Cement and construction materials',
      'Filler in plastics and paints',
      'Chalk and limestone applications',
      'Food additive (calcium supplement)',
    ],
    properties: {
      meltingPoint: 1339,
      boilingPoint: 1000,
      density: 2.71,
      pH: 9.4,
      solubility: '0.0013 g/100 mL water (25°C)',
    },
    description:
      'Calcium carbonate is the main component of limestone, chalk, and marble. It is used extensively in industry and medicine, and is the basis of many antacid preparations.',
    category: 'salt',
  },
  {
    id: 'mg',
    name: 'Magnesium',
    formula: 'Mg',
    molecularWeight: 24.31,
    physicalState: 'solid',
    color: 'silver-gray',
    hazardLevel: 'medium',
    hazards: [
      'Burns with brilliant white light when ignited',
      'Burning magnesium cannot be extinguished with water (produces H₂)',
      'Fine powder is a fire and explosion hazard',
      'Reacts with dilute acids to release H₂ gas',
    ],
    uses: [
      'Lightweight alloys (aerospace, automotive)',
      'Incendiary flares and fireworks',
      'Dietary supplement',
      'Reducing agent in metallurgy',
      'Medical applications (milk of magnesia)',
    ],
    properties: {
      meltingPoint: 650,
      boilingPoint: 1091,
      density: 1.738,
      solubility: 'Reacts with hot water',
    },
    description:
      'Magnesium is a shiny gray solid metal that is lightweight and burns with a brilliant white flame. It is the eighth most abundant element in Earth\'s crust and plays a critical role in biology and industry.',
    category: 'metal',
  },
  {
    id: 'fe',
    name: 'Iron',
    formula: 'Fe',
    molecularWeight: 55.85,
    physicalState: 'solid',
    color: 'gray',
    hazardLevel: 'low',
    hazards: [
      'Iron powder can be flammable',
      'Rusts in moist air forming iron oxide',
      'Reacts with strong acids',
    ],
    uses: [
      'Steel production',
      'Construction and manufacturing',
      'Dietary supplement (iron deficiency)',
      'Catalysts in chemical processes (Haber process)',
      'Pigments (iron oxide)',
    ],
    properties: {
      meltingPoint: 1538,
      boilingPoint: 2862,
      density: 7.874,
      solubility: 'Insoluble in water, reacts with dilute acids',
    },
    description:
      'Iron is a lustrous, ductile, malleable, silver-gray metal that is the most abundant element by mass in Earth. It is the primary component of steel and is essential for biological processes.',
    category: 'metal',
  },
  {
    id: 'cu',
    name: 'Copper',
    formula: 'Cu',
    molecularWeight: 63.55,
    physicalState: 'solid',
    color: 'copper-red',
    hazardLevel: 'low',
    hazards: [
      'Copper fumes can cause metal fume fever',
      'Copper salts can be toxic if ingested',
      'Fine powder may be flammable',
    ],
    uses: [
      'Electrical wiring and electronics',
      'Plumbing and water pipes',
      'Coinage and jewelry',
      'Antimicrobial surfaces',
      'Electroplating',
    ],
    properties: {
      meltingPoint: 1085,
      boilingPoint: 2562,
      density: 8.96,
      solubility: 'Insoluble in water, dissolves in nitric acid',
    },
    description:
      'Copper is a soft, malleable, and ductile metal with very high thermal and electrical conductivity. A freshly exposed surface has a pinkish-orange color. It is one of the few metals that occur in nature in directly usable form.',
    category: 'metal',
  },
  {
    id: 'zn',
    name: 'Zinc',
    formula: 'Zn',
    molecularWeight: 65.38,
    physicalState: 'solid',
    color: 'bluish-gray',
    hazardLevel: 'low',
    hazards: [
      'Zinc oxide fumes cause metal fume fever',
      'Reacts with dilute acids to produce H₂ gas',
      'Zinc salts can be irritating',
    ],
    uses: [
      'Galvanizing iron and steel to prevent corrosion',
      'Zinc-carbon and alkaline batteries',
      'Dietary supplement (essential trace element)',
      'Die-casting alloys',
      'Rubber and paint pigments (zinc oxide)',
    ],
    properties: {
      meltingPoint: 419.5,
      boilingPoint: 907,
      density: 7.133,
      solubility: 'Insoluble in water, dissolves in acids',
    },
    description:
      'Zinc is a bluish-white, lustrous, diamagnetic metal. It is the 24th most abundant element in Earth\'s crust and is essential to life, as it is present in hundreds of enzymes.',
    category: 'metal',
  },
  {
    id: 'kmno4',
    name: 'Potassium Permanganate',
    formula: 'KMnO₄',
    molecularWeight: 158.03,
    physicalState: 'solid',
    color: 'dark-purple',
    hazardLevel: 'medium',
    hazards: [
      'Strong oxidizing agent – fire and explosion risk with combustibles',
      'Corrosive to skin and eyes',
      'Toxic if ingested',
      'Reacts violently with concentrated acids',
    ],
    uses: [
      'Water treatment and purification',
      'Antiseptic for wounds and skin conditions',
      'Oxidizing agent in organic synthesis',
      'Bleaching agent for textiles and pulp',
      'Detection of reducing agents in chemistry',
    ],
    properties: {
      meltingPoint: 240,
      boilingPoint: 100,
      density: 2.703,
      pH: 7,
      solubility: '7.6 g/100 mL water (20°C)',
    },
    description:
      'Potassium permanganate is a strong oxidizing agent with a characteristic deep purple/violet color that turns to brown manganese dioxide upon reduction. It is widely used in analytical chemistry and water treatment.',
    category: 'oxidizer',
  },
  {
    id: 'h2o2',
    name: 'Hydrogen Peroxide',
    formula: 'H₂O₂',
    molecularWeight: 34.01,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Strong oxidizing agent',
      'Corrosive in concentrated form',
      'Decomposes exothermically (releases O₂)',
      'Bleaching agent – damages skin and hair',
    ],
    uses: [
      'Hair bleaching and coloring',
      'Disinfectant and antiseptic (3% solution)',
      'Bleaching paper and textiles',
      'Rocket propellant (high concentration)',
      'Waste water treatment',
    ],
    properties: {
      meltingPoint: -0.43,
      boilingPoint: 150.2,
      density: 1.45,
      pH: 4.5,
      solubility: 'Miscible with water',
    },
    description:
      'Hydrogen peroxide is a pale blue liquid in pure form, slightly more viscous than water. It is used as an oxidizer, bleaching agent, and disinfectant. It readily decomposes into water and oxygen.',
    category: 'oxidizer',
  },
  {
    id: 'hno3',
    name: 'Nitric Acid',
    formula: 'HNO₃',
    molecularWeight: 63.01,
    physicalState: 'liquid',
    color: 'pale-yellow',
    hazardLevel: 'high',
    hazards: [
      'Highly corrosive – causes severe burns',
      'Strong oxidizer – reacts with most metals',
      'Produces toxic nitrogen dioxide fumes',
      'Reacts with proteins (xanthoproteic reaction)',
    ],
    uses: [
      'Production of fertilizers (ammonium nitrate)',
      'Manufacturing of explosives (TNT, nitroglycerin)',
      'Metal processing (aqua regia with HCl)',
      'Production of nitrates',
      'Electroplating and etching',
    ],
    properties: {
      meltingPoint: -42,
      boilingPoint: 83,
      density: 1.51,
      pH: -1,
      solubility: 'Miscible with water',
    },
    description:
      'Nitric acid is a highly corrosive mineral acid with the formula HNO₃. It is a strong oxidizing agent that reacts with most metals and is a key industrial chemical used in the production of fertilizers and explosives.',
    category: 'acid',
  },
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein',
    formula: 'C₂₀H₁₄O₄',
    molecularWeight: 318.32,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Suspected carcinogen – handle with care',
      'May cause skin and eye irritation',
      'Do not ingest',
    ],
    uses: [
      'Acid-base indicator (colorless in acid, pink/red in base)',
      'Titration experiments',
      'Laxative (historical use)',
      'pH testing',
    ],
    properties: {
      meltingPoint: 258,
      boilingPoint: 557,
      density: 1.277,
      solubility: '400 mg/L water; soluble in ethanol',
    },
    description:
      'Phenolphthalein is a chemical compound widely used as a pH indicator. It is colorless in acidic solutions and turns pink to fuchsia in basic solutions, making it ideal for acid-base titrations.',
    category: 'indicator',
  },
  {
    id: 'na2s2o3',
    name: 'Sodium Thiosulfate',
    formula: 'Na₂S₂O₃',
    molecularWeight: 158.11,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Mildly irritating to skin and eyes',
      'Decomposition produces sulfur dioxide (toxic)',
    ],
    uses: [
      'Photography (fixing agent for films)',
      'Dechlorination of water',
      'Antidote for cyanide poisoning',
      'Iodometric titrations',
      'Medical treatment for fungal infections',
    ],
    properties: {
      meltingPoint: 48,
      boilingPoint: 100,
      density: 1.667,
      pH: 6.5,
      solubility: '70 g/100 mL water (20°C)',
    },
    description:
      'Sodium thiosulfate is an inorganic compound widely used in photography and analytical chemistry. It is a reducing agent and is the standard substance in iodometric titrations.',
    category: 'salt',
  },
];

export function getChemical(id: string): Chemical | undefined {
  return CHEMICALS.find((c) => c.id === id);
}

export function getChemicalsByHazard(level: HazardLevel): Chemical[] {
  return CHEMICALS.filter((c) => c.hazardLevel === level);
}

export function getChemicalsByState(state: PhysicalState): Chemical[] {
  return CHEMICALS.filter((c) => c.physicalState === state);
}

export function searchChemicals(query: string): Chemical[] {
  const q = query.toLowerCase();
  return CHEMICALS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.formula.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  );
}
