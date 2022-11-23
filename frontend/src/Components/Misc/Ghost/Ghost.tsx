import React from "react";
import styles from "./Ghost.module.scss";
import ghostIcon from "../../../Static/Images/ghost.svg";
import { Strings } from "../../../strings";
import { motion } from "framer-motion";

export enum Animations {
    Wobble = "wobble",
    Shake = "shake",
    Nod = "nod"
}

const Ghost = ({ animation }: { animation: Animations }) => {
    let ghostStyle;
    switch (animation) {
        case Animations.Wobble:
            ghostStyle = styles.ghostWobble;
            break;
        case Animations.Shake:
            ghostStyle = styles.ghostShake;
            break;
        case Animations.Nod:
            ghostStyle = styles.ghostNod;
            break;
    }
    return (
        <motion.div
            layout
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={ghostStyle}
        >
            <img
                className={styles.icon}
                src={ghostIcon}
                alt={Strings.GhostDesc}
            />
        </motion.div>
    );
};

export default Ghost;
