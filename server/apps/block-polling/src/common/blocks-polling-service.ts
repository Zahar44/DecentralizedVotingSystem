import { Log } from "web3";

export abstract class IBlocksPollingService {
    public abstract start(): Promise<void>;
}
