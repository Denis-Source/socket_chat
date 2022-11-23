import React from "react";
import { useSelector } from "react-redux";
import LogTab from "../../Components/Tabs/LogTab/LogTab";
import styles from "./HomePage.module.scss";
import RoomTab from "../../Components/Tabs/RoomTab/RoomTab";
import BaseLayout from "../BaseLayout/BaseLayout";

const HomePageLayout = () => {
    const { leftTab } = useSelector((state: any) => state.general);
    let leftTabElement;

    switch (leftTab) {
        default:
            leftTabElement = <LogTab />;
            break;
    }

    return (
        <BaseLayout>
            <div className={styles.layout}>
                <div className={styles.leftTab}>{leftTabElement}</div>
                <div className={styles.rightTab}>
                    <RoomTab />
                </div>
            </div>
        </BaseLayout>
    );
};

export default HomePageLayout;
