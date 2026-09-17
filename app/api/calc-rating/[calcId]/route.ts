import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/api/_utils/database';
import { CalcRating, CalcRatingVote } from '@/app/api/_schemas/calcRating.schema';
import { hashIp } from '@/app/api/_helpers/hashIp';
import { BadRequest, Conflict, Forbidden, NotFound } from '@/app/api/_helpers/errors';
import { averageOf, isCalcId, isValidRatingValue } from '@/lib/calcRating';

export const runtime = 'nodejs';

type Params = { calcId: string };

function statsOf(doc: { sum?: number; count?: number } | null) {
  const sum = doc?.sum ?? 0;
  const count = doc?.count ?? 0;
  return { average: averageOf(sum, count), count };
}

// Next 14 не заповнює req.ip у route handlers, тож адресу беремо з заголовків.
// x-vercel-forwarded-for і x-real-ip виставляє платформа, клієнт їх не підмінить;
// x-forwarded-for лишається запасним варіантом для інших хостингів.
function clientIp(req: NextRequest): string {
  const h = req.headers;
  return (
    h.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip')?.trim() ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.ip ||
    'unknown'
  );
}

// Захист від запису з чужих сайтів: «простий» крос-сайтовий запит без preflight
// не може мати Content-Type application/json, а Sec-Fetch-Site видає джерело.
function assertSameSite(req: NextRequest) {
  const site = req.headers.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'same-site' && site !== 'none') {
    throw new Forbidden('Cross-site requests are not allowed');
  }
  const type = req.headers.get('content-type') ?? '';
  if (!type.toLowerCase().startsWith('application/json')) {
    throw new BadRequest('Content-Type must be application/json');
  }
}

function errorResponse(e: unknown) {
  const err = e as { message?: string; status?: number };
  const status = err.status ?? 500;
  if (status === 500) console.error('calc-rating:', e);
  return NextResponse.json(
    { message: status === 500 ? 'Unable to process rating' : err.message },
    { status }
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
    assertSameSite(req);
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
