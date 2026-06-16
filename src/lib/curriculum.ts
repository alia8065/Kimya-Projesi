export type GradeLevel = 'hazirlik' | '9' | '10' | '11' | '12';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  type: 'multiple-choice' | 'true-false' | 'calculation';
}

export interface ExperimentStep {
  id: string;
  instruction: string;
  hint?: string;
  action?: string;
  expectedObservation?: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  titleTr: string;
  grade: GradeLevel;
  order: number;
  icon: string;
  color: string;
  description: string;
  duration: number;
  xpReward: number;
  theory: {
    sections: {
      title: string;
      content: string;
      visual?: string;
    }[];
    keyPoints: string[];
  };
  experiment: {
    title: string;
    objective: string;
    chemicals: string[];
    equipment: string[];
    steps: ExperimentStep[];
    expectedResults: string;
  };
  quiz: QuizQuestion[];
}

export const CURRICULUM: CurriculumTopic[] = [
  // HAZIRLIK (Prep Class)
  {
    id: 'madde-ve-ozellikleri',
    title: 'Matter and Properties',
    titleTr: 'Madde ve Özellikleri',
    grade: 'hazirlik',
    order: 1,
    icon: '⚗️',
    color: '#00d4ff',
    description: 'Learn about the fundamental properties of matter and how to classify substances.',
    duration: 45,
    xpReward: 100,
    theory: {
      sections: [
        {
          title: 'What is Matter?',
          content: 'Matter is anything that has mass and occupies space. Everything around us — the air we breathe, the water we drink, and the food we eat — is made of matter. Matter is composed of atoms and molecules.\n\nMatter has two types of properties:\n• **Physical properties**: Color, density, melting point, boiling point — can be observed without changing the substance.\n• **Chemical properties**: Flammability, reactivity, acidity — describe how a substance changes into another substance.',
        },
        {
          title: 'States of Matter',
          content: 'Matter exists in four common states:\n\n**Solid**: Fixed shape and volume. Particles are tightly packed and vibrate in place. Example: ice, rock salt.\n\n**Liquid**: Fixed volume but takes the shape of its container. Particles can flow past each other. Example: water, mercury.\n\n**Gas**: No fixed shape or volume. Particles move freely and rapidly. Example: oxygen, steam.\n\n**Plasma**: High-energy ionized gas. Found in stars and lightning.',
        },
        {
          title: 'Pure Substances vs. Mixtures',
          content: '**Pure Substances** have a fixed composition:\n• Elements: Made of one type of atom (O₂, Fe, Au)\n• Compounds: Two or more elements chemically combined (H₂O, NaCl, CO₂)\n\n**Mixtures** contain two or more substances:\n• Homogeneous (solutions): Uniform throughout — saltwater, air\n• Heterogeneous: Non-uniform — sand and water, salad',
        },
      ],
      keyPoints: [
        'Matter has mass and occupies space',
        'Physical changes do not alter composition',
        'Chemical changes produce new substances',
        'Mixtures can be separated by physical methods',
      ],
    },
    experiment: {
      title: 'Identifying States of Matter',
      objective: 'Observe and classify substances by their state of matter and physical properties.',
      chemicals: ['h2o', 'nacl', 'ethanol'],
      equipment: ['beaker', 'thermometer', 'hotplate', 'test_tube'],
      steps: [
        { id: '1', instruction: 'Place 50 mL of distilled water in a beaker.', expectedObservation: 'Water appears as a clear, colorless liquid.' },
        { id: '2', instruction: 'Add a spatula of NaCl (table salt) and stir.', expectedObservation: 'Salt dissolves to form a homogeneous solution.' },
        { id: '3', instruction: 'Heat the beaker on the hot plate to 100°C.', expectedObservation: 'Water begins to boil and converts to steam (gas).' },
        { id: '4', instruction: 'Record the temperature at which boiling begins.', hint: 'Pure water boils at 100°C at sea level.' },
        { id: '5', instruction: 'Allow to cool and observe the salt remaining.', expectedObservation: 'Salt crystals reappear as water evaporates — a physical change.' },
      ],
      expectedResults: 'Salt dissolves in water forming a solution. Heating causes water to evaporate, demonstrating a physical (state) change. NaCl remains after evaporation, confirming the separation is physical, not chemical.',
    },
    quiz: [
      { id: 'q1', question: 'Which of the following is a physical property of matter?', options: ['Flammability', 'Reactivity with acid', 'Melting point', 'Ability to rust'], correct: 2, explanation: 'Melting point is a physical property because it can be measured without changing the chemical identity of the substance.', type: 'multiple-choice' },
      { id: 'q2', question: 'Saltwater is an example of a:', options: ['Pure element', 'Pure compound', 'Homogeneous mixture', 'Heterogeneous mixture'], correct: 2, explanation: 'Saltwater is a homogeneous mixture (solution) because salt is uniformly distributed throughout the water.', type: 'multiple-choice' },
      { id: 'q3', question: 'True or False: Boiling water is a chemical change.', options: ['True', 'False'], correct: 1, explanation: 'False. Boiling water is a physical change — water changes state (liquid to gas) but its chemical formula H₂O remains the same.', type: 'true-false' },
      { id: 'q4', question: 'Which state of matter has a definite shape AND volume?', options: ['Gas', 'Liquid', 'Plasma', 'Solid'], correct: 3, explanation: 'Solids have both definite shape and definite volume because their particles are tightly packed and cannot move freely.', type: 'multiple-choice' },
    ],
  },
  {
    id: 'laboratuvar-guvenligi',
    title: 'Laboratory Safety',
    titleTr: 'Laboratuvar Güvenliği',
    grade: 'hazirlik',
    order: 2,
    icon: '🛡️',
    color: '#ef4444',
    description: 'Essential safety rules and protocols for working in a chemistry laboratory.',
    duration: 30,
    xpReward: 80,
    theory: {
      sections: [
        {
          title: 'Personal Protective Equipment (PPE)',
          content: '**Always wear** before entering the laboratory:\n\n• **Safety goggles**: Protect eyes from splashes and fumes\n• **Lab coat**: Protects skin and clothing from spills\n• **Gloves**: Protect hands from chemicals\n• **Closed-toe shoes**: Protect feet from falling objects\n\nNever wear: contact lenses (chemicals can get trapped), loose clothing, or open-toed shoes.',
        },
        {
          title: 'Hazard Symbols',
          content: 'Chemical hazard symbols (GHS/CLP):\n\n🔥 **Flammable**: Keep away from heat and flames\n☠️ **Toxic**: Can cause serious harm or death\n⚠️ **Irritant**: Causes skin/eye irritation\n🔴 **Corrosive**: Destroys tissue on contact\n💥 **Explosive**: Can explode under certain conditions\n♻️ **Oxidizing**: Can cause or intensify fires',
        },
        {
          title: 'Emergency Procedures',
          content: '**Chemical Spill on Skin**: Immediately flush with water for 15+ minutes. Remove contaminated clothing.\n\n**Chemical in Eye**: Use eyewash station for 15 minutes. Keep eye open.\n\n**Fire**: Alert others, use fire extinguisher (PASS: Pull, Aim, Squeeze, Sweep), evacuate if necessary.\n\n**Broken Glass**: Never pick up with bare hands. Use brush and dustpan.\n\n**In all emergencies**: Stay calm, alert teacher/supervisor immediately.',
        },
      ],
      keyPoints: [
        'Always wear PPE (goggles, gloves, lab coat)',
        'Never eat or drink in the laboratory',
        'Read hazard labels before using chemicals',
        'Know the location of safety equipment',
        'Report all accidents immediately',
      ],
    },
    experiment: {
      title: 'Laboratory Safety Scavenger Hunt',
      objective: 'Identify and locate all safety equipment in the virtual laboratory.',
      chemicals: [],
      equipment: ['safety_goggles', 'fire_extinguisher', 'eyewash', 'first_aid'],
      steps: [
        { id: '1', instruction: 'Locate the fire extinguisher in the laboratory.', expectedObservation: 'Fire extinguisher is mounted near the exit.' },
        { id: '2', instruction: 'Find the eyewash station and note its location.', expectedObservation: 'Eyewash station is accessible within 10 seconds of any bench.' },
        { id: '3', instruction: 'Identify the hazard symbols on each chemical bottle.', hint: 'Look for GHS pictograms on labels.' },
        { id: '4', instruction: 'Put on all PPE correctly before handling any chemical.', expectedObservation: 'Goggles secured, gloves on, lab coat buttoned.' },
      ],
      expectedResults: 'Students identify all safety equipment locations and demonstrate correct PPE usage.',
    },
    quiz: [
      { id: 'q1', question: 'What should you do FIRST if a chemical splashes in your eyes?', options: ['Call for help', 'Go to the eyewash station immediately', 'Rub your eyes', 'Put on safety goggles'], correct: 1, explanation: 'Immediately flush eyes with the eyewash station for at least 15 minutes. Delaying treatment can cause permanent damage.', type: 'multiple-choice' },
      { id: 'q2', question: 'True or False: It is safe to smell chemicals directly from the bottle to identify them.', options: ['True', 'False'], correct: 1, explanation: 'False. Never directly inhale from a chemical bottle. Instead, gently waft the vapors toward your nose with your hand.', type: 'true-false' },
    ],
  },
  {
    id: 'karisimlar',
    title: 'Mixtures and Separation',
    titleTr: 'Karışımlar ve Ayırma Yöntemleri',
    grade: 'hazirlik',
    order: 3,
    icon: '🔬',
    color: '#7c3aed',
    description: 'Explore different types of mixtures and methods used to separate them.',
    duration: 50,
    xpReward: 120,
    theory: {
      sections: [
        {
          title: 'Types of Mixtures',
          content: '**Homogeneous Mixtures (Solutions)**:\nUniform composition throughout. Components cannot be distinguished by naked eye.\nExamples: Saltwater, air, vinegar, brass (metal alloy)\n\n**Heterogeneous Mixtures**:\nNon-uniform composition. Components visible or distinguishable.\n• Suspensions: Large particles that settle (muddy water)\n• Colloids: Medium particles that scatter light (milk, fog)\n• Mechanical mixtures: Clearly separated components (salad)',
        },
        {
          title: 'Separation Methods',
          content: '**Filtration**: Separates solids from liquids using a filter. Example: removing sand from water.\n\n**Evaporation**: Removes liquid by heating, leaving dissolved solid. Example: getting salt from seawater.\n\n**Distillation**: Separates liquids by different boiling points. Example: purifying water, alcohol production.\n\n**Chromatography**: Separates mixtures based on different movement rates in a medium. Used to analyze inks, drugs, food colors.\n\n**Magnetism**: Separates magnetic from non-magnetic materials. Example: iron filings from sand.',
        },
      ],
      keyPoints: [
        'Mixtures can be separated by physical methods',
        'Filtration separates insoluble solids from liquids',
        'Distillation uses different boiling points',
        'Chromatography separates based on polarity and molecular size',
      ],
    },
    experiment: {
      title: 'Separation of a Mixture',
      objective: 'Separate a mixture of salt and sand using filtration and evaporation.',
      chemicals: ['nacl', 'h2o'],
      equipment: ['beaker', 'filter_paper', 'funnel', 'hotplate', 'evaporating_dish'],
      steps: [
        { id: '1', instruction: 'Add 5g of salt-sand mixture to 100 mL of water in a beaker.', expectedObservation: 'Sand sinks; salt dissolves.' },
        { id: '2', instruction: 'Stir thoroughly to dissolve all the salt.', expectedObservation: 'Solution appears cloudy due to undissolved sand.' },
        { id: '3', instruction: 'Filter the mixture through filter paper in a funnel.', expectedObservation: 'Sand collects on filter paper; clear solution passes through.' },
        { id: '4', instruction: 'Evaporate the filtrate in an evaporating dish on a hot plate.', expectedObservation: 'Water evaporates; white NaCl crystals form.' },
        { id: '5', instruction: 'Collect and weigh the recovered salt crystals.', hint: 'Compare with initial mass to calculate recovery %.' },
      ],
      expectedResults: 'Sand is separated by filtration. Salt is recovered by evaporation. Demonstrates that physical separation does not change the chemical identity of components.',
    },
    quiz: [
      { id: 'q1', question: 'Which separation method would you use to separate alcohol from water?', options: ['Filtration', 'Magnetism', 'Distillation', 'Chromatography'], correct: 2, explanation: 'Distillation uses different boiling points. Alcohol (bp 78°C) boils before water (bp 100°C) and can be collected separately.', type: 'multiple-choice' },
      { id: 'q2', question: 'A colloid differs from a suspension because:', options: ['Colloid particles settle over time', 'Colloid particles are larger', 'Colloid particles do not settle and scatter light', 'Colloids are always liquid'], correct: 2, explanation: 'Colloid particles (1–1000 nm) are small enough to remain suspended and scatter light (Tyndall effect), unlike suspension particles which settle.', type: 'multiple-choice' },
    ],
  },

  // GRADE 9
  {
    id: 'atom-yapisi',
    title: 'Atomic Structure',
    titleTr: 'Atom Yapısı',
    grade: '9',
    order: 1,
    icon: '⚛️',
    color: '#00d4ff',
    description: 'Discover the structure of atoms, subatomic particles, and atomic models.',
    duration: 60,
    xpReward: 150,
    theory: {
      sections: [
        {
          title: 'History of Atomic Models',
          content: '**Dalton (1803)**: Atoms are indivisible solid spheres. All atoms of an element are identical.\n\n**Thomson (1897)**: Discovered electrons. "Plum pudding model" — negative electrons embedded in positive sphere.\n\n**Rutherford (1911)**: Gold foil experiment. Discovered the nucleus. Most of atom is empty space.\n\n**Bohr (1913)**: Electrons orbit nucleus in fixed energy levels (shells). Electrons jump between levels by absorbing/emitting energy.\n\n**Quantum Mechanical Model (1920s+)**: Electrons exist in probability clouds (orbitals), not fixed paths.',
        },
        {
          title: 'Subatomic Particles',
          content: '| Particle | Charge | Mass (amu) | Location |\n|----------|--------|-----------|----------|\n| Proton | +1 | 1.007 | Nucleus |\n| Neutron | 0 | 1.008 | Nucleus |\n| Electron | -1 | 0.000549 | Orbitals |\n\n• **Atomic Number (Z)**: Number of protons = number of electrons (neutral atom)\n• **Mass Number (A)**: Protons + Neutrons\n• **Isotopes**: Same element (same Z), different mass number (different neutrons)',
        },
        {
          title: 'Electron Configuration',
          content: 'Electrons fill orbitals following:\n\n**Aufbau Principle**: Fill lowest energy levels first\n**Pauli Exclusion**: Each orbital holds max 2 electrons (opposite spins)\n**Hund\'s Rule**: One electron per orbital before pairing\n\nShell capacities: 1st=2, 2nd=8, 3rd=18, 4th=32\n\nExample (Na, Z=11): 2, 8, 1\nExample (Cl, Z=17): 2, 8, 7',
        },
      ],
      keyPoints: [
        'Atoms contain protons, neutrons, and electrons',
        'Atomic number = number of protons',
        'Isotopes have same protons, different neutrons',
        'Electrons occupy energy levels/orbitals',
        'Quantum model describes probability of electron location',
      ],
    },
    experiment: {
      title: 'Flame Test — Identifying Elements',
      objective: 'Identify metal ions by the color they produce in a flame.',
      chemicals: ['nacl', 'cucl2', 'koh'],
      equipment: ['bunsen_burner', 'wire_loop', 'test_tube', 'safety_goggles'],
      steps: [
        { id: '1', instruction: 'Clean the wire loop by heating in flame until no color appears.', expectedObservation: 'Flame turns colorless after cleaning.' },
        { id: '2', instruction: 'Dip the loop in NaCl solution and place in flame.', expectedObservation: 'Flame turns bright yellow — characteristic of sodium (Na).' },
        { id: '3', instruction: 'Clean loop, then test CuCl₂ solution.', expectedObservation: 'Flame turns blue-green — characteristic of copper (Cu).' },
        { id: '4', instruction: 'Clean loop, then test KOH solution.', expectedObservation: 'Flame turns violet/lilac — characteristic of potassium (K).' },
        { id: '5', instruction: 'Record all flame colors and identify each element.', hint: 'Each element produces a unique emission spectrum.' },
      ],
      expectedResults: 'Na produces yellow, Cu produces green, K produces violet flames. This demonstrates that electrons in excited atoms emit specific wavelengths of light when returning to ground state.',
    },
    quiz: [
      { id: 'q1', question: 'An atom has 17 protons and 18 neutrons. What is its mass number?', options: ['17', '18', '35', '1'], correct: 2, explanation: 'Mass number = protons + neutrons = 17 + 18 = 35. This is chlorine-35 (³⁵Cl).', type: 'calculation' },
      { id: 'q2', question: 'Which scientist\'s experiment led to the discovery of the atomic nucleus?', options: ['Dalton', 'Thomson', 'Rutherford', 'Bohr'], correct: 2, explanation: 'Rutherford\'s gold foil experiment (1911) showed that alpha particles were deflected, proving a dense, positively charged nucleus exists.', type: 'multiple-choice' },
      { id: 'q3', question: '¹²C and ¹⁴C are isotopes. What do they have in common?', options: ['Same mass number', 'Same number of neutrons', 'Same number of protons', 'Same atomic mass'], correct: 2, explanation: 'Isotopes of the same element have the SAME number of protons (same atomic number). ¹²C and ¹⁴C both have 6 protons but differ in neutron count (6 vs 8).', type: 'multiple-choice' },
    ],
  },
  {
    id: 'periyodik-tablo',
    title: 'Periodic Table',
    titleTr: 'Periyodik Tablo',
    grade: '9',
    order: 2,
    icon: '📊',
    color: '#f59e0b',
    description: 'Explore the periodic table, trends, and element classification.',
    duration: 55,
    xpReward: 140,
    theory: {
      sections: [
        {
          title: 'Organization of the Periodic Table',
          content: 'The periodic table arranges elements by increasing **atomic number**. Elements in the same:\n\n**Group (Column)**: Have the same number of valence electrons and similar chemical properties.\n• Group 1 (Alkali metals): Very reactive, 1 valence electron\n• Group 17 (Halogens): Very reactive nonmetals, 7 valence electrons\n• Group 18 (Noble gases): Unreactive, full valence shells\n\n**Period (Row)**: Have the same number of electron shells.',
        },
        {
          title: 'Periodic Trends',
          content: '**Atomic Radius**: Increases DOWN a group (more shells), decreases LEFT to RIGHT across a period (more protons pull electrons closer).\n\n**Ionization Energy**: Energy to remove an electron. Increases LEFT to RIGHT, decreases DOWN a group.\n\n**Electronegativity**: Tendency to attract electrons. Increases LEFT to RIGHT, decreases DOWN. Fluorine (F) is the most electronegative element.\n\n**Metallic Character**: Increases DOWN and to the LEFT.',
        },
      ],
      keyPoints: [
        'Elements arranged by increasing atomic number',
        'Groups have similar chemical properties',
        'Atomic radius increases down a group',
        'Ionization energy increases across a period',
        'Metals are on the left, nonmetals on the right',
      ],
    },
    experiment: {
      title: 'Reactivity of Metals',
      objective: 'Compare the reactivity of different metals by observing their reaction with dilute acid.',
      chemicals: ['hcl', 'h2o'],
      equipment: ['test_tube', 'beaker', 'pipette', 'safety_goggles'],
      steps: [
        { id: '1', instruction: 'Add 5 mL of dilute HCl to three separate test tubes.', expectedObservation: 'Clear, colorless solution.' },
        { id: '2', instruction: 'Add a small piece of magnesium ribbon to the first tube.', expectedObservation: 'Vigorous bubbling — H₂ gas produced rapidly. Most reactive.' },
        { id: '3', instruction: 'Add zinc granules to the second tube.', expectedObservation: 'Moderate bubbling — Zn is less reactive than Mg.' },
        { id: '4', instruction: 'Add copper pieces to the third tube.', expectedObservation: 'No reaction — Cu is below H₂ in activity series.' },
        { id: '5', instruction: 'Rank the metals from most to least reactive.', hint: 'Mg > Zn > Cu in the activity series.' },
      ],
      expectedResults: 'Reactivity order: Mg > Zn > Cu. This matches the activity series and periodic trends — metals on the left and bottom of the periodic table are more reactive.',
    },
    quiz: [
      { id: 'q1', question: 'Which group contains elements with 7 valence electrons?', options: ['Group 1', 'Group 2', 'Group 17', 'Group 18'], correct: 2, explanation: 'Group 17 (halogens: F, Cl, Br, I) have 7 valence electrons and need 1 more to complete their octet.', type: 'multiple-choice' },
      { id: 'q2', question: 'True or False: Atomic radius increases from left to right across a period.', options: ['True', 'False'], correct: 1, explanation: 'False. Atomic radius DECREASES from left to right because more protons pull electrons closer to the nucleus.', type: 'true-false' },
    ],
  },

  // GRADE 10
  {
    id: 'cozeltiler',
    title: 'Solutions and Concentration',
    titleTr: 'Çözeltiler ve Derişim',
    grade: '10',
    order: 1,
    icon: '💧',
    color: '#00d4ff',
    description: 'Understand solutions, solubility, and different ways to express concentration.',
    duration: 65,
    xpReward: 160,
    theory: {
      sections: [
        {
          title: 'Solutions',
          content: '**Solution**: A homogeneous mixture of solute dissolved in solvent.\n• **Solute**: Substance being dissolved (smaller amount)\n• **Solvent**: Substance doing the dissolving (larger amount)\n\n**Types by state**: Liquid solutions (aqueous), gaseous solutions (air), solid solutions (alloys)\n\n**Solubility**: Maximum amount of solute that can dissolve in a given amount of solvent at a specific temperature.\n• "Like dissolves like" — polar solvents dissolve polar solutes; nonpolar solvents dissolve nonpolar solutes.',
        },
        {
          title: 'Concentration',
          content: '**Molarity (M)** = moles of solute / liters of solution\n\nExample: 0.5 mol NaCl in 2.0 L → M = 0.5/2.0 = 0.25 M\n\n**Mass percent** = (mass of solute / mass of solution) × 100%\n\n**Molality (m)** = moles of solute / kg of solvent\n\n**Dilution Formula**: M₁V₁ = M₂V₂\nWhen diluting: moles of solute stays constant.',
        },
        {
          title: 'Colligative Properties',
          content: 'Properties that depend on the NUMBER of solute particles, not their identity:\n\n• **Boiling point elevation**: ΔTb = Kb × m (solution boils higher than pure solvent)\n• **Freezing point depression**: ΔTf = Kf × m (solution freezes lower)\n• **Osmotic pressure**: π = MRT (critical in biology and medicine)\n\nApplications: Antifreeze in cars, road salt, IV solutions in hospitals',
        },
      ],
      keyPoints: [
        'Molarity = moles per liter of solution',
        'Dilution: M₁V₁ = M₂V₂',
        'Solubility increases with temperature for most solids',
        'Colligative properties depend on particle count',
      ],
    },
    experiment: {
      title: 'Preparing a Standard Solution',
      objective: 'Prepare 250 mL of 0.1 M NaCl solution accurately.',
      chemicals: ['nacl', 'h2o'],
      equipment: ['volumetric_flask', 'analytical_balance', 'beaker', 'pipette'],
      steps: [
        { id: '1', instruction: 'Calculate the mass of NaCl needed: n = M × V = 0.1 × 0.25 = 0.025 mol; mass = 0.025 × 58.44 = 1.461 g', hint: 'M(NaCl) = 58.44 g/mol' },
        { id: '2', instruction: 'Weigh 1.461 g of NaCl on the analytical balance.', expectedObservation: 'Balance reads exactly 1.461 g.' },
        { id: '3', instruction: 'Dissolve the NaCl in about 100 mL of distilled water in a beaker.', expectedObservation: 'Salt dissolves completely.' },
        { id: '4', instruction: 'Transfer to a 250 mL volumetric flask.', expectedObservation: 'Use wash bottle to transfer all solution.' },
        { id: '5', instruction: 'Add distilled water up to the 250 mL mark.', expectedObservation: 'Meniscus sits exactly on the calibration mark.' },
      ],
      expectedResults: 'A 0.1 M NaCl solution. Accurate preparation requires careful mass measurement and use of a volumetric flask for precise volume.',
    },
    quiz: [
      { id: 'q1', question: 'How many moles of HCl are in 500 mL of 2.0 M HCl?', options: ['0.5 mol', '1.0 mol', '2.0 mol', '4.0 mol'], correct: 1, explanation: 'n = M × V = 2.0 mol/L × 0.5 L = 1.0 mol', type: 'calculation' },
      { id: 'q2', question: 'What volume of 6.0 M HCl is needed to prepare 1.0 L of 1.5 M HCl?', options: ['100 mL', '150 mL', '250 mL', '400 mL'], correct: 2, explanation: 'Using M₁V₁ = M₂V₂: 6.0 × V₁ = 1.5 × 1.0; V₁ = 0.25 L = 250 mL', type: 'calculation' },
    ],
  },
  {
    id: 'termokimya',
    title: 'Thermochemistry',
    titleTr: 'Termokimya',
    grade: '10',
    order: 2,
    icon: '🔥',
    color: '#ef4444',
    description: 'Study energy changes in chemical reactions and thermodynamic principles.',
    duration: 70,
    xpReward: 180,
    theory: {
      sections: [
        {
          title: 'Energy in Chemical Reactions',
          content: '**Exothermic reactions**: Release energy to surroundings. System loses energy; ΔH < 0.\nExamples: Combustion, neutralization, respiration\n\n**Endothermic reactions**: Absorb energy from surroundings. System gains energy; ΔH > 0.\nExamples: Photosynthesis, dissolving NH₄NO₃, cooking\n\n**Enthalpy (H)**: Total heat content of a system.\n**ΔH = H(products) − H(reactants)**',
        },
        {
          title: 'Calorimetry',
          content: 'Measuring heat changes using a calorimeter:\n\n**q = m × c × ΔT**\n\nWhere:\n• q = heat energy (J or kJ)\n• m = mass (g)\n• c = specific heat capacity (J/g·°C)\n• ΔT = temperature change (°C)\n\nSpecific heat of water: **4.184 J/g·°C**\n\nCoffee cup calorimeter: Simple, measures heat in aqueous solutions.\nBomb calorimeter: Measures heat of combustion at constant volume.',
        },
        {
          title: "Hess's Law",
          content: "The enthalpy change of a reaction is independent of the pathway — only depends on initial and final states.\n\n**ΔH°rxn = Σ ΔH°f(products) − Σ ΔH°f(reactants)**\n\nThis allows calculation of ΔH for reactions that can't be measured directly by combining known reactions.",
        },
      ],
      keyPoints: [
        'Exothermic: ΔH < 0 (releases heat)',
        'Endothermic: ΔH > 0 (absorbs heat)',
        'q = m × c × ΔT for calorimetry',
        "Hess's Law: ΔH is path-independent",
      ],
    },
    experiment: {
      title: 'Heat of Neutralization',
      objective: 'Measure the heat released when HCl reacts with NaOH.',
      chemicals: ['hcl', 'naoh', 'h2o'],
      equipment: ['calorimeter', 'thermometer', 'beaker', 'pipette'],
      steps: [
        { id: '1', instruction: 'Measure 50 mL of 1.0 M HCl and record initial temperature.', expectedObservation: 'Temperature ≈ 20°C' },
        { id: '2', instruction: 'Measure 50 mL of 1.0 M NaOH and record initial temperature.', expectedObservation: 'Temperature ≈ 20°C' },
        { id: '3', instruction: 'Mix both solutions in the calorimeter and record the temperature every 30 seconds.', expectedObservation: 'Temperature rises rapidly to ~26-27°C' },
        { id: '4', instruction: 'Calculate ΔT and compute heat released: q = m × c × ΔT', hint: 'Total mass ≈ 100 g; c = 4.184 J/g°C' },
        { id: '5', instruction: 'Calculate ΔH per mole of water formed.', hint: 'moles H₂O = 0.05 L × 1.0 mol/L = 0.05 mol' },
      ],
      expectedResults: 'ΔT ≈ +6-7°C. Heat released ≈ 2800 J. ΔH ≈ -57 kJ/mol, close to the literature value of -57.3 kJ/mol for strong acid-base neutralization.',
    },
    quiz: [
      { id: 'q1', question: 'A reaction has ΔH = -180 kJ. This reaction is:', options: ['Endothermic', 'Exothermic', 'Neither', 'Cannot determine'], correct: 1, explanation: 'A negative ΔH means the products have lower energy than reactants — energy is released to surroundings (exothermic).', type: 'multiple-choice' },
      { id: 'q2', question: '50 g of water warms from 20°C to 30°C. How much heat was absorbed? (c = 4.184 J/g°C)', options: ['209.2 J', '2092 J', '4184 J', '418.4 J'], correct: 1, explanation: 'q = m × c × ΔT = 50 × 4.184 × 10 = 2092 J', type: 'calculation' },
    ],
  },

  // GRADE 11
  {
    id: 'organik-kimya',
    title: 'Organic Chemistry',
    titleTr: 'Organik Kimya',
    grade: '11',
    order: 1,
    icon: '🧬',
    color: '#10b981',
    description: 'Study carbon-containing compounds, functional groups, and organic reactions.',
    duration: 80,
    xpReward: 200,
    theory: {
      sections: [
        {
          title: 'Introduction to Organic Chemistry',
          content: '**Organic chemistry**: Study of carbon-containing compounds.\n\nCarbon is unique:\n• Forms 4 bonds (tetravalent)\n• Bonds with other carbons to form chains, rings\n• Creates millions of compounds\n\n**Hydrocarbons**: Contain only C and H\n• Alkanes (CₙH₂ₙ₊₂): Single bonds — methane, ethane, propane\n• Alkenes (CₙH₂ₙ): One double bond — ethene, propene\n• Alkynes (CₙH₂ₙ₋₂): One triple bond — ethyne (acetylene)\n• Aromatic: Benzene ring structure',
        },
        {
          title: 'Functional Groups',
          content: '| Group | Formula | Class | Example |\n|-------|---------|-------|---------|\n| -OH | hydroxyl | Alcohol | Ethanol |\n| -COOH | carboxyl | Carboxylic acid | Acetic acid |\n| -CHO | aldehyde | Aldehyde | Formaldehyde |\n| -CO- | carbonyl | Ketone | Acetone |\n| -NH₂ | amine | Amine | Methylamine |\n| -COOR | ester | Ester | Ethyl acetate |\n\nFunctional groups determine the chemical behavior of organic molecules.',
        },
        {
          title: 'Isomerism',
          content: '**Structural isomers**: Same molecular formula, different connectivity.\nExample: Butane (C₄H₁₀) — n-butane (straight) vs isobutane (branched)\n\n**Stereoisomers**: Same connectivity, different spatial arrangement.\n• Cis-trans (geometric): Different arrangement around double bond\n• Optical isomers (enantiomers): Non-superimposable mirror images — important in pharmaceuticals',
        },
      ],
      keyPoints: [
        'Carbon forms 4 bonds and chains/rings',
        'Functional groups determine reactivity',
        'IUPAC naming follows systematic rules',
        'Isomers have same formula but different structures',
        'Chirality is important in medicine',
      ],
    },
    experiment: {
      title: 'Esterification Reaction',
      objective: 'Synthesize ethyl acetate from ethanol and acetic acid.',
      chemicals: ['ethanol', 'ch3cooh', 'h2so4'],
      equipment: ['round_flask', 'condenser', 'hotplate', 'separating_funnel'],
      steps: [
        { id: '1', instruction: 'Mix 10 mL ethanol and 10 mL acetic acid in a flask.', expectedObservation: 'Colorless mixture with acidic smell.' },
        { id: '2', instruction: 'Add 2 drops of concentrated H₂SO₄ (catalyst) carefully.', hint: 'H₂SO₄ acts as a catalyst for esterification.' },
        { id: '3', instruction: 'Reflux the mixture at 80°C for 30 minutes.', expectedObservation: 'Solution warms; reaction proceeds slowly.' },
        { id: '4', instruction: 'Cool and add sodium carbonate solution to neutralize acid.', expectedObservation: 'Bubbling as CO₂ is produced.' },
        { id: '5', instruction: 'Separate the ester layer in a separating funnel.', expectedObservation: 'Ethyl acetate (fruity smell) forms the upper layer.' },
      ],
      expectedResults: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O. Ethyl acetate has a characteristic fruity odor. This is a reversible reaction — equilibrium is shifted by removing products.',
    },
    quiz: [
      { id: 'q1', question: 'Which functional group characterizes an alcohol?', options: ['-COOH', '-OH', '-CHO', '-NH₂'], correct: 1, explanation: 'Alcohols contain the hydroxyl group (-OH) attached to a carbon atom. Example: ethanol (CH₃CH₂OH).', type: 'multiple-choice' },
      { id: 'q2', question: 'C₄H₁₀ has how many structural isomers?', options: ['1', '2', '3', '4'], correct: 1, explanation: 'Butane (C₄H₁₀) has 2 structural isomers: n-butane (straight chain) and isobutane (2-methylpropane, branched).', type: 'multiple-choice' },
    ],
  },
  {
    id: 'elektrokimya',
    title: 'Electrochemistry',
    titleTr: 'Elektrokimya',
    grade: '11',
    order: 2,
    icon: '⚡',
    color: '#f59e0b',
    description: 'Study redox reactions, galvanic cells, and electrolysis.',
    duration: 75,
    xpReward: 190,
    theory: {
      sections: [
        {
          title: 'Redox Reactions',
          content: '**Oxidation**: Loss of electrons (OIL — Oxidation Is Loss)\n**Reduction**: Gain of electrons (RIG — Reduction Is Gain)\n\nOxidation and reduction always occur together (redox).\n\n**Oxidizing agent**: Gets reduced (gains electrons) — causes oxidation\n**Reducing agent**: Gets oxidized (loses electrons) — causes reduction\n\nExample: Zn + Cu²⁺ → Zn²⁺ + Cu\n• Zn is oxidized (0 → +2), Zn is the reducing agent\n• Cu²⁺ is reduced (+2 → 0), Cu²⁺ is the oxidizing agent',
        },
        {
          title: 'Galvanic Cells',
          content: 'Galvanic (voltaic) cells convert chemical energy to electrical energy.\n\nComponents:\n• **Anode**: Oxidation occurs here (negative terminal)\n• **Cathode**: Reduction occurs here (positive terminal)\n• **Salt bridge**: Maintains electrical neutrality by allowing ion flow\n• **External circuit**: Electrons flow from anode to cathode\n\n**Cell notation**: Zn(s)|Zn²⁺(aq)||Cu²⁺(aq)|Cu(s)\n**Standard Cell Potential**: E°cell = E°cathode − E°anode',
        },
        {
          title: 'Electrolysis',
          content: 'Electrolysis uses electrical energy to drive non-spontaneous redox reactions.\n\nApplications:\n• Electroplating: Depositing a thin metal layer\n• Water splitting: 2H₂O → 2H₂ + O₂\n• Aluminum production (Hall-Héroult process)\n• Chlor-alkali process: NaCl → Cl₂ + H₂ + NaOH\n\n**Faraday\'s Laws**:\n1. Mass deposited ∝ charge passed (q = I × t)\n2. Mass deposited ∝ molar mass / number of electrons',
        },
      ],
      keyPoints: [
        'OIL RIG: Oxidation is Loss, Reduction is Gain',
        'Galvanic cells convert chemical energy to electrical',
        'Anode: oxidation; Cathode: reduction',
        'Electrolysis drives non-spontaneous reactions',
        "E°cell = E°cathode - E°anode",
      ],
    },
    experiment: {
      title: 'Building a Galvanic Cell',
      objective: 'Construct a Zn-Cu galvanic cell and measure its voltage.',
      chemicals: ['cuso4', 'h2so4', 'h2o'],
      equipment: ['galvanic_cell', 'voltmeter', 'salt_bridge', 'beaker'],
      steps: [
        { id: '1', instruction: 'Fill one beaker with 1.0 M ZnSO₄ solution and another with 1.0 M CuSO₄ solution.', expectedObservation: 'ZnSO₄: colorless; CuSO₄: blue solution.' },
        { id: '2', instruction: 'Place zinc electrode in ZnSO₄ and copper electrode in CuSO₄.', hint: 'Zinc is the anode (oxidation), copper is the cathode (reduction).' },
        { id: '3', instruction: 'Connect the two beakers with a salt bridge (saturated KNO₃ in agar).', expectedObservation: 'Circuit is now complete.' },
        { id: '4', instruction: 'Connect the voltmeter: negative to Zn, positive to Cu.', expectedObservation: 'Voltmeter reads approximately +1.10 V.' },
        { id: '5', instruction: 'Observe changes to the electrodes over time.', expectedObservation: 'Zn electrode dissolves; Cu metal deposits on copper electrode.' },
      ],
      expectedResults: 'Standard cell potential ≈ 1.10 V (E°Cu = +0.34V, E°Zn = -0.76V, so E°cell = 0.34 - (-0.76) = 1.10V). Zn dissolves at anode; Cu deposits at cathode.',
    },
    quiz: [
      { id: 'q1', question: 'In a galvanic cell, where does oxidation occur?', options: ['Cathode', 'Salt bridge', 'Anode', 'External wire'], correct: 2, explanation: 'Oxidation (loss of electrons) occurs at the ANODE. Remember: AN OX = ANode is OXidation; RED CAT = REDuction at CAThode.', type: 'multiple-choice' },
      { id: 'q2', question: 'A standard Zn-Cu cell has E°(Zn²⁺/Zn) = -0.76V and E°(Cu²⁺/Cu) = +0.34V. What is E°cell?', options: ['+0.42 V', '-1.10 V', '+1.10 V', '-0.42 V'], correct: 2, explanation: 'E°cell = E°cathode - E°anode = +0.34 - (-0.76) = +1.10 V. Cu is the cathode (more positive reduction potential).', type: 'calculation' },
    ],
  },

  // GRADE 12
  {
    id: 'titrasyon',
    title: 'Titration',
    titleTr: 'Titrasyon',
    grade: '12',
    order: 1,
    icon: '🧪',
    color: '#7c3aed',
    description: 'Master acid-base titration techniques and quantitative chemical analysis.',
    duration: 90,
    xpReward: 250,
    theory: {
      sections: [
        {
          title: 'What is Titration?',
          content: '**Titration**: A quantitative analytical technique where a solution of known concentration (titrant) is gradually added to a solution of unknown concentration (analyte) until the reaction reaches completion.\n\n**Equivalence point**: The point where moles of titrant exactly equal the stoichiometric amount needed to react with the analyte.\n\n**Endpoint**: The observed point in a titration, usually indicated by a color change of an indicator. Ideally very close to the equivalence point.',
        },
        {
          title: 'Types of Titration',
          content: '**Acid-Base Titration**: Neutralization reactions\n• Strong acid + Strong base: equivalence point pH = 7\n• Weak acid + Strong base: equivalence point pH > 7\n• Strong acid + Weak base: equivalence point pH < 7\n\n**Redox Titration**: Permanganate, dichromate, iodometry\n\n**Precipitation Titration**: Mohr\'s method (AgNO₃ vs Cl⁻)\n\n**Complexometric Titration**: EDTA for metal ions',
        },
        {
          title: 'Calculations',
          content: '**At equivalence point**: n(acid) = n(base) [for 1:1 reactions]\n\nM_acid × V_acid = M_base × V_base\n\nFor different stoichiometry:\nM_acid × V_acid × n_a = M_base × V_base × n_b\n\n**Example**: 25.00 mL of HCl is titrated with 0.100 M NaOH. Endpoint at 18.50 mL NaOH.\n\nM(HCl) = (0.100 × 18.50) / 25.00 = 0.0740 M',
        },
        {
          title: 'Indicators',
          content: '| Indicator | Color (acid) | Color (base) | pH Range |\n|-----------|-------------|-------------|----------|\n| Methyl orange | Red | Yellow | 3.1–4.4 |\n| Methyl red | Red | Yellow | 4.4–6.2 |\n| Litmus | Red | Blue | 5.0–8.0 |\n| Phenolphthalein | Colorless | Pink | 8.2–10.0 |\n| Thymol blue | Yellow | Blue | 8.0–9.6 |\n\n**Choice of indicator**: Must change color near the equivalence point pH.',
        },
      ],
      keyPoints: [
        'Titration determines unknown concentration',
        'Equivalence point: moles acid = moles base (1:1)',
        'M₁V₁ = M₂V₂ at equivalence point',
        'Indicator choice depends on equivalence point pH',
        'Phenolphthalein: colorless (acid) → pink (base)',
      ],
    },
    experiment: {
      title: 'Acid-Base Titration',
      objective: 'Determine the concentration of an unknown HCl solution by titration with 0.100 M NaOH.',
      chemicals: ['hcl', 'naoh', 'phenolphthalein', 'h2o'],
      equipment: ['burette', 'conical_flask', 'pipette', 'clamp_stand', 'white_tile'],
      steps: [
        { id: '1', instruction: 'Fill the burette with 0.100 M NaOH solution and record the initial reading.', hint: 'Read the bottom of the meniscus at eye level.' },
        { id: '2', instruction: 'Pipette exactly 25.00 mL of unknown HCl into a conical flask.', expectedObservation: 'Colorless solution in flask.' },
        { id: '3', instruction: 'Add 2-3 drops of phenolphthalein indicator.', expectedObservation: 'Solution remains colorless.' },
        { id: '4', instruction: 'Add NaOH slowly from the burette, swirling the flask constantly.', expectedObservation: 'Pink color appears and fades on swirling. Add more slowly near the endpoint.' },
        { id: '5', instruction: 'Stop when ONE drop of NaOH produces a permanent faint pink color. Record the final burette reading.', expectedObservation: 'Pale pink persists for 30 seconds — endpoint reached.' },
        { id: '6', instruction: 'Calculate the volume of NaOH used and determine M(HCl) using M₁V₁ = M₂V₂.', hint: 'Volume NaOH = final reading - initial reading.' },
      ],
      expectedResults: 'Using M(NaOH) × V(NaOH) = M(HCl) × V(HCl), calculate M(HCl). Typical endpoint: ~18-22 mL NaOH for 0.07-0.09 M HCl. Precision requires at least 3 concordant results within 0.1 mL.',
    },
    quiz: [
      { id: 'q1', question: '25.00 mL of NaOH (0.200 M) exactly neutralizes 20.00 mL of HCl. What is the concentration of HCl?', options: ['0.150 M', '0.200 M', '0.250 M', '0.100 M'], correct: 2, explanation: 'M₁V₁ = M₂V₂ → M(HCl) × 20.00 = 0.200 × 25.00 → M(HCl) = 5.00/20.00 = 0.250 M', type: 'calculation' },
      { id: 'q2', question: 'Which indicator is most suitable for titrating a weak acid with a strong base?', options: ['Methyl orange (pH 3.1-4.4)', 'Phenolphthalein (pH 8.2-10.0)', 'Litmus (pH 5.0-8.0)', 'Congo red (pH 3.0-5.0)'], correct: 1, explanation: 'Weak acid + strong base equivalence point pH > 7 (typically 8-9). Phenolphthalein changes color at pH 8.2-10, perfectly straddling this region.', type: 'multiple-choice' },
      { id: 'q3', question: 'True or False: The endpoint and equivalence point are always the same.', options: ['True', 'False'], correct: 1, explanation: 'False. The equivalence point is the theoretical point (complete reaction); the endpoint is when the indicator changes. A good indicator minimizes this difference (titration error).', type: 'true-false' },
    ],
  },
  {
    id: 'elektroliz',
    title: 'Electrolysis',
    titleTr: 'Elektroliz',
    grade: '12',
    order: 2,
    icon: '⚡',
    color: '#f59e0b',
    description: 'Study electrolytic cells, Faraday\'s laws, and industrial applications.',
    duration: 80,
    xpReward: 220,
    theory: {
      sections: [
        {
          title: 'Electrolytic Cells',
          content: '**Electrolysis**: Uses external electrical energy to drive non-spontaneous chemical reactions.\n\nKey difference from galvanic cells:\n• Galvanic: spontaneous reaction generates electricity (ΔG < 0)\n• Electrolytic: electricity drives non-spontaneous reaction (ΔG > 0)\n\n**Components**: Power supply, electrodes (cathode and anode), electrolyte solution.\n\nAt **cathode** (negative): Reduction — cations gain electrons\nAt **anode** (positive): Oxidation — anions lose electrons',
        },
        {
          title: "Faraday's Laws",
          content: "**First Law**: The mass of substance deposited (or dissolved) at an electrode is proportional to the quantity of charge passed.\n\nm = (M × I × t) / (n × F)\n\nWhere:\n• m = mass (g)\n• M = molar mass (g/mol)\n• I = current (A)\n• t = time (s)\n• n = electrons per ion\n• F = Faraday's constant = 96,485 C/mol\n\n**Example**: Electrolysis of CuSO₄ with 2A for 30 min:\nm(Cu) = (63.5 × 2 × 1800) / (2 × 96485) = 1.19 g",
        },
        {
          title: 'Industrial Applications',
          content: '**Chlor-Alkali Process**:\nElectrolysis of saturated NaCl solution:\n• Cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻\n• Anode: 2Cl⁻ → Cl₂ + 2e⁻\nProducts: Cl₂ gas, H₂ gas, NaOH solution\n\n**Aluminum Smelting (Hall-Héroult)**:\nElectrolysis of Al₂O₃ dissolved in molten cryolite\n\n**Electroplating**:\nDeposit thin metal layers for protection or decoration.\nAnode: metal to be plated (dissolves)\nCathode: object to be plated (metal deposits)',
        },
      ],
      keyPoints: [
        'Electrolysis uses electricity to drive non-spontaneous reactions',
        'Cathode: reduction (cations gain e⁻)',
        'Anode: oxidation (anions lose e⁻)',
        'm = MIt/nF (Faraday\'s Law)',
        'Industrial uses: chlor-alkali, aluminum, electroplating',
      ],
    },
    experiment: {
      title: 'Electrolysis of Copper Sulfate',
      objective: 'Electrolyze CuSO₄ solution and verify Faraday\'s Law by measuring mass deposited.',
      chemicals: ['cuso4', 'h2so4', 'h2o'],
      equipment: ['electrolysis_apparatus', 'power_supply', 'ammeter', 'copper_electrodes', 'analytical_balance'],
      steps: [
        { id: '1', instruction: 'Clean and weigh two copper electrodes carefully.', hint: 'Record mass to 4 decimal places.' },
        { id: '2', instruction: 'Prepare 200 mL of 1.0 M CuSO₄ solution with a few drops of H₂SO₄.', expectedObservation: 'Bright blue solution.' },
        { id: '3', instruction: 'Connect cathode (negative) and anode (positive), immerse in CuSO₄.', hint: 'Copper deposits at cathode; copper dissolves from anode.' },
        { id: '4', instruction: 'Apply 0.5 A current for exactly 30 minutes. Note start time.', expectedObservation: 'Pink copper deposits on cathode. Anode may become lighter.' },
        { id: '5', instruction: 'Remove, dry, and reweigh both electrodes. Calculate mass change.', expectedObservation: 'Cathode mass increases; anode mass decreases by similar amount.' },
        { id: '6', instruction: 'Compare observed mass with theoretical value using Faraday\'s Law.', hint: 'm = (63.5 × 0.5 × 1800) / (2 × 96485)' },
      ],
      expectedResults: 'Theoretical mass: m = (63.5 × 0.5 × 1800)/(2 × 96485) = 0.297 g. Observed ≈ 0.28–0.31 g. At anode: Cu → Cu²⁺ + 2e⁻. At cathode: Cu²⁺ + 2e⁻ → Cu. Mass conservation: anode loss ≈ cathode gain.',
    },
    quiz: [
      { id: 'q1', question: 'In electrolysis of CuSO₄, what happens at the cathode?', options: ['Cu is oxidized', 'SO₄²⁻ is reduced', 'Cu²⁺ is reduced to Cu metal', 'O₂ gas is produced'], correct: 2, explanation: 'At the cathode (negative electrode): Cu²⁺ + 2e⁻ → Cu. Reduction occurs at the cathode — cations gain electrons and are deposited as solid metal.', type: 'multiple-choice' },
      { id: 'q2', question: 'Calculate the mass of Cu deposited by 2.0 A for 1 hour. M(Cu)=63.5, n=2, F=96485', options: ['1.19 g', '2.38 g', '0.595 g', '4.76 g'], correct: 1, explanation: 'm = (M × I × t)/(n × F) = (63.5 × 2.0 × 3600)/(2 × 96485) = 457200/192970 = 2.37 g ≈ 2.38 g', type: 'calculation' },
    ],
  },
  {
    id: 'galvanik-piller',
    title: 'Galvanic Cells & Batteries',
    titleTr: 'Galvanik Piller',
    grade: '12',
    order: 3,
    icon: '🔋',
    color: '#10b981',
    description: 'Advanced study of electrochemical cells, EMF, and modern battery technology.',
    duration: 75,
    xpReward: 210,
    theory: {
      sections: [
        {
          title: 'Standard Electrode Potentials',
          content: 'Standard electrode potentials (E°) are measured vs. Standard Hydrogen Electrode (SHE, E° = 0.00 V).\n\nSelected values:\n• F₂/F⁻: +2.87 V (strongest oxidizer)\n• Au³⁺/Au: +1.52 V\n• Cu²⁺/Cu: +0.34 V\n• H⁺/H₂: 0.00 V\n• Zn²⁺/Zn: -0.76 V\n• Li⁺/Li: -3.05 V (strongest reducer)\n\n**E°cell = E°cathode − E°anode**\nPositive E°cell → spontaneous (galvanic cell)',
        },
        {
          title: 'Nernst Equation',
          content: 'At non-standard conditions:\n\n**E = E° − (RT/nF) × ln(Q)**\n\nAt 25°C simplifies to:\n**E = E° − (0.0592/n) × log(Q)**\n\nWhere Q is the reaction quotient.\n\nAs the cell discharges:\n• Reactants consumed, products accumulate\n• Q increases → E decreases\n• At equilibrium: Q = K, E = 0 (battery dead)\n\n**Relationship**: ΔG° = −nFE° = −RT ln K',
        },
        {
          title: 'Modern Batteries',
          content: '**Primary batteries** (non-rechargeable):\n• Alkaline: Zn-MnO₂, ~1.5V per cell\n• Lithium: High energy density, long shelf life\n\n**Secondary batteries** (rechargeable):\n• Lead-acid: Pb/PbO₂ in H₂SO₄, 2V/cell, used in cars\n• Ni-MH: Nickel-metal hydride, ~1.2V\n• Li-ion: LiCoO₂/graphite, ~3.7V, in phones/EVs\n• Li-polymer: Flexible form factor\n\n**Fuel cells**: Continuous H₂ + O₂ → H₂O + electricity',
        },
      ],
      keyPoints: [
        'E°cell = E°cathode − E°anode',
        'Positive E°cell means spontaneous reaction',
        'Nernst equation corrects for non-standard conditions',
        'Battery dies when Q = K and E = 0',
        'Li-ion batteries dominate modern electronics',
      ],
    },
    experiment: {
      title: 'Standard Cell Potential Measurement',
      objective: 'Measure and compare EMF values for different galvanic cells.',
      chemicals: ['cuso4', 'h2so4', 'h2o', 'nacl'],
      equipment: ['galvanic_cell', 'voltmeter', 'salt_bridge', 'electrodes'],
      steps: [
        { id: '1', instruction: 'Set up a Zn-Cu cell with 1.0 M solutions. Measure E.', expectedObservation: '~1.10 V' },
        { id: '2', instruction: 'Set up a Zn-Fe cell with 1.0 M solutions. Measure E.', expectedObservation: '~0.32 V (E°Fe²⁺/Fe = -0.44V)' },
        { id: '3', instruction: 'Set up a Cu-Ag cell if Ag electrodes are available.', expectedObservation: '~0.46 V (E°Ag⁺/Ag = +0.80V)' },
        { id: '4', instruction: 'Record all voltages and compare with calculated E° values.', hint: 'E°cell = E°cathode - E°anode' },
        { id: '5', instruction: 'Dilute one half-cell by 10x and observe voltage change (Nernst effect).', expectedObservation: 'Voltage shifts slightly from standard value.' },
      ],
      expectedResults: 'Measured values should approximate standard values. Zn-Cu: ~1.10V; Zn-Fe: ~0.32V. Deviations from standard due to non-standard conditions explained by Nernst equation.',
    },
    quiz: [
      { id: 'q1', question: 'For a cell with E°cell = +0.80V, which statement is true?', options: ['Reaction is non-spontaneous', 'ΔG > 0', 'Reaction is spontaneous', 'Q > K'], correct: 2, explanation: 'Positive E°cell → ΔG = -nFE° < 0 → spontaneous. The cell can do useful work.', type: 'multiple-choice' },
      { id: 'q2', question: 'When a battery is "dead," which condition is true?', options: ['E°cell = 0', 'Q = 0', 'E = 0 and Q = K', 'Concentration = 0'], correct: 2, explanation: 'A dead battery has reached electrochemical equilibrium: Q = K, so E = 0 (by Nernst equation). No net reaction occurs.', type: 'multiple-choice' },
    ],
  },
  {
    id: 'redoks-reaksiyonlari',
    title: 'Redox Reactions',
    titleTr: 'Redoks Reaksiyonları',
    grade: '12',
    order: 4,
    icon: '🔄',
    color: '#ef4444',
    description: 'Master oxidation states, balancing redox equations, and reaction types.',
    duration: 85,
    xpReward: 230,
    theory: {
      sections: [
        {
          title: 'Oxidation States',
          content: 'Rules for assigning oxidation states:\n1. Pure element: 0\n2. Monoatomic ion: equals its charge\n3. H: +1 (except metal hydrides: -1)\n4. O: -2 (except peroxides: -1, OF₂: +2)\n5. Sum of oxidation states = charge of species\n\nExample: Cr₂O₇²⁻\n2(Cr) + 7(-2) = -2 → Cr = +6\n\nMnO₄⁻: Mn + 4(-2) = -1 → Mn = +7',
        },
        {
          title: 'Balancing Redox Equations (Half-Reaction Method)',
          content: 'Steps:\n1. Split into oxidation and reduction half-reactions\n2. Balance atoms (O with H₂O, H with H⁺)\n3. Balance charge by adding electrons\n4. Multiply to equalize electron count\n5. Add half-reactions and simplify\n\nExample: MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺ (acidic)\n• Reduction: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O\n• Oxidation: Fe²⁺ → Fe³⁺ + e⁻ (×5)\n• Net: MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺',
        },
      ],
      keyPoints: [
        'Oxidation = increase in oxidation state',
        'Reduction = decrease in oxidation state',
        'Balance redox using half-reaction method',
        'KMnO₄: powerful oxidizing agent (Mn: +7 → +2)',
        'Dichromate (Cr₂O₇²⁻): oxidizer in acidic solution',
      ],
    },
    experiment: {
      title: 'Permanganate Redox Titration',
      objective: 'Determine iron(II) concentration using KMnO₄ as the oxidizing titrant.',
      chemicals: ['h2so4', 'h2o'],
      equipment: ['burette', 'conical_flask', 'pipette', 'hot_plate'],
      steps: [
        { id: '1', instruction: 'Fill burette with 0.0200 M KMnO₄ (purple) and record initial reading.', expectedObservation: 'Purple solution in burette.' },
        { id: '2', instruction: 'Pipette 25.00 mL Fe²⁺ solution into flask. Add dilute H₂SO₄.', expectedObservation: 'Pale green/yellow solution.' },
        { id: '3', instruction: 'Add KMnO₄ dropwise from burette, swirling after each addition.', expectedObservation: 'Purple color disappears immediately — Fe²⁺ reduces MnO₄⁻ to Mn²⁺ (colorless).' },
        { id: '4', instruction: 'At endpoint, one drop produces a permanent pale pink/purple.', expectedObservation: 'No more Fe²⁺ to reduce the permanganate.' },
        { id: '5', instruction: 'Calculate Fe²⁺ concentration using the stoichiometry (5:1 Fe:Mn).', hint: '5 mol Fe²⁺ per 1 mol MnO₄⁻' },
      ],
      expectedResults: 'Reaction: MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O. KMnO₄ is self-indicating (purple fades until endpoint). M(Fe²⁺) = 5 × M(KMnO₄) × V(KMnO₄) / V(Fe²⁺).',
    },
    quiz: [
      { id: 'q1', question: 'What is the oxidation state of Mn in KMnO₄?', options: ['+2', '+4', '+6', '+7'], correct: 3, explanation: 'K = +1, O = -2 (×4 = -8). Sum = 0: +1 + Mn + (-8) = 0 → Mn = +7.', type: 'calculation' },
      { id: 'q2', question: 'In the reaction Zn + 2HCl → ZnCl₂ + H₂, what is oxidized?', options: ['H in HCl', 'Cl in HCl', 'Zn', 'ZnCl₂'], correct: 2, explanation: 'Zn goes from 0 to +2 (loses electrons) — it is oxidized. H⁺ goes from +1 to 0 (gains electrons) — it is reduced. Zn is the reducing agent.', type: 'multiple-choice' },
    ],
  },
];

export function getGradeTopics(grade: GradeLevel): CurriculumTopic[] {
  return CURRICULUM.filter(t => t.grade === grade).sort((a, b) => a.order - b.order);
}

export function getTopic(id: string): CurriculumTopic | undefined {
  return CURRICULUM.find(t => t.id === id);
}

export const GRADE_INFO: Record<GradeLevel, { label: string; labelTr: string; color: string; icon: string; description: string }> = {
  hazirlik: { label: 'Prep Class', labelTr: 'Hazırlık Sınıfı', color: '#00d4ff', icon: '🌱', description: 'Foundation of chemistry: matter, safety, and basic concepts.' },
  '9': { label: 'Grade 9', labelTr: '9. Sınıf', color: '#10b981', icon: '⚛️', description: 'Atomic structure, periodic table, chemical bonding, and mole concept.' },
  '10': { label: 'Grade 10', labelTr: '10. Sınıf', color: '#7c3aed', icon: '💧', description: 'Solutions, gas laws, thermochemistry, and reaction rates.' },
  '11': { label: 'Grade 11', labelTr: '11. Sınıf', color: '#f59e0b', icon: '🧬', description: 'Organic chemistry, electrochemistry, and modern atomic theory.' },
  '12': { label: 'Grade 12', labelTr: '12. Sınıf', color: '#ef4444', icon: '🏆', description: 'Advanced topics: titration, electrolysis, galvanic cells, and analytical chemistry.' },
};
