import { ethers } from "ethers";
import { ProtocolABI } from "../abi/Protocol";

export enum ProtocolAction {
    SetPermissions  = 0xffffffff,
    SetAddress      = 0x0000000f,
    MintVotingPower = 0x000000f0,
}

/**
 * decorate of protocol permissions represented by number to
 * grant user friendly way of checking if action is allowed
 */
export class ProtocolPermissions {
    private readonly permissions;

    constructor(permissions: number) {
        this.permissions = permissions;
    }

    public isActionAllowed(action: ProtocolAction) {
        return (action & this.permissions) != 0;
    }

    public isAnythingAllowed() {
        return this.permissions != 0;
    }
}

/**
 * decorator of protocol contract to grant type safe access to contract api
 */
export class ProtocolHandler {
    private readonly api: ethers.Contract;

    constructor(targe: string, runner: ethers.ContractRunner) {
        this.api = new ethers.Contract(targe, Object.values(ProtocolABI), runner);
    }

    public async getPermissions(user: string) {
        const res = await this.api.getPermissions(user);
        return new ProtocolPermissions(+(res).toString());
    }

    public async getContractAddress() {
        const res = await this.api.getContractAddress();
        return res as string[];
    }
}
