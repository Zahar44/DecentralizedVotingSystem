import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Web3Connection } from "@app/core/web3";
import Web3 from "web3";
import { ERC20Abi } from "@app/core/web3/abi";

@Injectable()
export class ERC20TokenService {
    private readonly token: ReturnType<typeof this.getContract>;

    constructor(
        @Inject(Web3Connection) private readonly web3: Web3,
        private readonly prisma: PrismaService,
    ) {

        this.token = this.getContract();
        // this is due to issue I mentioned here https://github.com/web3/web3.js/issues/6557
        (this.token as any)['_dataInputFill'] = 'both';
    }

    private getContract() {
        return new this.web3.eth.Contract(ERC20Abi);
    }

    public async addToken(address: string) {
        this.token.options.address = address;
        const web3CallPromise = Promise.all([
            this.token.methods.decimals().call(),
        ]);

        const [decimals] = await web3CallPromise;

        return this.prisma.token.create({
            data: {
                address,
                decimals: +decimals.toString(),
            },
        });
    }

    public async getOrCreateToken(address: string) {
        const token = await this.prisma.token.findUnique({
            where: {
                address: address,
            },
        });
        if (token) return token;

        const addedToken = await this.addToken(address!);
        return addedToken;
    }

    public async getBalance(token: string, account: string) {
        this.token.options.address = token;
        const web3CallPromise = Promise.all([
            this.token.methods.transfer(account, '123').call(),
        ]);

        const [balance] = await web3CallPromise;

        return BigInt(balance.toString());
    }
}
