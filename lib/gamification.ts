export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Level {
  level: number;
  name: string;
  xpRequired: number;
  icon: string;
}

export interface UserStats {
  experimentsRun: number;
  reactionsDiscovered: number;
  quizzesCompleted: number;
  quizCorrect: number;
  topicsCompleted: number;
  dailyChallengesCompleted: number;
  currentStreak: number;
  xp: number;
}

export const BADGES: Badge[] = [
  { id: 'first_experiment', name: 'First Steps', description: 'Run your first experiment', icon: '🧪', rarity: 'common' },
  { id: 'reaction_master', name: 'Reaction Master', description: 'Discover 10 different reactions', icon: '⚗️', rarity: 'rare' },
  { id: 'safety_first', name: 'Safety First', description: 'Read safety info for 5 chemicals', icon: '🛡️', rarity: 'common' },
  { id: 'quiz_champion', name: 'Quiz Champion', description: 'Score 100% on 3 quizzes', icon: '🏆', rarity: 'epic' },
  { id: 'daily_challenge', name: 'Daily Challenger', description: 'Complete a daily challenge', icon: '📅', rarity: 'common' },
  { id: 'acid_base_expert', name: 'Acid-Base Expert', description: 'Complete all acid-base experiments', icon: '🔬', rarity: 'rare' },
  { id: 'precipitation_pro', name: 'Precipitation Pro', description: 'Observe 5 precipitation reactions', icon: '❄️', rarity: 'rare' },
  { id: 'gas_evolution', name: 'Gas Evolution', description: 'Produce gas in 3 reactions', icon: '💨', rarity: 'common' },
  { id: 'electrochemistry', name: 'Electrochemistry Expert', description: 'Complete all electrochemistry topics', icon: '⚡', rarity: 'epic' },
  { id: 'chemistry_graduate', name: 'Chemistry Graduate', description: 'Complete the full Grade 12 curriculum', icon: '🎓', rarity: 'legendary' },
  { id: 'curious_mind', name: 'Curious Mind', description: 'Ask the AI tutor 10 questions', icon: '🧠', rarity: 'common' },
  { id: 'streak_7', name: 'Week Warrior', description: '7-day learning streak', icon: '🔥', rarity: 'rare' },
  { id: 'topic_explorer', name: 'Topic Explorer', description: 'Complete 5 different topics', icon: '🗺️', rarity: 'common' },
  { id: 'redox_master', name: 'Redox Master', description: 'Master all redox reactions', icon: '⚖️', rarity: 'epic' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all daily challenges in a week', icon: '🌟', rarity: 'legendary' },
];

export const LEVELS: Level[] = [
  { level: 1, name: 'Lab Assistant', xpRequired: 0, icon: '👨‍🔬' },
  { level: 2, name: 'Chemistry Student', xpRequired: 100, icon: '🧑‍🎓' },
  { level: 3, name: 'Junior Chemist', xpRequired: 250, icon: '🔬' },
  { level: 4, name: 'Chemist', xpRequired: 500, icon: '⚗️' },
  { level: 5, name: 'Senior Chemist', xpRequired: 1000, icon: '🧪' },
  { level: 6, name: 'Research Chemist', xpRequired: 2000, icon: '📊' },
  { level: 7, name: 'Lead Scientist', xpRequired: 3500, icon: '🏆' },
  { level: 8, name: 'Chemistry Expert', xpRequired: 5000, icon: '🎓' },
  { level: 9, name: 'Master Chemist', xpRequired: 7500, icon: '⭐' },
  { level: 10, name: 'Nobel Laureate', xpRequired: 10000, icon: '🥇' },
];

export function calculateLevel(xp: number): Level {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      currentLevel = level;
    } else {
      break;
    }
  }
  return currentLevel;
}

export function getNextLevel(xp: number): Level | null {
  const current = calculateLevel(xp);
  const nextIndex = LEVELS.findIndex(l => l.level === current.level + 1);
  return nextIndex !== -1 ? LEVELS[nextIndex] : null;
}

export function getLevelProgress(xp: number): number {
  const current = calculateLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const progress = ((xp - current.xpRequired) / (next.xpRequired - current.xpRequired)) * 100;
  return Math.min(100, Math.max(0, progress));
}

export function checkBadges(stats: UserStats, earnedBadges: string[]): Badge[] {
  const newBadges: Badge[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !earnedBadges.includes(id)) {
      const badge = BADGES.find(b => b.id === id);
      if (badge) newBadges.push(badge);
    }
  };

  check('first_experiment', stats.experimentsRun >= 1);
  check('reaction_master', stats.reactionsDiscovered >= 10);
  check('quiz_champion', stats.quizzesCompleted >= 3 && (stats.quizCorrect / Math.max(1, stats.quizzesCompleted)) >= 0.9);
  check('daily_challenge', stats.dailyChallengesCompleted >= 1);
  check('gas_evolution', stats.reactionsDiscovered >= 3);
  check('curious_mind', stats.topicsCompleted >= 3);
  check('streak_7', stats.currentStreak >= 7);
  check('topic_explorer', stats.topicsCompleted >= 5);
  check('chemistry_graduate', stats.topicsCompleted >= 20);
  check('perfect_week', stats.currentStreak >= 7 && stats.dailyChallengesCompleted >= 7);

  return newBadges;
}

export const XP_REWARDS = {
  runExperiment: 10,
  discoverNewReaction: 25,
  completeQuiz: 20,
  perfectQuiz: 50,
  completeTopic: 100,
  dailyChallenge: 30,
  askAI: 5,
  earnBadge: 50,
};
