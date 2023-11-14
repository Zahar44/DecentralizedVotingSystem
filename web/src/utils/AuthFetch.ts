import { ethers } from "ethers";
import { LoginRequestDto, LoginResponseDto, MessageResponseDto, RefreshResponseDto } from '@server/auth/dto';
import { jwtDecode } from 'jwt-decode';

interface StoredToken {
    token: string;
    expire: number;
}

export const setCorsHeaders = (headers: RequestInit['headers']) => {
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        ...headers,
    };
};

export const getValidAccessToken = async (userAddress: string, signer: ethers.Signer) => {
    const accessToken = localStorage.getItem('access-token');
    if (!accessToken) {
        return loginAndStore(userAddress, signer);
    }

    const parsedAccessToken = JSON.parse(accessToken) as StoredToken;
    if (parsedAccessToken.expire * 1000 < Date.now()) {
        return refreshToken(userAddress, signer);
    }

    return parsedAccessToken.token;
};

const loginAndStore = async (userAddress: string, signer: ethers.Signer) => {
    const { accessToken, refreshToken } = await login(userAddress, signer);

    const accessTokenStored = { token: accessToken, expire: jwtDecode(accessToken).exp };
    const refreshTokenStored = { token: refreshToken, expire: jwtDecode(refreshToken).exp };
    localStorage.setItem('access-token', JSON.stringify(accessTokenStored));
    localStorage.setItem('refresh-token', JSON.stringify(refreshTokenStored));
    return accessToken;
}

const login = async (userAddress: string, signer: ethers.Signer) => {
    const init: RequestInit = { headers: {} };
    setCorsHeaders(init.headers);
    const messageResponse = await fetch(
        import.meta.env.VITE_API_URL + 'auth/message/' + userAddress,
        init,
    );
    const { message } = await messageResponse.json() as MessageResponseDto;
    const signature = await signer.signMessage(message);
    const loginRequest: LoginRequestDto = {
        signature,
        address: userAddress,
    }

    init.headers = {
        ...init.headers,
        'Content-Type': 'application/json',
    }
    const loginResponse = await fetch(
        import.meta.env.VITE_API_URL + 'auth/login',
        {
            ...init,
            method: 'POST',
            body: JSON.stringify(loginRequest),
        }
    );
    return await loginResponse.json() as LoginResponseDto;
}

const refreshToken = async (userAddress: string, signer: ethers.Signer) => {
    const refreshToken = localStorage.getItem('refresh-token');
    if (!refreshToken) return loginAndStore(userAddress, signer);
    const refreshTokenParsed = JSON.parse(refreshToken) as StoredToken;
    if (refreshTokenParsed.expire * 1000 < Date.now()) return loginAndStore(userAddress, signer);

    const headers: HeadersInit = {
        Authorization: refreshTokenParsed.token,
        'Content-Type': 'application/json',
    }
    setCorsHeaders(headers);
    const resp = await fetch(
        import.meta.env.VITE_API_URL + 'auth/refresh',
        {
            headers,
            method: 'POST',
        }
    );
    const { accessToken } = await resp.json() as RefreshResponseDto;
    const accessTokenStored = { token: accessToken, expire: jwtDecode(accessToken).exp };
    localStorage.setItem('access-token', JSON.stringify(accessTokenStored));
    return accessToken;
}