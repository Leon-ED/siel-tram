import { type Line, Mode } from '@/types'
const API_URL = import.meta.env.VITE_API_URL

export class LineService {
  private static LINE_ENDPOINT = API_URL + 'lines/lines:'

  private static apiModeToMode(apiMode: string): Mode {
    switch (apiMode.toUpperCase()) {
      case 'RER':
        return Mode.RER
      case 'TRANSILIEN':
        return Mode.TRANSILIEN
      case 'TER':
        return Mode.TER
      case 'METRO':
        return Mode.METRO
      case 'TRAM':
        return Mode.TRAM
      case 'CABLE':
        return Mode.CABLE
      case 'BUS':
        return Mode.BUS
      case 'NOCTILIEN':
        return Mode.NOCTILIEN
      default:
        return Mode.AUTRE
    }
  }
  private static apiLineToLine(apiLine: any): Line {
    return {
      id: apiLine.ref,
      name: apiLine.name,
      mode: LineService.apiModeToMode(apiLine.mode),
      color: apiLine.backgroundColor,
      textColor: apiLine.textColor,
    }
  }

  public static getLine(lineId: string): Promise<Line | null> {
    const url = LineService.LINE_ENDPOINT + lineId
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to fetch line with id ${lineId}: ${response.statusText}`)
          return null
        }
        return response.json().then((apiLineResponse) =>{
          if(!apiLineResponse || apiLineResponse.lines.length === 0){
            console.error(`No line found with id ${lineId}`)
            return null
          }
          return LineService.apiLineToLine(apiLineResponse.lines[0])
        })
      })
      .catch((error) => {
        console.error(`Error fetching line with id ${lineId}`, error)
        return null
      })
  }
}
