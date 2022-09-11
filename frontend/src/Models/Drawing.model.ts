enum Tools {
    pen = "pen",
    eraser = "eraser",
}

export interface LineModel {
    tool: Tools;
    uuid: string;
    color: string;
    points: number[];
}

export interface DrawingModel {
    uuid: string;
    name: string;
    lines: LineModel[];
}
