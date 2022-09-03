import React from 'react';
import UserName from "./UserName/UserName";
import {Strings} from "../../strings";

import styles from "./Header.module.scss"


const Header = () => {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>{Strings.Header}</h1>
            <UserName/>
        </div>
    );
};

export default Header;