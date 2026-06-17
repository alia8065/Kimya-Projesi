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
    name: 'Bêcher',
    description:
      'Un récipient en verre cylindrique à fond plat et à bec verseur. Utilisé pour contenir, mélanger et chauffer des liquides. Ne convient pas aux mesures précises de volume.',
    icon: '🧪',
    category: 'glassware',
    maxVolume: '50 mL – 4000 mL',
    material: 'Verre borosilicate',
    usageNotes:
      'Utiliser une tige en verre pour mélanger le contenu. Placer sur une toile métallique lors du chauffage sur bec Bunsen. Ne pas chauffer à vide.',
    uses: ['Mélange de solutions', 'Chauffage de liquides', 'Réactions courantes', 'Stockage de réactifs'],
  },
  {
    id: 'erlenmeyer',
    name: 'Fiole d\'Erlenmeyer',
    description:
      'Une fiole conique à fond plat, corps conique et col cylindrique étroit. Excellente pour agiter les solutions par rotation (p. ex. lors de titrages) sans renverser.',
    icon: '⚗️',
    category: 'glassware',
    maxVolume: '50 mL – 2000 mL',
    material: 'Verre borosilicate',
    usageNotes:
      'Idéale pour les titrages – permet de faire tourner sans éclabousser. Peut être fixée et chauffée doucement.',
    uses: ['Titrage', 'Réactions par agitation rotative', 'Stockage de solutions', 'Montages à reflux'],
  },
  {
    id: 'test_tube',
    name: 'Tube à essai',
    description:
      'Un petit tube en verre fermé à une extrémité, utilisé pour contenir, mélanger, chauffer ou réaliser des réactions chimiques à petite échelle.',
    icon: '🧫',
    category: 'glassware',
    maxVolume: '10–25 mL',
    material: 'Verre borosilicate ou verre sodocalcique',
    usageNotes:
      'Tenir avec une pince à tube lors du chauffage. Orienter l\'ouverture à l\'écart de soi-même et des autres lors du chauffage.',
    uses: ['Réactions à petite échelle', 'Chauffage de petits échantillons', 'Observation', 'Tests qualitatifs'],
  },
  {
    id: 'volumetric_flask',
    name: 'Fiole jaugée',
    description:
      'Une fiole à fond plat avec un long col étalonné à un seul trait de jauge exact. Utilisée pour préparer des solutions de concentration précisément connue.',
    icon: '🫙',
    category: 'glassware',
    maxVolume: '25 mL – 2000 mL',
    material: 'Verre borosilicate',
    usageNotes:
      'Lire le ménisque à hauteur des yeux. Remplir juste en dessous du trait, puis utiliser un compte-gouttes pour ajouter le solvant jusqu\'au trait de jauge. Ne pas chauffer.',
    uses: ['Préparation de solutions étalons', 'Dilutions précises', 'Analyse quantitative'],
  },
  {
    id: 'burette',
    name: 'Burette',
    description:
      'Un long tube en verre gradué muni d\'un robinet en bas, utilisé pour délivrer des volumes précisément mesurés de solution lors des titrages.',
    icon: '📏',
    category: 'glassware',
    maxVolume: '25 mL ou 50 mL (graduation 0,1 mL)',
    material: 'Verre borosilicate',
    usageNotes:
      'Rincer avec la solution avant de remplir. Lire le bas du ménisque à hauteur des yeux. Éliminer les bulles d\'air avant de commencer.',
    uses: ['Titrage', 'Délivrance précise de volume', 'Détection du point d\'équivalence'],
  },
  {
    id: 'graduated_cylinder',
    name: 'Éprouvette graduée',
    description:
      'Un récipient cylindrique avec des graduations utilisé pour mesurer les volumes de liquides avec une précision modérée.',
    icon: '📐',
    category: 'glassware',
    maxVolume: '10 mL – 2000 mL',
    material: 'Verre ou polypropylène',
    usageNotes: 'Toujours lire au bas du ménisque, à hauteur des yeux.',
    uses: ['Mesure de volume', 'Préparation de solutions approximatives', 'Détermination de la densité'],
  },
  {
    id: 'watch_glass',
    name: 'Verre de montre',
    description:
      'Une coupelle en verre circulaire concave/plate utilisée pour contenir des solides lors de la pesée, pour couvrir des bêchers, ou comme petite surface d\'évaporation.',
    icon: '🔵',
    category: 'glassware',
    material: 'Verre borosilicate',
    usageNotes: 'Placer sur un bêcher pour réduire l\'évaporation. Utiliser pour peser des produits chimiques solides.',
    uses: ['Évaporation', 'Couverture de bêchers', 'Pesée de petites quantités', 'Contenance de solides'],
  },
  {
    id: 'separatory_funnel',
    name: 'Ampoule à décanter',
    description:
      'Un entonnoir en forme de poire muni d\'un robinet en bas, utilisé pour séparer deux liquides non miscibles en fonction de leurs différences de densité.',
    icon: '⚗️',
    category: 'separation',
    maxVolume: '50 mL – 2000 mL',
    material: 'Verre borosilicate',
    usageNotes:
      'Dégazer fréquemment lors de l\'utilisation de solvants volatils. Laisser les phases se séparer complètement avant de vidanger.',
    uses: ['Extraction liquide-liquide', 'Séparation de phases non miscibles', 'Traitement en synthèse organique'],
  },
  {
    id: 'crucible',
    name: 'Creuset',
    description:
      'Un petit récipient résistant à la chaleur (céramique ou porcelaine) utilisé pour chauffer des substances à très haute température, par exemple pour la calcination, les tests de cendres ou les réactions à haute température.',
    icon: '🏺',
    category: 'heating',
    material: 'Porcelaine, alumine ou silice',
    usageNotes:
      'Toujours préchauffer avant utilisation pour éliminer l\'humidité. Utiliser des pinces à creuset. Laisser refroidir dans un dessiccateur avant de peser.',
    uses: ['Réactions à haute température', 'Analyse par combustion', 'Calcination', 'Analyse gravimétrique'],
  },

  // ─── Measurement ────────────────────────────────────────────────────────────
  {
    id: 'pipette',
    name: 'Pipette jaugée',
    description:
      'Un tube en verre étalonné pour délivrer un volume exact de liquide. Utilisée lorsqu\'un transfert de volume très précis est requis (p. ex. 25,00 mL).',
    icon: '💧',
    category: 'measurement',
    material: 'Verre borosilicate',
    usageNotes:
      'Utiliser une poire ou un dispositif d\'aspiration – ne jamais pipeter à la bouche. Ne pas souffler la dernière goutte.',
    uses: ['Transfert précis de liquide', 'Préparation de titrages', 'Prélèvement d\'échantillons', 'Préparation de solutions étalons'],
  },
  {
    id: 'balance',
    name: 'Balance analytique',
    description:
      'Une balance de précision capable de mesurer la masse à ±0,0001 g (4 décimales). Enfermée dans un caisson anti-souffle pour éviter que les courants d\'air n\'affectent les lectures.',
    icon: '⚖️',
    category: 'measurement',
    usageNotes:
      'Toujours fermer le caisson avant de lire. Tarer la balance avec le récipient. Ne jamais peser directement sur le plateau.',
    uses: ['Mesure de masse', 'Pesée de réactifs', 'Calculs stœchiométriques', 'Analyse gravimétrique'],
  },
  {
    id: 'thermometer',
    name: 'Thermomètre',
    description:
      'Un instrument de mesure de la température. Les thermomètres de laboratoire vont de -10°C à 300°C. Utilisé pour surveiller les températures de réaction et les points d\'ébullition.',
    icon: '🌡️',
    category: 'measurement',
    usageNotes:
      'Ne pas agiter avec un thermomètre. Laisser le temps à l\'équilibre thermique de s\'établir avant de lire.',
    uses: ['Mesure de température', 'Surveillance des réactions exothermiques', 'Détermination du point d\'ébullition', 'Courbes de chauffage'],
  },
  {
    id: 'ph_meter',
    name: 'pH-mètre',
    description:
      'Un instrument électronique utilisé pour mesurer le pH d\'une solution avec une grande précision (±0,01 pH). Comprend une électrode de référence, une électrode en verre et une unité d\'affichage.',
    icon: '📊',
    category: 'measurement',
    usageNotes:
      'Toujours étalonner avec des solutions tampon étalons (pH 4, 7, 10) avant utilisation. Rincer l\'électrode à l\'eau distillée entre les mesures. Conserver dans une solution de KCl.',
    uses: ['Mesure du pH', 'Surveillance du point d\'équivalence lors du titrage', 'Préparation de tampons', 'Test de qualité de l\'eau'],
  },
  {
    id: 'conductivity_meter',
    name: 'Conductimètre',
    description:
      'Mesure la conductivité électrique d\'une solution, indiquant la concentration en ions dissous. Utilisé pour le contrôle de la qualité de l\'eau et les études sur les électrolytes.',
    icon: '⚡',
    category: 'measurement',
    usageNotes:
      'Étalonner avec une solution étalon de KCl. Rincer la sonde à l\'eau distillée entre les mesures.',
    uses: ['Mesure de la concentration en ions', 'Tests de pureté', 'Caractérisation des électrolytes', 'Surveillance de titrage'],
  },

  // ─── Heating ────────────────────────────────────────────────────────────────
  {
    id: 'hot_plate',
    name: 'Plaque chauffante',
    description:
      'Un appareil de chauffage électrique à surface plane en céramique ou en métal pour chauffer des récipients. Beaucoup incluent une fonction d\'agitation magnétique.',
    icon: '🔥',
    category: 'heating',
    usageNotes:
      'Ne jamais placer de matières inflammables près d\'une plaque chauffante. Utiliser des gants résistants à la chaleur. La surface de la plaque peut rester chaude longtemps après extinction.',
    uses: ['Chauffage de solutions', 'Évaporation', 'Dissolution', 'Montage de distillation'],
  },
  {
    id: 'bunsen_burner',
    name: 'Bec Bunsen',
    description:
      'Un brûleur à gaz produisant une flamme chaude et contrôlable pour le chauffage en laboratoire. La température varie de ~300°C (flamme jaune) à ~1500°C (cône bleu).',
    icon: '🕯️',
    category: 'heating',
    usageNotes:
      'Utiliser le cône bleu pour une chaleur maximale. Ne jamais laisser sans surveillance lorsqu\'il est allumé. Éloigner des solvants inflammables. Attacher les cheveux et les vêtements amples.',
    uses: ['Chauffage', 'Tests à la flamme', 'Stérilisation', 'Combustion', 'Cintrage de tubes en verre'],
  },
  {
    id: 'magnetic_stirrer',
    name: 'Agitateur magnétique',
    description:
      'Un appareil utilisant un champ magnétique rotatif pour faire tourner un petit barreau aimanté placé dans un récipient contenant un liquide, assurant une agitation continue.',
    icon: '🌀',
    category: 'heating',
    usageNotes:
      'Placer le barreau aimanté dans le récipient avant d\'ajouter le liquide. Démarrer à vitesse lente et augmenter progressivement.',
    uses: ['Mélange continu', 'Dissolution', 'Surveillance de réaction', 'Agitation lors du titrage'],
  },
  {
    id: 'condenser',
    name: 'Réfrigérant à reflux',
    description:
      'Un condenseur en verre monté verticalement au-dessus d\'un ballon à fond rond pour condenser les vapeurs et les renvoyer dans le ballon, permettant aux réactions de se dérouler à ébullition sans perte de solvant.',
    icon: '🌡️',
    category: 'heating',
    material: 'Verre borosilicate',
    usageNotes:
      'Brancher l\'eau de refroidissement par le bas et la sortir par le haut. S\'assurer du débit d\'eau avant de chauffer. Ajouter des pierres ponces.',
    uses: ['Réactions à reflux', 'Distillation', 'Condensation des vapeurs', 'Synthèse organique'],
  },

  // ─── Electrical ─────────────────────────────────────────────────────────────
  {
    id: 'electrolysis',
    name: 'Appareil d\'électrolyse',
    description:
      'Équipement pour réaliser l\'électrolyse : comprend des électrodes (carbone/platine/cuivre), un récipient pour l\'électrolyte et des connexions à une alimentation électrique.',
    icon: '🔋',
    category: 'electrical',
    usageNotes:
      'Toujours connecter l\'alimentation APRÈS avoir immergé les électrodes dans la solution. Ne jamais toucher les électrodes lorsqu\'elles sont connectées. Assurer une ventilation suffisante si des gaz sont produits.',
    uses: ['Électrolyse', 'Dépôt métallique', 'Production de gaz', 'Démonstrations chlore-soude'],
  },
  {
    id: 'galvanic_cell',
    name: 'Kit de pile galvanique',
    description:
      'Un kit pour construire des piles électrochimiques (batteries) afin de mesurer les potentiels standard d\'électrode. Comprend des électrodes métalliques, un pont salin, des bêchers et des fils de connexion.',
    icon: '⚡',
    category: 'electrical',
    usageNotes:
      'Connecter le voltmètre en parallèle. Assurer un bon contact électrique. Le pont salin doit être frais. Enregistrer la tension de la pile à ±0,01 V.',
    uses: ['Mesure de tension', 'Expériences d\'électrochimie', 'Réactions d\'oxydoréduction', 'Détermination du potentiel standard'],
  },

  // ─── Safety ─────────────────────────────────────────────────────────────────
  {
    id: 'safety_goggles',
    name: 'Lunettes de protection',
    description:
      'Lunettes de protection avec côtés fermés pour empêcher les projections chimiques, les débris et les vapeurs d\'atteindre les yeux. Différentes des lunettes de sécurité simples – les lunettes de protection ont des écrans latéraux.',
    icon: '🥽',
    category: 'safety',
    usageNotes:
      'Doivent être portées EN PERMANENCE dans le laboratoire. Nettoyer avec du savon doux et de l\'eau. Remplacer si fissurées ou rayées.',
    uses: ['Protection des yeux', 'Prévention des projections', 'Protection contre les vapeurs'],
  },
  {
    id: 'lab_coat',
    name: 'Blouse de laboratoire',
    description:
      'Un vêtement de protection pleine longueur porté pour protéger la peau et les vêtements des projections chimiques, des déversements et des contaminations.',
    icon: '🥼',
    category: 'safety',
    usageNotes:
      'Doit être en coton 100% ou en matériau chimiquement résistant. Garder boutonnée en permanence. Remplacer immédiatement en cas de contamination.',
    uses: ['Protection de la peau', 'Prévention des contaminations', 'Protection des vêtements'],
  },
  {
    id: 'fume_hood',
    name: 'Hotte aspirante',
    description:
      'Une enceinte ventilée pour la manipulation de produits chimiques toxiques, corrosifs ou volatils. Aspire les vapeurs et les émanations à l\'écart de l\'opérateur et les évacue par un système de filtration.',
    icon: '🏠',
    category: 'safety',
    usageNotes:
      'Maintenir la vitre à la hauteur de sécurité indiquée. Travailler à au moins 15 cm à l\'intérieur de la hotte. Ne jamais obstruer les déflecteurs. Vérifier l\'indicateur de débit d\'air avant utilisation.',
    uses: ['Manipulation de produits chimiques volatils', 'Travail avec des vapeurs toxiques', 'Manipulation d\'acides corrosifs', 'Réactions dégageant des gaz'],
  },

  // ─── General / Support ──────────────────────────────────────────────────────
  {
    id: 'ring_stand',
    name: 'Support universel et pinces',
    description:
      'Un support métallique avec des anneaux et des pinces réglables utilisé pour tenir et supporter la verrerie de laboratoire (p. ex. burettes, réfrigérants, fioles) à la hauteur souhaitée pendant les expériences.',
    icon: '🗼',
    category: 'general',
    material: 'Acier',
    usageNotes:
      'S\'assurer que le support est stable avant de fixer des équipements lourds. Serrer toutes les pinces solidement.',
    uses: ['Support de burettes', 'Maintien des réfrigérants', 'Organisation du montage', 'Maintien des ampoules à décanter'],
  },
  {
    id: 'filter_funnel',
    name: 'Entonnoir filtrant',
    description:
      'Un entonnoir conique en verre ou en plastique utilisé avec du papier filtre pour séparer des solides insolubles de liquides par filtration.',
    icon: '🔻',
    category: 'separation',
    material: 'Verre borosilicate ou polypropylène',
    usageNotes:
      'Plier le papier filtre en cône. Mouiller le papier filtre avec le solvant avant de filtrer. S\'assurer que l\'entonnoir est solidement fixé.',
    uses: ['Filtration par gravité', 'Séparation de précipités', 'Purification de solides', 'Élimination de particules en suspension'],
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
