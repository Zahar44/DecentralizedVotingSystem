import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Web3Context } from "../../pages/protocol/Web3";

export function RequireLogin({ children }: React.PropsWithChildren) {
    const { userAddress } = useContext(Web3Context);

    if (userAddress) {
        return children;
    }

    return <Navigate to="login" />
}

export default RequireLogin;
