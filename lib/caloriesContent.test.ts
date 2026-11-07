import { describe, it, expect } from 'vitest';
import {
  CALORIES_EXAMPLE,
  CALORIES_SOURCES,
  caloriesFaq,
} from '@/components/calcs-page/caloriesContent';
import { bmrMifflin, macros, targets, tdee } from './calories';
import { GYM_ACTIVITIES, kcalPerHour } from './activityBurn';

const answer = (question: string): string => {
  const item = caloriesFaq.find(faq => faq.question === question);
  if (!item) throw new Error(`FAQ question not found: ${question}`);
  return item.answer;
};

const burn = (code: string, weightKg: number) =>
  kcalPerHour(GYM_ACTIVITIES.find(a => a.code === code)!.met, weightKg);

describe('CALORIES_EXAMPLE', () => {
  it('produces the worked-example numbers', () => {
    const e = CALORIES_EXAMPLE;
    const bmr = bmrMifflin({ sex: e.sex, age: e.age, heightCm: e.heightCm, weightKg: e.weightKg });
    const daily = tdee(bmr, e.activity);
    const t = targets(daily);

    expect(bmr).toBe(1402);
    expect(daily).toBe(2173);
    expect(t.maintain).toBe(2170);
    expect(t.loss15).toBe(1850);
    expect(macros(t.loss15, e.weightKg, e.goal)).toEqual({ proteinG: 117, fatG: 51, carbsG: 231 });
  });
});

describe('caloriesFaq', () => {
  it('has 11 questions', () => {
    expect(caloriesFaq).toHaveLength(11);
  });

  it('keeps the example numbers in sync with the calculator', () => {
    expect(answer('Як розрахувати денну норму калорій?')).toContain('2170');
    expect(answer('Як розрахувати денну норму калорій?')).toContain('1850');
    expect(answer('Що таке BMR і чим він відрізняється від норми калорій?')).toContain('1400');
    expect(answer('Що таке BMR і чим він відрізняється від норми калорій?')).toContain('2170');
    const protein = answer('Скільки білка потрібно на день?');
    expect(protein).toContain('117 г');
    expect(protein).toContain('51 г');
    expect(protein).toContain('231 г');
  });

  it('quotes the Mifflin-St Jeor formula for both sexes', () => {
    const text = answer('За якою формулою рахує калькулятор калорій?');
    expect(text).toContain('10 × вага (кг) + 6,25 × зріст (см) − 5 × вік + 5');
    expect(text).toContain('10 × вага (кг) + 6,25 × зріст (см) − 5 × вік − 161');
  });

  it('matches the gym burn table', () => {
    const text = answer('Скільки калорій спалює тренування в залі?');
    expect(text).toContain(`${burn('02054', 60)}–${burn('02054', 80)} ккал`);
    expect(text).toContain(`${burn('02050', 60)}–${burn('02050', 80)} ккал`);
  });

  it('states the weekly pace in percent of body weight, not kilograms', () => {
    for (const item of caloriesFaq) {
      expect(item.answer).not.toContain('0,5–1 кг');
    }
    expect(answer('Скільки калорій потрібно, щоб схуднути?')).toContain('0,5–1% маси тіла на тиждень');
  });
});

describe('CALORIES_SOURCES', () => {
  it('lists the four verified sources', () => {
    expect(CALORIES_SOURCES.map(s => s.url)).toEqual([
      'https://pubmed.ncbi.nlm.nih.gov/2305711/',
      'https://pubmed.ncbi.nlm.nih.gov/28642676/',
      'https://pacompendium.com/',
      'https://www.who.int/news-room/fact-sheets/detail/healthy-diet',
    ]);
    expect(CALORIES_SOURCES.map(s => s.type)).toEqual([
      'ScholarlyArticle',
      'ScholarlyArticle',
      'ScholarlyArticle',
      'CreativeWork',
    ]);
  });
});
