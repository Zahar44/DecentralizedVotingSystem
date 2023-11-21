import { ethers } from "ethers";

export type TransactionStatus = 'failed' | 'success' | 'timeout';

export class ContractResponseHandler {
    private response: ethers.ContractTransactionResponse | false;
    private provider: ethers.Provider;

    // depends on blockchain time to mine block
    public pollingInterval = 1000;
    public pollingTriesTillCancel = 3;

    public get value() {
        return this.response;
    }

    constructor(
        response: ethers.ContractTransactionResponse | false,
        provider: ethers.Provider,
    ) {
        this.response = response;
        this.provider = provider;
    }

    public async waitConfirm(): Promise<TransactionStatus> {
        if (this.response === false) {
            return 'failed';
        }

        let tries = 0;
        while(tries++ < this.pollingTriesTillCancel) {
            const confirmed = await this.isTransactionConfirmed();
            if (confirmed) return 'success';
            await new Promise((resolve) => setTimeout(resolve, this.pollingInterval));
        }

        return 'timeout';
    }

    private async isTransactionConfirmed() {
        if (this.response === false) return false;
        const receipt = await this.provider.getTransactionReceipt(this.response.hash);
        await receipt?.confirmations();
        return !!receipt;
    }
}