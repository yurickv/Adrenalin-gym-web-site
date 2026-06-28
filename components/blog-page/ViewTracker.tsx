'use client';

import { useEffect } from 'react';

export function ViewTracker({ postId }: { postId: string }) {
  useEffect(() => {
    fetch(`/api/post/${postId}/view`, { method: 'POST' }).catch(() => {});
  }, [postId]);

  return null;
}
