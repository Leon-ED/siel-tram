import {  type Stop } from '@/types'
const API_URL = import.meta.env.VITE_API_URL

export class StopService {
  private static STOP_ENDPOINT = API_URL + 'stops/stop/'

  private static apiStopToStop(apiStop: any): Stop {
    return {
        id: apiStop.ref,
        name: apiStop.name,
        city: apiStop.cityName,
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
        return response.json().then((apiStopResponse) =>{
          if(!apiStopResponse || !apiStopResponse.stop){
            return null
          }
          return StopService.apiStopToStop(apiStopResponse.stop)
        })
      })
      .catch(() => {
        return null
      })
  }
}
