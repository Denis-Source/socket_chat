import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import drawingIcon from "../../../Static/Images/drawing.svg";
import { Strings } from "../../../strings";
import { useDispatch } from "react-redux";
import { RightTabs, setRightTab } from "../../../Reducers/General";

const SetDrawingTabButton = () => {
    // Use dispatch to set left tab to the log list
    const dispatch = useDispatch();

    return (
        <BaseButton
            img={drawingIcon}
            imgDesc={Strings.DrawingTabButtonDesc}
            callback={() => dispatch(setRightTab(RightTabs.Drawing))}
        />
    );
};

export default SetDrawingTabButton;
