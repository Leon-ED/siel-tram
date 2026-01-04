import { cleanAndStripId } from "@/utils";
const API_URL = import.meta.env.VITE_API_URL
const SCREEN_ID = import.meta.env.VITE_API_SCREEN_ID

interface LogLocalStorage {
  key: string;
  date: number;
}
const LOG_KEY = "logScreenSelection";
const LOG_DURATION_MS = 3 * 60 * 60 * 1000; // 3 hours
export class LogService {
  private static checkIfAlreadyLogged(
    screenId: string,
    lineRef: string | null,
    stopRef: string
  ): boolean {
    // On log la sélection seulement si elle n'a pas déjà été loggée dans les dernières 3h
    const lastLog = localStorage.getItem(LOG_KEY);
    const logScreenRef = `${screenId}|${lineRef}|${stopRef}`;
    const now = Date.now();
    if (lastLog) {
      const logData: LogLocalStorage = JSON.parse(lastLog);
      if (
        logData.key === logScreenRef &&
        now - logData.date < LOG_DURATION_MS
      ) {
        return true;
      }
    }
    // On enregistre la nouvelle entrée de log en local
    const newLogData: LogLocalStorage = {
      key: logScreenRef,
      date: now,
    };
    localStorage.setItem(LOG_KEY, JSON.stringify(newLogData));
    return false;
  }

  public static async logScreenSelection(
    lineRef: string,
    stopRef: string,
    isEmbeded: boolean = false,
    source: null | string = null
  ): Promise<boolean> {
    // if the current url is localhost, or an ip address, do not log
    if (source === null && isEmbeded) {
      source = "embeded";
    }
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/)
    ) {
      console.table({
        SCREEN_ID,
        lineRef,
        stopRef,
        isEmbeded,
        source,
      });
      if (this.checkIfAlreadyLogged(SCREEN_ID, lineRef, stopRef)) {
        console.info("Already logged recently, skipping log.");
        return true;
      }
      console.info("Localhost or IP address detected, skipping log.");
      return true;
    }
    if (this.checkIfAlreadyLogged(SCREEN_ID, lineRef, stopRef)) {
      console.info("Skipping stats");
      return true;
    }

    const data = {
      screenId: SCREEN_ID,
      lineId: cleanAndStripId(lineRef),
      stopId: cleanAndStripId(stopRef),
      isEmbeded,
      source,
    };
    const response = await fetch(`${API_URL}log/screen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      return false;
    }
    const result = await response.json();
    if (result.error) {
      return false;
    }
    return true;
  }
}
