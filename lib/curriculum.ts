export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[];
  answer: string | number;
  explanation: string;
}

export interface TheorySection {
  title: string;
  content: string;
  formula?: string;
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  chemicals: string[];
  equipment: string[];
  steps: string[];
  expectedObservations: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  theory: { sections: TheorySection[] };
  experiments: Experiment[];
  quiz: QuizQuestion[];
}

export interface GradeLevel {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  description: string;
  topics: Topic[];
}

export const CURRICULUM: Record<string, GradeLevel> = {
  hazirlık: {
    id: 'hazirlık',
    name: 'Preparation Class',
    shortName: 'Prep',
    color: '#8b5cf6',
    icon: '📚',
    description: 'Introduction to chemistry fundamentals and laboratory basics',
    topics: [
      {
        id: 'matter',
        name: 'Matter and Properties',
        description: 'Understanding what matter is and its physical and chemical properties',
        icon: '⚛️',
        theory: {
          sections: [
            {
              title: 'What is Matter?',
              content: 'Matter is anything that has mass and takes up space. Everything around us — air, water, rocks, and living things — is made of matter. Matter is composed of tiny particles called atoms and molecules.'
            },
            {
              title: 'Physical Properties',
              content: 'Physical properties can be observed without changing the chemical composition of matter. Examples include: color, odor, density, melting point, boiling point, hardness, and conductivity.'
            },
            {
              title: 'Chemical Properties',
              content: 'Chemical properties describe how a substance changes into a different substance. Examples: flammability (burns in air), reactivity with acids, ability to rust (oxidation), and decomposition.'
            },
            { title: 'Density Formula', content: 'Density = Mass / Volume', formula: 'ρ = m/V (g/cm³)' }
          ]
        },
        experiments: [{
          id: 'density_exp',
          name: 'Measuring Density',
          description: 'Measure density of different substances using analytical balance and graduated cylinder',
          chemicals: ['h2o'],
          equipment: ['balance', 'beaker', 'volumetric_flask'],
          steps: ['Measure the mass of the empty beaker', 'Add 50 mL of water to the beaker', 'Measure the total mass', 'Calculate density using ρ = m/V', 'Repeat with different liquids'],
          expectedObservations: 'Water has density ~1 g/cm³. Denser liquids sink in water, lighter ones float.'
        }],
        quiz: [
          { id: 'q1', question: 'Which of the following is a physical property?', type: 'multiple-choice', options: ['Flammability', 'Boiling point', 'Reactivity with acid', 'Oxidation'], answer: 1, explanation: 'Boiling point is a physical property because it can be observed without changing the chemical composition.' },
          { id: 'q2', question: 'Matter is defined as anything with mass and volume.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Matter is anything that has mass and occupies space (volume).' },
          { id: 'q3', question: 'If an object has mass 50g and volume 25cm³, what is its density?', type: 'multiple-choice', options: ['0.5 g/cm³', '2 g/cm³', '75 g/cm³', '25 g/cm³'], answer: 1, explanation: 'Density = mass/volume = 50/25 = 2 g/cm³' },
          { id: 'q4', question: 'Iron rusting is an example of a chemical property.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Rusting involves iron reacting with oxygen to form iron oxide — a chemical change.' }
        ]
      },
      {
        id: 'states_of_matter',
        name: 'States of Matter',
        description: 'Solid, liquid, gas — and the transitions between them',
        icon: '💧',
        theory: {
          sections: [
            { title: 'Three States of Matter', content: 'Matter exists in three common states: solid (fixed shape and volume), liquid (fixed volume, takes container shape), and gas (fills entire container). A fourth state — plasma — exists at very high temperatures.' },
            { title: 'Particle Theory', content: 'In solids, particles vibrate in fixed positions. In liquids, particles move freely but stay close together. In gases, particles move rapidly and are far apart.' },
            { title: 'Phase Changes', content: 'Melting: solid → liquid. Freezing: liquid → solid. Evaporation: liquid → gas. Condensation: gas → liquid. Sublimation: solid → gas directly. Deposition: gas → solid directly.' },
            { title: 'Phase Change Energy', content: 'Melting requires heat (endothermic). Freezing releases heat (exothermic). The temperature stays constant during a phase change — all energy goes into breaking intermolecular forces.', formula: 'Q = mL (latent heat)' }
          ]
        },
        experiments: [{
          id: 'phase_change_exp',
          name: 'Observing Phase Changes',
          description: 'Heat water and observe phase transitions at different temperatures',
          chemicals: ['h2o'],
          equipment: ['beaker', 'hot_plate', 'thermometer'],
          steps: ['Fill beaker with 100 mL water', 'Place thermometer in water', 'Heat on hot plate', 'Record temperature every 30 seconds', 'Observe when water starts boiling', 'Note temperature remains constant during boiling'],
          expectedObservations: 'Water temperature rises steadily until 100°C, then stays constant while boiling occurs.'
        }],
        quiz: [
          { id: 'q1', question: 'What happens to particle movement when a solid melts?', type: 'multiple-choice', options: ['Particles stop moving', 'Particles move more freely', 'Particles become smaller', 'No change occurs'], answer: 1, explanation: 'When a solid melts, energy breaks intermolecular bonds, allowing particles to move more freely as a liquid.' },
          { id: 'q2', question: 'During boiling, temperature continues to rise steadily.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! During a phase change (boiling), temperature remains constant because all heat energy breaks intermolecular bonds.' },
          { id: 'q3', question: 'Which process is endothermic?', type: 'multiple-choice', options: ['Freezing', 'Condensation', 'Melting', 'Deposition'], answer: 2, explanation: 'Melting is endothermic — it requires heat energy to break the bonds holding the solid structure together.' },
          { id: 'q4', question: 'Sublimation occurs when a solid converts directly to a gas.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Dry ice (CO₂) is a classic example of sublimation — it goes directly from solid to gas.' }
        ]
      },
      {
        id: 'lab_safety',
        name: 'Laboratory Safety',
        description: 'Essential safety rules and procedures for the chemistry lab',
        icon: '🛡️',
        theory: {
          sections: [
            { title: 'Why Safety Matters', content: 'Chemistry laboratories contain hazardous chemicals, open flames, and fragile glassware. Understanding and following safety rules prevents accidents and protects everyone in the lab.' },
            { title: 'Personal Protective Equipment (PPE)', content: 'Always wear: safety goggles (eye protection), lab coat or apron, closed-toe shoes, and gloves when handling corrosive or toxic chemicals. Never wear loose clothing near open flames.' },
            { title: 'Chemical Hazard Symbols', content: 'Hazard symbols warn about chemical dangers: Skull & Crossbones (toxic), Flame (flammable), Corrosion (corrosive), Exclamation mark (irritant), Environment (eco-toxic), Biohazard (biological risk).' },
            { title: 'Emergency Procedures', content: 'If acid spills on skin: immediately flush with plenty of water for 15+ minutes. If chemicals enter eyes: use eyewash station for 15 minutes. In case of fire: use fire extinguisher or fire blanket. Always report accidents to the teacher.' }
          ]
        },
        experiments: [{
          id: 'safety_quiz',
          name: 'Lab Safety Identification',
          description: 'Identify hazard symbols and appropriate safety responses',
          chemicals: ['hcl', 'naoh'],
          equipment: ['beaker'],
          steps: ['Examine hazard labels on containers', 'Identify each safety symbol', 'Practice proper PPE procedure', 'Review chemical disposal methods', 'Locate emergency equipment in lab'],
          expectedObservations: 'Understanding that each chemical has specific hazards that require specific precautions.'
        }],
        quiz: [
          { id: 'q1', question: 'What should you do first if acid splashes in your eyes?', type: 'multiple-choice', options: ['Rub eyes gently', 'Use eyewash station for 15 minutes', 'Apply eye drops', 'Inform teacher first'], answer: 1, explanation: 'Immediately use the eyewash station for at least 15 minutes. Time is critical when acids contact eyes!' },
          { id: 'q2', question: 'You must wear safety goggles at all times in the chemistry lab.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Goggles protect your eyes from splashes, fumes, and broken glass — always required.' },
          { id: 'q3', question: 'Which symbol indicates a flammable chemical?', type: 'multiple-choice', options: ['Skull and crossbones', 'Flame symbol', 'Exclamation mark', 'Biohazard symbol'], answer: 1, explanation: 'The flame symbol (🔥) indicates a flammable substance — keep away from heat sources and open flames.' },
          { id: 'q4', question: 'It is safe to smell chemicals by waving fumes toward your nose.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True — this technique is called "wafting" and is the safe way to detect odors. Never inhale directly from containers.' }
        ]
      },
      {
        id: 'mixtures',
        name: 'Mixtures and Separation',
        description: 'Types of mixtures and methods to separate their components',
        icon: '🌀',
        theory: {
          sections: [
            { title: 'Pure Substances vs. Mixtures', content: 'A pure substance has a fixed composition (element or compound). A mixture contains two or more substances combined without chemical reaction. Mixtures can be separated by physical means.' },
            { title: 'Homogeneous Mixtures (Solutions)', content: 'In a homogeneous mixture, components are uniformly distributed. Examples: saltwater, air, brass. The solute dissolves in the solvent. NaCl + H₂O → saltwater solution.' },
            { title: 'Heterogeneous Mixtures', content: 'In a heterogeneous mixture, components are visibly different. Examples: sand and water, oil and water, granite. Components can often be separated by simple physical methods.' },
            { title: 'Separation Methods', content: 'Filtration: separates insoluble solids from liquids. Evaporation: removes solvent to recover dissolved solid. Distillation: separates liquids by boiling point. Chromatography: separates by solubility. Decanting: pour off liquid from settled solid.' }
          ]
        },
        experiments: [{
          id: 'separation_exp',
          name: 'Separating a Salt-Sand Mixture',
          description: 'Use filtration and evaporation to separate NaCl and sand',
          chemicals: ['nacl', 'h2o'],
          equipment: ['beaker', 'hot_plate', 'watch_glass'],
          steps: ['Mix salt and sand together', 'Add water and stir to dissolve salt', 'Filter through filter paper to remove sand', 'Evaporate water from filtrate on hot plate', 'Observe white salt crystals remaining'],
          expectedObservations: 'Sand collects on filter paper. After evaporation, pure white NaCl crystals remain.'
        }],
        quiz: [
          { id: 'q1', question: 'Which method separates salt from water?', type: 'multiple-choice', options: ['Filtration', 'Distillation', 'Evaporation', 'Decanting'], answer: 2, explanation: 'Evaporation removes water as vapor, leaving salt crystals behind.' },
          { id: 'q2', question: 'Saltwater is a homogeneous mixture.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Saltwater is a solution — the salt (NaCl) is uniformly distributed throughout the water.' },
          { id: 'q3', question: 'What separation technique uses paper to separate pigments?', type: 'multiple-choice', options: ['Filtration', 'Distillation', 'Chromatography', 'Centrifugation'], answer: 2, explanation: 'Chromatography separates mixtures based on how far components travel through paper based on their solubility.' },
          { id: 'q4', question: 'Filtration can separate dissolved salt from water.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! Dissolved salt passes through filter paper. You need evaporation or distillation to separate it.' }
        ]
      }
    ]
  },

  grade9: {
    id: 'grade9',
    name: 'Grade 9 Chemistry',
    shortName: 'Grade 9',
    color: '#6366f1',
    icon: '🔬',
    description: 'Atomic theory, periodic table, chemical bonds, and reactions',
    topics: [
      {
        id: 'atom',
        name: 'Atomic Structure',
        description: 'The structure of atoms: protons, neutrons, electrons, and atomic models',
        icon: '⚛️',
        theory: {
          sections: [
            { title: 'The Atom', content: 'Atoms are the basic building blocks of matter. Each atom has a nucleus (protons + neutrons) surrounded by electrons. Protons have positive charge (+1), neutrons have no charge, electrons have negative charge (-1).' },
            { title: 'Atomic Number and Mass', content: 'Atomic number (Z) = number of protons. This uniquely identifies an element. Mass number (A) = protons + neutrons. Electrons equal protons in a neutral atom.', formula: 'A = Z + N (where N = neutron number)' },
            { title: 'Electron Configuration', content: 'Electrons occupy energy levels (shells). First shell: max 2 electrons. Second shell: max 8. Third shell: max 18. Valence electrons (outermost shell) determine chemical behavior.' },
            { title: 'Bohr Model vs. Quantum Model', content: 'Bohr model: electrons in circular orbits at fixed distances. More accurate quantum model: electrons exist in probability regions called orbitals (s, p, d, f). Both models are useful for different purposes.' }
          ]
        },
        experiments: [{
          id: 'flame_test',
          name: 'Flame Test',
          description: 'Identify metal ions by the color of flame they produce',
          chemicals: ['nacl', 'cuso4'],
          equipment: ['bunsen_burner', 'test_tube'],
          steps: ['Prepare dilute solutions of different metal salts', 'Dip wire loop in solution', 'Hold in blue flame of Bunsen burner', 'Observe and record flame color', 'Repeat with different salts'],
          expectedObservations: 'NaCl → bright yellow, CuSO₄ → blue-green, KCl → lilac/violet'
        }],
        quiz: [
          { id: 'q1', question: 'An element has atomic number 11. How many protons does it have?', type: 'multiple-choice', options: ['10', '11', '12', '22'], answer: 1, explanation: 'The atomic number IS the number of protons. Na (sodium) has atomic number 11, so it has 11 protons.' },
          { id: 'q2', question: 'Neutrons have a negative charge.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! Neutrons have NO charge (neutral). Protons are positive, electrons are negative.' },
          { id: 'q3', question: 'An atom of carbon (Z=6, A=12) has how many neutrons?', type: 'multiple-choice', options: ['6', '12', '18', '4'], answer: 0, explanation: 'Neutrons = A - Z = 12 - 6 = 6 neutrons' },
          { id: 'q4', question: 'Valence electrons determine an element\'s chemical behavior.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Valence electrons are in the outermost shell and participate in chemical bonding.' }
        ]
      },
      {
        id: 'periodic_table',
        name: 'Periodic Table',
        description: 'Organization of elements: groups, periods, and periodic trends',
        icon: '📊',
        theory: {
          sections: [
            { title: 'Organization of the Periodic Table', content: 'Elements are arranged by increasing atomic number. Periods (rows) indicate energy levels. Groups (columns) contain elements with similar chemical properties and the same number of valence electrons.' },
            { title: 'Periodic Trends', content: 'Atomic radius: increases down a group, decreases across a period. Electronegativity: increases across a period and up a group. Ionization energy: increases across a period and up a group.' },
            { title: 'Element Families', content: 'Group 1: Alkali metals (very reactive). Group 2: Alkaline earth metals. Groups 3-12: Transition metals. Group 17: Halogens (reactive nonmetals). Group 18: Noble gases (inert).' },
            { title: 'Metals vs. Nonmetals', content: 'Metals: shiny, ductile, malleable, good conductors. Located left of periodic table. Nonmetals: dull, brittle, poor conductors. Located right side. Metalloids (semimetals): on the stair-step boundary.' }
          ]
        },
        experiments: [{
          id: 'reactivity_series',
          name: 'Metal Reactivity Series',
          description: 'Compare reactivity of different metals with acid',
          chemicals: ['hcl', 'mg', 'zn', 'fe', 'cu'],
          equipment: ['test_tube', 'beaker'],
          steps: ['Add equal amounts of HCl to 4 test tubes', 'Add small piece of each metal to separate tubes', 'Observe bubble production rate', 'Record reactivity order', 'Compare with theoretical reactivity series'],
          expectedObservations: 'Mg reacts vigorously (rapid bubbles), Zn moderately, Fe slowly, Cu has no reaction. Confirms activity series: Mg > Zn > Fe > Cu'
        }],
        quiz: [
          { id: 'q1', question: 'Elements in the same group have similar properties because they have:', type: 'multiple-choice', options: ['Same mass number', 'Same number of valence electrons', 'Same atomic radius', 'Same period number'], answer: 1, explanation: 'Elements in the same group (column) have the same number of valence electrons, giving them similar chemical properties.' },
          { id: 'q2', question: 'Noble gases are highly reactive.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! Noble gases have complete outer electron shells, making them extremely stable and largely unreactive.' },
          { id: 'q3', question: 'As you move left to right across a period, atomic radius generally:', type: 'multiple-choice', options: ['Increases', 'Decreases', 'Stays the same', 'First increases then decreases'], answer: 1, explanation: 'Atomic radius decreases left to right because more protons pull electrons closer while adding electrons to the same shell.' },
          { id: 'q4', question: 'Halogens are found in Group 17 of the periodic table.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Group 17 contains fluorine, chlorine, bromine, iodine, and astatine — all halogens.' }
        ]
      },
      {
        id: 'acids_bases',
        name: 'Acids and Bases',
        description: 'Properties of acids and bases, pH scale, and neutralization',
        icon: '⚗️',
        theory: {
          sections: [
            { title: 'Arrhenius Definition', content: 'Acids release H⁺ ions in water. Bases release OH⁻ ions in water. Example: HCl → H⁺ + Cl⁻ (acid); NaOH → Na⁺ + OH⁻ (base).' },
            { title: 'Bronsted-Lowry Definition', content: 'Acid = proton (H⁺) donor. Base = proton acceptor. This is broader than Arrhenius — it includes reactions in non-aqueous solvents.' },
            { title: 'pH Scale', content: 'pH = -log[H⁺]. Scale runs from 0-14. pH < 7: acidic. pH = 7: neutral (pure water). pH > 7: basic. Each unit = 10× difference in [H⁺].', formula: 'pH = -log₁₀[H⁺]' },
            { title: 'Neutralization', content: 'Acid + Base → Salt + Water. Example: HCl + NaOH → NaCl + H₂O. This is exothermic — heat is released. The equivalence point is reached when moles of acid = moles of base.', formula: 'H⁺ + OH⁻ → H₂O' }
          ]
        },
        experiments: [{
          id: 'neutralization',
          name: 'Acid-Base Neutralization',
          description: 'Neutralize HCl with NaOH using phenolphthalein indicator',
          chemicals: ['hcl', 'naoh', 'phenolphthalein'],
          equipment: ['beaker', 'burette', 'erlenmeyer'],
          steps: ['Add 25 mL HCl to Erlenmeyer flask', 'Add 3 drops phenolphthalein indicator', 'Fill burette with NaOH solution', 'Add NaOH dropwise, swirling', 'Stop at first permanent pink color', 'Record volume NaOH used'],
          expectedObservations: 'Solution is colorless in acid. Turns persistent pink at equivalence point when NaOH neutralizes HCl.'
        }],
        quiz: [
          { id: 'q1', question: 'A solution with pH = 3 is:', type: 'multiple-choice', options: ['Basic', 'Neutral', 'Acidic', 'Alkaline'], answer: 2, explanation: 'pH < 7 indicates an acidic solution. pH = 3 means [H⁺] = 10⁻³ mol/L — quite acidic.' },
          { id: 'q2', question: 'Neutralization always produces water and a salt.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Acid + Base → Salt + Water is the general formula for neutralization reactions.' },
          { id: 'q3', question: 'Which indicator turns pink in basic solution?', type: 'multiple-choice', options: ['Litmus (red)', 'Universal indicator', 'Phenolphthalein', 'Methyl orange'], answer: 2, explanation: 'Phenolphthalein is colorless in acid but turns pink/magenta in basic solutions (pH > 8.2).' },
          { id: 'q4', question: 'Strong acids fully dissociate in water.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Strong acids like HCl and H₂SO₄ fully dissociate: HCl → H⁺ + Cl⁻ (100% dissociation).' }
        ]
      }
    ]
  },

  grade10: {
    id: 'grade10',
    name: 'Grade 10 Chemistry',
    shortName: 'Grade 10',
    color: '#10b981',
    icon: '🔭',
    description: 'Solutions, gas laws, thermochemistry, and equilibrium',
    topics: [
      {
        id: 'solutions',
        name: 'Solutions and Concentration',
        description: 'Types of solutions, concentration calculations, and colligative properties',
        icon: '💧',
        theory: {
          sections: [
            { title: 'Solutions', content: 'A solution is a homogeneous mixture of solute (dissolved substance) and solvent (dissolving medium). Water is called the "universal solvent" because it dissolves many substances.' },
            { title: 'Molarity', content: 'Molarity (M) = moles of solute / liters of solution. Used to express concentration in mol/L (molar, M).', formula: 'M = n/V (mol/L)' },
            { title: 'Colligative Properties', content: 'Properties that depend on the number of solute particles, not their identity: boiling point elevation, freezing point depression, osmotic pressure, vapor pressure lowering.' },
            { title: 'Dilution', content: 'When diluting a solution, moles of solute stay constant: C₁V₁ = C₂V₂', formula: 'C₁V₁ = C₂V₂' }
          ]
        },
        experiments: [{
          id: 'molarity_exp',
          name: 'Preparing a 1 M NaCl Solution',
          description: 'Accurately prepare a standard molar solution',
          chemicals: ['nacl', 'h2o'],
          equipment: ['balance', 'volumetric_flask', 'beaker'],
          steps: ['Calculate mass of NaCl needed: 58.44 g for 1L of 1M', 'Weigh exactly 58.44 g NaCl', 'Dissolve in ~800 mL distilled water in beaker', 'Transfer to 1L volumetric flask', 'Add distilled water to the 1L mark', 'Stopper and invert several times to mix'],
          expectedObservations: 'Clear colorless solution. Exact concentration = 1.000 M NaCl'
        }],
        quiz: [
          { id: 'q1', question: 'What is the molarity of a solution containing 4 mol NaOH in 2 L?', type: 'multiple-choice', options: ['0.5 M', '2 M', '6 M', '8 M'], answer: 1, explanation: 'M = moles/volume = 4 mol / 2 L = 2 M' },
          { id: 'q2', question: 'Adding solute to water raises its boiling point.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! This is boiling point elevation — a colligative property. Saltwater boils above 100°C.' },
          { id: 'q3', question: 'The formula for dilution is:', type: 'multiple-choice', options: ['M₁+M₂ = V₁+V₂', 'C₁V₁ = C₂V₂', 'n = CV', 'C = n/V²'], answer: 1, explanation: 'C₁V₁ = C₂V₂: initial concentration × initial volume = final concentration × final volume.' },
          { id: 'q4', question: 'Molarity is measured in mol/L.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Molarity (M) = moles of solute per liter of solution, written as mol/L or M.' }
        ]
      },
      {
        id: 'thermochemistry',
        name: 'Thermochemistry',
        description: 'Energy changes in chemical reactions: exothermic, endothermic, Hess\'s Law',
        icon: '🔥',
        theory: {
          sections: [
            { title: 'Exothermic Reactions', content: 'Exothermic reactions release energy (heat) to the surroundings. ΔH < 0. Examples: combustion, neutralization, many oxidation reactions. The products have lower energy than the reactants.' },
            { title: 'Endothermic Reactions', content: 'Endothermic reactions absorb energy from surroundings. ΔH > 0. Examples: photosynthesis, thermal decomposition, dissolving NH₄NO₃. Products have higher energy than reactants.' },
            { title: 'Enthalpy Calculations', content: 'q = mcΔT where q = heat, m = mass, c = specific heat capacity (4.18 J/g°C for water), ΔT = temperature change.', formula: 'q = mcΔT' },
            { title: "Hess's Law", content: "The total enthalpy change is independent of the pathway. If a reaction can be expressed as sum of other reactions, ΔH_total = ΣΔH_steps. This allows calculation of ΔH for reactions that can't be measured directly.", formula: 'ΔH_rxn = ΣΔH_products - ΣΔH_reactants' }
          ]
        },
        experiments: [{
          id: 'calorimetry_exp',
          name: 'Calorimetry of Neutralization',
          description: 'Measure heat released during HCl + NaOH neutralization',
          chemicals: ['hcl', 'naoh', 'h2o'],
          equipment: ['beaker', 'thermometer'],
          steps: ['Measure 50 mL of 1M HCl', 'Record initial temperature', 'Add 50 mL of 1M NaOH', 'Stir and record maximum temperature', 'Calculate ΔT', 'Calculate heat: q = mcΔT', 'Calculate molar enthalpy ΔH'],
          expectedObservations: 'Temperature rises approximately 5-7°C. Reaction is exothermic (ΔH ≈ -57 kJ/mol).'
        }],
        quiz: [
          { id: 'q1', question: 'An exothermic reaction has:', type: 'multiple-choice', options: ['ΔH > 0', 'ΔH = 0', 'ΔH < 0', 'ΔH > 1'], answer: 2, explanation: 'Exothermic reactions release heat, so ΔH is negative (energy decreases in system, goes to surroundings).' },
          { id: 'q2', question: 'Photosynthesis is an exothermic process.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! Photosynthesis is endothermic — plants absorb light energy to convert CO₂ and H₂O into glucose.' },
          { id: 'q3', question: 'Using q = mcΔT with m=100g, c=4.18, ΔT=5°C, what is q?', type: 'multiple-choice', options: ['2090 J', '209 J', '20900 J', '20.9 J'], answer: 0, explanation: 'q = 100 × 4.18 × 5 = 2090 J = 2.09 kJ' },
          { id: 'q4', question: 'Hess\'s Law states that enthalpy is a state function.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: "True! Hess's Law works because enthalpy depends only on initial and final states, not the path taken." }
        ]
      },
      {
        id: 'reaction_rates',
        name: 'Reaction Rates',
        description: 'Factors affecting how fast chemical reactions occur',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Reaction Rate', content: 'Reaction rate = change in concentration / change in time. Measured by how quickly reactants are consumed or products form.', formula: 'rate = Δ[A]/Δt' },
            { title: 'Factors Affecting Rate', content: '1. Concentration: more reactant → more collisions → faster rate. 2. Temperature: higher T → more kinetic energy → more effective collisions. 3. Surface area: more exposed surface → more reaction sites. 4. Catalyst: lowers activation energy, increases rate.' },
            { title: 'Collision Theory', content: 'For a reaction to occur, particles must collide with sufficient energy (activation energy) and correct orientation. Only a fraction of collisions are effective.' },
            { title: 'Activation Energy', content: 'The minimum energy required for a reaction to occur. Catalysts provide an alternative pathway with lower activation energy, increasing the reaction rate without being consumed.', formula: 'Ea = activation energy (kJ/mol)' }
          ]
        },
        experiments: [{
          id: 'rate_experiment',
          name: 'Effect of Concentration on Rate',
          description: 'Compare reaction rates of CaCO₃ with different HCl concentrations',
          chemicals: ['hcl', 'caco3', 'h2o'],
          equipment: ['beaker', 'thermometer'],
          steps: ['Prepare 1M, 0.5M, and 0.1M HCl solutions', 'Add equal amounts of CaCO₃ chips to each', 'Observe bubble rate (CO₂ production)', 'Time how long reaction takes', 'Compare rates'],
          expectedObservations: '1M HCl produces rapid bubbling. 0.5M is moderate. 0.1M is very slow. Rate is proportional to concentration.'
        }],
        quiz: [
          { id: 'q1', question: 'Which factor does NOT directly affect reaction rate?', type: 'multiple-choice', options: ['Temperature', 'Concentration', 'Color of solution', 'Surface area'], answer: 2, explanation: 'Color itself doesn\'t affect rate. The other three directly influence collision frequency and energy.' },
          { id: 'q2', question: 'A catalyst is consumed during a chemical reaction.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! A catalyst speeds up a reaction by lowering activation energy but is NOT consumed — it\'s regenerated.' },
          { id: 'q3', question: 'Increasing temperature increases reaction rate because:', type: 'multiple-choice', options: ['Particles become smaller', 'More particles have sufficient energy to react', 'Concentration increases', 'Surface area increases'], answer: 1, explanation: 'Higher temperature gives more particles the minimum activation energy, resulting in more effective collisions.' },
          { id: 'q4', question: 'Crushing a solid into powder increases its reaction rate.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Crushing increases surface area, exposing more particles to react with the other reactant.' }
        ]
      }
    ]
  },

  grade11: {
    id: 'grade11',
    name: 'Grade 11 Chemistry',
    shortName: 'Grade 11',
    color: '#f59e0b',
    icon: '⚡',
    description: 'Organic chemistry, electrochemistry, and chemical analysis',
    topics: [
      {
        id: 'organic_chemistry',
        name: 'Organic Chemistry',
        description: 'Carbon compounds: hydrocarbons, functional groups, and reactions',
        icon: '🌿',
        theory: {
          sections: [
            { title: 'Introduction to Organic Chemistry', content: 'Organic chemistry studies carbon-containing compounds. Carbon forms 4 bonds and can bond to itself, creating chains and rings. The vast diversity of organic compounds makes life possible.' },
            { title: 'Hydrocarbons', content: 'Alkanes (CₙH₂ₙ₊₂): only single C-C bonds, saturated. Alkenes (CₙH₂ₙ): contain C=C double bond. Alkynes (CₙH₂ₙ₋₂): contain C≡C triple bond. Aromatics: contain benzene ring.' },
            { title: 'Functional Groups', content: 'Functional groups determine reactivity: -OH (alcohol), -COOH (carboxylic acid), -CHO (aldehyde), -CO- (ketone), -NH₂ (amine), -COO- (ester), -CONH- (amide).' },
            { title: 'Organic Reactions', content: 'Combustion: complete → CO₂ + H₂O. Substitution (alkanes). Addition (alkenes + HX, H₂, Br₂). Esterification: alcohol + acid → ester + water. Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂' }
          ]
        },
        experiments: [{
          id: 'ester_synthesis',
          name: 'Ester Synthesis (Esterification)',
          description: 'React ethanol with acetic acid to produce ethyl acetate (fruity odor)',
          chemicals: ['ethanol', 'ch3cooh', 'h2so4'],
          equipment: ['beaker', 'hot_plate', 'condenser'],
          steps: ['Mix 10 mL ethanol and 10 mL acetic acid', 'Add 2-3 drops H₂SO₄ as catalyst', 'Heat gently for 5-10 minutes', 'Cool and smell carefully by wafting', 'Note fruity odor of ethyl acetate'],
          expectedObservations: 'Fruity (pear/nail polish) odor of ethyl acetate forms. CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O'
        }],
        quiz: [
          { id: 'q1', question: 'Which functional group is characteristic of alcohols?', type: 'multiple-choice', options: ['-COOH', '-OH', '-CHO', '-NH₂'], answer: 1, explanation: 'The hydroxyl group (-OH) bonded to a carbon is the functional group that defines alcohols.' },
          { id: 'q2', question: 'Alkanes are unsaturated hydrocarbons.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! Alkanes are SATURATED — they contain only single C-C bonds. Alkenes and alkynes are unsaturated.' },
          { id: 'q3', question: 'What type of reaction produces an ester?', type: 'multiple-choice', options: ['Combustion', 'Addition', 'Esterification', 'Substitution'], answer: 2, explanation: 'Esterification: alcohol + carboxylic acid → ester + water (with acid catalyst, reversible reaction).' },
          { id: 'q4', question: 'The general formula for alkenes is CₙH₂ₙ.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Alkenes have one C=C double bond, so each double bond reduces 2 H atoms from alkane formula CₙH₂ₙ₊₂.' }
        ]
      },
      {
        id: 'electrochemistry',
        name: 'Electrochemistry',
        description: 'Galvanic cells, electrolysis, electrode potentials, and Faraday\'s Laws',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Galvanic (Voltaic) Cells', content: 'Galvanic cells convert chemical energy to electrical energy through spontaneous redox reactions. The cell has two half-cells connected by a salt bridge. Electrons flow from anode (oxidation) to cathode (reduction).' },
            { title: 'Standard Electrode Potentials', content: 'E° values measure tendency to be reduced. More positive E° = better oxidizing agent. Cell EMF: E°cell = E°cathode - E°anode. Example: Cu/Zn cell E° = 0.34 - (-0.76) = 1.10 V', formula: 'E°cell = E°cathode - E°anode' },
            { title: 'Electrolysis', content: 'Electrolysis uses electrical energy to drive non-spontaneous redox reactions. External power source forces electrons to flow in opposite direction. Used in metal plating, water splitting (H₂O → H₂ + O₂).' },
            { title: "Faraday's Laws", content: 'First Law: mass deposited ∝ quantity of charge. Second Law: mass ∝ molar mass / charge number. Q = It (charge = current × time)', formula: "m = (Q × M) / (n × F) where F = 96485 C/mol" }
          ]
        },
        experiments: [{
          id: 'galvanic_cell_exp',
          name: 'Zinc-Copper Galvanic Cell',
          description: 'Build a Zn-Cu galvanic cell and measure its voltage',
          chemicals: ['cuso4', 'h2so4', 'zn', 'cu'],
          equipment: ['galvanic_cell', 'conductivity_meter', 'beaker'],
          steps: ['Set up two beakers: one with CuSO₄, one with ZnSO₄', 'Place Cu electrode in CuSO₄, Zn in ZnSO₄', 'Connect with salt bridge (saturated KNO₃)', 'Connect voltmeter between electrodes', 'Measure voltage (expect ~1.1 V)', 'Observe copper depositing on Cu electrode'],
          expectedObservations: 'Voltage reading ~1.1 V. Zn anode slowly dissolves (oxidation). Cu cathode gains mass (reduction: Cu²⁺ → Cu).'
        }],
        quiz: [
          { id: 'q1', question: 'In a galvanic cell, oxidation occurs at the:', type: 'multiple-choice', options: ['Cathode', 'Anode', 'Salt bridge', 'Electrolyte'], answer: 1, explanation: 'AN OX: ANode = OXidation. The anode loses electrons — it is where oxidation occurs.' },
          { id: 'q2', question: 'Electrolysis converts chemical energy to electrical energy.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! It\'s the reverse — electrolysis uses ELECTRICAL energy to drive chemical reactions (non-spontaneous).' },
          { id: 'q3', question: 'If E°cathode = +0.34V and E°anode = -0.76V, what is E°cell?', type: 'multiple-choice', options: ['0.42 V', '1.10 V', '-0.42 V', '0.76 V'], answer: 1, explanation: 'E°cell = E°cathode - E°anode = 0.34 - (-0.76) = 0.34 + 0.76 = 1.10 V' },
          { id: 'q4', question: 'A positive E°cell indicates a spontaneous reaction.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Positive cell potential (E°cell > 0) means the reaction is spontaneous (ΔG < 0).' }
        ]
      }
    ]
  },

  grade12: {
    id: 'grade12',
    name: 'Grade 12 Chemistry',
    shortName: 'Grade 12',
    color: '#ef4444',
    icon: '🎓',
    description: 'Advanced topics: titration, electrolysis, redox, and analytical chemistry',
    topics: [
      {
        id: 'titration',
        name: 'Titration',
        description: 'Quantitative acid-base analysis using titration techniques',
        icon: '💧',
        theory: {
          sections: [
            { title: 'What is Titration?', content: 'Titration is a quantitative analytical technique to determine the unknown concentration of a solution. A solution of known concentration (titrant) is carefully added to an unknown solution until the reaction is complete (equivalence point).' },
            { title: 'Types of Titration', content: 'Acid-base titration: most common, uses indicators. Redox titration: uses KMnO₄ or I₂ (no indicator needed). Complexometric: uses EDTA. Precipitation: forms insoluble product. Back titration: add excess and then titrate the excess.' },
            { title: 'Equivalence Point vs. Endpoint', content: 'Equivalence point: moles of acid = moles of base (theoretical). Endpoint: when indicator changes color (practical). These should be as close as possible. Choice of indicator depends on pH at equivalence point.' },
            { title: 'Titration Calculations', content: 'At equivalence point: n(acid) = n(base). Therefore: C_acid × V_acid = C_base × V_base', formula: 'C₁V₁ = C₂V₂ (for 1:1 reactions)' }
          ]
        },
        experiments: [{
          id: 'titration_exp',
          name: 'Acid-Base Titration',
          description: 'Determine concentration of unknown NaOH using standard HCl and phenolphthalein',
          chemicals: ['hcl', 'naoh', 'phenolphthalein'],
          equipment: ['burette', 'erlenmeyer', 'pipette', 'beaker'],
          steps: [
            'Rinse burette with standard HCl solution',
            'Fill burette with standard 0.1 M HCl, record initial volume',
            'Pipette exactly 25.0 mL unknown NaOH into Erlenmeyer flask',
            'Add 3 drops phenolphthalein indicator (solution turns pink)',
            'Add HCl from burette dropwise, swirling after each addition',
            'Near endpoint, add HCl one drop at a time',
            'Stop when pink color disappears permanently',
            'Record final burette reading',
            'Calculate: C(HCl) × V(HCl) = C(NaOH) × V(NaOH)'
          ],
          expectedObservations: 'Pink phenolphthalein turns colorless at endpoint. Calculate unknown NaOH concentration from HCl volume used.'
        }],
        quiz: [
          { id: 'q1', question: 'Phenolphthalein is colorless in acidic and pink in basic solution.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Phenolphthalein is colorless at pH < 8.2 and pink/magenta at pH > 8.2.' },
          { id: 'q2', question: 'If 20 mL of 0.5M HCl neutralizes NaOH, how many moles of NaOH were present?', type: 'multiple-choice', options: ['0.01 mol', '0.02 mol', '0.04 mol', '0.1 mol'], answer: 0, explanation: 'n(HCl) = C×V = 0.5 × 0.020 = 0.01 mol. Since HCl:NaOH = 1:1, n(NaOH) = 0.01 mol.' },
          { id: 'q3', question: 'The equivalence point is where indicator changes color.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! The endpoint is where the indicator changes color. The equivalence point is the theoretical point where moles are equal.' },
          { id: 'q4', question: 'In a back titration, you:', type: 'multiple-choice', options: ['Titrate backwards direction', 'Add excess reagent then titrate the excess', 'Use two indicators', 'Titrate at low temperature'], answer: 1, explanation: 'Back titration adds a known excess of reagent, then titrates the unreacted excess to find how much reacted with the unknown.' }
        ]
      },
      {
        id: 'redox',
        name: 'Redox Reactions',
        description: 'Oxidation-reduction reactions, balancing redox equations, and applications',
        icon: '⚖️',
        theory: {
          sections: [
            { title: 'Oxidation and Reduction', content: 'Oxidation = loss of electrons (OIL). Reduction = gain of electrons (RIG). Mnemonic: OIL RIG. They always occur together (hence "redox"). The reducing agent is oxidized; the oxidizing agent is reduced.' },
            { title: 'Oxidation States', content: 'Rules for assigning oxidation states: Pure element = 0. Monoatomic ion = charge. O = -2 (except peroxides). H = +1 (except metal hydrides). Sum of OS = molecule charge.' },
            { title: 'Balancing Redox Equations', content: 'Half-reaction method: 1) Write separate oxidation and reduction half-reactions. 2) Balance atoms. 3) Balance electrons. 4) Combine half-reactions. 5) Check atoms and charges.' },
            { title: 'Disproportionation', content: 'Special redox where one species is simultaneously oxidized and reduced. Example: Cl₂ + 2NaOH → NaCl + NaOCl + H₂O. Cl₂ (0) → Cl⁻ (-1, reduced) and OCl⁻ (+1, oxidized).' }
          ]
        },
        experiments: [{
          id: 'kmno4_titration',
          name: 'Permanganate Redox Titration',
          description: 'Determine Fe²⁺ concentration using KMnO₄ (self-indicating)',
          chemicals: ['kmno4', 'h2so4', 'fe'],
          equipment: ['burette', 'erlenmeyer', 'beaker'],
          steps: ['Dissolve iron wire in dilute H₂SO₄ to get Fe²⁺ solution', 'Add excess H₂SO₄ to ensure acidic conditions', 'Fill burette with KMnO₄ solution', 'Add KMnO₄ from burette', 'Purple KMnO₄ is decolorized by Fe²⁺', 'At endpoint, one drop gives permanent pink', 'Calculate Fe²⁺ concentration'],
          expectedObservations: 'Purple KMnO₄ is instantly decolorized. At endpoint, permanent light pink. MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O'
        }],
        quiz: [
          { id: 'q1', question: 'OIL RIG stands for:', type: 'multiple-choice', options: ['Oxygen Is Lost, Reduction Is Gained', 'Oxidation Is Loss, Reduction Is Gain', 'Oxide In Liquid, Reduction In Gas', 'Oxidant Is Low, Reductant Is Great'], answer: 1, explanation: 'OIL RIG: Oxidation Is Loss (of electrons), Reduction Is Gain (of electrons). The essential redox mnemonic.' },
          { id: 'q2', question: 'In MnO₄⁻, the oxidation state of Mn is +7.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! Each O = -2, total from 4 O = -8. Ion charge = -1. So Mn + (-8) = -1, Mn = +7.' },
          { id: 'q3', question: 'When a substance is oxidized, it:', type: 'multiple-choice', options: ['Gains electrons', 'Loses protons', 'Loses electrons', 'Gains protons'], answer: 2, explanation: 'Oxidation = loss of electrons. The substance loses electrons to the oxidizing agent.' },
          { id: 'q4', question: 'The reducing agent is the substance that gets reduced.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! The REDUCING agent is OXIDIZED (it loses electrons and causes the other substance to be reduced).' }
        ]
      },
      {
        id: 'electrolysis',
        name: 'Electrolysis',
        description: 'Using electricity to drive chemical reactions: applications and Faraday\'s laws',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Electrolysis Basics', content: 'Electrolysis uses electrical energy to drive non-spontaneous redox reactions. An external power source forces electrons to flow: cations migrate to cathode (reduction), anions to anode (oxidation).' },
            { title: 'Products of Electrolysis', content: 'Molten NaCl: cathode → Na metal, anode → Cl₂ gas. Water electrolysis: cathode → H₂, anode → O₂. Aqueous CuSO₄ with Cu electrodes: cathode → Cu deposited, anode → Cu dissolves.' },
            { title: "Faraday's First Law", content: 'The mass of substance deposited or dissolved at an electrode is proportional to the quantity of charge passed: m ∝ Q = It', formula: 'm = (Q × M)/(n × F) where F = 96485 C/mol' },
            { title: 'Electroplating', content: 'Electroplating uses electrolysis to deposit a thin layer of metal on an object. Object = cathode, metal source = anode, electrolyte = metal salt solution. Applications: chrome plating, silver plating, gold plating.' }
          ]
        },
        experiments: [{
          id: 'water_electrolysis',
          name: 'Electrolysis of Water',
          description: 'Split water into hydrogen and oxygen gas using electrolysis',
          chemicals: ['h2o', 'na2co3'],
          equipment: ['electrolysis', 'beaker', 'conductivity_meter'],
          steps: ['Dissolve Na₂CO₃ in water (improves conductivity)', 'Set up electrolysis apparatus with carbon electrodes', 'Connect to DC power supply (6-12V)', 'Observe bubble formation at both electrodes', 'Cathode: 2H₂O + 2e⁻ → H₂ + 2OH⁻', 'Anode: 2H₂O → O₂ + 4H⁺ + 4e⁻', 'Ratio of H₂:O₂ = 2:1 by volume'],
          expectedObservations: 'Twice as much gas at cathode (H₂) vs anode (O₂). Overall: 2H₂O → 2H₂ + O₂'
        }],
        quiz: [
          { id: 'q1', question: 'In electrolysis, what happens at the cathode?', type: 'multiple-choice', options: ['Oxidation', 'Reduction', 'Nothing', 'Neutralization'], answer: 1, explanation: 'At the cathode: cations gain electrons → REDUCTION occurs. (CAThode = CATion reduction)' },
          { id: 'q2', question: 'Electroplating uses the object to be plated as the anode.', type: 'true-false', options: ['True', 'False'], answer: 1, explanation: 'False! The object to be plated is the CATHODE. The anode is the source metal (e.g., pure copper for copper plating).' },
          { id: 'q3', question: 'In water electrolysis, what is produced at the cathode?', type: 'multiple-choice', options: ['Oxygen gas', 'Chlorine gas', 'Hydrogen gas', 'Water'], answer: 2, explanation: 'At cathode: 2H₂O + 2e⁻ → H₂↑ + 2OH⁻. Hydrogen gas is produced at the cathode.' },
          { id: 'q4', question: "Faraday's constant is approximately 96485 C/mol.\"", type: 'true-false', options: ['True', 'False'], answer: 0, explanation: "True! Faraday's constant F = 96485 C/mol represents the charge of one mole of electrons." }
        ]
      },
      {
        id: 'galvanic_cells',
        name: 'Galvanic Cells',
        description: 'Electrochemical cells that generate electricity from spontaneous redox reactions',
        icon: '🔋',
        theory: {
          sections: [
            { title: 'Cell Construction', content: 'A galvanic cell has: anode (negative, oxidation), cathode (positive, reduction), salt bridge (maintains electrical neutrality), external circuit (electron flow from anode to cathode).' },
            { title: 'Standard Cell Notation', content: 'Cell notation: Anode | anode solution || cathode solution | cathode. Example: Zn | Zn²⁺ || Cu²⁺ | Cu (Daniel cell). || represents the salt bridge.' },
            { title: 'Nernst Equation', content: 'Cell potential varies with concentration. At non-standard conditions:', formula: 'E = E° - (RT/nF)ln(Q) ≈ E° - (0.0592/n)log(Q) at 25°C' },
            { title: 'Commercial Cells', content: 'Dry cell (Leclanché): Zn anode, MnO₂/C cathode. Alkaline cell: longer life, higher current. Lead-acid battery (car): Pb/PbO₂, rechargeable. Li-ion: high energy density, used in phones/laptops. Fuel cells: H₂ + O₂ → H₂O + electricity.' }
          ]
        },
        experiments: [{
          id: 'fruit_battery',
          name: 'Lemon Battery',
          description: 'Create a galvanic cell using citric acid in a lemon with Zn and Cu electrodes',
          chemicals: ['ch3cooh'],
          equipment: ['galvanic_cell', 'conductivity_meter'],
          steps: ['Insert zinc (Zn) strip into lemon', 'Insert copper (Cu) strip into same lemon', 'Keep electrodes separate (do not touch inside)', 'Connect voltmeter to electrodes', 'Measure voltage', 'Series-connect multiple lemons for higher voltage'],
          expectedObservations: 'Voltage ~0.5-1.0 V per lemon. Zn is anode (oxidized), Cu is cathode (reduced). Lemon juice (citric acid) = electrolyte.'
        }],
        quiz: [
          { id: 'q1', question: 'In cell notation Zn|Zn²⁺||Cu²⁺|Cu, which is the anode?', type: 'multiple-choice', options: ['Cu', 'Cu²⁺', 'Zn', 'Zn²⁺'], answer: 2, explanation: 'The anode is written first (left side): Zn. Zinc is oxidized: Zn → Zn²⁺ + 2e⁻' },
          { id: 'q2', question: 'The standard hydrogen electrode (SHE) has E° = 0.00 V by definition.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! The SHE (2H⁺ + 2e⁻ → H₂) is the reference point E° = 0.000 V for all electrode potentials.' },
          { id: 'q3', question: 'Which commercial battery is rechargeable?', type: 'multiple-choice', options: ['Leclanché dry cell', 'Alkaline battery', 'Lead-acid battery', 'Zinc-carbon battery'], answer: 2, explanation: 'Lead-acid batteries (car batteries) are rechargeable. Dry cells and alkaline batteries are primary (non-rechargeable) cells.' },
          { id: 'q4', question: 'The Nernst equation adjusts cell potential for non-standard concentrations.', type: 'true-false', options: ['True', 'False'], answer: 0, explanation: 'True! E = E° - (0.0592/n)log Q allows calculation of EMF at any concentration, not just standard 1 M.' }
        ]
      }
    ]
  }
};

export function getGradeTopics(gradeId: string): Topic[] {
  return CURRICULUM[gradeId]?.topics || [];
}

export function getTopic(gradeId: string, topicId: string): Topic | undefined {
  return CURRICULUM[gradeId]?.topics.find(t => t.id === topicId);
}

export const GRADE_ORDER = ['hazirlık', 'grade9', 'grade10', 'grade11', 'grade12'];
