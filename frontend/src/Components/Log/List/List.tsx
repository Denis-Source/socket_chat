import React from 'react';
import {useSelector} from "react-redux";
import {LogModel} from "../../../Models/Log.model";
import Item from "../Item/Item";
import styles from "./List.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";

const List = () => {
    const logs: LogModel[] = useSelector((state: any) => state.log.list);

    return (
        <ScrollToBottom initialScrollBehavior={"auto"} followButtonClassName={styles.followButton} className={styles.listWrapper}>
            <div className={styles.list}>
            {logs.map(log =>
                <Item log={log}/>
            )}
        </div>
        </ScrollToBottom>
    );
};

export default List;