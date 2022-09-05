import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import messageIcon from "../../../Static/Images/messageTab.svg";
import { Strings } from "../../../strings";
import { RightTabs, setRightTab } from "../../../Reducers/General";
import { useDispatch } from "react-redux";

const SetMessageTabButton = () => {
  // Use dispatch to set right tab to messages
  const dispatch = useDispatch();

  return (
    <BaseButton
      img={messageIcon}
      imgDesc={Strings.MessageTabButtonDesc}
      callback={() => dispatch(setRightTab(RightTabs.Messages))}
    />
  );
};

export default SetMessageTabButton;
