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
    name: 'Classe préparatoire',
    shortName: 'Prép.',
    color: '#8b5cf6',
    icon: '📚',
    description: 'Introduction aux fondamentaux de la chimie et aux bases du laboratoire',
    topics: [
      {
        id: 'matter',
        name: 'La matière et ses propriétés',
        description: 'Comprendre ce qu\'est la matière et ses propriétés physiques et chimiques',
        icon: '⚛️',
        theory: {
          sections: [
            {
              title: 'Qu\'est-ce que la matière ?',
              content: 'La matière est tout ce qui a une masse et occupe un espace. Tout ce qui nous entoure — l\'air, l\'eau, les roches et les êtres vivants — est constitué de matière. La matière est composée de minuscules particules appelées atomes et molécules.'
            },
            {
              title: 'Propriétés physiques',
              content: 'Les propriétés physiques peuvent être observées sans modifier la composition chimique de la matière. Exemples : couleur, odeur, densité, point de fusion, point d\'ébullition, dureté et conductivité.'
            },
            {
              title: 'Propriétés chimiques',
              content: 'Les propriétés chimiques décrivent comment une substance se transforme en une substance différente. Exemples : inflammabilité (brûle dans l\'air), réactivité avec les acides, capacité à rouiller (oxydation) et décomposition.'
            },
            { title: 'Formule de la densité', content: 'Densité = Masse / Volume', formula: 'ρ = m/V (g/cm³)' }
          ]
        },
        experiments: [{
          id: 'density_exp',
          name: 'Mesure de la densité',
          description: 'Mesurer la densité de différentes substances à l\'aide d\'une balance analytique et d\'une éprouvette graduée',
          chemicals: ['h2o'],
          equipment: ['balance', 'beaker', 'volumetric_flask'],
          steps: ['Mesurer la masse du bécher vide', 'Ajouter 50 mL d\'eau dans le bécher', 'Mesurer la masse totale', 'Calculer la densité en utilisant ρ = m/V', 'Répéter avec différents liquides'],
          expectedObservations: 'L\'eau a une densité d\'environ 1 g/cm³. Les liquides plus denses coulent dans l\'eau, les plus légers flottent.'
        }],
        quiz: [
          { id: 'q1', question: 'Laquelle des propriétés suivantes est une propriété physique ?', type: 'multiple-choice', options: ['Inflammabilité', 'Point d\'ébullition', 'Réactivité avec un acide', 'Oxydation'], answer: 1, explanation: 'Le point d\'ébullition est une propriété physique car il peut être observé sans modifier la composition chimique.' },
          { id: 'q2', question: 'La matière est définie comme tout ce qui a une masse et un volume.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La matière est tout ce qui a une masse et occupe un espace (volume).' },
          { id: 'q3', question: 'Si un objet a une masse de 50 g et un volume de 25 cm³, quelle est sa densité ?', type: 'multiple-choice', options: ['0,5 g/cm³', '2 g/cm³', '75 g/cm³', '25 g/cm³'], answer: 1, explanation: 'Densité = masse/volume = 50/25 = 2 g/cm³' },
          { id: 'q4', question: 'La rouille du fer est un exemple de propriété chimique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La rouille implique une réaction du fer avec l\'oxygène pour former de l\'oxyde de fer — une transformation chimique.' }
        ]
      },
      {
        id: 'states_of_matter',
        name: 'États de la matière',
        description: 'Solide, liquide, gaz — et les transitions entre eux',
        icon: '💧',
        theory: {
          sections: [
            { title: 'Les trois états de la matière', content: 'La matière existe dans trois états communs : solide (forme et volume fixes), liquide (volume fixe, prend la forme du récipient) et gaz (remplit entièrement le récipient). Un quatrième état — le plasma — existe à très haute température.' },
            { title: 'Théorie des particules', content: 'Dans les solides, les particules vibrent à des positions fixes. Dans les liquides, les particules se déplacent librement mais restent proches les unes des autres. Dans les gaz, les particules se déplacent rapidement et sont éloignées les unes des autres.' },
            { title: 'Changements de phase', content: 'Fusion : solide → liquide. Solidification : liquide → solide. Évaporation : liquide → gaz. Condensation : gaz → liquide. Sublimation : solide → gaz directement. Déposition : gaz → solide directement.' },
            { title: 'Énergie lors des changements de phase', content: 'La fusion nécessite de la chaleur (endothermique). La solidification libère de la chaleur (exothermique). La température reste constante lors d\'un changement de phase — toute l\'énergie sert à rompre les forces intermoléculaires.', formula: 'Q = mL (chaleur latente)' }
          ]
        },
        experiments: [{
          id: 'phase_change_exp',
          name: 'Observation des changements de phase',
          description: 'Chauffer de l\'eau et observer les transitions de phase à différentes températures',
          chemicals: ['h2o'],
          equipment: ['beaker', 'hot_plate', 'thermometer'],
          steps: ['Remplir le bécher avec 100 mL d\'eau', 'Placer le thermomètre dans l\'eau', 'Chauffer sur la plaque chauffante', 'Relever la température toutes les 30 secondes', 'Observer quand l\'eau commence à bouillir', 'Noter que la température reste constante pendant l\'ébullition'],
          expectedObservations: 'La température de l\'eau monte régulièrement jusqu\'à 100 °C, puis reste constante pendant l\'ébullition.'
        }],
        quiz: [
          { id: 'q1', question: 'Que se passe-t-il pour le mouvement des particules quand un solide fond ?', type: 'multiple-choice', options: ['Les particules s\'arrêtent de bouger', 'Les particules se déplacent plus librement', 'Les particules deviennent plus petites', 'Aucun changement ne se produit'], answer: 1, explanation: 'Lorsqu\'un solide fond, l\'énergie rompt les liaisons intermoléculaires, permettant aux particules de se déplacer plus librement sous forme de liquide.' },
          { id: 'q2', question: 'Pendant l\'ébullition, la température continue de monter régulièrement.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Lors d\'un changement de phase (ébullition), la température reste constante car toute l\'énergie thermique rompt les liaisons intermoléculaires.' },
          { id: 'q3', question: 'Quel processus est endothermique ?', type: 'multiple-choice', options: ['Solidification', 'Condensation', 'Fusion', 'Déposition'], answer: 2, explanation: 'La fusion est endothermique — elle nécessite de l\'énergie thermique pour rompre les liaisons maintenant la structure solide.' },
          { id: 'q4', question: 'La sublimation se produit lorsqu\'un solide se convertit directement en gaz.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La glace sèche (CO₂) est un exemple classique de sublimation — elle passe directement de l\'état solide à l\'état gazeux.' }
        ]
      },
      {
        id: 'lab_safety',
        name: 'Sécurité au laboratoire',
        description: 'Règles et procédures de sécurité essentielles pour le laboratoire de chimie',
        icon: '🛡️',
        theory: {
          sections: [
            { title: 'Pourquoi la sécurité est importante', content: 'Les laboratoires de chimie contiennent des produits chimiques dangereux, des flammes nues et de la verrerie fragile. Comprendre et respecter les règles de sécurité prévient les accidents et protège toutes les personnes présentes dans le laboratoire.' },
            { title: 'Équipements de protection individuelle (EPI)', content: 'Toujours porter : lunettes de protection (protection des yeux), blouse ou tablier de laboratoire, chaussures fermées, et gants lors de la manipulation de produits chimiques corrosifs ou toxiques. Ne jamais porter de vêtements amples près de flammes nues.' },
            { title: 'Symboles de danger chimique', content: 'Les symboles de danger avertissent des dangers chimiques : Tête de mort (toxique), Flamme (inflammable), Corrosion (corrosif), Point d\'exclamation (irritant), Environnement (éco-toxique), Biohazard (risque biologique).' },
            { title: 'Procédures d\'urgence', content: 'Si de l\'acide se renverse sur la peau : rincer immédiatement avec beaucoup d\'eau pendant 15 minutes ou plus. Si des produits chimiques pénètrent dans les yeux : utiliser la station de lavage oculaire pendant 15 minutes. En cas d\'incendie : utiliser l\'extincteur ou la couverture anti-feu. Toujours signaler les accidents à l\'enseignant.' }
          ]
        },
        experiments: [{
          id: 'safety_quiz',
          name: 'Identification de la sécurité au laboratoire',
          description: 'Identifier les symboles de danger et les réponses de sécurité appropriées',
          chemicals: ['hcl', 'naoh'],
          equipment: ['beaker'],
          steps: ['Examiner les étiquettes de danger sur les récipients', 'Identifier chaque symbole de sécurité', 'Pratiquer la procédure EPI appropriée', 'Réviser les méthodes d\'élimination des produits chimiques', 'Localiser les équipements d\'urgence dans le laboratoire'],
          expectedObservations: 'Comprendre que chaque produit chimique présente des dangers spécifiques nécessitant des précautions spécifiques.'
        }],
        quiz: [
          { id: 'q1', question: 'Que faut-il faire en premier si de l\'acide éclabousse vos yeux ?', type: 'multiple-choice', options: ['Se frotter doucement les yeux', 'Utiliser la station de lavage oculaire pendant 15 minutes', 'Appliquer des gouttes ophtalmiques', 'Informer l\'enseignant en premier'], answer: 1, explanation: 'Utiliser immédiatement la station de lavage oculaire pendant au moins 15 minutes. Le temps est critique lorsque des acides entrent en contact avec les yeux !' },
          { id: 'q2', question: 'Vous devez porter des lunettes de protection à tout moment dans le laboratoire de chimie.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Les lunettes protègent vos yeux des éclaboussures, des vapeurs et du verre brisé — toujours obligatoires.' },
          { id: 'q3', question: 'Quel symbole indique un produit chimique inflammable ?', type: 'multiple-choice', options: ['Tête de mort', 'Symbole de flamme', 'Point d\'exclamation', 'Symbole biohazard'], answer: 1, explanation: 'Le symbole de flamme (🔥) indique une substance inflammable — tenir à l\'écart des sources de chaleur et des flammes nues.' },
          { id: 'q4', question: 'Il est sans danger de sentir les produits chimiques en agitant les vapeurs vers son nez.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai — cette technique s\'appelle « effluvage » et c\'est la façon sûre de détecter les odeurs. Ne jamais inhaler directement depuis les récipients.' }
        ]
      },
      {
        id: 'mixtures',
        name: 'Mélanges et séparation',
        description: 'Types de mélanges et méthodes pour séparer leurs composants',
        icon: '🌀',
        theory: {
          sections: [
            { title: 'Corps purs vs. mélanges', content: 'Un corps pur a une composition fixe (élément ou composé). Un mélange contient deux substances ou plus combinées sans réaction chimique. Les mélanges peuvent être séparés par des moyens physiques.' },
            { title: 'Mélanges homogènes (solutions)', content: 'Dans un mélange homogène, les composants sont uniformément distribués. Exemples : eau salée, air, laiton. Le soluté se dissout dans le solvant. NaCl + H₂O → solution d\'eau salée.' },
            { title: 'Mélanges hétérogènes', content: 'Dans un mélange hétérogène, les composants sont visiblement différents. Exemples : sable et eau, huile et eau, granite. Les composants peuvent souvent être séparés par des méthodes physiques simples.' },
            { title: 'Méthodes de séparation', content: 'Filtration : sépare les solides insolubles des liquides. Évaporation : retire le solvant pour récupérer le solide dissous. Distillation : sépare les liquides par point d\'ébullition. Chromatographie : sépare par solubilité. Décantation : verser le liquide depuis le solide déposé.' }
          ]
        },
        experiments: [{
          id: 'separation_exp',
          name: 'Séparation d\'un mélange sel-sable',
          description: 'Utiliser la filtration et l\'évaporation pour séparer NaCl et le sable',
          chemicals: ['nacl', 'h2o'],
          equipment: ['beaker', 'hot_plate', 'watch_glass'],
          steps: ['Mélanger le sel et le sable ensemble', 'Ajouter de l\'eau et remuer pour dissoudre le sel', 'Filtrer avec du papier filtre pour enlever le sable', 'Évaporer l\'eau du filtrat sur la plaque chauffante', 'Observer les cristaux blancs de sel restants'],
          expectedObservations: 'Le sable se recueille sur le papier filtre. Après évaporation, il reste des cristaux purs de NaCl blanc.'
        }],
        quiz: [
          { id: 'q1', question: 'Quelle méthode permet de séparer le sel de l\'eau ?', type: 'multiple-choice', options: ['Filtration', 'Distillation', 'Évaporation', 'Décantation'], answer: 2, explanation: 'L\'évaporation retire l\'eau sous forme de vapeur, laissant des cristaux de sel.' },
          { id: 'q2', question: 'L\'eau salée est un mélange homogène.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! L\'eau salée est une solution — le sel (NaCl) est uniformément distribué dans toute l\'eau.' },
          { id: 'q3', question: 'Quelle technique de séparation utilise du papier pour séparer des pigments ?', type: 'multiple-choice', options: ['Filtration', 'Distillation', 'Chromatographie', 'Centrifugation'], answer: 2, explanation: 'La chromatographie sépare les mélanges selon la distance parcourue par les composants sur du papier en fonction de leur solubilité.' },
          { id: 'q4', question: 'La filtration peut séparer le sel dissous de l\'eau.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Le sel dissous passe à travers le papier filtre. Il faut l\'évaporation ou la distillation pour le séparer.' }
        ]
      }
    ]
  },

  grade9: {
    id: 'grade9',
    name: 'Chimie de 3e',
    shortName: '3e',
    color: '#6366f1',
    icon: '🔬',
    description: 'Théorie atomique, tableau périodique, liaisons chimiques et réactions',
    topics: [
      {
        id: 'atom',
        name: 'Structure atomique',
        description: 'La structure des atomes : protons, neutrons, électrons et modèles atomiques',
        icon: '⚛️',
        theory: {
          sections: [
            { title: 'L\'atome', content: 'Les atomes sont les éléments de base de la matière. Chaque atome possède un noyau (protons + neutrons) entouré d\'électrons. Les protons ont une charge positive (+1), les neutrons n\'ont pas de charge, les électrons ont une charge négative (-1).' },
            { title: 'Numéro atomique et masse', content: 'Numéro atomique (Z) = nombre de protons. Cela identifie de manière unique un élément. Nombre de masse (A) = protons + neutrons. Les électrons sont égaux aux protons dans un atome neutre.', formula: 'A = Z + N (où N = nombre de neutrons)' },
            { title: 'Configuration électronique', content: 'Les électrons occupent des niveaux d\'énergie (couches). Première couche : 2 électrons max. Deuxième couche : 8 max. Troisième couche : 18 max. Les électrons de valence (couche externe) déterminent le comportement chimique.' },
            { title: 'Modèle de Bohr vs. modèle quantique', content: 'Modèle de Bohr : électrons sur des orbites circulaires à distances fixes. Modèle quantique plus précis : les électrons existent dans des régions de probabilité appelées orbitales (s, p, d, f). Les deux modèles sont utiles à des fins différentes.' }
          ]
        },
        experiments: [{
          id: 'flame_test',
          name: 'Test à la flamme',
          description: 'Identifier les ions métalliques par la couleur de la flamme qu\'ils produisent',
          chemicals: ['nacl', 'cuso4'],
          equipment: ['bunsen_burner', 'test_tube'],
          steps: ['Préparer des solutions diluées de différents sels métalliques', 'Tremper une boucle en fil dans la solution', 'Tenir dans la flamme bleue du bec Bunsen', 'Observer et noter la couleur de la flamme', 'Répéter avec différents sels'],
          expectedObservations: 'NaCl → jaune vif, CuSO₄ → bleu-vert, KCl → lilas/violet'
        }],
        quiz: [
          { id: 'q1', question: 'Un élément a le numéro atomique 11. Combien de protons possède-t-il ?', type: 'multiple-choice', options: ['10', '11', '12', '22'], answer: 1, explanation: 'Le numéro atomique EST le nombre de protons. Na (sodium) a le numéro atomique 11, donc il possède 11 protons.' },
          { id: 'q2', question: 'Les neutrons ont une charge négative.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Les neutrons n\'ont AUCUNE charge (neutres). Les protons sont positifs, les électrons sont négatifs.' },
          { id: 'q3', question: 'Un atome de carbone (Z=6, A=12) possède combien de neutrons ?', type: 'multiple-choice', options: ['6', '12', '18', '4'], answer: 0, explanation: 'Neutrons = A - Z = 12 - 6 = 6 neutrons' },
          { id: 'q4', question: 'Les électrons de valence déterminent le comportement chimique d\'un élément.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Les électrons de valence se trouvent sur la couche externe et participent aux liaisons chimiques.' }
        ]
      },
      {
        id: 'periodic_table',
        name: 'Tableau périodique',
        description: 'Organisation des éléments : groupes, périodes et tendances périodiques',
        icon: '📊',
        theory: {
          sections: [
            { title: 'Organisation du tableau périodique', content: 'Les éléments sont classés par numéro atomique croissant. Les périodes (lignes) indiquent les niveaux d\'énergie. Les groupes (colonnes) contiennent des éléments aux propriétés chimiques similaires et au même nombre d\'électrons de valence.' },
            { title: 'Tendances périodiques', content: 'Rayon atomique : augmente dans un groupe, diminue au sein d\'une période. Électronégativité : augmente au sein d\'une période et vers le haut d\'un groupe. Énergie d\'ionisation : augmente au sein d\'une période et vers le haut d\'un groupe.' },
            { title: 'Familles d\'éléments', content: 'Groupe 1 : métaux alcalins (très réactifs). Groupe 2 : métaux alcalino-terreux. Groupes 3-12 : métaux de transition. Groupe 17 : halogènes (non-métaux réactifs). Groupe 18 : gaz nobles (inertes).' },
            { title: 'Métaux vs. non-métaux', content: 'Métaux : brillants, ductiles, malléables, bons conducteurs. Situés à gauche du tableau périodique. Non-métaux : ternes, cassants, mauvais conducteurs. Situés à droite. Métalloïdes (semi-métaux) : sur la frontière en escalier.' }
          ]
        },
        experiments: [{
          id: 'reactivity_series',
          name: 'Série de réactivité des métaux',
          description: 'Comparer la réactivité de différents métaux avec un acide',
          chemicals: ['hcl', 'mg', 'zn', 'fe', 'cu'],
          equipment: ['test_tube', 'beaker'],
          steps: ['Ajouter des quantités égales de HCl dans 4 tubes à essais', 'Ajouter un petit morceau de chaque métal dans des tubes séparés', 'Observer le taux de production de bulles', 'Enregistrer l\'ordre de réactivité', 'Comparer avec la série de réactivité théorique'],
          expectedObservations: 'Mg réagit vigoureusement (bulles rapides), Zn modérément, Fe lentement, Cu ne réagit pas. Confirme la série d\'activité : Mg > Zn > Fe > Cu'
        }],
        quiz: [
          { id: 'q1', question: 'Les éléments d\'un même groupe ont des propriétés similaires car ils ont :', type: 'multiple-choice', options: ['Le même nombre de masse', 'Le même nombre d\'électrons de valence', 'Le même rayon atomique', 'Le même numéro de période'], answer: 1, explanation: 'Les éléments d\'un même groupe (colonne) ont le même nombre d\'électrons de valence, ce qui leur confère des propriétés chimiques similaires.' },
          { id: 'q2', question: 'Les gaz nobles sont très réactifs.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Les gaz nobles ont des couches électroniques externes complètes, ce qui les rend extrêmement stables et largement inertes.' },
          { id: 'q3', question: 'En se déplaçant de gauche à droite au sein d\'une période, le rayon atomique :', type: 'multiple-choice', options: ['Augmente', 'Diminue', 'Reste le même', 'Augmente d\'abord puis diminue'], answer: 1, explanation: 'Le rayon atomique diminue de gauche à droite car plus de protons attirent les électrons plus près tout en ajoutant des électrons à la même couche.' },
          { id: 'q4', question: 'Les halogènes se trouvent dans le groupe 17 du tableau périodique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Le groupe 17 contient le fluor, le chlore, le brome, l\'iode et l\'astate — tous des halogènes.' }
        ]
      },
      {
        id: 'acids_bases',
        name: 'Acides et bases',
        description: 'Propriétés des acides et des bases, échelle de pH et neutralisation',
        icon: '⚗️',
        theory: {
          sections: [
            { title: 'Définition d\'Arrhenius', content: 'Les acides libèrent des ions H⁺ dans l\'eau. Les bases libèrent des ions OH⁻ dans l\'eau. Exemple : HCl → H⁺ + Cl⁻ (acide) ; NaOH → Na⁺ + OH⁻ (base).' },
            { title: 'Définition de Brønsted-Lowry', content: 'Acide = donneur de proton (H⁺). Base = accepteur de proton. Cette définition est plus large qu\'Arrhenius — elle inclut les réactions dans des solvants non aqueux.' },
            { title: 'Échelle de pH', content: 'pH = -log[H⁺]. L\'échelle va de 0 à 14. pH < 7 : acide. pH = 7 : neutre (eau pure). pH > 7 : basique. Chaque unité = 10× de différence en [H⁺].', formula: 'pH = -log₁₀[H⁺]' },
            { title: 'Neutralisation', content: 'Acide + Base → Sel + Eau. Exemple : HCl + NaOH → NaCl + H₂O. C\'est une réaction exothermique — de la chaleur est libérée. Le point d\'équivalence est atteint quand les moles d\'acide = les moles de base.', formula: 'H⁺ + OH⁻ → H₂O' }
          ]
        },
        experiments: [{
          id: 'neutralization',
          name: 'Neutralisation acide-base',
          description: 'Neutraliser HCl avec NaOH en utilisant la phénolphtaléine comme indicateur',
          chemicals: ['hcl', 'naoh', 'phenolphthalein'],
          equipment: ['beaker', 'burette', 'erlenmeyer'],
          steps: ['Ajouter 25 mL de HCl dans le flacon Erlenmeyer', 'Ajouter 3 gouttes d\'indicateur phénolphtaléine', 'Remplir la burette avec la solution de NaOH', 'Ajouter NaOH goutte à goutte en agitant', 'Arrêter à la première couleur rose persistante', 'Noter le volume de NaOH utilisé'],
          expectedObservations: 'La solution est incolore dans l\'acide. Devient rose persistant au point d\'équivalence quand NaOH neutralise HCl.'
        }],
        quiz: [
          { id: 'q1', question: 'Une solution de pH = 3 est :', type: 'multiple-choice', options: ['Basique', 'Neutre', 'Acide', 'Alcaline'], answer: 2, explanation: 'Un pH < 7 indique une solution acide. pH = 3 signifie [H⁺] = 10⁻³ mol/L — assez acide.' },
          { id: 'q2', question: 'La neutralisation produit toujours de l\'eau et un sel.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Acide + Base → Sel + Eau est la formule générale des réactions de neutralisation.' },
          { id: 'q3', question: 'Quel indicateur devient rose en solution basique ?', type: 'multiple-choice', options: ['Tournesol (rouge)', 'Indicateur universel', 'Phénolphtaléine', 'Orange de méthyle'], answer: 2, explanation: 'La phénolphtaléine est incolore en milieu acide mais devient rose/magenta en solution basique (pH > 8,2).' },
          { id: 'q4', question: 'Les acides forts se dissocient complètement dans l\'eau.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Les acides forts comme HCl et H₂SO₄ se dissocient complètement : HCl → H⁺ + Cl⁻ (dissociation à 100 %).' }
        ]
      }
    ]
  },

  grade10: {
    id: 'grade10',
    name: 'Chimie de 2nde',
    shortName: '2nde',
    color: '#10b981',
    icon: '🔭',
    description: 'Solutions, lois des gaz, thermochimie et équilibre',
    topics: [
      {
        id: 'solutions',
        name: 'Solutions et concentration',
        description: 'Types de solutions, calculs de concentration et propriétés colligatives',
        icon: '💧',
        theory: {
          sections: [
            { title: 'Solutions', content: 'Une solution est un mélange homogène de soluté (substance dissoute) et de solvant (milieu de dissolution). L\'eau est appelée le « solvant universel » car elle dissout de nombreuses substances.' },
            { title: 'Molarité', content: 'Molarité (M) = moles de soluté / litres de solution. Utilisée pour exprimer la concentration en mol/L (molaire, M).', formula: 'M = n/V (mol/L)' },
            { title: 'Propriétés colligatives', content: 'Propriétés qui dépendent du nombre de particules de soluté, non de leur nature : élévation du point d\'ébullition, abaissement du point de congélation, pression osmotique, abaissement de la pression de vapeur.' },
            { title: 'Dilution', content: 'Lors de la dilution d\'une solution, les moles de soluté restent constantes : C₁V₁ = C₂V₂', formula: 'C₁V₁ = C₂V₂' }
          ]
        },
        experiments: [{
          id: 'molarity_exp',
          name: 'Préparation d\'une solution de NaCl à 1 M',
          description: 'Préparer avec précision une solution molaire standard',
          chemicals: ['nacl', 'h2o'],
          equipment: ['balance', 'volumetric_flask', 'beaker'],
          steps: ['Calculer la masse de NaCl nécessaire : 58,44 g pour 1 L de 1 M', 'Peser exactement 58,44 g de NaCl', 'Dissoudre dans environ 800 mL d\'eau distillée dans un bécher', 'Transvaser dans une fiole jaugée de 1 L', 'Ajouter de l\'eau distillée jusqu\'au trait de 1 L', 'Boucher et retourner plusieurs fois pour mélanger'],
          expectedObservations: 'Solution claire et incolore. Concentration exacte = 1,000 M NaCl'
        }],
        quiz: [
          { id: 'q1', question: 'Quelle est la molarité d\'une solution contenant 4 mol de NaOH dans 2 L ?', type: 'multiple-choice', options: ['0,5 M', '2 M', '6 M', '8 M'], answer: 1, explanation: 'M = moles/volume = 4 mol / 2 L = 2 M' },
          { id: 'q2', question: 'Ajouter un soluté à l\'eau élève son point d\'ébullition.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! C\'est l\'élévation du point d\'ébullition — une propriété colligative. L\'eau salée bout au-dessus de 100 °C.' },
          { id: 'q3', question: 'La formule de dilution est :', type: 'multiple-choice', options: ['M₁+M₂ = V₁+V₂', 'C₁V₁ = C₂V₂', 'n = CV', 'C = n/V²'], answer: 1, explanation: 'C₁V₁ = C₂V₂ : concentration initiale × volume initial = concentration finale × volume final.' },
          { id: 'q4', question: 'La molarité est mesurée en mol/L.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La molarité (M) = moles de soluté par litre de solution, écrite mol/L ou M.' }
        ]
      },
      {
        id: 'thermochemistry',
        name: 'Thermochimie',
        description: 'Changements d\'énergie dans les réactions chimiques : exothermique, endothermique, loi de Hess',
        icon: '🔥',
        theory: {
          sections: [
            { title: 'Réactions exothermiques', content: 'Les réactions exothermiques libèrent de l\'énergie (chaleur) vers le milieu. ΔH < 0. Exemples : combustion, neutralisation, nombreuses réactions d\'oxydation. Les produits ont une énergie inférieure à celle des réactifs.' },
            { title: 'Réactions endothermiques', content: 'Les réactions endothermiques absorbent de l\'énergie du milieu. ΔH > 0. Exemples : photosynthèse, décomposition thermique, dissolution de NH₄NO₃. Les produits ont une énergie supérieure à celle des réactifs.' },
            { title: 'Calculs d\'enthalpie', content: 'q = mcΔT où q = chaleur, m = masse, c = capacité thermique massique (4,18 J/g°C pour l\'eau), ΔT = variation de température.', formula: 'q = mcΔT' },
            { title: 'Loi de Hess', content: 'La variation d\'enthalpie totale est indépendante du chemin suivi. Si une réaction peut être exprimée comme la somme d\'autres réactions, ΔH_total = ΣΔH_étapes. Cela permet de calculer ΔH pour des réactions qui ne peuvent pas être mesurées directement.', formula: 'ΔH_rxn = ΣΔH_products - ΣΔH_reactants' }
          ]
        },
        experiments: [{
          id: 'calorimetry_exp',
          name: 'Calorimétrie de neutralisation',
          description: 'Mesurer la chaleur libérée lors de la neutralisation HCl + NaOH',
          chemicals: ['hcl', 'naoh', 'h2o'],
          equipment: ['beaker', 'thermometer'],
          steps: ['Mesurer 50 mL de HCl à 1 M', 'Relever la température initiale', 'Ajouter 50 mL de NaOH à 1 M', 'Agiter et relever la température maximale', 'Calculer ΔT', 'Calculer la chaleur : q = mcΔT', 'Calculer l\'enthalpie molaire ΔH'],
          expectedObservations: 'La température augmente d\'environ 5 à 7 °C. La réaction est exothermique (ΔH ≈ -57 kJ/mol).'
        }],
        quiz: [
          { id: 'q1', question: 'Une réaction exothermique a :', type: 'multiple-choice', options: ['ΔH > 0', 'ΔH = 0', 'ΔH < 0', 'ΔH > 1'], answer: 2, explanation: 'Les réactions exothermiques libèrent de la chaleur, donc ΔH est négatif (l\'énergie diminue dans le système, va vers le milieu).' },
          { id: 'q2', question: 'La photosynthèse est un processus exothermique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! La photosynthèse est endothermique — les plantes absorbent de l\'énergie lumineuse pour convertir le CO₂ et H₂O en glucose.' },
          { id: 'q3', question: 'En utilisant q = mcΔT avec m=100 g, c=4,18, ΔT=5 °C, quelle est la valeur de q ?', type: 'multiple-choice', options: ['2090 J', '209 J', '20900 J', '20,9 J'], answer: 0, explanation: 'q = 100 × 4,18 × 5 = 2090 J = 2,09 kJ' },
          { id: 'q4', question: 'La loi de Hess affirme que l\'enthalpie est une fonction d\'état.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La loi de Hess fonctionne car l\'enthalpie dépend uniquement des états initial et final, et non du chemin suivi.' }
        ]
      },
      {
        id: 'reaction_rates',
        name: 'Cinétique chimique',
        description: 'Facteurs influençant la vitesse à laquelle les réactions chimiques se produisent',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Vitesse de réaction', content: 'Vitesse de réaction = variation de concentration / variation de temps. Mesurée par la rapidité avec laquelle les réactifs sont consommés ou les produits se forment.', formula: 'vitesse = Δ[A]/Δt' },
            { title: 'Facteurs influençant la vitesse', content: '1. Concentration : plus de réactif → plus de collisions → vitesse plus élevée. 2. Température : T plus élevée → plus d\'énergie cinétique → plus de collisions efficaces. 3. Surface de contact : plus grande surface exposée → plus de sites de réaction. 4. Catalyseur : abaisse l\'énergie d\'activation, augmente la vitesse.' },
            { title: 'Théorie des collisions', content: 'Pour qu\'une réaction se produise, les particules doivent entrer en collision avec une énergie suffisante (énergie d\'activation) et une orientation correcte. Seulement une fraction des collisions est efficace.' },
            { title: 'Énergie d\'activation', content: 'L\'énergie minimale requise pour qu\'une réaction se produise. Les catalyseurs offrent une voie alternative avec une énergie d\'activation plus faible, augmentant la vitesse de réaction sans être consommés.', formula: 'Ea = énergie d\'activation (kJ/mol)' }
          ]
        },
        experiments: [{
          id: 'rate_experiment',
          name: 'Effet de la concentration sur la vitesse',
          description: 'Comparer les vitesses de réaction de CaCO₃ avec différentes concentrations de HCl',
          chemicals: ['hcl', 'caco3', 'h2o'],
          equipment: ['beaker', 'thermometer'],
          steps: ['Préparer des solutions de HCl à 1 M, 0,5 M et 0,1 M', 'Ajouter des quantités égales de morceaux de CaCO₃ à chacune', 'Observer la vitesse de production de bulles (CO₂)', 'Chronométrer la durée de la réaction', 'Comparer les vitesses'],
          expectedObservations: 'HCl à 1 M produit des bulles rapides. 0,5 M est modéré. 0,1 M est très lent. La vitesse est proportionnelle à la concentration.'
        }],
        quiz: [
          { id: 'q1', question: 'Quel facteur n\'affecte PAS directement la vitesse de réaction ?', type: 'multiple-choice', options: ['Température', 'Concentration', 'Couleur de la solution', 'Surface de contact'], answer: 2, explanation: 'La couleur elle-même n\'affecte pas la vitesse. Les trois autres influencent directement la fréquence et l\'énergie des collisions.' },
          { id: 'q2', question: 'Un catalyseur est consommé lors d\'une réaction chimique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Un catalyseur accélère une réaction en abaissant l\'énergie d\'activation mais N\'est PAS consommé — il est régénéré.' },
          { id: 'q3', question: 'L\'augmentation de la température accroît la vitesse de réaction parce que :', type: 'multiple-choice', options: ['Les particules deviennent plus petites', 'Plus de particules ont suffisamment d\'énergie pour réagir', 'La concentration augmente', 'La surface de contact augmente'], answer: 1, explanation: 'Une température plus élevée donne à plus de particules l\'énergie d\'activation minimale, résultant en plus de collisions efficaces.' },
          { id: 'q4', question: 'Broyer un solide en poudre augmente sa vitesse de réaction.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Broyer augmente la surface de contact, exposant plus de particules à réagir avec l\'autre réactif.' }
        ]
      }
    ]
  },

  grade11: {
    id: 'grade11',
    name: 'Chimie de 1re',
    shortName: '1re',
    color: '#f59e0b',
    icon: '⚡',
    description: 'Chimie organique, électrochimie et analyse chimique',
    topics: [
      {
        id: 'organic_chemistry',
        name: 'Chimie organique',
        description: 'Composés carbonés : hydrocarbures, groupes fonctionnels et réactions',
        icon: '🌿',
        theory: {
          sections: [
            { title: 'Introduction à la chimie organique', content: 'La chimie organique étudie les composés contenant du carbone. Le carbone forme 4 liaisons et peut se lier à lui-même, créant des chaînes et des cycles. La vaste diversité des composés organiques rend la vie possible.' },
            { title: 'Hydrocarbures', content: 'Alcanes (CₙH₂ₙ₊₂) : seulement des liaisons simples C-C, saturés. Alcènes (CₙH₂ₙ) : contiennent une double liaison C=C. Alcynes (CₙH₂ₙ₋₂) : contiennent une triple liaison C≡C. Aromatiques : contiennent un cycle benzénique.' },
            { title: 'Groupes fonctionnels', content: 'Les groupes fonctionnels déterminent la réactivité : -OH (alcool), -COOH (acide carboxylique), -CHO (aldéhyde), -CO- (cétone), -NH₂ (amine), -COO- (ester), -CONH- (amide).' },
            { title: 'Réactions organiques', content: 'Combustion : complète → CO₂ + H₂O. Substitution (alcanes). Addition (alcènes + HX, H₂, Br₂). Estérification : alcool + acide → ester + eau. Fermentation : C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂' }
          ]
        },
        experiments: [{
          id: 'ester_synthesis',
          name: 'Synthèse d\'ester (estérification)',
          description: 'Faire réagir l\'éthanol avec l\'acide acétique pour produire de l\'acétate d\'éthyle (odeur fruitée)',
          chemicals: ['ethanol', 'ch3cooh', 'h2so4'],
          equipment: ['beaker', 'hot_plate', 'condenser'],
          steps: ['Mélanger 10 mL d\'éthanol et 10 mL d\'acide acétique', 'Ajouter 2-3 gouttes de H₂SO₄ comme catalyseur', 'Chauffer doucement pendant 5-10 minutes', 'Refroidir et sentir soigneusement par effluvage', 'Noter l\'odeur fruitée de l\'acétate d\'éthyle'],
          expectedObservations: 'Odeur fruitée (poire/vernis à ongles) de l\'acétate d\'éthyle se forme. CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O'
        }],
        quiz: [
          { id: 'q1', question: 'Quel groupe fonctionnel est caractéristique des alcools ?', type: 'multiple-choice', options: ['-COOH', '-OH', '-CHO', '-NH₂'], answer: 1, explanation: 'Le groupe hydroxyle (-OH) lié à un carbone est le groupe fonctionnel qui définit les alcools.' },
          { id: 'q2', question: 'Les alcanes sont des hydrocarbures insaturés.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Les alcanes sont SATURÉS — ils ne contiennent que des liaisons simples C-C. Les alcènes et les alcynes sont insaturés.' },
          { id: 'q3', question: 'Quel type de réaction produit un ester ?', type: 'multiple-choice', options: ['Combustion', 'Addition', 'Estérification', 'Substitution'], answer: 2, explanation: 'Estérification : alcool + acide carboxylique → ester + eau (avec catalyseur acide, réaction réversible).' },
          { id: 'q4', question: 'La formule générale des alcènes est CₙH₂ₙ.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Les alcènes ont une double liaison C=C, donc chaque double liaison réduit de 2 les atomes H par rapport à la formule de l\'alcane CₙH₂ₙ₊₂.' }
        ]
      },
      {
        id: 'electrochemistry',
        name: 'Électrochimie',
        description: 'Piles galvaniques, électrolyse, potentiels d\'électrode et lois de Faraday',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Piles galvaniques (voltaïques)', content: 'Les piles galvaniques convertissent l\'énergie chimique en énergie électrique par des réactions redox spontanées. La pile comporte deux demi-piles reliées par un pont salin. Les électrons circulent de l\'anode (oxydation) vers la cathode (réduction).' },
            { title: 'Potentiels standard d\'électrode', content: 'Les valeurs E° mesurent la tendance à être réduit. E° plus positif = meilleur agent oxydant. FEM de la pile : E°pile = E°cathode - E°anode. Exemple : pile Cu/Zn E° = 0,34 - (-0,76) = 1,10 V', formula: 'E°pile = E°cathode - E°anode' },
            { title: 'Électrolyse', content: 'L\'électrolyse utilise l\'énergie électrique pour conduire des réactions redox non spontanées. Une source d\'alimentation externe force les électrons à circuler en sens inverse. Utilisée pour le dépôt électrolytique, l\'électrolyse de l\'eau (H₂O → H₂ + O₂).' },
            { title: 'Lois de Faraday', content: 'Première loi : la masse déposée ∝ quantité de charge. Deuxième loi : la masse ∝ masse molaire / nombre de charges. Q = It (charge = courant × temps)', formula: 'm = (Q × M) / (n × F) où F = 96485 C/mol' }
          ]
        },
        experiments: [{
          id: 'galvanic_cell_exp',
          name: 'Pile galvanique zinc-cuivre',
          description: 'Construire une pile galvanique Zn-Cu et mesurer sa tension',
          chemicals: ['cuso4', 'h2so4', 'zn', 'cu'],
          equipment: ['galvanic_cell', 'conductivity_meter', 'beaker'],
          steps: ['Installer deux béchers : un avec CuSO₄, un avec ZnSO₄', 'Placer l\'électrode Cu dans CuSO₄, Zn dans ZnSO₄', 'Relier avec un pont salin (KNO₃ saturé)', 'Connecter le voltmètre entre les électrodes', 'Mesurer la tension (environ 1,1 V)', 'Observer le dépôt de cuivre sur l\'électrode Cu'],
          expectedObservations: 'Lecture de tension ~1,1 V. L\'anode Zn se dissout lentement (oxydation). La cathode Cu gagne de la masse (réduction : Cu²⁺ → Cu).'
        }],
        quiz: [
          { id: 'q1', question: 'Dans une pile galvanique, l\'oxydation se produit à :', type: 'multiple-choice', options: ['La cathode', 'L\'anode', 'Le pont salin', 'L\'électrolyte'], answer: 1, explanation: 'L\'anode = OXydation. L\'anode perd des électrons — c\'est là que se produit l\'oxydation.' },
          { id: 'q2', question: 'L\'électrolyse convertit l\'énergie chimique en énergie électrique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! C\'est l\'inverse — l\'électrolyse utilise l\'énergie ÉLECTRIQUE pour conduire des réactions chimiques (non spontanées).' },
          { id: 'q3', question: 'Si E°cathode = +0,34 V et E°anode = -0,76 V, quelle est la valeur de E°pile ?', type: 'multiple-choice', options: ['0,42 V', '1,10 V', '-0,42 V', '0,76 V'], answer: 1, explanation: 'E°pile = E°cathode - E°anode = 0,34 - (-0,76) = 0,34 + 0,76 = 1,10 V' },
          { id: 'q4', question: 'Un E°pile positif indique une réaction spontanée.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Un potentiel de pile positif (E°pile > 0) signifie que la réaction est spontanée (ΔG < 0).' }
        ]
      }
    ]
  },

  grade12: {
    id: 'grade12',
    name: 'Chimie de Terminale',
    shortName: 'Term.',
    color: '#ef4444',
    icon: '🎓',
    description: 'Sujets avancés : titrage, électrolyse, redox et chimie analytique',
    topics: [
      {
        id: 'titration',
        name: 'Titrage',
        description: 'Analyse acide-base quantitative par des techniques de titrage',
        icon: '💧',
        theory: {
          sections: [
            { title: 'Qu\'est-ce que le titrage ?', content: 'Le titrage est une technique analytique quantitative permettant de déterminer la concentration inconnue d\'une solution. Une solution de concentration connue (titrant) est soigneusement ajoutée à une solution inconnue jusqu\'à ce que la réaction soit complète (point d\'équivalence).' },
            { title: 'Types de titrage', content: 'Titrage acide-base : le plus courant, utilise des indicateurs. Titrage redox : utilise KMnO₄ ou I₂ (sans indicateur nécessaire). Complexométrique : utilise l\'EDTA. Précipitation : forme un produit insoluble. Titrage en retour : ajouter un excès puis titrer l\'excès.' },
            { title: 'Point d\'équivalence vs. point de virage', content: 'Point d\'équivalence : moles d\'acide = moles de base (théorique). Point de virage : quand l\'indicateur change de couleur (pratique). Ces deux points doivent être aussi proches que possible. Le choix de l\'indicateur dépend du pH au point d\'équivalence.' },
            { title: 'Calculs de titrage', content: 'Au point d\'équivalence : n(acide) = n(base). Donc : C_acide × V_acide = C_base × V_base', formula: 'C₁V₁ = C₂V₂ (pour les réactions 1:1)' }
          ]
        },
        experiments: [{
          id: 'titration_exp',
          name: 'Titrage acide-base',
          description: 'Déterminer la concentration de NaOH inconnu à l\'aide de HCl standard et de phénolphtaléine',
          chemicals: ['hcl', 'naoh', 'phenolphthalein'],
          equipment: ['burette', 'erlenmeyer', 'pipette', 'beaker'],
          steps: [
            'Rincer la burette avec la solution de HCl standard',
            'Remplir la burette avec 0,1 M HCl standard, noter le volume initial',
            'Prélever exactement 25,0 mL de NaOH inconnu à la pipette dans le flacon Erlenmeyer',
            'Ajouter 3 gouttes d\'indicateur phénolphtaléine (la solution devient rose)',
            'Ajouter HCl depuis la burette goutte à goutte, en agitant après chaque ajout',
            'Près du point de virage, ajouter HCl une goutte à la fois',
            'Arrêter quand la couleur rose disparaît définitivement',
            'Relever la lecture finale de la burette',
            'Calculer : C(HCl) × V(HCl) = C(NaOH) × V(NaOH)'
          ],
          expectedObservations: 'La phénolphtaléine rose devient incolore au point de virage. Calculer la concentration inconnue de NaOH à partir du volume de HCl utilisé.'
        }],
        quiz: [
          { id: 'q1', question: 'La phénolphtaléine est incolore en milieu acide et rose en solution basique.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La phénolphtaléine est incolore à pH < 8,2 et rose/magenta à pH > 8,2.' },
          { id: 'q2', question: 'Si 20 mL de HCl à 0,5 M neutralise du NaOH, combien de moles de NaOH étaient présentes ?', type: 'multiple-choice', options: ['0,01 mol', '0,02 mol', '0,04 mol', '0,1 mol'], answer: 0, explanation: 'n(HCl) = C×V = 0,5 × 0,020 = 0,01 mol. Comme HCl:NaOH = 1:1, n(NaOH) = 0,01 mol.' },
          { id: 'q3', question: 'Le point d\'équivalence est là où l\'indicateur change de couleur.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! Le point de virage est là où l\'indicateur change de couleur. Le point d\'équivalence est le point théorique où les moles sont égales.' },
          { id: 'q4', question: 'Dans un titrage en retour, on :', type: 'multiple-choice', options: ['Effectuer le titrage en sens inverse', 'Ajouter un excès de réactif puis titrer l\'excès', 'Utiliser deux indicateurs', 'Effectuer le titrage à basse température'], answer: 1, explanation: 'Le titrage en retour ajoute un excès connu de réactif, puis titre l\'excès qui n\'a pas réagi pour déterminer la quantité ayant réagi avec l\'inconnu.' }
        ]
      },
      {
        id: 'redox',
        name: 'Réactions redox',
        description: 'Réactions d\'oxydoréduction, équilibrage des équations redox et applications',
        icon: '⚖️',
        theory: {
          sections: [
            { title: 'Oxydation et réduction', content: 'Oxydation = perte d\'électrons (OIL). Réduction = gain d\'électrons (RIG). Moyen mnémotechnique : OIL RIG. Elles se produisent toujours ensemble (d\'où « redox »). L\'agent réducteur est oxydé ; l\'agent oxydant est réduit.' },
            { title: 'États d\'oxydation', content: 'Règles d\'attribution des états d\'oxydation : Élément pur = 0. Ion monoatomique = charge. O = -2 (sauf peroxydes). H = +1 (sauf hydrures métalliques). Somme des EO = charge de la molécule.' },
            { title: 'Équilibrage des équations redox', content: 'Méthode des demi-réactions : 1) Écrire les demi-réactions d\'oxydation et de réduction séparément. 2) Équilibrer les atomes. 3) Équilibrer les électrons. 4) Combiner les demi-réactions. 5) Vérifier les atomes et les charges.' },
            { title: 'Dismutation', content: 'Réaction redox spéciale où une espèce est simultanément oxydée et réduite. Exemple : Cl₂ + 2NaOH → NaCl + NaOCl + H₂O. Cl₂ (0) → Cl⁻ (-1, réduit) et OCl⁻ (+1, oxydé).' }
          ]
        },
        experiments: [{
          id: 'kmno4_titration',
          name: 'Titrage redox au permanganate',
          description: 'Déterminer la concentration de Fe²⁺ en utilisant KMnO₄ (auto-indicateur)',
          chemicals: ['kmno4', 'h2so4', 'fe'],
          equipment: ['burette', 'erlenmeyer', 'beaker'],
          steps: ['Dissoudre du fil de fer dans H₂SO₄ dilué pour obtenir une solution de Fe²⁺', 'Ajouter un excès de H₂SO₄ pour assurer des conditions acides', 'Remplir la burette avec la solution de KMnO₄', 'Ajouter KMnO₄ depuis la burette', 'Le KMnO₄ violet est décoloré par Fe²⁺', 'Au point de virage, une goutte donne un rose permanent', 'Calculer la concentration de Fe²⁺'],
          expectedObservations: 'Le KMnO₄ violet est instantanément décoloré. Au point de virage, rose clair permanent. MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O'
        }],
        quiz: [
          { id: 'q1', question: 'OIL RIG signifie :', type: 'multiple-choice', options: ['L\'oxygène est perdu, la réduction est gagnée', 'L\'oxydation est une perte, la réduction est un gain', 'L\'oxyde en liquide, la réduction en gaz', 'L\'oxydant est faible, le réducteur est puissant'], answer: 1, explanation: 'OIL RIG : Oxydation est une perte (d\'électrons), Réduction est un gain (d\'électrons). Le mnémotechnique essentiel du redox.' },
          { id: 'q2', question: 'Dans MnO₄⁻, l\'état d\'oxydation de Mn est +7.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! Chaque O = -2, total des 4 O = -8. Charge de l\'ion = -1. Donc Mn + (-8) = -1, Mn = +7.' },
          { id: 'q3', question: 'Lorsqu\'une substance est oxydée, elle :', type: 'multiple-choice', options: ['Gagne des électrons', 'Perd des protons', 'Perd des électrons', 'Gagne des protons'], answer: 2, explanation: 'Oxydation = perte d\'électrons. La substance perd des électrons au profit de l\'agent oxydant.' },
          { id: 'q4', question: 'L\'agent réducteur est la substance qui est réduite.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! L\'agent RÉDUCTEUR est OXYDÉ (il perd des électrons et provoque la réduction de l\'autre substance).' }
        ]
      },
      {
        id: 'electrolysis',
        name: 'Électrolyse',
        description: 'Utiliser l\'électricité pour conduire des réactions chimiques : applications et lois de Faraday',
        icon: '⚡',
        theory: {
          sections: [
            { title: 'Bases de l\'électrolyse', content: 'L\'électrolyse utilise l\'énergie électrique pour conduire des réactions redox non spontanées. Une source d\'alimentation externe force la circulation des électrons : les cations migrent vers la cathode (réduction), les anions vers l\'anode (oxydation).' },
            { title: 'Produits de l\'électrolyse', content: 'NaCl fondu : cathode → métal Na, anode → gaz Cl₂. Électrolyse de l\'eau : cathode → H₂, anode → O₂. CuSO₄ aqueux avec électrodes Cu : cathode → Cu déposé, anode → Cu dissous.' },
            { title: 'Première loi de Faraday', content: 'La masse de substance déposée ou dissoute à une électrode est proportionnelle à la quantité de charge passée : m ∝ Q = It', formula: 'm = (Q × M)/(n × F) où F = 96485 C/mol' },
            { title: 'Électrodépôt', content: 'L\'électrodépôt utilise l\'électrolyse pour déposer une fine couche de métal sur un objet. Objet = cathode, source de métal = anode, électrolyte = solution de sel métallique. Applications : chromage, argenture, dorure.' }
          ]
        },
        experiments: [{
          id: 'water_electrolysis',
          name: 'Électrolyse de l\'eau',
          description: 'Décomposer l\'eau en hydrogène et en oxygène gazeux par électrolyse',
          chemicals: ['h2o', 'na2co3'],
          equipment: ['electrolysis', 'beaker', 'conductivity_meter'],
          steps: ['Dissoudre Na₂CO₃ dans l\'eau (améliore la conductivité)', 'Installer l\'appareil d\'électrolyse avec des électrodes en carbone', 'Connecter à une alimentation CC (6-12 V)', 'Observer la formation de bulles aux deux électrodes', 'Cathode : 2H₂O + 2e⁻ → H₂ + 2OH⁻', 'Anode : 2H₂O → O₂ + 4H⁺ + 4e⁻', 'Rapport H₂:O₂ = 2:1 en volume'],
          expectedObservations: 'Deux fois plus de gaz à la cathode (H₂) qu\'à l\'anode (O₂). Bilan : 2H₂O → 2H₂ + O₂'
        }],
        quiz: [
          { id: 'q1', question: 'En électrolyse, que se passe-t-il à la cathode ?', type: 'multiple-choice', options: ['Oxydation', 'Réduction', 'Rien', 'Neutralisation'], answer: 1, explanation: 'À la cathode : les cations gagnent des électrons → la RÉDUCTION se produit. (CAThode = réduction des CATions)' },
          { id: 'q2', question: 'En électrodépôt, l\'objet à plaquer sert d\'anode.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 1, explanation: 'Faux ! L\'objet à plaquer est la CATHODE. L\'anode est le métal source (par ex., cuivre pur pour le placage au cuivre).' },
          { id: 'q3', question: 'Lors de l\'électrolyse de l\'eau, qu\'est-ce qui est produit à la cathode ?', type: 'multiple-choice', options: ['Gaz oxygène', 'Gaz chlore', 'Gaz hydrogène', 'Eau'], answer: 2, explanation: 'À la cathode : 2H₂O + 2e⁻ → H₂↑ + 2OH⁻. Le gaz hydrogène est produit à la cathode.' },
          { id: 'q4', question: 'La constante de Faraday est approximativement 96485 C/mol.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! La constante de Faraday F = 96485 C/mol représente la charge d\'une mole d\'électrons.' }
        ]
      },
      {
        id: 'galvanic_cells',
        name: 'Piles galvaniques',
        description: 'Cellules électrochimiques qui génèrent de l\'électricité à partir de réactions redox spontanées',
        icon: '🔋',
        theory: {
          sections: [
            { title: 'Construction de la pile', content: 'Une pile galvanique comprend : une anode (négative, oxydation), une cathode (positive, réduction), un pont salin (maintient la neutralité électrique), un circuit externe (flux d\'électrons de l\'anode vers la cathode).' },
            { title: 'Notation standard des piles', content: 'Notation de pile : Anode | solution anode || solution cathode | cathode. Exemple : Zn | Zn²⁺ || Cu²⁺ | Cu (pile de Daniell). || représente le pont salin.' },
            { title: 'Équation de Nernst', content: 'Le potentiel de pile varie avec la concentration. Dans des conditions non standard :', formula: 'E = E° - (RT/nF)ln(Q) ≈ E° - (0,0592/n)log(Q) à 25°C' },
            { title: 'Piles commerciales', content: 'Pile sèche (Leclanché) : anode Zn, cathode MnO₂/C. Pile alcaline : durée de vie plus longue, courant plus élevé. Batterie plomb-acide (voiture) : Pb/PbO₂, rechargeable. Li-ion : haute densité d\'énergie, utilisée dans les téléphones/ordinateurs. Piles à combustible : H₂ + O₂ → H₂O + électricité.' }
          ]
        },
        experiments: [{
          id: 'fruit_battery',
          name: 'Pile au citron',
          description: 'Créer une pile galvanique en utilisant l\'acide citrique d\'un citron avec des électrodes Zn et Cu',
          chemicals: ['ch3cooh'],
          equipment: ['galvanic_cell', 'conductivity_meter'],
          steps: ['Insérer une lamelle de zinc (Zn) dans le citron', 'Insérer une lamelle de cuivre (Cu) dans le même citron', 'Garder les électrodes séparées (ne pas se toucher à l\'intérieur)', 'Connecter le voltmètre aux électrodes', 'Mesurer la tension', 'Connecter plusieurs citrons en série pour une tension plus élevée'],
          expectedObservations: 'Tension ~0,5-1,0 V par citron. Le Zn est l\'anode (oxydé), le Cu est la cathode (réduit). Le jus de citron (acide citrique) = électrolyte.'
        }],
        quiz: [
          { id: 'q1', question: 'Dans la notation de pile Zn|Zn²⁺||Cu²⁺|Cu, quelle est l\'anode ?', type: 'multiple-choice', options: ['Cu', 'Cu²⁺', 'Zn', 'Zn²⁺'], answer: 2, explanation: 'L\'anode est écrite en premier (côté gauche) : Zn. Le zinc est oxydé : Zn → Zn²⁺ + 2e⁻' },
          { id: 'q2', question: 'L\'électrode standard à hydrogène (ESH) a E° = 0,00 V par définition.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! L\'ESH (2H⁺ + 2e⁻ → H₂) est le point de référence E° = 0,000 V pour tous les potentiels d\'électrode.' },
          { id: 'q3', question: 'Quelle pile commerciale est rechargeable ?', type: 'multiple-choice', options: ['Pile sèche Leclanché', 'Pile alcaline', 'Batterie plomb-acide', 'Pile zinc-carbone'], answer: 2, explanation: 'Les batteries plomb-acide (batteries de voiture) sont rechargeables. Les piles sèches et alcalines sont des piles primaires (non rechargeables).' },
          { id: 'q4', question: 'L\'équation de Nernst ajuste le potentiel de pile pour des concentrations non standard.', type: 'true-false', options: ['Vrai', 'Faux'], answer: 0, explanation: 'Vrai ! E = E° - (0,0592/n)log Q permet de calculer la FEM à n\'importe quelle concentration, pas seulement à 1 M standard.' }
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
