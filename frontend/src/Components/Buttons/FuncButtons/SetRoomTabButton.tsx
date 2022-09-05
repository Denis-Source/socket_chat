import React from "react";
import BaseButton from "../BaseButton/BaseButton";
import roomListIcon from "../../../Static/Images/room_list.svg";
import { Strings } from "../../../strings";
import { LeftTabs, setLeftTab } from "../../../Reducers/General";
import { useDispatch } from "react-redux";

const SetRoomTabButton = () => {
  // Use dispatch to set left tab to the log list
  const dispatch = useDispatch();

  return (
    <BaseButton
      img={roomListIcon}
      imgDesc={Strings.RoomTabButtonDesc}
      callback={() => dispatch(setLeftTab(LeftTabs.Rooms))}
    />
  );
};

export default SetRoomTabButton;
