import React from "react";
import { useSelector } from "react-redux";
import { LogModel } from "../../../Models/Log.model";
import Item from "../Item/Item";
import styles from "./List.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import { ViewportList } from "react-viewport-list";

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
                <ViewportList items={logs}>
                    {(item, index) => (
                        <Item
                            log={item}
                            key={index}
                            last={index === logs.length - 1}
                        />
                    )}
                </ViewportList>
            </div>
        </ScrollToBottom>
    );
};

export default List;
