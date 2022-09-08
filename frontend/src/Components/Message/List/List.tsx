import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MessageModel} from "../../../Models/Message.model";
import Item from "../Item/Item";
import {UserModel} from "../../../Models/User.model";

import styles from "./List.module.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import useSound from "use-sound";
import {setNew} from "../../../Reducers/Message";
import Spinner from "../../Spinner/Spinner";

const notificationOther = require("../../../Static/Sound/messageOther.mp3");
const notificationMine = require("../../../Static/Sound/messageMine.mp3");

const List = () => {
    const messages: MessageModel[] = useSelector(
        (state: any) => state.message.list
    );

    const dispatch = useDispatch();

    const user: UserModel = useSelector((state: any) => state.user.user);
    const toNotify: boolean = useSelector((state: any) => state.message.isNew);
    // Use sound for notification
    const [playOther] = useSound(notificationOther);
    const [playMine] = useSound(notificationMine);
    useEffect(() => {
        if (toNotify) {
            messages[messages.length - 1].user.uuid === user.uuid
                ? playMine()
                : playOther();

            dispatch(setNew());
        }
    });

    return (
        <ScrollToBottom
            initialScrollBehavior={"auto"}
            className={styles.wrapper}
            followButtonClassName={styles.scrollButton}
        >
            <div className={styles.messages}>
                {messages ?
                        messages.map((message) => (
                            <Item
                                message={message}
                                isMine={message.user.uuid === user.uuid}
                                key={message.uuid}
                            />
                        )):
                    <Spinner/>
                }
            </div>
        </ScrollToBottom>

    );
};

export default List;
