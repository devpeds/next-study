export function abort(): void;
export function abort(message: string): void;
export function abort(message: string, error: unknown): void;
export function abort(message?: string, error?: unknown) {
  message && console.error(message);
  error && console.error(error);
  process.exit(1);
}
