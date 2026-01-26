type getPostsProps = {
  page?: string | number;
  limit?: string | number;
  search?: string;
  topic?: string;
};

class PostService {
  constructor() {}

  async getPosts(post: getPostsProps) {
    const { page = 1, limit = 12, search = '', topic = '' } = post;
    try {
      const res = await fetch(
        `${
          process.env.HOST || process.env.NEXT_PUBLIC_HOST
        }/api/post?page=${page}&limit=${limit}&search=${search}&topic=${topic}`
      );

      if (!res.ok) {
        console.error('Failed to fetch posts:', res.status, res.statusText);
        return { posts: [], totalCount: 0 };
      }

      return res.json();
    } catch (e) {
      console.error('Error fetching posts:', e);
      return { posts: [], totalCount: 0 };
    }
  }

  async getPostById(id: string) {
    try {
      const res = await fetch(
        `${process.env.HOST || process.env.NEXT_PUBLIC_HOST}/api/post/${id}`
      );
      if (!res.ok) return undefined;
      const { post } = await res.json();
      return post;
    } catch (e) {
      console.log(e);
    }
  }

  async createPost(post: FormData) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/post/new`, {
        method: 'POST',
        body: post,
      });
      return await res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async updatePost(id: string, post: FormData) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/post/${id}`,
        {
          method: 'PATCH',
          body: post,
        }
      );
      return await res.json();
    } catch (e) {
      console.log(e);
    }
  }

  async deletePost(id: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/post/${id}`,
        {
          method: 'DELETE',
        }
      );
      return await res.json();
    } catch (e) {
      console.log(e);
    }
  }
}

const postHttpService = new PostService();

export default postHttpService;
