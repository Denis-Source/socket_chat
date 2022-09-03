import React, {useState} from 'react';
import List from "../../Room/List/List";
import Input from "../../../Input/Input";
import styles from "./RoomTabMinimal.module.scss"
import {Strings} from "../../../strings";

const RoomTabMinimal = () => {
    const [filterString, setFilterString] = useState("");

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Input setString={setFilterString}
                    placeholder={Strings.SearchPlaceholder}
                />
            </div>
            <List filterString={filterString}/>
        </div>
    );
};

export default RoomTabMinimal;