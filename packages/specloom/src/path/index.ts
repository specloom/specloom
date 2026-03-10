export function resolvePathValues(value: unknown, path: string): unknown[] {
  const segments = path
    .split(".")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return walkPath(value, segments);
}

function walkPath(value: unknown, segments: string[]): unknown[] {
  if (segments.length === 0) {
    return flattenValues(value);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => walkPath(item, segments));
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const [head, ...tail] = segments;
  return walkPath((value as Record<string, unknown>)[head!], tail);
}

function flattenValues(value: unknown): unknown[] {
  if (value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => flattenValues(item));
  }

  return [value];
}
