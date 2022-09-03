import React from "react";
import spinner from "../../Static/Images/spinner.svg";
import styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={styles.wrapper}>
      <img className={styles.spinner} src={spinner} alt="spinner" />
    </div>
  );
};

export default Spinner;
