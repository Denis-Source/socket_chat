import React from 'react';
import {useSelector} from "react-redux";
import {MessageModel} from "../../../Models/Message.model";
import Item from "../Item/Item";
import {UserModel} from "../../../Models/User.model";

import styles from "./List.module.scss"
import ScrollToBottom from "react-scroll-to-bottom";

const List = () => {
    const messages: MessageModel[] = useSelector((state: any) => state.message.list);
    const user: UserModel = useSelector((state: any) => state.user.user);


    return (
        <ScrollToBottom className={styles.wrapper} followButtonClassName={styles.scrollButton}>
            <div className={styles.messages}>
                {messages.map(message =>
                    <Item message={message} isMine={message.user.uuid === user.uuid} key={message.uuid}/>
                )}
            </div>
        </ScrollToBottom>
    );
};

export default List;