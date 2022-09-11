import React from "react";
import styles from "./DrawingColorPicker.module.scss";
import { drawingColors } from "../../Drawing/DrawingColors";
import { Tools } from "../../Drawing/Drawing";

const DrawingColorPicker = ({
    setColor,
    setTool,
}: {
    setColor: (value: string) => void;
    setTool: (tool: Tools) => void;
}) => {
    return (
        <div className={styles.picker}>
            {drawingColors.map((item) => (
                <div
                    style={{ backgroundColor: `${item}cc` }}
                    className={styles.color}
                    onClick={() => {
                        setColor(item);
                        setTool(Tools.pen);
                    }}
                />
            ))}
        </div>
    );
};

export default DrawingColorPicker;
