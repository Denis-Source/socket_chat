import React from "react";
import Drawing from "../../Drawing/Drawing";
import styles from "./DrawingTab.module.scss";
import { useSelector } from "react-redux";
import { Strings } from "../../../strings";
import { RoomModel } from "../../../Models/Room.model";
import GoBackButton from "../../Buttons/FuncButtons/GoBackButton";
import SetMessageTabButton from "../../Buttons/FuncButtons/SetMessageTabButton";
import MutableName, { Alignment } from "../../MutableName/MutableName";

const DrawingTab = () => {
  const currentRoom: RoomModel = useSelector(
    (state: any) => state.room.current
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.navigation}>
          <GoBackButton />
          <SetMessageTabButton />
        </div>
        <div className={styles.nameWrapper}>
          <p className={styles.hint}>{Strings.MessageTabRoom}</p>
          <MutableName room={currentRoom} alignment={Alignment.right} />
        </div>
      </div>
      <Drawing />
    </div>
  );
};

export default DrawingTab;
