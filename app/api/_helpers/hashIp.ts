import { createHash } from 'crypto';

// Сіль тримає хеш адреси необоротним; без неї SHA-256 від IPv4 перебирається за секунди.
export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET;
  if (!salt) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXTAUTH_SECRET is required to hash voter addresses');
    }
    return createHash('sha256').update(`calc-rating-dev:${ip}`).digest('hex');
  }
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}
