import { registerAs } from "@nestjs/config";

export interface Web3Config {
    url: string;
}

export const Web3Config = 'Web3Config';

export const Web3ConfigLoaded = registerAs(Web3Config, () => {
    const config: Web3Config = {
        url: process.env.WEB3_CONNECTION_URL || 'http://localhost:8545/',
    };

    return config;
});
