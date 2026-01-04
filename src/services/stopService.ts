import {  type Stop } from '@/types'
const API_URL = import.meta.env.VITE_API_URL

export class StopService {
  private static STOP_ENDPOINT = API_URL + 'stops/stop/'

  private static apiStopToStop(apiStop: any): Stop {
    return {
        id: apiStop.ref,
        name: apiStop.name,
        otherIds: [],
    }
  }
  public static getStop(stopId: string): Promise<Stop | null> {
    const url = this.STOP_ENDPOINT + stopId
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          return null
        }
        return response.json().then(this.apiStopToStop)
      })
      .catch(() => {
        return null
      })
  }
}
