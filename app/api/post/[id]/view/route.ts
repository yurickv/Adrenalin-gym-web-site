import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/api/_utils/database';
import Post from '@/app/api/_schemas/post.schema';
import { NotFound } from '@/app/api/_helpers/errors';

type Params = { id: string };

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    await connectToDB();

    const post = await Post.findOneAndUpdate(
      { id: params.id },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      throw new NotFound(`Post with id '${params.id}' not found`);
    }

    return NextResponse.json({ views: post.views }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Unable to track view' },
      { status: e.status || 500 }
    );
  }
};
