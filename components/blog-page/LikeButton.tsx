'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'liked_posts';

function getLikedPosts(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLikedPosts(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setLiked(getLikedPosts().includes(postId));
  }, [postId]);

  const handleClick = async () => {
    if (pending) return;

    const action = liked ? 'unlike' : 'like';
    const optimisticCount = liked ? count - 1 : count + 1;

    setLiked(!liked);
    setCount(optimisticCount);
    setPending(true);

    try {
      const res = await fetch(`/api/post/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error();

      const { likes } = await res.json();
      setCount(likes);

      const likedPosts = getLikedPosts();
      if (action === 'like') {
        saveLikedPosts([...likedPosts, postId]);
      } else {
        saveLikedPosts(likedPosts.filter(id => id !== postId));
      }
    } catch {
      setLiked(liked);
      setCount(count);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      aria-label={liked ? 'Прибрати лайк' : 'Поставити лайк'}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors font-poppins text-sm font-semibold
        ${liked
          ? 'border-main bg-orange-100 text-main dark:bg-mainText dark:text-white'
          : 'border-gray-300 bg-white text-gray-500 hover:border-main hover:text-main dark:bg-darkBody dark:border-gray-600 dark:text-gray-400 dark:hover:border-main dark:hover:text-main'
        } disabled:opacity-60`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
      <span>{count}</span>
    </button>
  );
}
