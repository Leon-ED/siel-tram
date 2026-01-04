export interface Line{
    id: string;
    name: string;
    mode: Mode;
    color: string;
    textColor: string;
}

export enum Mode{
    RER,
    TRANSILIEN,
    TER,
    METRO,
    TRAM,
    CABLE,
    BUS,
    NOCTILIEN,
    AUTRE,
}

export interface Stop{
    id: string;
    name: string;
    otherIds: string[];
}

export interface Departure {
    id: string;
    lineId: string;

    branchId: string;
    branchName: string;

    destination: string;

    isAtStop: boolean;
    time: string; // ISO time string

    platform: string;
}
