import React from 'react';
import BaseLayout from "../BaseLayout/BaseLayout";
import ErrorTab from "../../Components/Tabs/ErrorTab/ErrorTab";
import {ErrorMessages} from "../../Reducers/General";
import {useNavigate} from "react-router-dom";
import {RouterPaths} from "../../router";

const ErrorLayout = (
    {
        message,
        description,
        onClick
    }: {
        message: ErrorMessages | string,
        description?: string,
        onClick?: () => void
    }) => {
    // Get navigator to redirect to the homepage onClick
    const navigate = useNavigate();

    return (
        <BaseLayout>
            <ErrorTab
                message={message}
                onClick={onClick ?? (() => {
                    navigate(RouterPaths.HomePage)
                })}
                description={description}
            />
        </BaseLayout>
    );
};

export default ErrorLayout;