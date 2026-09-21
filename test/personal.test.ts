import { afterEach, describe, expect, it, vi } from 'vitest';
import { emptyPersonalSignals, personalInterestScore, personalizedScore, PERSONAL_SIGNALS } from '@/lib/personal';
import { rerank } from '@/lib/typesafe';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('personal scoring', () => {
  it('averages the seven personal signals and keeps relevance as the score gate', () => {
    const signals = emptyPersonalSignals();
    PERSONAL_SIGNALS.forEach((signal, index) => {
      signals[signal.id] = (index + 1) / 10;
    });
    expect(personalInterestScore(signals)).toBeCloseTo(0.4);
    expect(personalizedScore(0.8, 0.4)).toBeCloseTo(0.632);
    expect(personalizedScore(0, 1)).toBe(0);
  });

  it('asks for relevance and every personal signal in one Jev request', async () => {
    const calls: Record<string, unknown>[] = [];
    vi.stubGlobal('fetch', vi.fn(async (_input: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body ?? '{}')) as {
        questions: Record<string, { type: string }>;
      };
      calls.push(body as Record<string, unknown>);
      const answers: Record<string, unknown> = { r0: { type: 'noul', noul: 0.9 } };
      PERSONAL_SIGNALS.forEach((signal, index) => {
        answers[`p0_${signal.id}`] = { type: 'noul', noul: 0.2 + index * 0.1 };
      });
      return new Response(JSON.stringify({
        model: 'jev-1.13.0',
        answers,
        usage: { input_tokens: 50, output_tokens: 10 },
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }));

    const out = await rerank(
      { providers: [{ provider: 'typesafe', apiKey: 'test' }] },
      'small browser tool',
      [{ id: 'a', source: 'github', title: 'A project', snippet: 'A useful browser utility' }]
    );

    expect(calls).toHaveLength(1);
    const questions = calls[0]!.questions as Record<string, unknown>;
    expect(Object.keys(questions)).toHaveLength(PERSONAL_SIGNALS.length + 1);
    expect(questions).toHaveProperty('r0');
    for (const signal of PERSONAL_SIGNALS) expect(questions).toHaveProperty(`p0_${signal.id}`);
    expect(out.relevance.a).toBe(0.9);
    expect(out.personal.a!.githubStars).toBeCloseTo(0.4);
    expect(out.interest.a).toBeCloseTo(0.5);
    expect(out.score.a).toBeCloseTo(personalizedScore(0.9, 0.5));
    expect(out.usage).toEqual({ input_tokens: 50, output_tokens: 10 });
  });
});
