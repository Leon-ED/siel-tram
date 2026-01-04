import type { LocationQueryValue } from 'vue-router'
import  { Mode } from './types';

// Fonction utilitaire pour normaliser les paramètres de requête en tableau
export const queryParamToArray = (
  param: unknown,
  defaultValue: string[] = []
): string[] => {
  if (!param) return defaultValue;
  return Array.isArray(param) ? param : [param as string];
};

export const getStringRealLength = (str: string): number => {
  return str.replace(/<[^>]*>/g, '').length;
}

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
  time:number = Date.now()
): number => {
  const date = new Date(dateString)
  const diffInMs = date.getTime() - time
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

export const getVehicleName = (mode: Mode,defaultsTo:string): string => {
  switch (mode) {
    case Mode.RER:
    case Mode.TRANSILIEN:
      case Mode.TER:
      return 'train'
    case Mode.METRO:
      return 'métro'
    case Mode.TRAM:
      return 'tram'
    case Mode.BUS:
    case Mode.NOCTILIEN:
      return 'bus'
    case Mode.CABLE:
      return 'cabine'
    default:
      return defaultsTo
  }
  }

  export const cleanStopName = (name: string): string => {
    let cleaned = name.replace(/\(.*\)/g, "").trim();

    const hardRules = new Map<string, string>([
      ["Invalides", "Paris–Invalides"],
      ["Aéroport CDG", "Aéroport Ch. de Gaulle"],
      ["Aéroport Charles de Gaulle", "Aéroport Ch. de Gaulle"],
      ["Aéroport Charles de Gaulle 2", "Aéroport Ch. de Gaulle"],
    ]);

    hardRules.forEach((value, key) => {
      if (cleaned === key) {
        cleaned = value;
      }
    });

    const parisGares = new Map<string, string>([
      ["Paris Gare du Nord", "Paris–Gare du Nord"],
      ["Paris Lyon", "Paris–Gare de Lyon"],
      ["Paris Gare de Lyon", "Paris–Gare de Lyon"],
      ["Paris Austerlitz", "Paris–Austerlitz"],
      ["Paris Est", "Paris–Gare de l'Est"],
      ["Paris Saint-Lazare", "Paris–Saint-Lazare"],
      ["Paris Montparnasse", "Paris–Montparnasse"],
      ["Paris Bercy Bourgogne–Pays d'Auvergne", "Paris–Gare de Bercy"],
    ]);
    const dontTouch = [
      "gare du nord",
      "gare de lyon",
      "gare de l'est",
      "gare montparnasse",
      "gare saint-lazare",
      "gare de bercy",
      "gare saint lazare",
      "gare de l est",
    ];

    parisGares.forEach((value, key) => {
      if (cleaned === key) {
        cleaned = value;
      }
    });

    const toRemove = ["Gare de "];
    toRemove.forEach((str) => {
      if (dontTouch.includes(cleaned.toLowerCase())) {
        return;
      }
      cleaned = cleaned.replace(str, "");
    });

    const replace = new Map<string, string>([
      [" - ", "–"],
      ['Noisy le Sec', 'Noisy-le-Sec'],
      ["Porte ", "P<sup>te</sup> "],
      ["Villiers-sur-Marne – Le Plessis-Trévise", "Villiers-sur-Marne"],
      ["Villiers-sur-Marne - Le Plessis-Trévise", "Villiers-sur-Marne"],
      ["Dourdan la Forêt", "Dourdan–La Forêt"],
      ["Versailles Château Rive Gauche", "Versailles-Château-Rive-Gauche"],
      ["Versailles Rive Droite", "Versailles–Rive-Droite"],
      ["Saint-Nom-la-Bretèche–Forêt de Marly", "Saint-Nom-la-Bretèche"],
      ["Saint-Nom-la-Bretèche - Forêt de Marly", "Saint-Nom-la-Bretèche"],
      ["Marne-La-Vallée Chessy", "Marne-la-Vallée"],
      ["Marne-la-Vallée Chessy", "Marne-la-Vallée"],
      ["Marne-la-Vallée–Chessy", "Marne-la-Vallée"],
      ["Marne-la-Vallée - Chessy", "Marne-la-Vallée"],
      ["Marne-la-Vallée – Chessy", "Marne-la-Vallée"],
      ["Cergy Le Haut", "Cergy–Le Haut"],
      ["Cergy le Haut", "Cergy–Le Haut"],
      ["Noisy-le-Grand - Mont d'Est", "Noisy-le-Grand"],
      ["Lyon Part Dieu", "Lyon–Part-Dieu"],
      ["Nanterre-La-Folie", "Nanterre–La Folie"],
      [
        "Saint-Quentin en Yvelines - Montigny-le-Bretonneux",
        "Saint-Quentin-en-Yvelines",
      ],
      [
        "Saint-Quentin en Yvelines–Montigny-le-Bretonneux",
        "Saint-Quentin-en-Yvelines",
      ],
    ]);

    replace.forEach((value, key) => {
      cleaned = cleaned.replace(key, value);
    });

    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

