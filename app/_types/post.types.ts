export interface Post {
  markup: string;
  id: string;
  _id: string;
  topic: string;
  title: string;
  description: string;
  image: string;
  views: number;
  likes: number;
}

// export type CreatedPost = Omit<Post, 'id'>;
export type CreatedPost = Omit<Post, '_id'>;
