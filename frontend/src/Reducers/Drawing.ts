import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DrawingModel, LineModel } from "../Models/Drawing.model";

interface InitialState {
    drawing: DrawingModel | null;
    lastLine: LineModel | null;
}

const initialState: InitialState = {
    drawing: null,
    lastLine: null,
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
                if (
                    !state.drawing.lines.find(
                        (line) => line.uuid === action.payload.uuid
                    )
                ) {
                    state.drawing.lines = [
                        ...state.drawing.lines,
                        action.payload,
                    ].slice(-POINTS_LIMIT);
                }
            }
        },
        setLastLine: (state, action: PayloadAction<LineModel>) => {
            state.lastLine = action.payload;
        },
        updateLastLine: (state, action: PayloadAction<number[]>) => {
            if (state.lastLine) {
                state.lastLine.points = [
                    ...state.lastLine.points,
                    ...action.payload,
                ].slice(-POINTS_LIMIT);
            }
        },
        resetLastLine: (state) => {
            state.lastLine = null;
        },
    },
});

export const {
    setDrawing,
    addDrawingLine,
    clearDrawing,
    updateLastLine,
    resetLastLine,
    setLastLine,
} = drawingSlice.actions;
export default drawingSlice.reducer;

export class updateDrawing {}
