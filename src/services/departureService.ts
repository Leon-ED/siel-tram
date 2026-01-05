import { type Departure } from '@/types'
const API_URL = import.meta.env.VITE_API_URL
import mock from '@/mock/departures.json'
export class DepartureService {
  private static DEPARTURE_ENDPOINT = API_URL + 'departures/'

  private static apiDepartureToDeparture(apiDeparture: any): Departure {
    return {
      id: apiDeparture.ref,
      lineId: apiDeparture.lineRef,
      destination: apiDeparture.destinationLabel,
      branchId: apiDeparture.branchRef,
      branchName: apiDeparture.directionName,
      isAtStop: apiDeparture.isAtStop,
      time: apiDeparture.dateTime,
      platform: apiDeparture.platform,
    }
  }
  /**
   *
   * @param stopId - ID of the stop
   * @param lineId - ID of the line
   * @param oldDepartures - Existing departures to return in case of error
   * @returns
   */
  public static getDepartures(
    stopId: string,
    lineId: string,
    oldDepartures: Departure[],
  ): Promise<Departure[]> {
    // /**
    //  * return mock
    //  */
    // return Promise.resolve(
    //   (mock as any[]).map(DepartureService.apiDepartureToDeparture)
    // )
    const url: URL = new URL(this.DEPARTURE_ENDPOINT  + stopId)
    url.searchParams.append('getLineNotice', 'false')
    url.searchParams.append('returnStopPoint', 'false')
    url.searchParams.append('linesIds', JSON.stringify([lineId]))
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.error(
            `Failed to fetch departures for lineId ${lineId} and stopId ${stopId}: ${response.statusText}`,
          )
          return oldDepartures
        }
        return response.json().then((apiDeparturesResponse) => {
          if (
            !apiDeparturesResponse ||
            !apiDeparturesResponse.departures ||
            apiDeparturesResponse.behavior !== 'replace_data'
          ) {
            console.error(`API response invalid for lineId ${lineId} and stopId ${stopId}`)
            return oldDepartures
          }
          return apiDeparturesResponse.departures
          .filter((dep: any) => 
          {
            const forbiddenFlags = ['TERMINATES_HERE', 'SERVICE_IS_CANCELLED']
            // si le départ aurait du avoir lieu y'a plus de 15 minutes on le filtre aussi
            const departureTime = new Date(dep.dateTime).getTime()
            const currentTime = Date.now()
            if (currentTime - departureTime > 10 * 60 * 1000) {
              return false
            }

            return !dep.flags?.some((flag: any) => forbiddenFlags.includes(flag))
          })
          .map(DepartureService.apiDepartureToDeparture)
          .sort((a: Departure, b: Departure) => {
            const timeA = new Date(a.time).getTime()
            const timeB = new Date(b.time).getTime()
            return timeA - timeB
          })
        })
      })
      .catch((error) => {
        console.error(`Error fetching line with id ${lineId} and stopId ${stopId}`, error)
        return oldDepartures
      })
  }
}
