import { ethers } from "ethers";
import { ContractResponseHandler } from "./ContractResponseHandler";
import { VotingSystemABI } from "../abi/VotingSystem";

export class VotingSystemHandler {
    private readonly api: ethers.Contract;
    private readonly runner: ethers.ContractRunner;

    constructor(targe: string, runner: ethers.ContractRunner) {
        this.api = new ethers.Contract(targe, Object.values(VotingSystemABI), runner);
        this.runner = runner;
    }

    public async createProject() {
        try {
            const resp: ethers.ContractTransactionResponse = await this.api?.createVoting();
            return new ContractResponseHandler(resp, this.runner.provider!);
        } catch(error) {
            return new ContractResponseHandler(false, this.runner.provider!);
        }
    }

    public async getTotalSupply() {
        const res = await this.api?.totalSupply() as bigint;
        return +res.toString();
    }
}
