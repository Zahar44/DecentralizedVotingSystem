import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Web3Context } from "../context/Web3";

export function RequireLogin() {
    const { userAddress } = useContext(Web3Context);

    if (userAddress) {
        return <Outlet/>;
    }

    return <Navigate to="login" />
}

export default RequireLogin;
