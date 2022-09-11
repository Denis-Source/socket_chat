import React, { useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import styles from "./Drawing.module.scss";
import eraser from "../../Static/Images/eraser.svg";
import pen from "../../Static/Images/pen.svg";
import del from "../../Static/Images/delete.svg";
import { prepareStatement, WSS_FEED_URL } from "../../api";
import { TypeStatements } from "../../StatementsTypes/TypeStatements";
import useWebSocket from "react-use-websocket";
import { DrawingStatements } from "../../StatementsTypes/DrawingStatements";
import { useDispatch, useSelector } from "react-redux";
import {
    addDrawingLine,
    clearDrawing,
    resetLastLine,
    setLastLine,
    updateLastLine,
} from "../../Reducers/Drawing";
import { DrawingModel, LineModel } from "../../Models/Drawing.model";
import Spinner from "../Spinner/Spinner";
import DrawingColorPicker from "../ColorPicker/DrawingColorPicker/DrawingColorPicker";

export enum Tools {
    pen = "pen",
    eraser = "eraser",
}

const Drawing = () => {
    const WIDTH = 640;
    const HEIGHT = 480;

    // Configure websocket connection
    const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
        share: true,
    });

    const drawing: DrawingModel = useSelector(
        (state: any) => state.drawing.drawing
    );

    const lastLine: LineModel = useSelector(
        (state: any) => state.drawing.lastLine
    );

    const [tool, setTool] = useState(Tools.pen);
    const [color, setColor] = useState("#000000cc");

    const stageRef = useRef<any>(null);
    const isDrawing = useRef(false);

    const dispatch = useDispatch();

    const sendDelete = async () => {
        const statement = prepareStatement({
            type: TypeStatements.Call,
            message: DrawingStatements.ResetDrawing,
        });
        await sendJsonMessage(statement);
    };

    // Function to update a drawn line
    const sendUpdate = async () => {
        if (lastLine) {
            const statement = prepareStatement({
                type: TypeStatements.Call,
                message: DrawingStatements.ChangeDrawLine,
                uuid: lastLine.uuid,
                points: lastLine.points,
                color: lastLine.color,
                tool: lastLine.tool,
            });
            await sendJsonMessage(statement);
            dispatch(resetLastLine());
        }
    };

    const handleMouseDown = async (event: any) => {
        isDrawing.current = true;
        const stage = event.target.getStage();
        const pos = stage.getPointerPosition();

        dispatch(
            setLastLine({
                uuid: crypto.randomUUID(),
                tool: tool,
                color: color,
                points: [pos.x, pos.y],
            })
        );
    };

    const handleMouseMove = (event: any) => {
        if (isDrawing.current && lastLine) {
            const stage = event.target.getStage();
            const pos = stage.getPointerPosition();
            dispatch(updateLastLine([pos.x, pos.y]));
        }
    };

    const handleMouseUp = async () => {
        isDrawing.current = false;
        lastLine && dispatch(addDrawingLine(lastLine));
        await sendUpdate();
        dispatch(resetLastLine());
    };

    let renderedLines: LineModel[] = [];

    if (drawing) {
        renderedLines = lastLine ? [...drawing.lines, lastLine] : drawing.lines;
    }

    return (
        <>
            {drawing ? (
                <div className={styles.layout}>
                    <Stage
                        width={WIDTH}
                        height={HEIGHT}
                        onMouseDown={handleMouseDown}
                        onMousemove={handleMouseMove}
                        onMouseup={handleMouseUp}
                        className={styles.stage}
                        ref={stageRef}
                    >
                        <Layer>
                            {renderedLines.map((line: LineModel, i: number) => (
                                <Line
                                    key={i}
                                    points={line.points}
                                    stroke={
                                        line.tool === "eraser"
                                            ? "#ffffff"
                                            : line.color
                                    }
                                    strokeWidth={
                                        line.tool === "eraser" ? 50 : 5
                                    }
                                    tension={0.5}
                                    lineCap="round"
                                    lineJoin="round"
                                    globalCompositeOperation={
                                        line.tool === "eraser"
                                            ? "destination-out"
                                            : "source-over"
                                    }
                                />
                            ))}
                        </Layer>
                    </Stage>
                    <div className={styles.toolsWrapper}>
                        <div className={styles.tools}>
                            <button
                                className={styles.button}
                                onClick={() => setTool(Tools.eraser)}
                            >
                                <img
                                    className={styles.buttonIcon}
                                    src={eraser}
                                    alt="eraser"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={() => setTool(Tools.pen)}
                            >
                                <img
                                    className={styles.buttonIcon}
                                    src={pen}
                                    alt="pen"
                                />
                            </button>
                            <button
                                className={styles.button}
                                onClick={async () => {
                                    dispatch(clearDrawing());
                                    await sendDelete();
                                }}
                            >
                                <img
                                    className={styles.buttonIcon}
                                    src={del}
                                    alt="delete"
                                />
                            </button>
                        </div>
                        <DrawingColorPicker
                            setColor={setColor}
                            setTool={setTool}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.spinnerWrapper}>
                    <Spinner />
                </div>
            )}
        </>
    );
};

export default Drawing;
