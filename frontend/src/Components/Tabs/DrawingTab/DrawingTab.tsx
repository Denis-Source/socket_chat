import React, {useEffect, useState} from "react";
import Drawing from "../../Drawing/Drawing";
import styles from "./DrawingTab.module.scss";
import {useSelector} from "react-redux";
import {Strings} from "../../../strings";
import {RoomModel} from "../../../Models/Room.model";
import GoBackButton from "../../Buttons/FuncButtons/GoBackButton";
import SetMessageTabButton from "../../Buttons/FuncButtons/SetMessageTabButton";
import MutableName, {Alignment} from "../../MutableName/MutableName";
import DrawingDummy from "./DrawingDummy/DrawingDummy";

const DrawingTab = () => {
    // Get current room
    const currentRoom: RoomModel = useSelector(
        (state: any) => state.room.current
    );

    // Handle window size
    const getWindowSize = () => {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    };
    const [windowSize, setWindowSize] = useState(getWindowSize());
    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);
        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);
    const BREAKPOINT = 840;

    return (
        <>
            <div className={styles.header}>
                <div className={styles.navigation}>
                    <GoBackButton/>
                    <SetMessageTabButton/>
                </div>
                <div className={styles.nameWrapper}>
                    <p className={styles.hint}>{Strings.MessageTabRoom}</p>
                    <MutableName
                        room={currentRoom}
                        alignment={Alignment.right}
                    />
                </div>
            </div>
            {BREAKPOINT < windowSize.innerWidth ? (
                <Drawing/>
            ) : (
                <DrawingDummy/>
            )}
        </>
    );
};

export default DrawingTab;
