export const PERSONAL_SIGNALS = [
  {
    id: 'reproducible',
    label: 'buildable',
    question: 'Could a solo developer realistically reproduce or implement a useful version of the idea, technique or product shown here?',
    yes: 'There is a plausible path using public information, accessible APIs, common tools or a scope small enough for an individual developer',
    no: 'It appears to require unavailable data, a large organization, specialized infrastructure or information not sufficient to reproduce anything useful',
  },
  {
    id: 'lowCost',
    label: 'low cost',
    question: 'Could a useful implementation of this be operated with low ongoing cost?',
    yes: 'A browser, local-first, serverless, free-tier or otherwise inexpensive implementation looks plausible',
    no: 'The useful version appears to require material recurring spend, expensive inference, proprietary data or substantial infrastructure',
  },
  {
    id: 'githubStars',
    label: 'GitHub stars',
    question: 'If the core idea were implemented well as open source, does it have traits that could attract GitHub stars?',
    yes: 'It has clear developer usefulness, an easy-to-understand demo, reusable code or a distinct technical hook',
    no: 'It is difficult to demonstrate, narrowly useful, mostly non-technical or offers little reason for developers to save or share a repository',
  },
  {
    id: 'xBuzz',
    label: 'X buzz',
    question: 'Does this have a concise, visual, surprising or immediately understandable hook that could spread when demonstrated on X?',
    yes: 'A short post, screenshot or clip could communicate the payoff and invite sharing or discussion',
    no: 'The value needs substantial explanation or has little visible or surprising payoff',
  },
  {
    id: 'useful',
    label: 'useful',
    question: 'Could this solve a concrete problem for people beyond being only a technical demonstration?',
    yes: 'It saves time, reduces friction, enables a task or provides information or capability people could repeatedly use',
    no: 'It is mainly a novelty, benchmark or demonstration without a clear recurring user benefit',
  },
  {
    id: 'shipaton',
    label: 'Shipaton',
    question: 'Could this become a compact, demonstrable product suitable for a short Shipaton or hackathon-style build?',
    yes: 'The scope can be bounded, the main loop can be finished quickly and the result has a distinct demoable hook',
    no: 'It depends on a long build-out, extensive content, hard partnerships or infrastructure before the idea becomes demonstrable',
  },
  {
    id: 'boardgame',
    label: 'board game',
    question: 'Could the core mechanism here be translated into a tabletop or board-game decision system rather than merely used as a theme?',
    yes: 'It contains choices, information structure, resource pressure, sequencing, interaction or another mechanism that can survive translation to tabletop play',
    no: 'Its value depends mainly on automation, raw computation, audiovisual presentation or a theme with no transferable decision mechanism',
  },
] as const;

export type PersonalSignalId = (typeof PERSONAL_SIGNALS)[number]['id'];
export type PersonalSignals = Record<PersonalSignalId, number>;

export function emptyPersonalSignals(): PersonalSignals {
  return Object.fromEntries(PERSONAL_SIGNALS.map((signal) => [signal.id, 0])) as PersonalSignals;
}

export function personalInterestScore(signals: PersonalSignals): number {
  return PERSONAL_SIGNALS.reduce((sum, signal) => sum + signals[signal.id], 0) / PERSONAL_SIGNALS.length;
}

/**
 * Topic relevance is a prerequisite; personal interest can move similarly
 * relevant rows but cannot rescue a result the judge considers unrelated.
 */
export function personalizedScore(relevance: number, interest: number): number {
  return relevance * (0.65 + 0.35 * interest);
}
