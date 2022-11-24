import { createBrowserRouter } from "react-router-dom";
import HomePageLayout from "./Layouts/HomePageLayout/HomePageLayout";
import React from "react";
import RoomLayout from "./Layouts/RoomLayout/RoomLayout";
import { Strings } from "./strings";
import ErrorLayout from "./Layouts/ErrorLayout/ErrorLayout";
import { ErrorMessages } from "./Reducers/General";
import InfoLayout from "./Layouts/InfoLayout/InfoLayout";

export enum RouterPaths {
    HomePage = "/",
    Rooms = "/room",
    Info = "/info",
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePageLayout />,
        errorElement: (
            <ErrorLayout
                message={Strings.NoPageFound}
                description={Strings.GoBack}
            />
        ),
    },
    {
        path: "/room/:roomUuid",
        element: <RoomLayout />,
        errorElement: (
            <ErrorLayout
                message={ErrorMessages.Unknown}
                description={Strings.GoBack}
            />
        ),
    },
    {
        path: "/info",
        element: <InfoLayout />,
        errorElement: (
            <ErrorLayout
                message={ErrorMessages.Unknown}
                description={Strings.GoBack}
            />
        ),
    },
]);
