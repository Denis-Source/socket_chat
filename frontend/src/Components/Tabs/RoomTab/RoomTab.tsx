import React, { useState } from "react";
import List from "../../Room/List/List";
import Input from "../../Input/Input";
import styles from "./RoomTab.module.scss";
import { Strings } from "../../../strings";

const RoomTab = () => {
  // Use state to filter rooms with the input field
  const [filterString, setFilterString] = useState("");

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{Strings.ListRoomHeader}</h2>
        <Input
          setString={setFilterString}
          placeholder={Strings.SearchPlaceholder}
        />
      </div>
      <List filterString={filterString} />
    </div>
  );
};

export default RoomTab;
