import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { connectToDB } from '@/app/api/_utils/database';
import Post from '@/app/api/_schemas/post.schema';

import { authMiddleware } from '@/app/api/_middlewares/auth.middleware';
import { createPostSchema } from '@/app/api/_schemas/post.yup.schema';
import { transformImage } from '@/app/api/_helpers/transformImage';
import { uploadImage } from '@/app/api/_helpers/uploadImage';

export const POST = async (req: NextRequest) => {
  try {
    await authMiddleware();

    const data = await req.formData();

    const transformedData = Object.fromEntries(
      [...data.entries()].filter(([key]) => key !== '_id')
    );

    await createPostSchema.validate(transformedData);

    // const file: File | null = data.get('image') as unknown as File;
    // const transformedImage = await transformImage(file);

    // const uploadedImage = await uploadImage(transformedImage);

    await connectToDB();

    const newPost = await Post.create({
      ...transformedData,
      // image: uploadedImage,
    });

    revalidatePath('/blog');
    revalidatePath('/');

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || 'Failed to create a new post' },
      { status: e.status ? e.status : 500 }
    );
  }
};
