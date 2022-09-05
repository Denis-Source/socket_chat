import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrawingModel, LineModel } from "../Models/Drawing.model";

interface InitialState {
  drawing: DrawingModel | null;
}

const initialState: InitialState = {
  drawing: null,
};

export const POINTS_LIMIT = 1000;
export const LINES_LIMIT = 100;

export const drawingSlice = createSlice({
  name: "drawing",
  initialState: initialState,
  reducers: {
    setDrawing: (state, action: PayloadAction<DrawingModel>) => {
      state.drawing = action.payload;
    },
    clearDrawing: (state) => {
      if (state.drawing) {
        state.drawing.lines = [];
      }
    },
    addDrawingLine: (state, action: PayloadAction<LineModel>) => {
      if (state.drawing) {
        state.drawing.lines = [...state.drawing.lines, action.payload].slice(
          -LINES_LIMIT
        );
      }
    },
  },
});

export const { setDrawing, addDrawingLine, clearDrawing } =
  drawingSlice.actions;
export default drawingSlice.reducer;

export class updateDrawing {}
