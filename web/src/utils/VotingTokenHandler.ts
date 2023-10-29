import { ethers } from "ethers";
import { ERC20TokenABI } from "../abi/Tokens";
import { ContractResponseHandler } from "./ContractResponseHandler";

export class VotingTokenHandler {
    private readonly api: ethers.Contract;
    private readonly runner: ethers.ContractRunner;

    constructor(targe: string, runner: ethers.ContractRunner) {
        this.api = new ethers.Contract(targe, Object.values(ERC20TokenABI), runner);
        this.runner = runner;
    }

    public async mint(to: string, amount: string | bigint) {
        const resp: ethers.ContractTransactionResponse = await this.api?.mint(to, amount);
        return new ContractResponseHandler(resp, this.runner.provider!);
    }

    public async balanceOf(user: string) {
        const balance = await this.api.balanceOf(user);
        return balance as bigint;
    }
}
