import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/app/api/_utils/database';
import Post from '@/app/api/_schemas/post.schema';
import { BadRequest, NotFound } from '@/app/api/_helpers/errors';

type Params = { id: string };

export const POST = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    const { action } = await req.json();

    if (action !== 'like' && action !== 'unlike') {
      throw new BadRequest('action must be "like" or "unlike"');
    }

    await connectToDB();

    const post = await Post.findOne({ id: params.id });

    if (!post) {
      throw new NotFound(`Post with id '${params.id}' not found`);
    }

    const increment = action === 'like' ? 1 : -1;
    const newLikes = Math.max(0, (post.likes ?? 0) + increment);

    const updated = await Post.findOneAndUpdate(
      { id: params.id },
      { $set: { likes: newLikes } },
      { new: true }
    );

    return NextResponse.json({ likes: updated.likes }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Unable to update likes' },
      { status: e.status || 500 }
    );
  }
};
