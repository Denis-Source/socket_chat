import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import logIcon from "../../../Static/Images/log.svg";
import { Strings } from "../../../strings";
import { LeftTabs, setLeftTab } from "../../../Reducers/General";
import { useDispatch } from "react-redux";

const SetLogTabButton = () => {
    // Use dispatch to set right tab to messages
    const dispatch = useDispatch();

    return (
        <BaseButton
            img={logIcon}
            imgDesc={Strings.LogTabButtonDesc}
            callback={() => dispatch(setLeftTab(LeftTabs.Log))}
        />
    );
};

export default SetLogTabButton;
