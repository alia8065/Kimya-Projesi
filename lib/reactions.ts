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
        "L'acide chlorhydrique réagit avec l'hydroxyde de sodium dans une neutralisation acide-base classique. Les ions H⁺ de HCl se combinent avec les ions OH⁻ de NaOH pour former de l'eau, et les ions Na⁺ et Cl⁻ restent en solution sous forme de chlorure de sodium.",
      observations: [
        'La solution se réchauffe (réaction exothermique)',
        'Le pH diminue depuis un milieu fortement basique vers la neutralité',
        "Aucun changement de couleur visible en l'absence d'indicateur",
        'Avec indicateur phénolphtaléine : la solution rose devient incolore',
      ],
      equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: 'Rose → incolore (avec phénolphtaléine)',
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
        "L'acide sulfurique réagit avec l'hydroxyde de sodium dans une neutralisation fortement exothermique. Deux moles de NaOH sont nécessaires pour neutraliser complètement une mole de H₂SO₄, produisant du sulfate de sodium et de l'eau.",
      observations: [
        'Une chaleur importante est libérée – la solution devient très chaude',
        'Le pH remonte vers la neutralité à mesure que NaOH est ajouté',
        'Aucun précipité ni gaz formé',
        "Avec phénolphtaléine : reste incolore en milieu acide, vire au rose au point d'équivalence",
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
        "Le nitrate d'argent réagit avec le chlorure de sodium dans une réaction de précipitation. Les ions argent (Ag⁺) se combinent avec les ions chlorure (Cl⁻) pour former le chlorure d'argent (AgCl), un précipité blanc insoluble, tandis que le nitrate de sodium reste en solution.",
      observations: [
        'Un précipité blanc se forme immédiatement (AgCl)',
        'Le précipité caille et est insoluble dans les acides dilués',
        'Le précipité vire au gris/violet à la lumière du soleil (photosensibilité)',
        'La solution reste claire autour du précipité',
      ],
      equation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Incolore → précipité blanc',
      precipitate: 'AgCl (blanc)',
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
        "Le sulfate de cuivre(II) réagit avec l'hydroxyde de sodium dans une réaction de précipitation. Les ions Cu²⁺ bleus réagissent avec les ions OH⁻ pour produire l'hydroxyde de cuivre(II), un précipité gélatineux bleu pâle/turquoise.",
      observations: [
        'Un précipité gélatineux bleu de Cu(OH)₂ se forme',
        'La solution passe du bleu vif à un bleu plus clair puis pâle',
        'Le précipité est soluble dans un excès de NaOH (formant le complexe bleu intense [Cu(OH)₄]²⁻)',
        'En chauffant, le précipité devient noir (formation de CuO)',
      ],
      equation: 'CuSO₄(aq) + 2 NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Solution bleue → précipité bleu pâle',
      precipitate: 'Cu(OH)₂ (bleu/turquoise)',
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
        "Le carbonate de calcium réagit avec l'acide chlorhydrique. L'ion carbonate réagit avec les ions H⁺ pour former l'acide carbonique (H₂CO₃), qui se décompose immédiatement en eau et en dioxyde de carbone gazeux.",
      observations: [
        'Effervescence vigoureuse (bulles de CO₂) depuis le calcaire/marbre',
        'Le CaCO₃ solide se dissout progressivement',
        "Du CO₂ gazeux incolore est produit (trouble l'eau de chaux)",
        'La solution se réchauffe légèrement',
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
        "Le magnésium métallique réagit vigoureusement avec l'acide chlorhydrique. Le magnésium est oxydé (perd des électrons) tandis que les ions H⁺ sont réduits en hydrogène gazeux. La vitesse de réaction est nettement plus rapide qu'avec le fer ou le zinc dans HCl.",
      observations: [
        "Bullage vigoureux de gaz H₂ à la surface du métal",
        'Le ruban de magnésium se dissout rapidement',
        'La solution se réchauffe (exothermique)',
        'Le métal finit par disparaître complètement',
        "Du gaz H₂ incolore est produit (inflammable – claquement sec avec une allumette enflammée)",
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
        "Le zinc réagit avec l'acide sulfurique dilué dans une réaction de déplacement simple. Le zinc est plus réactif que l'hydrogène, il déplace donc l'hydrogène de l'acide pour former du sulfate de zinc et du gaz hydrogène.",
      observations: [
        "Production régulière de bulles de gaz hydrogène",
        'Le métal zinc se dissout progressivement',
        'La solution reste incolore (ZnSO₄ est incolore)',
        'Légère chaleur dégagée par la solution',
        "Le gaz H₂ est confirmé par le test du claquement sec",
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
        "Le fer réagit avec l'acide chlorhydrique pour produire du chlorure de fer(II) et du gaz hydrogène. La réaction progresse plus lentement qu'avec le magnésium ou le zinc, ce qui reflète la réactivité moindre du fer.",
      observations: [
        "Production de bulles lente à modérée (H₂)",
        'La surface du métal ferreux devient piquée',
        'La solution vire progressivement au vert pâle (FeCl₂)',
        'Le fer se dissout avec le temps',
        'De la chaleur est libérée lentement',
      ],
      equation: 'Fe(s) + 2 HCl(aq) → FeCl₂(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Incolore → vert pâle',
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
        "Le permanganate de potassium oxyde le peroxyde d'hydrogène dans une réaction d'oxydo-réduction en milieu acide. Le permanganate violet intense est réduit en Mn²⁺ incolore, tandis que H₂O₂ est oxydé en oxygène gazeux.",
      observations: [
        'La couleur violette intense de KMnO₄ s\'estompe et disparaît',
        'La solution devient incolore lorsque tout le KMnO₄ est consommé',
        "Effervescence vigoureuse de gaz O₂",
        'De la chaleur est libérée – la solution se réchauffe',
        'La réaction s\'accélère car Mn²⁺ joue le rôle d\'autocatalyseur',
      ],
      equation:
        '2 KMnO₄(aq) + 5 H₂O₂(aq) + 3 H₂SO₄(aq) → 2 MnSO₄(aq) + K₂SO₄(aq) + 8 H₂O(l) + 5 O₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Violet → incolore',
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
        "Le chlorure d'hydrogène gazeux réagit avec l'ammoniac gazeux dans une réaction acide-base pour former le chlorure d'ammonium. Lorsque les gaz se rencontrent, une fumée blanche dense de NH₄Cl solide apparaît immédiatement.",
      observations: [
        "Fumée blanche dense ou vapeur (aérosol de NH₄Cl) apparaît",
        'Un solide blanc se dépose sur les surfaces froides',
        "L'odeur âcre et piquante diminue à mesure que les gaz réagissent",
        'La réaction est instantanée lors du mélange des gaz',
      ],
      equation: 'HCl(g) + NH₃(g) → NH₄Cl(s)',
      reactionType: 'synthesis',
      isExothermic: true,
      colorChange: 'Fumée blanche dense',
      precipitate: 'NH₄Cl (solide blanc)',
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
        "Le carbonate de sodium réagit avec l'acide chlorhydrique pour produire du chlorure de sodium, de l'eau et du dioxyde de carbone gazeux. L'ion carbonate agit comme une base en acceptant les protons de l'acide.",
      observations: [
        "Effervescence – des bulles de CO₂ sont produites",
        'Le Na₂CO₃ solide ou dissous réagit aisément',
        'La solution se réchauffe légèrement',
        "Le CO₂ trouble l'eau de chaux s'il y est barboté",
        'Le pH diminue vers la neutralité',
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
        "L'acide sulfurique réagit avec l'hydroxyde de potassium dans une réaction de neutralisation, formant du sulfate de potassium et de l'eau. Deux moles de KOH sont nécessaires par mole de H₂SO₄.",
      observations: [
        'Une chaleur considérable est libérée',
        'Le pH remonte vers 7 à mesure que KOH est ajouté',
        'Aucun précipité ni gaz formé',
        "Changement de couleur de l'indicateur au point d'équivalence",
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
        "L'acide acétique (un acide faible) réagit avec l'hydroxyde de sodium (une base forte) dans une réaction de neutralisation, produisant de l'acétate de sodium (un sel) et de l'eau. Le pH au point d'équivalence est supérieur à 7 en raison de la nature acide faible–base forte.",
      observations: [
        "Légère chaleur libérée (moins qu'acide fort + base forte)",
        "L'odeur de vinaigre diminue à mesure que l'acide est consommé",
        "Le pH monte vers ~8,7 au point d'équivalence",
        "Avec phénolphtaléine : couleur rose au point d'équivalence (au-dessus de pH 8)",
      ],
      equation: 'CH₃COOH(aq) + NaOH(aq) → CH₃COONa(aq) + H₂O(l)',
      reactionType: 'neutralization',
      isExothermic: true,
      colorChange: 'Rose au point d\'équivalence avec phénolphtaléine',
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
        "Le zinc métallique réagit avec l'acide chlorhydrique dans une réaction de déplacement simple. Le zinc est oxydé et déplace l'hydrogène de l'acide, formant du chlorure de zinc et du gaz hydrogène.",
      observations: [
        "Bullage régulier de gaz H₂",
        'Le zinc se dissout progressivement',
        'La solution reste incolore',
        'Légère chaleur dégagée par la solution',
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
        "Le permanganate de potassium agit comme catalyseur pour décomposer rapidement le peroxyde d'hydrogène en eau et en oxygène. Cette réaction est utilisée pour illustrer la décomposition catalytique.",
      observations: [
        "Dégagement rapide et vigoureux de gaz O₂",
        "Mousse spectaculaire en présence de savon (dentifrice d'éléphant)",
        'La solution se réchauffe rapidement',
        'La couleur violette de KMnO₄ s\'estompe à mesure que Mn²⁺ se forme',
        "Une braise rallumée dans l'atmosphère riche en oxygène",
      ],
      equation: '2 H₂O₂(aq) → 2 H₂O(l) + O₂(g)↑  [KMnO₄ catalyst]',
      reactionType: 'decomposition',
      isExothermic: true,
      colorChange: 'Violet → incolore',
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
        "Le fer réagit avec l'acide sulfurique dilué pour produire du sulfate de fer(II) et du gaz hydrogène. La réaction est plus lente qu'avec le magnésium ou le zinc mais produit les ions Fe²⁺ caractéristiques de couleur vert pâle.",
      observations: [
        "Bullage de gaz H₂ lent à modéré",
        'La surface du fer devient piquée et noircie',
        'La solution vire au vert pâle (ions Fe²⁺ dans FeSO₄)',
        'Légère chaleur libérée',
      ],
      equation: 'Fe(s) + H₂SO₄(aq) → FeSO₄(aq) + H₂(g)↑',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Incolore → vert pâle',
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
        "Le cuivre ne réagit pas avec l'acide sulfurique dilué, mais réagit avec H₂SO₄ concentré et chaud dans une réaction d'oxydo-réduction. Le cuivre est oxydé en Cu²⁺ et le sulfate est réduit en dioxyde de soufre.",
      observations: [
        'La solution devient bleue (CuSO₄ formé)',
        'Un gaz SO₂ suffocant et piquant est libéré',
        "Le cuivre se dissout lentement dans l'acide chaud",
        'Changement de couleur de incolore à bleu',
      ],
      equation: 'Cu(s) + 2 H₂SO₄(conc., hot) → CuSO₄(aq) + SO₂(g)↑ + 2 H₂O(l)',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Incolore → bleu',
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
        "Le permanganate de potassium réagit avec l'acide chlorhydrique concentré dans une réaction d'oxydo-réduction. Le permanganate (Mn⁷⁺) est réduit en Mn²⁺ tandis que les ions chlorure sont oxydés en chlore gazeux.",
      observations: [
        'La solution violette de KMnO₄ se décolore',
        'Du gaz chlore jaune-vert (Cl₂) est libéré – toxique !',
        'Odeur piquante de gaz chlore',
        'La solution devient incolore/pâle',
      ],
      equation:
        '2 KMnO₄(aq) + 16 HCl(aq) → 2 KCl(aq) + 2 MnCl₂(aq) + 5 Cl₂(g)↑ + 8 H₂O(l)',
      reactionType: 'redox',
      isExothermic: true,
      colorChange: 'Violet → incolore avec gaz Cl₂ vert',
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
        "L'éthanol subit une combustion complète en excès d'oxygène pour produire du dioxyde de carbone et de la vapeur d'eau. La réaction est fortement exothermique et produit une flamme bleue propre.",
      observations: [
        'Flamme bleue brûlant proprement',
        'Chaleur et lumière produites',
        'CO₂ et vapeur H₂O libérés',
        'Aucune suie produite (combustion complète)',
        'Température de flamme d\'environ 1 000 °C',
      ],
      equation: 'C₂H₅OH(l) + 3 O₂(g) → 2 CO₂(g) + 3 H₂O(g)',
      reactionType: 'combustion',
      isExothermic: true,
      colorChange: 'Flamme bleue',
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
        "Le fer déplace le cuivre de la solution de sulfate de cuivre dans une réaction de déplacement simple. Le fer est plus réactif que le cuivre, il réduit donc les ions Cu²⁺ en cuivre métallique tout en étant oxydé en Fe²⁺.",
      observations: [
        'La solution bleue de CuSO₄ devient vert pâle (FeSO₄)',
        'Du cuivre métallique brun-rouge se dépose sur la surface de fer',
        'Un clou ou une lamelle de fer se recouvre progressivement de cuivre',
        'La couleur de la solution passe du bleu au vert',
      ],
      equation: 'Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓',
      reactionType: 'redox',
      isExothermic: false,
      colorChange: 'Bleu → vert pâle',
      precipitate: 'Cu (métal brun-rouge)',
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
        "Le carbonate de sodium réagit avec l'acide sulfurique pour produire du sulfate de sodium, de l'eau et du dioxyde de carbone. La réaction se déroule en deux étapes : formation d'abord du bicarbonate de sodium, puis décomposition.",
      observations: [
        "Effervescence vigoureuse de CO₂",
        'Le pH chute du milieu alcalin vers la neutralité',
        'Légère chaleur dégagée par la solution',
        'Le Na₂CO₃ solide se dissout rapidement',
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
        "Le nitrate d'argent réagit avec l'acide chlorhydrique pour produire un précipité blanc de chlorure d'argent et de l'acide nitrique. C'est un test classique pour détecter la présence d'ions chlorure.",
      observations: [
        "Un précipité blanc caillé d'AgCl se forme immédiatement",
        "Le précipité est insoluble dans HNO₃ dilué",
        'Le précipité vire au violet/gris à la lumière du soleil (photodécomposition)',
        'La solution reste acide',
      ],
      equation: 'AgNO₃(aq) + HCl(aq) → AgCl(s)↓ + HNO₃(aq)',
      reactionType: 'precipitation',
      isExothermic: false,
      colorChange: 'Incolore → précipité blanc',
      precipitate: 'AgCl (blanc, caillé)',
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
        "Le zinc déplace le cuivre de la solution de sulfate de cuivre. Le zinc est plus réactif que le cuivre et réduit les Cu²⁺ en cuivre métallique tout en étant oxydé en Zn²⁺.",
      observations: [
        'La solution bleue de CuSO₄ s\'estompe progressivement jusqu\'à devenir incolore',
        'La surface du zinc se recouvre de cuivre rougeâtre',
        'La solution devient incolore (ZnSO₄ est incolore)',
        'Le zinc se dissout tandis que le cuivre se dépose',
      ],
      equation: 'Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)',
      reactionType: 'redox',
      isExothermic: false,
      colorChange: 'Bleu → incolore',
      precipitate: 'Cu (brun-rouge)',
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
        "Le magnésium réagit vigoureusement avec l'acide sulfurique dilué pour produire du sulfate de magnésium et du gaz hydrogène. Le magnésium est très réactif et la réaction est plus rapide qu'avec le fer ou le zinc.",
      observations: [
        "Bullage très vigoureux de gaz H₂",
        'Le ruban de magnésium se dissout rapidement',
        'Une chaleur considérable est libérée',
        'La solution se réchauffe notablement',
        "Du gaz H₂ incolore confirmé par le test du claquement sec",
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
        "Le peroxyde d'hydrogène se décompose lentement en eau et en oxygène gazeux dans des conditions normales. La vitesse augmente significativement en présence de catalyseurs (MnO₂, KMnO₄, enzymes comme la catalase).",
      observations: [
        "Très lent dégagement de gaz O₂ à température ambiante",
        'Décomposition plus rapide en cas de chauffage ou d\'ajout d\'un catalyseur',
        'Aucun changement de couleur visible',
        "Le test à la braise confirme la production de O₂",
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
    "Aucune réaction ne se produit entre les produits chimiques sélectionnés dans les conditions normales de laboratoire. Les produits chimiques peuvent être incompatibles ou nécessiter des conditions différentes (chaleur, pression, catalyseur) pour réagir.",
  observations: ['Aucun changement visible', 'Aucun gaz produit', 'Aucun précipité formé', 'La température reste constante'],
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
            description: `[Réaction dominante entre ${reactants[i]} et ${reactants[j]}]: ${result.description}`,
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
