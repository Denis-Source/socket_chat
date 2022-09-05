import React from "react";
import UserName from "./UserName/UserName";
import { Strings } from "../../strings";
import styles from "./Header.module.scss";
import { ThemeColorPicker } from "../ColorPicker/ThemeColorPicker/ThemeColorPicker";

const Header = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <div />
                <h1 className={styles.header}>{Strings.Header}</h1>
                <ThemeColorPicker />
            </div>
            <UserName />
        </div>
    );
};

export default Header;
