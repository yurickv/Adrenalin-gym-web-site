import { createHash } from 'crypto';

export function hashIp(ip: string): string {
  const salt = process.env.NEXTAUTH_SECRET ?? 'calc-rating';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}
