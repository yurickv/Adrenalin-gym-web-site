import { CreatedPost, Post } from '@/app/_types/post.types';

export const createPostFormData = (post: CreatedPost) => {
  const formData = new FormData();
  Object.keys(post).forEach((key: string) => {
    formData.append(key, String(post[key as keyof CreatedPost]));
  });
  return formData;
};

export const editPostFormData = (post: Post, editedPost: Post) => {
  const formData = new FormData();

  Object.keys(post).forEach((key: string) => {
    if (
      key !== '_id' &&
      post[key as keyof Post] !== editedPost[key as keyof Post]
    ) {
      formData.append(key, String(post[key as keyof Post]));
    }
  });
  return formData;
};
