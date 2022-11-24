import React from "react";
import styles from "./BaseLayout.module.scss";
import Header from "../../Components/Header/Header";
import { useSelector } from "react-redux";
import { AppStates, ErrorMessages } from "../../Reducers/General";
import Spinner from "../../Components/Spinner/Spinner";
import ErrorTab from "../../Components/Tabs/ErrorTab/ErrorTab";
import { Strings } from "../../strings";

const BaseLayout = ({
    children,
    dynamicHeight,
}: {
    children?: JSX.Element | [JSX.Element];
    dynamicHeight?: boolean;
}) => {
    // Get theme, application state and error message from the state
    const theme: string[] = useSelector((state: any) => state.general.theme);
    const appState: AppStates = useSelector(
        (state: any) => state.general.appState
    );
    const errorMessage: ErrorMessages = useSelector(
        (state: any) => state.general.errorMessage
    );

    // Decide what to render depending on the application state
    let selectedLayout;
    switch (appState) {
        case AppStates.Loading:
            dynamicHeight = false;
            selectedLayout = <Spinner />;
            break;
        case AppStates.Errored:
            selectedLayout = (
                <ErrorTab
                    message={errorMessage}
                    description={Strings.ErrorRefresh}
                    onClick={() => window.location.reload()}
                />
            );
            break;
        default:
            selectedLayout = (
                <div className={styles.container}>
                    <Header />
                    {children}
                </div>
            );
    }

    return (
        <div
            className={dynamicHeight ? styles.bodyFixed : styles.body}
            style={{
                background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
            }}
        >
            {selectedLayout}
        </div>
    );
};

export default BaseLayout;
