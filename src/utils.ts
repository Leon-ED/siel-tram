import type { LocationQueryValue } from 'vue-router'


// STRING
export function getSingleValueFromQueryParam(
  param: LocationQueryValue | LocationQueryValue[] | undefined,
  typeToLookFor: "string",
  defaultValue?: string | null
): string | null;

// NUMBER
export function getSingleValueFromQueryParam(
  param: LocationQueryValue | LocationQueryValue[] | undefined,
  typeToLookFor: "number",
  defaultValue?: number | null
): number | null;

// BOOLEAN
export function getSingleValueFromQueryParam(
  param: LocationQueryValue | LocationQueryValue[] | undefined,
  typeToLookFor: "boolean",
  defaultValue?: boolean
): boolean;

// IMPLEMENTATION
export function getSingleValueFromQueryParam(
  param: LocationQueryValue | LocationQueryValue[] | undefined,
  typeToLookFor: "string" | "number" | "boolean" = "string",
  defaultValue: string | number | boolean | null = null
): string | number | boolean | null {
  if (param === undefined) return defaultValue;

  const rawValue = Array.isArray(param) ? param[0] : param;
  if (rawValue == null) return defaultValue;

  switch (typeToLookFor) {
    case "string":
      return rawValue;

    case "number": {
      const n = Number(rawValue);
      if (Number.isNaN(n)) {
        throw new Error(`Query param "${rawValue}" is not a valid number`);
      }
      return n;
    }

    case "boolean": {
      if (rawValue === "true" || rawValue === "1") return true;
      if (rawValue === "false" || rawValue === "0") return false;
      throw new Error(`Query param "${rawValue}" is not a valid boolean`);
    }
  }
}

export const getMinutesFromDate = (dateString: string): number => {
  return Math.max(0, Math.floor(getSecondesFromDate(dateString) / 60))
}
export const getSecondesFromDate = (
  dateString: string,
  allowNegativesValues: boolean = false,
): number => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = date.getTime() - now.getTime()
  if (allowNegativesValues) {
    return Math.floor(diffInMs / 1000)
  }
  return Math.max(0, Math.floor(diffInMs / 1000))
}
/**
 * Clean and strip a stop id or a line id
 * From STIF::Line:C01742: to C01742 or from STIF::StopPoint:SP:18455: to 18455
 * @param id
 * @returns  string
 */
export const cleanId = (id: string): string => {
  return id
    .toLocaleUpperCase()
    .replace('FR-IDF', '')
    .split(':')
    .filter((s) => s)
    .pop() as string
}
