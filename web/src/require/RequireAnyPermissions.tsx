import { useContext } from "react";
import { ProtocolContext } from "../context/Protocol";
import { Navigate, Outlet } from "react-router-dom";

function RequireAnyPermissions() {
    const { permissions } = useContext(ProtocolContext);

    if (permissions?.isAnythingAllowed()) {
        return <Outlet/>;
    }

    return <Navigate to="/" />
}

export default RequireAnyPermissions;
