import React from 'react';
import styles from "./Input.module.scss";

const Input = ({setString, placeholder}: { setString: (value: string) => void, placeholder: string}) => {
    return (
        <div className={styles.searchWrapper}>
            <input placeholder={placeholder} className={styles.input} type="text"
                   onChange={(event) => setString(event.target.value)}/>
        </div>

    );
};

export default Input;