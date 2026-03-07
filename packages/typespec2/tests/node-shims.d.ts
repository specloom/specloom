declare module "node:child_process" {
  export function execFileSync(
    file: string,
    args?: readonly string[],
    options?: {
      cwd?: string;
      stdio?: unknown;
    },
  ): unknown;
}

declare module "node:fs" {
  export function mkdtempSync(prefix: string): string;
  export function readFileSync(path: string, encoding: string): string;
  export function rmSync(
    path: string,
    options?: {
      recursive?: boolean;
      force?: boolean;
    },
  ): void;
}

declare module "node:os" {
  export function tmpdir(): string;
}

declare module "node:path" {
  export function dirname(path: string): string;
  export function resolve(...paths: string[]): string;
}

declare module "node:url" {
  export function fileURLToPath(url: string): string;
}
