import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/api/_utils/database';
import { CalcRating, CalcRatingVote } from '@/app/api/_schemas/calcRating.schema';
import { hashIp } from '@/app/api/_helpers/hashIp';
import { BadRequest, Conflict, NotFound } from '@/app/api/_helpers/errors';
import { averageOf, isCalcId, isValidRatingValue } from '@/lib/calcRating';

export const runtime = 'nodejs';

type Params = { calcId: string };

function statsOf(doc: { sum?: number; count?: number } | null) {
  const sum = doc?.sum ?? 0;
  const count = doc?.count ?? 0;
  return { average: averageOf(sum, count), count };
}

// req.ip заповнює платформа (Vercel) з реального з'єднання; X-Forwarded-For
// беремо лише як запасний варіант, бо перший елемент цього заголовка
// контролює клієнт. Без обох значень усі голоси об'єднуються під 'unknown'.
function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return req.ip || forwarded?.split(',')[0]?.trim() || 'unknown';
}

function errorResponse(e: unknown) {
  const err = e as { message?: string; status?: number };
  return NextResponse.json(
    { message: err.message || 'Unable to process rating' },
    { status: err.status || 500 }
  );
}

export const GET = async (_req: NextRequest, { params }: { params: Params }) => {
  try {
    if (!isCalcId(params.calcId)) {
      throw new NotFound(`Unknown calculator '${params.calcId}'`);
    }
    await connectToDB();
    const doc = await CalcRating.findOne({ calcId: params.calcId }).lean();
    return NextResponse.json(
      statsOf(doc as { sum?: number; count?: number } | null),
      { status: 200 }
    );
  } catch (e) {
    return errorResponse(e);
  }
};

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    if (!isCalcId(params.calcId)) {
      throw new NotFound(`Unknown calculator '${params.calcId}'`);
    }
    const body = await req.json().catch(() => ({}));
    const value = body?.value;
    if (!isValidRatingValue(value)) {
      throw new BadRequest('value must be an integer from 1 to 5');
    }

    await connectToDB();

    const ipHash = hashIp(clientIp(req));

    try {
      await CalcRatingVote.create({ calcId: params.calcId, ipHash });
    } catch (e) {
      if ((e as { code?: number }).code === 11000) {
        throw new Conflict('Ви вже оцінювали цей калькулятор сьогодні');
      }
      throw e;
    }

    let doc;
    try {
      doc = await CalcRating.findOneAndUpdate(
        { calcId: params.calcId },
        { $inc: { sum: value, count: 1 } },
        { upsert: true, new: true }
      ).lean();
    } catch (e) {
      // Компенсація: без цього голос лишився б у журналі, а повторна спроба
      // отримувала б хибний 409 упродовж доби.
      await CalcRatingVote.deleteOne({ calcId: params.calcId, ipHash }).catch(() => {});
      throw e;
    }

    return NextResponse.json(
      statsOf(doc as { sum?: number; count?: number } | null),
      { status: 200 }
    );
  } catch (e) {
    return errorResponse(e);
  }
};
