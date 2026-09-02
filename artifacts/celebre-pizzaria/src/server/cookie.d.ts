declare module 'cookie' {
  export interface SerializeOptions {
    httpOnly?: boolean;
    maxAge?: number;
    path?: string;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    secure?: boolean;
  }

  export function parse(value: string): Record<string, string>;
  export function serialize(
    name: string,
    value: string,
    options?: SerializeOptions,
  ): string;
}
