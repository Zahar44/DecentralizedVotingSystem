import { ethers } from "ethers";

export class ContractResponseHandler {
    private response: ethers.ContractTransactionResponse;
    private provider: ethers.Provider;

    // depends on blockchain time to mine block
    public pollingInterval = 1000;
    public pollingTriesTillCancel = 3;

    public get value() {
        return this.response;
    }

    constructor(
        response: ethers.ContractTransactionResponse,
        provider: ethers.Provider,
    ) {
        this.response = response;
        this.provider = provider;
    }

    public onConfirmed(onConfirmed: () => void, onCancel?: () => void) {
        // just in case using setTimeout
        // if something failed then it wont do same thing forever like setInterval
        let check: () => Promise<void>;
        let tries = 0;

        check = async () => {
            const confirmed = await this.isTransactionConfirmed();
            if (confirmed) {
                onConfirmed();
                return;
            }

            if (tries++ >= this.pollingTriesTillCancel) {
                if (onCancel) onCancel();
                return;
            }

            setTimeout(check, this.pollingInterval);
        }

        check();
    }

    private async isTransactionConfirmed() {
        const receipt = await this.provider.getTransactionReceipt(this.response.hash);
        return !!receipt;
    }
}