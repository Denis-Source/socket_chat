import React from 'react';
import {UserModel} from "../../Molels/User.model";
import {useSelector} from "react-redux";
import UserName from "./UserName/UserName";
import {Strings} from "../../strings";

import styles from "./Header.module.scss"


const Header = () => {
    // Get user from the state
    const user: UserModel = useSelector((state: any) => state.user.user);

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>{Strings.Header}</h1>
            {user &&
                <UserName/>
            }
        </div>
    );
};

export default Header;