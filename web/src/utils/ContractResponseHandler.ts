import { ethers } from "ethers";

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

    public onConfirmed(onConfirmed: (status: 'failed' | 'success') => void, onTimeout?: () => void) {
        if (this.response === false) {
            onConfirmed('failed');
            return;
        }

        // just in case using setTimeout
        // if something failed then it wont do same thing forever like setInterval
        let check: () => Promise<void>;
        let tries = 0;

        check = async () => {
            const confirmed = await this.isTransactionConfirmed();
            if (confirmed) {
                onConfirmed('success');
                return;
            }

            if (tries++ >= this.pollingTriesTillCancel) {
                if (onTimeout) onTimeout();
                return;
            }

            setTimeout(check, this.pollingInterval);
        }

        check();
    }

    private async isTransactionConfirmed() {
        if (this.response === false) return false;
        const receipt = await this.provider.getTransactionReceipt(this.response.hash);
        return !!receipt;
    }
}