import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DrawingModel, LineModel, LineModelCompressed} from "../Models/Drawing.model";
import LZUTF8 from "lzutf8";


interface InitialState {
    drawing: DrawingModel | null;
}

const initialState: InitialState = {
    drawing: null,
}

const POINTS_LIMIT = 1000;
const LINES_LIMIT = 100;

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
        updateDrawing: (state, action: PayloadAction<LineModelCompressed | LineModel>) => {
            if (state.drawing) {
                state.drawing.lines = state.drawing.lines.slice(-LINES_LIMIT);
                const lines = state.drawing?.lines.filter(line => line.uuid === action.payload.uuid);
                const points = typeof action.payload.points === "string"
                    ? JSON.parse(LZUTF8.decompress(LZUTF8.decodeBase64(action.payload.points)))
                    : action.payload.points;

                if (lines.length < 1) {
                    state.drawing.lines.push({
                        tool: action.payload.tool,
                        uuid: action.payload.uuid,
                        color: action.payload.color,
                        points: points
                    });
                } else {
                    lines[0].points = points;
                }
            }
        },
        updateDrawingLine: (state, action: PayloadAction<{ x: number, y: number }>) => {
            if (state.drawing) {
                state.drawing.lines[state.drawing.lines.length - 1].points.push(action.payload.x, action.payload.y);
                state.drawing.lines[state.drawing.lines.length - 1].points = state.drawing.lines[state.drawing.lines.length - 1].points.slice(-POINTS_LIMIT);
            }
        }

    },
});

export const {setDrawing, updateDrawing, clearDrawing, updateDrawingLine} = drawingSlice.actions;
export default drawingSlice.reducer;
