import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import backImage from "../../../Static/Images/back.svg";
import { Strings } from "../../../strings";
import { RightTabs, setRightTab } from "../../../Reducers/General";
import { useDispatch } from "react-redux";
import { clearMessages, resetMessages } from "../../../Reducers/Message";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "../../../router";

const GoBackButton = () => {
    // Use dispatch to set right tab to leave room and control tabs
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Function to leave the entered room
    const leave = async () => {
        // Navigate to the homepage
        navigate(RouterPaths.HomePage);
        // Clear message history
        dispatch(clearMessages());
        // Switch the left tab to room selection
        dispatch(setRightTab(RightTabs.Rooms));
        // Clear the messages
        dispatch(resetMessages());
    };
    return (
        <BaseButton
            img={backImage}
            imgDesc={Strings.GoBackButtonDesc}
            callback={leave}
        />
    );
};

export default GoBackButton;
