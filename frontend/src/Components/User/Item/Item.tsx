import React from "react";
import { UserModel } from "../../../Models/User.model";
import styles from "./Item.module.scss";
import { Strings } from "../../../strings";

const Item = ({ user, isMe }: { user: UserModel; isMe: boolean }) => {
    return (
        <div className={isMe ? styles.userMe : styles.user}>
            <p className={styles.name}>
                {user.name}
                {isMe && " " + Strings.MeUserList}
            </p>
            <p className={styles.uuid}>{user.uuid}</p>
        </div>
    );
};

export default Item;
