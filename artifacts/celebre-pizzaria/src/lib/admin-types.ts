import type { LandingContent } from '@/content/landing-content';

export interface AdminSession {
  username: string;
  issuedAt: number;
  expiresAt: number;
}

export interface ContentDocument {
  content: LandingContent;
  revision: string;
  updatedAt: string;
}
