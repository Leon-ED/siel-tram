import {
  Mode,
  type Disruption,
  type DisruptionImpact,
  type DisruptionStatus,
  type Line,
} from '@/types'
import { cleanAndStripId, getStringRealLength } from '@/utils'
const API_URL = import.meta.env.VITE_API_URL
const MAX_CHARS_DESCRIPTION = 500

export class DisruptionService {
  private static DISRUPTION_ENDPOINT = API_URL + 'disruptions/'

  public static getIconForImpact(impact: DisruptionImpact | undefined): string {
    const BASE_ICON_PATH = 'public/disruptions/'
    switch (impact) {
      case 'SUSPENSION':
        return BASE_ICON_PATH + 'suspended.svg'
      case 'DELAY':
        return BASE_ICON_PATH + 'delay.svg'
      case 'INFO':
        return BASE_ICON_PATH + 'info_line.svg'
      default:
        return BASE_ICON_PATH + 'info_line.svg'
    }
  }

  private static apiDisruptionToDisruption(apiDisruption: any, lines: Line[]): Disruption {
    const line = lines.find((line) => apiDisruption.affectedLinesRefs.map((l: any) => cleanAndStripId(l)).includes(cleanAndStripId(line.id)))!

    const apiStatusToStatus = (status: string): DisruptionStatus => {
      switch (status) {
        case 'ACTIVE':
          return 'ACTIVE'
        case 'FUTURE':
          return 'PLANNED'
        case 'PAST':
          return 'RESOLVED'
        default:
          return 'ACTIVE'
      }
    }
    const apiImpactToImpact = (impact: string): DisruptionImpact => {
      switch (impact) {
        case 'SUSPENDED':
          return 'SUSPENSION'
        case 'WORKS':
        case 'DEVIATED':
          if ([Mode.METRO, Mode.TRANSILIEN, Mode.RER, Mode.TER, Mode.TRAM].includes(line.mode)) {
            return 'SUSPENSION'
          }
          return 'DELAY'
        case 'DISRUPTED':
          return 'DELAY'
        case 'INFO':
          return 'INFO'
        default:
          return 'INFO'
      }
    }
    let shortenedDescription: string = apiDisruption.title
    if (!shortenedDescription.includes(apiDisruption.causeLabel)) {
      shortenedDescription += ' - ' + apiDisruption.causeLabel
    }

    return {
      id: apiDisruption.ref,
      line: line,
      title: apiDisruption.title,
      description:
        getStringRealLength(apiDisruption.message) > MAX_CHARS_DESCRIPTION
          ? shortenedDescription
          : apiDisruption.message,
      status: apiStatusToStatus(apiDisruption.status),
      impact: apiImpactToImpact(apiDisruption.type),
    }
  }
  public static getDisruptions(lines: Line[]): Promise<Disruption[]> {
    const url = this.DISRUPTION_ENDPOINT + lines.map((line) => line.id).join(',')
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          return []
        }
        return response.json().then((apiStopResponse) => {
          if (!apiStopResponse || !apiStopResponse.disruptions) {
            return []
          }
          if (!apiStopResponse.disruptions.length) {
            return []
          }
          return apiStopResponse.disruptions.map((apiDisruption: any) =>
            DisruptionService.apiDisruptionToDisruption(apiDisruption, lines),
          ).filter((disruption: Disruption) => disruption.status === 'ACTIVE')
        })
      })
      .catch(() => {
        return null
      })
  }
}
