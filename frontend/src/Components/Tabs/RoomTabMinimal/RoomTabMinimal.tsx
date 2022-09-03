import React, {useState} from 'react';
import List from "../../Room/List/List";
import Input from "../../Input/Input";
import styles from "./RoomTabMinimal.module.scss"
import {Strings} from "../../../strings";
import log from "../../../Static/Images/log.svg"
import {useDispatch} from "react-redux";
import {LeftTabs, setLeftTab} from "../../../Reducers/General";

const RoomTabMinimal = () => {
    // Use state to filter rooms with the input field
    const [filterString, setFilterString] = useState("");

    // Use dispatch to switch the left tab
    const dispatch = useDispatch();

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <Input setString={setFilterString}
                       placeholder={Strings.SearchPlaceholder}
                />
                <button className={styles.button} onClick={() => dispatch(setLeftTab(LeftTabs.Log))}>
                    <img className={styles.buttonIcon} src={log} alt="Add icon"/>
                </button>
            </div>
            <List filterString={filterString}/>
        </div>
    );
};

export default RoomTabMinimal;