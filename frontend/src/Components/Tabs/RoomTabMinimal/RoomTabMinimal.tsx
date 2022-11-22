import React, {useState} from "react";
import List from "../../Room/List/List";
import Input from "../../Input/Input";
import styles from "./RoomTabMinimal.module.scss";
import {Strings} from "../../../strings";
import SetLogTabButton from "../../Buttons/FuncButtons/SetLogTabButton";

const RoomTabMinimal = () => {
    // Use state to filter rooms with the input field
    const [filterString, setFilterString] = useState("");

    return (
        <>
            <div className={styles.header}>
                <Input
                    setString={setFilterString}
                    placeholder={Strings.SearchPlaceholder}
                />
                <SetLogTabButton/>
            </div>
            <List filterString={filterString}/>
        </>
    );
};

export default RoomTabMinimal;
