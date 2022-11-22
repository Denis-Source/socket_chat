import React from "react";
import UserName from "./UserName/UserName";
import { Strings } from "../../strings";
import styles from "./Header.module.scss";
import { ThemeColorPicker } from "../ColorPicker/ThemeColorPicker/ThemeColorPicker";
import { UserModel } from "../../Models/User.model";
import { useSelector } from "react-redux";

const Header = () => {
    // Get user model from the store
    const user: UserModel = useSelector((state: any) => state.user.user);

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div />
                <h1 className={styles.header}>{Strings.Header}</h1>
                <ThemeColorPicker />
            </div>
            {user && <UserName />}
        </div>
    );
};

export default Header;
