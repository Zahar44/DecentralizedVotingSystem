import { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { Web3Context } from '../../context/Web3';

function Login() {
    const { userAddress, setAddress } = useContext(Web3Context);

    const connect = async () => {
        try {
            const addresses = await window.ethereum!.request<string[]>({ method: 'eth_requestAccounts' });
            if (addresses && addresses[0]) {
                setAddress(addresses[0]);
            }
        } catch(err) {
            console.warn(`failed to connect..`, err);
        }
    };

    if (userAddress) {
        return <Navigate to='/' />
    }

    return (
        <>
            <button onClick={connect}>
                Click to connect
            </button>
        </>
    )
}

export default Login
