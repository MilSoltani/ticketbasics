/** serializes object, handling dates as ISO strings and stripping nulls/undefined */
export function serializeQuery<T extends object>(query: T): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined)
      continue;

    if (value instanceof Date) {
      params[key] = value.toISOString();
    }
    else if (Array.isArray(value)) {
      if (value.length > 0)
        params[key] = value.join(',');
    }
    else {
      params[key] = String(value);
    }
  }

  return params;
}
