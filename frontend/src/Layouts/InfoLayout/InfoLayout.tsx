import React from "react";
import { Strings } from "../../strings";
import BaseLayout from "../BaseLayout/BaseLayout";
import styles from "./InfoLayout.module.scss";
import Ghost, { Animations } from "../../Components/Misc/Ghost/Ghost";
import { Link } from "react-router-dom";
import { RouterPaths } from "../../router";

const InfoLayout = () => {
    return (
        <BaseLayout dynamicHeight={true}>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h2>{Strings.InfoHeader}</h2>
                </div>
                <div className={styles.body}>
                    <Ghost animation={Animations.Nod} />
                    <p className={styles.desc}>{Strings.InfoP1}</p>
                    <p className={styles.desc}>{Strings.InfoP2}</p>
                    <p className={styles.desc}>
                        <a
                            className={styles.link}
                            href="https://zoloto.cx.ua/#section-portfolio"
                            target="_blank"
                            rel="noopener"
                        >
                            <u>{Strings.InfoLink}</u>
                        </a>
                    </p>
                    <p className={styles.desc}>{Strings.InfoP3}</p>
                    <p className={styles.desc}>
                        {Strings.InfoP4}
                        <a
                            className={styles.link}
                            href="https://github.com/Denis-Source/socket_chat"
                            target="_blank"
                            rel="noopener"
                        >
                            <u>GitHub</u>
                        </a>
                    </p>
                    <p className={styles.desc}>{Strings.InfoCopyRight}</p>
                    <Link className={styles.desc} to={RouterPaths.HomePage}>
                        <u>{Strings.GoBack}</u>
                    </Link>
                </div>
            </div>
        </BaseLayout>
    );
};

export default InfoLayout;
