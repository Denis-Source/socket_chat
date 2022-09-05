import React from "react";
import styles from "./BaseButton.module.scss";

export interface BaseButtonProps {
  img: string;
  imgDesc: string;
  callback: () => void;
}

const BaseButton = (button: BaseButtonProps) => {
  return (
    <button className={styles.button} onClick={button.callback}>
      <img
        className={styles.buttonIcon}
        src={button.img}
        alt={button.imgDesc}
      />
    </button>
  );
};

export default BaseButton;
