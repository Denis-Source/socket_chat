import React from "react";
import { useSelector } from "react-redux";
import { LogModel } from "../../../Models/Log.model";
import Item from "../Item/Item";
import styles from "./List.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";

const List = () => {
    // Get log list from the state
    const logs: LogModel[] = useSelector((state: any) => state.log.list);

    return (
        <ScrollToBottom
            initialScrollBehavior={"auto"}
            followButtonClassName={styles.followButton}
            className={styles.listWrapper}
        >
            <div className={styles.list}>
                {logs.map((log, index) => (
                    <Item log={log} key={index} />
                ))}
            </div>
        </ScrollToBottom>
    );
};

export default List;
