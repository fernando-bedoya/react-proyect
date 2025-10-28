// Util para normalizar respuestas del backend (snake_case -> camelCase)
// y parsear fechas ISO en objetos Date.

function isIsoDateString(value: any): boolean {
  return typeof value === 'string' && /\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}/.test(value);
}

function toCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function mapKeysToCamel<T>(input: any): T {
  if (input === null || input === undefined) return input;
  if (Array.isArray(input)) return input.map(mapKeysToCamel) as any;
  if (typeof input !== 'object') return input;

  const out: any = {};
  for (const key of Object.keys(input)) {
    const val = input[key];
    const camelKey = toCamel(key);

    if (val === null) {
      out[camelKey] = val;
      continue;
    }

    if (Array.isArray(val)) {
      out[camelKey] = val.map(mapKeysToCamel);
      continue;
    }

    if (typeof val === 'object') {
      out[camelKey] = mapKeysToCamel(val);
      continue;
    }

    // parse date-like strings into Date
    if (isIsoDateString(val)) {
      out[camelKey] = new Date(val);
      continue;
    }

    out[camelKey] = val;
  }

  return out as T;
}

export default mapKeysToCamel;
