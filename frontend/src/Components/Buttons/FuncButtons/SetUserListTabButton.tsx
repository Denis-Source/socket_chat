import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import userListIcon from "../../../Static/Images/userList.svg";
import { Strings } from "../../../strings";
import { useDispatch } from "react-redux";
import { RightTabs, setRightTab } from "../../../Reducers/General";

const SetDrawingTabButton = () => {
    // Use dispatch to set left tab to the log list
    const dispatch = useDispatch();

    return (
        <BaseButton
            img={userListIcon}
    imgDesc={Strings.DrawingTabButtonDesc}
    callback={() => dispatch(setRightTab(RightTabs.UserList))}
    />
);
};

export default SetDrawingTabButton;
