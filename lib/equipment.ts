export type EquipmentCategory =
  | 'glassware'
  | 'measurement'
  | 'heating'
  | 'electrical'
  | 'safety'
  | 'separation'
  | 'general';

export interface Equipment {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  category: EquipmentCategory;
  maxVolume?: string;
  material?: string;
  usageNotes?: string;
  uses: string[];
}

export const EQUIPMENT: Equipment[] = [
  // ─── Glassware ──────────────────────────────────────────────────────────────
  {
    id: 'beaker',
    name: 'Beaker',
    description:
      'A cylindrical glass container with a flat bottom and a small beak for pouring. Used to hold, mix, and heat liquids. Not suitable for accurate volume measurements.',
    icon: '🧪',
    category: 'glassware',
    maxVolume: '50 mL – 4000 mL',
    material: 'Borosilicate glass',
    usageNotes:
      'Use a stirring rod to mix contents. Place on wire gauze when heating over Bunsen burner. Do not heat empty.',
    uses: ['Mixing solutions', 'Heating liquids', 'General reactions', 'Holding reagents'],
  },
  {
    id: 'erlenmeyer',
    name: 'Erlenmeyer Flask',
    description:
      'A conical flask with a flat bottom, conical body, and narrow cylindrical neck. Excellent for swirling solutions (e.g., titrations) without spilling.',
    icon: '⚗️',
    category: 'glassware',
    maxVolume: '50 mL – 2000 mL',
    material: 'Borosilicate glass',
    usageNotes:
      'Ideal for titrations – allows swirling without splashing. Can be clamped and heated gently.',
    uses: ['Titration', 'Swirling reactions', 'Storing solutions', 'Reflux setups'],
  },
  {
    id: 'test_tube',
    name: 'Test Tube',
    description:
      'A small glass tube closed at one end, used to hold, mix, heat, or perform small-scale chemical reactions.',
    icon: '🧫',
    category: 'glassware',
    maxVolume: '10–25 mL',
    material: 'Borosilicate glass or soda-lime glass',
    usageNotes:
      'Hold in a test-tube holder when heating. Point away from yourself and others when heating.',
    uses: ['Small-scale reactions', 'Heating small samples', 'Observation', 'Qualitative tests'],
  },
  {
    id: 'volumetric_flask',
    name: 'Volumetric Flask',
    description:
      'A flat-bottomed flask with a long neck calibrated at a single exact volume mark. Used to prepare solutions of precisely known concentration.',
    icon: '🫙',
    category: 'glassware',
    maxVolume: '25 mL – 2000 mL',
    material: 'Borosilicate glass',
    usageNotes:
      'Read the meniscus at eye level. Fill to just below the mark, then use a dropper to add solvent to the calibration mark. Do not heat.',
    uses: ['Preparing standard solutions', 'Precise dilutions', 'Quantitative analysis'],
  },
  {
    id: 'burette',
    name: 'Burette',
    description:
      'A long graduated glass tube with a stopcock at the bottom, used to deliver precisely measured volumes of solution during titrations.',
    icon: '📏',
    category: 'glassware',
    maxVolume: '25 mL or 50 mL (0.1 mL graduation)',
    material: 'Borosilicate glass',
    usageNotes:
      'Rinse with the solution before filling. Read the bottom of the meniscus at eye level. Remove air bubbles before starting.',
    uses: ['Titration', 'Precise volume delivery', 'Endpoint detection'],
  },
  {
    id: 'graduated_cylinder',
    name: 'Graduated Cylinder',
    description:
      'A cylindrical vessel with graduated markings used to measure volumes of liquids with moderate precision.',
    icon: '📐',
    category: 'glassware',
    maxVolume: '10 mL – 2000 mL',
    material: 'Glass or polypropylene',
    usageNotes: 'Always read at the bottom of the meniscus, at eye level.',
    uses: ['Volume measurement', 'Preparation of approximate solutions', 'Density determination'],
  },
  {
    id: 'watch_glass',
    name: 'Watch Glass',
    description:
      'A concave/flat circular glass dish used to hold solids during weighing, to cover beakers, or as a small evaporating surface.',
    icon: '🔵',
    category: 'glassware',
    material: 'Borosilicate glass',
    usageNotes: 'Place over a beaker to reduce evaporation. Use to weigh solid chemicals.',
    uses: ['Evaporation', 'Covering beakers', 'Weighing small amounts', 'Holding solids'],
  },
  {
    id: 'separatory_funnel',
    name: 'Separatory Funnel',
    description:
      'A pear-shaped funnel with a stopcock at the bottom, used to separate two immiscible liquids based on density differences.',
    icon: '⚗️',
    category: 'separation',
    maxVolume: '50 mL – 2000 mL',
    material: 'Borosilicate glass',
    usageNotes:
      'Vent frequently when using with volatile solvents. Allow layers to separate completely before draining.',
    uses: ['Liquid-liquid extraction', 'Separating immiscible layers', 'Organic synthesis workup'],
  },
  {
    id: 'crucible',
    name: 'Crucible',
    description:
      'A small, heat-resistant container (ceramic or porcelain) used to heat substances to very high temperatures, e.g., for ignition, ash testing, or high-temperature reactions.',
    icon: '🏺',
    category: 'heating',
    material: 'Porcelain, alumina, or silica',
    usageNotes:
      'Always preheat before use to remove moisture. Use crucible tongs. Allow to cool in a desiccator before weighing.',
    uses: ['High-temperature reactions', 'Combustion analysis', 'Calcination', 'Gravimetric analysis'],
  },

  // ─── Measurement ────────────────────────────────────────────────────────────
  {
    id: 'pipette',
    name: 'Volumetric Pipette',
    description:
      'A glass tube calibrated to deliver an exact volume of liquid. Used when highly accurate volume transfer is required (e.g., 25.00 mL).',
    icon: '💧',
    category: 'measurement',
    material: 'Borosilicate glass',
    usageNotes:
      'Use a pipette bulb or filler – never pipette by mouth. Do not blow out the last drop.',
    uses: ['Accurate liquid transfer', 'Titration preparation', 'Sampling', 'Standard solution preparation'],
  },
  {
    id: 'balance',
    name: 'Analytical Balance',
    description:
      'A precision balance capable of measuring mass to ±0.0001 g (4 decimal places). Enclosed in a draft shield to prevent air currents affecting readings.',
    icon: '⚖️',
    category: 'measurement',
    usageNotes:
      'Always close the draft shield before reading. Zero (tare) the balance with the container. Never weigh directly on the pan.',
    uses: ['Mass measurement', 'Weighing reagents', 'Stoichiometry calculations', 'Gravimetric analysis'],
  },
  {
    id: 'thermometer',
    name: 'Thermometer',
    description:
      'A temperature-measuring instrument. Laboratory thermometers range from -10°C to 300°C. Used to monitor reaction temperatures and boiling points.',
    icon: '🌡️',
    category: 'measurement',
    usageNotes:
      'Do not stir with a thermometer. Allow time for thermal equilibration before reading.',
    uses: ['Temperature measurement', 'Monitoring exothermic reactions', 'Boiling point determination', 'Heating curves'],
  },
  {
    id: 'ph_meter',
    name: 'pH Meter',
    description:
      'An electronic instrument used to measure the pH of a solution with high precision (±0.01 pH). Consists of a reference electrode, glass pH electrode, and display unit.',
    icon: '📊',
    category: 'measurement',
    usageNotes:
      'Always calibrate with standard buffer solutions (pH 4, 7, 10) before use. Rinse electrode with distilled water between measurements. Store in KCl solution.',
    uses: ['pH measurement', 'Titration endpoint monitoring', 'Buffer preparation', 'Water quality testing'],
  },
  {
    id: 'conductivity_meter',
    name: 'Conductivity Meter',
    description:
      'Measures the electrical conductivity of a solution, indicating the concentration of dissolved ions. Used in water quality testing and electrolyte studies.',
    icon: '⚡',
    category: 'measurement',
    usageNotes:
      'Calibrate with a standard KCl solution. Rinse probe with distilled water between measurements.',
    uses: ['Ion concentration measurement', 'Purity testing', 'Electrolyte characterization', 'Titration monitoring'],
  },

  // ─── Heating ────────────────────────────────────────────────────────────────
  {
    id: 'hot_plate',
    name: 'Hot Plate',
    description:
      'An electric heating device with a flat ceramic or metal top surface for heating containers. Many include a magnetic stirrer function.',
    icon: '🔥',
    category: 'heating',
    usageNotes:
      'Never place flammable materials near a hot plate. Use heat-resistant gloves. Hot plate surfaces can retain heat long after switch-off.',
    uses: ['Heating solutions', 'Evaporation', 'Dissolution', 'Distillation setup'],
  },
  {
    id: 'bunsen_burner',
    name: 'Bunsen Burner',
    description:
      'A gas burner producing a hot, controllable flame for heating in the laboratory. Temperature varies from ~300°C (yellow flame) to ~1500°C (blue cone flame).',
    icon: '🕯️',
    category: 'heating',
    usageNotes:
      'Use the blue cone flame for maximum heat. Never leave unattended when lit. Keep away from flammable solvents. Tie back hair and loose clothing.',
    uses: ['Heating', 'Flame tests', 'Sterilization', 'Combustion', 'Bending glass tubing'],
  },
  {
    id: 'magnetic_stirrer',
    name: 'Magnetic Stirrer',
    description:
      'A device using a rotating magnetic field to spin a small magnetic stir bar (flea) placed inside a liquid container, providing continuous stirring.',
    icon: '🌀',
    category: 'heating',
    usageNotes:
      'Place the stir bar in the container before adding liquid. Start at low speed and gradually increase.',
    uses: ['Continuous mixing', 'Dissolution', 'Reaction monitoring', 'Titration stirring'],
  },
  {
    id: 'condenser',
    name: 'Reflux Condenser',
    description:
      'A glass condenser mounted vertically above a round-bottom flask to condense vapors and return liquid to the flask, allowing reactions to proceed at boiling point without losing solvent.',
    icon: '🌡️',
    category: 'heating',
    material: 'Borosilicate glass',
    usageNotes:
      'Connect cooling water in at the bottom and out at the top. Ensure water flow before heating. Add boiling chips.',
    uses: ['Reflux reactions', 'Distillation', 'Vapor condensation', 'Organic synthesis'],
  },

  // ─── Electrical ─────────────────────────────────────────────────────────────
  {
    id: 'electrolysis',
    name: 'Electrolysis Apparatus',
    description:
      'Equipment for performing electrolysis: includes electrodes (carbon/platinum/copper), an electrolyte container, and connections to a power supply.',
    icon: '🔋',
    category: 'electrical',
    usageNotes:
      'Always connect power supply AFTER electrodes are in solution. Never touch electrodes while connected. Ensure adequate ventilation if gases are produced.',
    uses: ['Electrolysis', 'Metal deposition', 'Gas production', 'Chlor-alkali demonstrations'],
  },
  {
    id: 'galvanic_cell',
    name: 'Galvanic Cell Kit',
    description:
      'A kit for constructing electrochemical cells (batteries) to measure standard electrode potentials. Includes metal electrodes, salt bridge, beakers, and connecting wires.',
    icon: '⚡',
    category: 'electrical',
    usageNotes:
      'Connect voltmeter in parallel. Ensure good electrical contact. Salt bridge must be fresh. Record cell potential to ±0.01 V.',
    uses: ['Voltage measurement', 'Electrochemistry experiments', 'Oxidation-reduction reactions', 'Standard potential determination'],
  },

  // ─── Safety ─────────────────────────────────────────────────────────────────
  {
    id: 'safety_goggles',
    name: 'Safety Goggles',
    description:
      'Protective eyewear with sealed sides to prevent chemical splashes, flying debris, and fumes from reaching the eyes. Different from safety glasses – goggles have side shields.',
    icon: '🥽',
    category: 'safety',
    usageNotes:
      'Must be worn at ALL times in the laboratory. Clean with mild soap and water. Replace if cracked or scratched.',
    uses: ['Eye protection', 'Splash prevention', 'Fume protection'],
  },
  {
    id: 'lab_coat',
    name: 'Laboratory Coat',
    description:
      'A protective full-length garment worn to protect skin and clothing from chemical splashes, spills, and contamination.',
    icon: '🥼',
    category: 'safety',
    usageNotes:
      'Must be 100% cotton or chemically resistant material. Keep buttoned at all times. Replace immediately if contaminated.',
    uses: ['Skin protection', 'Contamination prevention', 'Clothing protection'],
  },
  {
    id: 'fume_hood',
    name: 'Fume Hood',
    description:
      'A ventilated enclosure for handling toxic, corrosive, or volatile chemicals. Draws vapors and fumes away from the worker and exhausts them through a filtration system.',
    icon: '🏠',
    category: 'safety',
    usageNotes:
      'Keep sash at the marked safe height. Work at least 6 inches inside the hood. Never block the baffles. Check airflow indicator before use.',
    uses: ['Handling volatile chemicals', 'Working with toxic fumes', 'Corrosive acid handling', 'Gas evolution reactions'],
  },

  // ─── General / Support ──────────────────────────────────────────────────────
  {
    id: 'ring_stand',
    name: 'Ring Stand and Clamps',
    description:
      'A metal support stand with adjustable rings and clamps used to hold and support laboratory glassware (e.g., burettes, condensers, flasks) at a desired height during experiments.',
    icon: '🗼',
    category: 'general',
    material: 'Steel',
    usageNotes:
      'Ensure the stand is stable before attaching heavy equipment. Tighten all clamps securely.',
    uses: ['Supporting burettes', 'Holding condensers', 'Organizing lab setup', 'Holding separatory funnels'],
  },
  {
    id: 'filter_funnel',
    name: 'Filter Funnel',
    description:
      'A conical glass or plastic funnel used with filter paper to separate insoluble solids from liquids by filtration.',
    icon: '🔻',
    category: 'separation',
    material: 'Borosilicate glass or polypropylene',
    usageNotes:
      'Fold filter paper into a cone. Wet the filter paper with solvent before filtering. Ensure the funnel is supported securely.',
    uses: ['Gravity filtration', 'Separating precipitates', 'Purification of solids', 'Removing suspended particles'],
  },
];

export function getEquipmentByCategory(category: EquipmentCategory): Equipment[] {
  return EQUIPMENT.filter((e) => e.category === category);
}

export function getEquipmentById(id: string): Equipment | undefined {
  return EQUIPMENT.find((e) => e.id === id);
}

export function searchEquipment(query: string): Equipment[] {
  const q = query.toLowerCase();
  return EQUIPMENT.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
  );
}
