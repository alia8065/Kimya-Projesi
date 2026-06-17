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
    name: 'Acide chlorhydrique',
    formula: 'HCl',
    molecularWeight: 36.46,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Très corrosif pour la peau et les yeux',
      'Toxique par inhalation',
      'Réagit violemment avec les bases',
      'Libère du gaz hydrogène au contact des métaux',
    ],
    uses: [
      'Ajustement du pH dans l\'industrie',
      'Nettoyage et gravure des métaux',
      'Production de PVC',
      'Traitement des aliments (forme diluée)',
      'Simulation de l\'acide gastrique en laboratoire',
    ],
    properties: {
      meltingPoint: -27.32,
      boilingPoint: 110,
      density: 1.18,
      pH: 0,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'L\'acide chlorhydrique est un acide minéral fort formé en dissolvant du chlorure d\'hydrogène gazeux dans l\'eau. C\'est l\'un des acides les plus couramment utilisés dans les laboratoires de chimie et les procédés industriels.',
    category: 'acid',
  },
  {
    id: 'h2so4',
    name: 'Acide sulfurique',
    formula: 'H₂SO₄',
    molecularWeight: 98.08,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Extrêmement corrosif – provoque de graves brûlures chimiques',
      'Très exothermique lors de la dilution avec de l\'eau',
      'Agent déshydratant – réagit avec la matière organique',
      'Fumées toxiques à températures élevées',
    ],
    uses: [
      'Batteries plomb-acide',
      'Production d\'engrais (acide phosphorique)',
      'Raffinage du pétrole',
      'Traitement et décapage des métaux',
      'Production de colorants et d\'explosifs',
    ],
    properties: {
      meltingPoint: 10.31,
      boilingPoint: 337,
      density: 1.84,
      pH: -3,
      solubility: 'Miscible avec l\'eau (très exothermique)',
    },
    description:
      'L\'acide sulfurique est un acide minéral fort très corrosif de formule chimique H₂SO₄. C\'est le produit chimique le plus fabriqué au monde et il est utilisé dans une vaste gamme d\'applications industrielles et de laboratoire.',
    category: 'acid',
  },
  {
    id: 'naoh',
    name: 'Hydroxyde de sodium',
    formula: 'NaOH',
    molecularWeight: 40.00,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'high',
    hazards: [
      'Très corrosif pour la peau et les yeux',
      'Provoque de graves brûlures chimiques au contact',
      'Réagit violemment avec les acides',
      'Absorbe le CO₂ et l\'humidité de l\'air',
    ],
    uses: [
      'Fabrication de savons et détergents',
      'Production de papier',
      'Déboucheurs de canalisations',
      'Préparation alimentaire (p. ex., bretzels, nouilles)',
      'Régulation du pH dans le traitement des eaux',
    ],
    properties: {
      meltingPoint: 318,
      boilingPoint: 1388,
      density: 2.13,
      pH: 14,
      solubility: '111 g/100 mL d\'eau (20°C)',
    },
    description:
      'L\'hydroxyde de sodium, également connu sous le nom de soude caustique ou lessive de soude, est une base inorganique forte. C\'est un composé ionique solide blanc constitué de cations sodium et d\'anions hydroxyde.',
    category: 'base',
  },
  {
    id: 'koh',
    name: 'Hydroxyde de potassium',
    formula: 'KOH',
    molecularWeight: 56.11,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'high',
    hazards: [
      'Fortement corrosif',
      'Provoque de graves brûlures de la peau et des yeux',
      'Réagit de façon exothermique avec les acides',
      'Hygroscopique – absorbe l\'humidité atmosphérique',
    ],
    uses: [
      'Fabrication de savons mous et de détergents',
      'Batteries alcalines',
      'Électrolyte dans les piles à combustible',
      'Additif alimentaire (E525)',
      'Production de carbonate de potassium',
    ],
    properties: {
      meltingPoint: 360,
      boilingPoint: 1327,
      density: 2.04,
      pH: 14,
      solubility: '121 g/100 mL d\'eau (25°C)',
    },
    description:
      'L\'hydroxyde de potassium est un composé inorganique de formule KOH. C\'est une base forte, similaire à l\'hydroxyde de sodium, utilisée dans une large gamme d\'applications industrielles et de laboratoire.',
    category: 'base',
  },
  {
    id: 'agno3',
    name: 'Nitrate d\'argent',
    formula: 'AgNO₃',
    molecularWeight: 169.87,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'medium',
    hazards: [
      'Agent oxydant – risque d\'incendie avec les matières combustibles',
      'Laisse des taches noires sur la peau et les vêtements',
      'Corrosif pour les yeux et les muqueuses',
      'Nocif en cas d\'ingestion',
    ],
    uses: [
      'Photographie (films aux halogénures d\'argent)',
      'Applications médicales (antiseptique)',
      'Analyse qualitative des ions chlorure',
      'Production d\'autres composés d\'argent',
      'Teinture et coloration des cheveux',
    ],
    properties: {
      meltingPoint: 212,
      boilingPoint: 444,
      density: 4.35,
      pH: 5,
      solubility: '256 g/100 mL d\'eau (25°C)',
    },
    description:
      'Le nitrate d\'argent est un composé inorganique de formule AgNO₃. C\'est un réactif polyvalent largement utilisé en analyse chimique qualitative, notamment pour détecter les ions halogénures, et en photographie.',
    category: 'salt',
  },
  {
    id: 'cuso4',
    name: 'Sulfate de cuivre(II)',
    formula: 'CuSO₄',
    molecularWeight: 159.61,
    physicalState: 'solid',
    color: 'blue',
    hazardLevel: 'medium',
    hazards: [
      'Irritant pour la peau et les yeux',
      'Toxique en cas d\'ingestion en grande quantité',
      'Nocif pour les organismes aquatiques',
      'Éviter l\'inhalation de poussière',
    ],
    uses: [
      'Fongicide et algicide en agriculture',
      'Procédés de galvanoplastie',
      'Tests qualitatifs des sucres réducteurs',
      'Complément alimentaire pour animaux',
      'Production de bouillie bordelaise',
    ],
    properties: {
      meltingPoint: 110,
      boilingPoint: 560,
      density: 3.60,
      pH: 3.5,
      solubility: '20,7 g/100 mL d\'eau (25°C)',
    },
    description:
      'Le sulfate de cuivre(II) pentahydraté est la forme la plus courante du sulfate de cuivre, caractérisée par sa couleur bleu vif. Il est utilisé en agriculture, dans les laboratoires de chimie et en galvanoplastie.',
    category: 'salt',
  },
  {
    id: 'nacl',
    name: 'Chlorure de sodium',
    formula: 'NaCl',
    molecularWeight: 58.44,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Généralement sans danger en petites quantités',
      'Une consommation élevée peut être nocive (effets cardiovasculaires)',
      'Légèrement irritant pour les yeux',
    ],
    uses: [
      'Assaisonnement et conservation des aliments',
      'Dégivrage des routes',
      'Fabrication de chlore et d\'hydroxyde de sodium',
      'Solutions salines en médecine',
      'Traitement de l\'eau',
    ],
    properties: {
      meltingPoint: 801,
      boilingPoint: 1413,
      density: 2.165,
      pH: 7,
      solubility: '36 g/100 mL d\'eau (25°C)',
    },
    description:
      'Le chlorure de sodium, communément appelé sel de table, est un composé ionique de formule NaCl. Il est essentiel à la vie humaine et est l\'un des minéraux les plus abondants sur Terre.',
    category: 'salt',
  },
  {
    id: 'ethanol',
    name: 'Éthanol',
    formula: 'C₂H₅OH',
    molecularWeight: 46.07,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Très inflammable',
      'Dépresseur du système nerveux central',
      'Les vapeurs peuvent former des mélanges explosifs',
      'Irritant pour les yeux et les voies respiratoires',
    ],
    uses: [
      'Boissons alcoolisées',
      'Antiseptique et désinfectant',
      'Solvant dans les produits pharmaceutiques et cosmétiques',
      'Biocarburant (gasohol)',
      'Solvant de laboratoire',
    ],
    properties: {
      meltingPoint: -114.1,
      boilingPoint: 78.4,
      density: 0.789,
      pH: 7,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'L\'éthanol, également appelé alcool éthylique, est un liquide volatile, inflammable et incolore de formule C₂H₅OH. C\'est l\'alcool présent dans les boissons alcoolisées et il est largement utilisé comme solvant, antiseptique et carburant.',
    category: 'organic',
  },
  {
    id: 'methanol',
    name: 'Méthanol',
    formula: 'CH₃OH',
    molecularWeight: 32.04,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Très toxique – provoque la cécité et la mort en cas d\'ingestion',
      'Très inflammable',
      'Absorbé à travers la peau',
      'Dépresseur du SNC et poison métabolique',
    ],
    uses: [
      'Production de formaldéhyde',
      'Carburant et additif carburant',
      'Solvant dans les procédés industriels',
      'Production d\'acide acétique',
      'Antigel dans les pipelines',
    ],
    properties: {
      meltingPoint: -97.6,
      boilingPoint: 64.7,
      density: 0.792,
      pH: 7,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'Le méthanol, également connu sous le nom d\'alcool méthylique ou alcool de bois, est l\'alcool le plus simple. C\'est un liquide léger, volatile, incolore et inflammable avec une odeur caractéristique, mais extrêmement toxique pour l\'être humain.',
    category: 'organic',
  },
  {
    id: 'ch3cooh',
    name: 'Acide acétique',
    formula: 'CH₃COOH',
    molecularWeight: 60.05,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Corrosif sous forme concentrée',
      'Inflammable',
      'Odeur piquante de vinaigre',
      'Irritant pour la peau et les yeux',
    ],
    uses: [
      'Composant principal du vinaigre (5–8 %)',
      'Production de monomère d\'acétate de vinyle',
      'Solvant en synthèse chimique',
      'Additif alimentaire et conservateur',
      'Production d\'acétate de cellulose',
    ],
    properties: {
      meltingPoint: 16.6,
      boilingPoint: 118.1,
      density: 1.049,
      pH: 2.4,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'L\'acide acétique est un acide organique faible de formule CH₃COOH. C\'est le composant principal du vinaigre (après l\'eau) et l\'un des acides carboxyliques les plus simples, largement utilisé en synthèse chimique.',
    category: 'acid',
  },
  {
    id: 'h2o',
    name: 'Eau distillée',
    formula: 'H₂O',
    molecularWeight: 18.02,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'low',
    hazards: [
      'Aucun danger significatif dans des conditions normales',
    ],
    uses: [
      'Solvant universel en chimie',
      'Systèmes de refroidissement',
      'Préparation de réactifs en laboratoire',
      'Applications médicales',
      'Production de vapeur',
    ],
    properties: {
      meltingPoint: 0,
      boilingPoint: 100,
      density: 1.00,
      pH: 7,
      solubility: 'N/A – solvant de référence',
    },
    description:
      'L\'eau est le composé le plus abondant sur Terre et est essentielle à toute vie connue. L\'eau distillée a été débarrassée de ses impuretés par distillation et est utilisée comme solvant standard dans la plupart des expériences chimiques.',
    category: 'solvent',
  },
  {
    id: 'nh3',
    name: 'Ammoniac',
    formula: 'NH₃',
    molecularWeight: 17.03,
    physicalState: 'gas',
    color: 'colorless',
    hazardLevel: 'high',
    hazards: [
      'Gaz toxique – irrite le système respiratoire',
      'Corrosif pour les muqueuses et les yeux',
      'Inflammable en fortes concentrations',
      'Réagit violemment avec les oxydants forts',
    ],
    uses: [
      'Production d\'engrais (procédé Haber)',
      'Agent nettoyant (ammoniaque ménager)',
      'Réfrigérant (R-717)',
      'Production d\'explosifs et de colorants',
      'Ajustement du pH dans les procédés industriels',
    ],
    properties: {
      meltingPoint: -77.7,
      boilingPoint: -33.4,
      density: 0.000771,
      pH: 11.6,
      solubility: '31,5 g/100 mL d\'eau (25°C)',
    },
    description:
      'L\'ammoniac est un composé d\'azote et d\'hydrogène de formule NH₃. C\'est un gaz incolore à l\'odeur piquante caractéristique et l\'un des produits chimiques industriels les plus fabriqués au monde.',
    category: 'base',
  },
  {
    id: 'na2co3',
    name: 'Carbonate de sodium',
    formula: 'Na₂CO₃',
    molecularWeight: 105.99,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Irritant pour la peau, les yeux et les voies respiratoires',
      'Légèrement alcalin – peut causer de légères brûlures en solution concentrée',
    ],
    uses: [
      'Fabrication du verre (soude ash)',
      'Adoucissement de l\'eau',
      'Lessive et détergent (cristaux de soude)',
      'Fabrication de papier et de textiles',
      'Tampon pH en chimie analytique',
    ],
    properties: {
      meltingPoint: 851,
      boilingPoint: 1600,
      density: 2.54,
      pH: 11.6,
      solubility: '21,5 g/100 mL d\'eau (20°C)',
    },
    description:
      'Le carbonate de sodium (soude ash ou cristaux de soude) est un sel de sodium de l\'acide carbonique de formule Na₂CO₃. C\'est une poudre blanche et inodore largement utilisée dans la fabrication industrielle et comme adoucissant d\'eau.',
    category: 'salt',
  },
  {
    id: 'caco3',
    name: 'Carbonate de calcium',
    formula: 'CaCO₃',
    molecularWeight: 100.09,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Généralement sans danger',
      'La poussière peut irriter les yeux et les voies respiratoires',
    ],
    uses: [
      'Médicament antiacide',
      'Ciment et matériaux de construction',
      'Charge dans les plastiques et les peintures',
      'Applications de craie et de calcaire',
      'Additif alimentaire (supplément de calcium)',
    ],
    properties: {
      meltingPoint: 1339,
      boilingPoint: 1000,
      density: 2.71,
      pH: 9.4,
      solubility: '0,0013 g/100 mL d\'eau (25°C)',
    },
    description:
      'Le carbonate de calcium est le principal composant du calcaire, de la craie et du marbre. Il est largement utilisé dans l\'industrie et en médecine, et constitue la base de nombreuses préparations antiacides.',
    category: 'salt',
  },
  {
    id: 'mg',
    name: 'Magnésium',
    formula: 'Mg',
    molecularWeight: 24.31,
    physicalState: 'solid',
    color: 'silver-gray',
    hazardLevel: 'medium',
    hazards: [
      'Brûle avec une lumière blanche éclatante lorsqu\'il est enflammé',
      'Le magnésium en combustion ne peut pas être éteint à l\'eau (produit du H₂)',
      'La poudre fine est un risque d\'incendie et d\'explosion',
      'Réagit avec les acides dilués pour libérer du gaz H₂',
    ],
    uses: [
      'Alliages légers (aérospatiale, automobile)',
      'Fusées éclairantes et feux d\'artifice',
      'Complément alimentaire',
      'Agent réducteur en métallurgie',
      'Applications médicales (lait de magnésie)',
    ],
    properties: {
      meltingPoint: 650,
      boilingPoint: 1091,
      density: 1.738,
      solubility: 'Réagit avec l\'eau chaude',
    },
    description:
      'Le magnésium est un métal solide gris brillant, léger, qui brûle avec une flamme blanche éclatante. C\'est le huitième élément le plus abondant dans la croûte terrestre et joue un rôle essentiel en biologie et dans l\'industrie.',
    category: 'metal',
  },
  {
    id: 'fe',
    name: 'Fer',
    formula: 'Fe',
    molecularWeight: 55.85,
    physicalState: 'solid',
    color: 'gray',
    hazardLevel: 'low',
    hazards: [
      'La poudre de fer peut être inflammable',
      'Rouille à l\'air humide en formant de l\'oxyde de fer',
      'Réagit avec les acides forts',
    ],
    uses: [
      'Production d\'acier',
      'Construction et fabrication',
      'Complément alimentaire (carence en fer)',
      'Catalyseurs dans les procédés chimiques (procédé Haber)',
      'Pigments (oxyde de fer)',
    ],
    properties: {
      meltingPoint: 1538,
      boilingPoint: 2862,
      density: 7.874,
      solubility: 'Insoluble dans l\'eau, réagit avec les acides dilués',
    },
    description:
      'Le fer est un métal lustré, ductile, malléable et gris argenté, qui est l\'élément le plus abondant en masse sur Terre. C\'est le principal composant de l\'acier et il est essentiel aux processus biologiques.',
    category: 'metal',
  },
  {
    id: 'cu',
    name: 'Cuivre',
    formula: 'Cu',
    molecularWeight: 63.55,
    physicalState: 'solid',
    color: 'copper-red',
    hazardLevel: 'low',
    hazards: [
      'Les fumées de cuivre peuvent provoquer la fièvre des métaux',
      'Les sels de cuivre peuvent être toxiques en cas d\'ingestion',
      'La poudre fine peut être inflammable',
    ],
    uses: [
      'Câblage électrique et électronique',
      'Plomberie et tuyaux d\'eau',
      'Monnaies et bijoux',
      'Surfaces antimicrobiennes',
      'Galvanoplastie',
    ],
    properties: {
      meltingPoint: 1085,
      boilingPoint: 2562,
      density: 8.96,
      solubility: 'Insoluble dans l\'eau, se dissout dans l\'acide nitrique',
    },
    description:
      'Le cuivre est un métal doux, malléable et ductile avec une très haute conductivité thermique et électrique. Une surface fraîchement exposée présente une couleur rose-orangé. C\'est l\'un des rares métaux qui existent dans la nature sous une forme directement utilisable.',
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
      'Les fumées d\'oxyde de zinc provoquent la fièvre des métaux',
      'Réagit avec les acides dilués pour produire du gaz H₂',
      'Les sels de zinc peuvent être irritants',
    ],
    uses: [
      'Galvanisation du fer et de l\'acier pour prévenir la corrosion',
      'Batteries zinc-carbone et alcalines',
      'Complément alimentaire (oligoélément essentiel)',
      'Alliages de moulage sous pression',
      'Pigments pour caoutchouc et peintures (oxyde de zinc)',
    ],
    properties: {
      meltingPoint: 419.5,
      boilingPoint: 907,
      density: 7.133,
      solubility: 'Insoluble dans l\'eau, se dissout dans les acides',
    },
    description:
      'Le zinc est un métal blanc bleuâtre, lustré et diamagnétique. C\'est le 24e élément le plus abondant dans la croûte terrestre et il est essentiel à la vie, car il est présent dans des centaines d\'enzymes.',
    category: 'metal',
  },
  {
    id: 'kmno4',
    name: 'Permanganate de potassium',
    formula: 'KMnO₄',
    molecularWeight: 158.03,
    physicalState: 'solid',
    color: 'dark-purple',
    hazardLevel: 'medium',
    hazards: [
      'Puissant agent oxydant – risque d\'incendie et d\'explosion avec les matières combustibles',
      'Corrosif pour la peau et les yeux',
      'Toxique en cas d\'ingestion',
      'Réagit violemment avec les acides concentrés',
    ],
    uses: [
      'Traitement et purification de l\'eau',
      'Antiseptique pour plaies et affections cutanées',
      'Agent oxydant en synthèse organique',
      'Agent de blanchiment pour textiles et pâte à papier',
      'Détection d\'agents réducteurs en chimie',
    ],
    properties: {
      meltingPoint: 240,
      boilingPoint: 100,
      density: 2.703,
      pH: 7,
      solubility: '7,6 g/100 mL d\'eau (20°C)',
    },
    description:
      'Le permanganate de potassium est un puissant agent oxydant de couleur caractéristique violet/mauve foncé qui vire au brun (dioxyde de manganèse) lors de sa réduction. Il est largement utilisé en chimie analytique et dans le traitement de l\'eau.',
    category: 'oxidizer',
  },
  {
    id: 'h2o2',
    name: 'Peroxyde d\'hydrogène',
    formula: 'H₂O₂',
    molecularWeight: 34.01,
    physicalState: 'liquid',
    color: 'colorless',
    hazardLevel: 'medium',
    hazards: [
      'Puissant agent oxydant',
      'Corrosif sous forme concentrée',
      'Se décompose de façon exothermique (libère du O₂)',
      'Agent blanchissant – endommage la peau et les cheveux',
    ],
    uses: [
      'Décoloration et coloration des cheveux',
      'Désinfectant et antiseptique (solution à 3 %)',
      'Blanchiment du papier et des textiles',
      'Propergol pour fusées (haute concentration)',
      'Traitement des eaux usées',
    ],
    properties: {
      meltingPoint: -0.43,
      boilingPoint: 150.2,
      density: 1.45,
      pH: 4.5,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'Le peroxyde d\'hydrogène est un liquide bleu pâle à l\'état pur, légèrement plus visqueux que l\'eau. Il est utilisé comme oxydant, agent blanchissant et désinfectant. Il se décompose facilement en eau et en oxygène.',
    category: 'oxidizer',
  },
  {
    id: 'hno3',
    name: 'Acide nitrique',
    formula: 'HNO₃',
    molecularWeight: 63.01,
    physicalState: 'liquid',
    color: 'pale-yellow',
    hazardLevel: 'high',
    hazards: [
      'Très corrosif – provoque de graves brûlures',
      'Puissant oxydant – réagit avec la plupart des métaux',
      'Produit des fumées toxiques de dioxyde d\'azote',
      'Réagit avec les protéines (réaction xanthoprotéique)',
    ],
    uses: [
      'Production d\'engrais (nitrate d\'ammonium)',
      'Fabrication d\'explosifs (TNT, nitroglycérine)',
      'Traitement des métaux (eau régale avec HCl)',
      'Production de nitrates',
      'Galvanoplastie et gravure',
    ],
    properties: {
      meltingPoint: -42,
      boilingPoint: 83,
      density: 1.51,
      pH: -1,
      solubility: 'Miscible avec l\'eau',
    },
    description:
      'L\'acide nitrique est un acide minéral très corrosif de formule HNO₃. C\'est un puissant agent oxydant qui réagit avec la plupart des métaux et constitue un produit chimique industriel clé utilisé dans la production d\'engrais et d\'explosifs.',
    category: 'acid',
  },
  {
    id: 'phenolphthalein',
    name: 'Phénolphtaléine',
    formula: 'C₂₀H₁₄O₄',
    molecularWeight: 318.32,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Cancérogène présumé – manipuler avec précaution',
      'Peut provoquer une irritation de la peau et des yeux',
      'Ne pas ingérer',
    ],
    uses: [
      'Indicateur acido-basique (incolore en milieu acide, rose/rouge en milieu basique)',
      'Expériences de titrage',
      'Laxatif (usage historique)',
      'Test du pH',
    ],
    properties: {
      meltingPoint: 258,
      boilingPoint: 557,
      density: 1.277,
      solubility: '400 mg/L d\'eau ; soluble dans l\'éthanol',
    },
    description:
      'La phénolphtaléine est un composé chimique largement utilisé comme indicateur de pH. Elle est incolore en solutions acides et vire au rose puis au fuchsia en solutions basiques, ce qui la rend idéale pour les titrages acido-basiques.',
    category: 'indicator',
  },
  {
    id: 'na2s2o3',
    name: 'Thiosulfate de sodium',
    formula: 'Na₂S₂O₃',
    molecularWeight: 158.11,
    physicalState: 'solid',
    color: 'white',
    hazardLevel: 'low',
    hazards: [
      'Légèrement irritant pour la peau et les yeux',
      'La décomposition produit du dioxyde de soufre (toxique)',
    ],
    uses: [
      'Photographie (fixateur pour films)',
      'Déchloration de l\'eau',
      'Antidote contre l\'empoisonnement au cyanure',
      'Titrages iodométriques',
      'Traitement médical des infections fongiques',
    ],
    properties: {
      meltingPoint: 48,
      boilingPoint: 100,
      density: 1.667,
      pH: 6.5,
      solubility: '70 g/100 mL d\'eau (20°C)',
    },
    description:
      'Le thiosulfate de sodium est un composé inorganique largement utilisé en photographie et en chimie analytique. C\'est un agent réducteur et la substance étalon dans les titrages iodométriques.',
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
