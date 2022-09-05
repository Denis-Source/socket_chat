export enum LogOrigin {
    Sent = "sent",
    Received = "received",
}

export interface LogModel {
    type: string;
    description: string;
    origin: LogOrigin;
    time: string;
}
