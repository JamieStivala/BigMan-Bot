import CentralizedMiddleware from "../middleware/CentralizedMiddleware";
import {MessageReaction, User} from "discord.js";
import QuoteVoteHandler from "./QuoteVoteHandler";
import RoastVoteHandler from "./RoastVoteHandler";
import InsultVoteHandler from "./InsultVoteHandler";

export default class VotingHandler {
    static approveReaction: string = "✅";
    static declineReaction: string = "❎";

    centralizedMiddleware: CentralizedMiddleware;

    quoteVoteHandler: QuoteVoteHandler;
    roastVoteHandler: RoastVoteHandler;
    insultVoteHandler: InsultVoteHandler;

    constructor(centralizedMiddleware: CentralizedMiddleware) {
        this.centralizedMiddleware = centralizedMiddleware;

        this.quoteVoteHandler = new QuoteVoteHandler(centralizedMiddleware);
        this.roastVoteHandler = new RoastVoteHandler(centralizedMiddleware);
        this.insultVoteHandler = new InsultVoteHandler(centralizedMiddleware);
    }

    async handleVote(messageReaction: MessageReaction, user: User): Promise<void> {
        let isReactionPending = this.isReactionPending(messageReaction.message.id);
        if (!isReactionPending.pending) return;

        if (isReactionPending.type === "quote") await this.quoteVoteHandler.handle(messageReaction, user);
        else if (isReactionPending.type === "roast") await this.roastVoteHandler.handle(messageReaction, user);
        else if (isReactionPending.type === "insult") await this.insultVoteHandler.handle(messageReaction, user);
    }

    private isReactionPending(messageId: string): PendingReaction {
        if (this.centralizedMiddleware.quoteMiddleware.isQuotePending(messageId)) return new PendingReaction(true, "quote");
        else if (this.centralizedMiddleware.roastMiddleware.isRoastPending(messageId)) return new PendingReaction(true, "roast")
        else if (this.centralizedMiddleware.insultMiddleware.isInsultPending(messageId)) return new PendingReaction(true, "insult")
        return new PendingReaction(false, undefined);
    }
}

class PendingReaction {
    readonly pending: boolean;
    readonly type: string;


    constructor(pending: boolean, type: string) {
        this.pending = pending;
        this.type = type;
    }
}