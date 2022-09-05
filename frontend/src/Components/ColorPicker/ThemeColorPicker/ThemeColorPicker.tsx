import React from "react";
import ReactSlider from "react-slider";
import styles from "./ThemeColorPicker.module.scss";
import { useDispatch } from "react-redux";
import { BACKGROUND_COLORS, setTheme } from "../../../Reducers/General";
import { useCookies } from "react-cookie";
import themeIcon from "../../../Static/Images/theme.svg";
import { Strings } from "../../../strings";

export const ThemeColorPicker = () => {
    // Use cookies to store theme
    const [cookies, setCookie] = useCookies(["theme"]);

    // Function to handle theme changes
    const onChange = (value: number) => {
        dispatch(setTheme(value));
        setCookie("theme", value, { path: "/" });
    };

    // Use dispatch to store the selected theme in the state
    const dispatch = useDispatch();
    return (
        <div className={styles.wrapper}>
            <ReactSlider
                value={cookies.theme}
                min={0}
                max={BACKGROUND_COLORS.length - 1}
                className={styles.picker}
                thumbClassName={styles.thumb}
                trackClassName={styles.track}
                onChange={onChange}
            />
            <img
                className={styles.icon}
                src={themeIcon}
                alt={Strings.ThemeIconDesc}
            />
        </div>
    );
};
