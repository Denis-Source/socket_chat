import { createBrowserRouter } from "react-router-dom";
import HomePageLayout from "./Layouts/HomePageLayout/HomePageLayout";
import React from "react";
import RoomLayout from "./Layouts/RoomLayout/RoomLayout";
import { Strings } from "./strings";
import ErrorLayout from "./Layouts/ErrorLayout/ErrorLayout";

export enum RouterPaths {
    HomePage = "/",
    Rooms = "/room",
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
        path: "/room",
        element: <RoomLayout />,
        errorElement: (
            <ErrorLayout
                message={Strings.NoPageFound}
                description={Strings.GoBack}
            />
        ),
    },
]);
