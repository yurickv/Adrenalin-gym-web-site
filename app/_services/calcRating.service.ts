import mongoose from 'mongoose';
import { connectToDB } from '@/app/api/_utils/database';
import { CalcRating } from '@/app/api/_schemas/calcRating.schema';
import { averageOf, type CalcId, type RatingStats } from '@/lib/calcRating';

// Читається напряму з бази у серверному компоненті сторінки (ISR), без
// самозапиту до власного API: під час збірки API ще не піднятий.
export async function getCalcRating(calcId: CalcId): Promise<RatingStats | null> {
  try {
    await connectToDB();
    if (mongoose.connection.readyState !== 1) return null;
    const doc = await CalcRating.findOne({ calcId }).lean<{ sum?: number; count?: number }>();
    const count = doc?.count ?? 0;
    return { average: averageOf(doc?.sum ?? 0, count), count };
  } catch (e) {
    console.error('calcRating.service: не вдалося прочитати рейтинг', e);
    return null;
  }
}
