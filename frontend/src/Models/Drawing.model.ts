enum Tools {
  pen = "pen",
  eraser = "eraser",
}

export interface LineModelCompressed {
  tool: Tools;
  uuid: string;
  color: string;
  points: string;
}

export interface LineModel {
  tool: Tools;
  uuid: string;
  color: string;
  points: number[];
}

export interface DrawingModel {
  uuid: string;
  lines: LineModel[];
}
