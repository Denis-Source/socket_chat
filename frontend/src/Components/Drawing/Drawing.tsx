import React, { useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import styles from "./Drawing.module.scss";
import { CirclePicker } from "react-color";
import eraser from "../../Static/Images/eraser.svg";
import pen from "../../Static/Images/pen.svg";
import del from "../../Static/Images/delete.svg";
import { prepareStatement, WSS_FEED_URL } from "../../api";
import { TypeStatements } from "../../StatementsTypes/TypeStatements";
import useWebSocket from "react-use-websocket";
import { DrawingStatements } from "../../StatementsTypes/DrawingStatements";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDrawing,
  updateDrawing,
  updateDrawingLine,
} from "../../Reducers/Drawing";
import { DrawingModel } from "../../Models/Drawing.model";
import Spinner from "../Spinner/Spinner";

enum Tools {
  pen = "pen",
  eraser = "eraser",
}

const Drawing = () => {
  const WIDTH = 640;
  const HEIGHT = 480;

  const [color, setColor] = useState("#000000cc");

  const stageRef = React.useRef<any>(null);
  const [tool, setTool] = useState(Tools.pen);
  const isDrawing = useRef(false);
  const [uuid, setUuid] = useState(crypto.randomUUID());
  const [lastLine, setLastLine] = useState<any>();

  // Configure websocket connection
  const { sendJsonMessage } = useWebSocket(WSS_FEED_URL, {
    share: true,
  });

  const drawing: DrawingModel = useSelector(
    (state: any) => state.drawing.drawing
  );
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
    const statement = prepareStatement({
      type: TypeStatements.Call,
      message: DrawingStatements.ChangeDrawLine,
      uuid: uuid,
      points: lastLine.points,
      color: lastLine.color,
      tool: lastLine.tool,
    });
    await sendJsonMessage(statement);
  };

  const handleMouseDown = async (e: any) => {
    setUuid(crypto.randomUUID());
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    dispatch(updateDrawing({ uuid, tool, color, points: [pos.x, pos.y] }));
  };

  const handleMouseMove = (e: any) => {
    if (isDrawing.current) {
      const stage = e.target.getStage();
      const point: { x: number; y: number } = stage.getPointerPosition();
      dispatch(updateDrawingLine(point));
      setLastLine(drawing.lines[drawing.lines.length - 1]);
    }
  };

  const handleMouseUp = async () => {
    isDrawing.current = false;
    await sendUpdate();
  };

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
              {drawing.lines?.map((line: any, i: number) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === "eraser" ? "#ffffff" : line.color}
                  strokeWidth={line.tool === "eraser" ? 50 : 5}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
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
                <img className={styles.buttonIcon} src={eraser} alt="eraser" />
              </button>
              <button
                className={styles.button}
                onClick={() => setTool(Tools.pen)}
              >
                <img className={styles.buttonIcon} src={pen} alt="pen" />
              </button>
              <button
                className={styles.button}
                onClick={async () => {
                  dispatch(clearDrawing());
                  await sendDelete();
                }}
              >
                <img className={styles.buttonIcon} src={del} alt="delete" />
              </button>
            </div>
            <CirclePicker
              className={styles.picker}
              width={"130px"}
              onChange={(color) => {
                setColor(`${color.hex}cc`);
                setTool(Tools.pen);
              }}
            />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default Drawing;
