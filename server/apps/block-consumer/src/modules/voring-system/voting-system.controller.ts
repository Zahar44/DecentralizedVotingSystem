import { Topics } from "@app/core/web3";
import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { Log } from "web3";
import { VotingSystemService } from "./voting-system.service";

@Controller()
export class VotingSystemController {
    constructor(
        private readonly votingSystemService: VotingSystemService,
    ) {}

    @EventPattern(Topics.VotingCreated)
    public async votingCreated(@Payload() data: string) {
        const parsed = JSON.parse(data) as Log;
        this.votingSystemService.votingCreated(parsed);
    }

    @EventPattern(Topics.Voted)
    public async voted(@Payload() data: string) {
        const parsed = JSON.parse(data) as Log;
        this.votingSystemService.voted(parsed);
    }
}