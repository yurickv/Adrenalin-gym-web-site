import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { authMiddleware } from '@/app/api/_middlewares/auth.middleware';
import { connectToDB } from '@/app/api/_utils/database';
import Post from '@/app/api/_schemas/post.schema';
import { BadRequest, NotFound } from '@/app/api/_helpers/errors';
import { uploadImage } from '@/app/api/_helpers/uploadImage';
import { transformImage } from '@/app/api/_helpers/transformImage';

type Params = {
  id?: string;
};

export const GET = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    if (!params.id) {
      throw new BadRequest('You must add id in your query params!');
    }

    await connectToDB();

    const post = await Post.findOne({ id: params.id });

    if (!post) {
      throw new NotFound(`Post with ${params.id} not found`);
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Unable to get post' },
      { status: e.status || 500 }
    );
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  try {
    await authMiddleware();

    if (!params.id) {
      throw new BadRequest('You must add _id in your query params!');
    }
    await connectToDB();

    await Post.findOneAndDelete({ _id: params.id });

    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Unable to delete post' },
      {
        status: e.status || 500,
      }
    );
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Params }
) => {
  try {
    await authMiddleware();

    const contentLength = req.headers.get('content-length');

    if (!Number(contentLength)) {
      throw new BadRequest(
        'At least one field is required! (title, description, topic, image)'
      );
    }

    const data = await req.formData();
    const transformedData = Object.fromEntries(data.entries());

    await connectToDB();
    const post = await Post.findById(params.id);
    if (!post) {
      throw new NotFound(`Post with _id:'${params.id}' not found`);
    }

    // const file: File | null = data.get('image') as unknown as File;

    Object.keys(transformedData).forEach(
      key => (post[key] = transformedData[key])
    );

    // if (file) {
    //   const transformedImage = await transformImage(file);

    //   const uploadedImage = await uploadImage(transformedImage);
    //   post.image = uploadedImage as string;
    // }

    post.save();

    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ post }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Unable to update post' },
      { status: e.status || 500 }
    );
  }
};
