import BaseMiddleware from "./BaseMiddleware";
import GuildCache from "../cache/GuildCache";
import GuildWrapper from "../database/wrapper/GuildWrapper";

export default class GuildMiddleware extends BaseMiddleware {
    readonly guildCache: GuildCache;
    readonly guildWrapper: GuildWrapper;
    cacheBuilt: boolean;

    constructor(guild: string) {
        super(guild);

        this.guildCache = new GuildCache();
        this.guildWrapper = new GuildWrapper(guild);
    }

    async buildCache(): Promise<void> {
        this.guildCache.setCache(await this.guildWrapper.getGuild());
        this.cacheBuilt = true;
    }

    async setQuoteSubmissionChannel(channel: string): Promise<void> {
        this.guildCache.setQuoteSubmissionChannel(channel);
        await this.guildWrapper.setQuoteSubmissionChannel(channel);
    }

    async setQuoteChannel(channel: string): Promise<void> {
        this.guildCache.setQuoteChannel(channel);
        await this.guildWrapper.setQuoteChannel(channel);
    }

    async setRoastSubmissionChannel(channel: string): Promise<void> {
        this.guildCache.setRoastSubmissionChannel(channel);
        await this.guildWrapper.setRoastSubmissionChannel(channel);
    }

    async setInsultSubmissionChannel(channel: string): Promise<void> {
        this.guildCache.setInsultSubmissionChannel(channel);
        await this.guildWrapper.setInsultSubmissionChannel(channel);
    }

    async setBigmanRole(role: string): Promise<void> {
        this.guildCache.setBigmanRole(role);
        await this.guildWrapper.setBigmanRole(role);
    }

    async setGeneralRole(role: string) : Promise <void>{
        this.guildCache.setGeneralRole(role);
        await this.guildWrapper.setGeneralRole(role);
    }

    async setBadmanRole(role: string): Promise<void> {
        this.guildCache.setBadmanRole(role);
        await this.guildWrapper.setBadmanRole(role);
    }

    async setMusicChannel(channel: string): Promise<void> {
        this.guildCache.setMusicChannel(channel);
        await this.guildWrapper.setMusicChannel(channel);
    }

    async addPrefix(prefix: string): Promise<void> {
        let currentPrefixes = this.prefixes;
        currentPrefixes.push(prefix);

        await this.guildWrapper.setPrefixes(currentPrefixes);
        this.guildCache.setPrefixes(currentPrefixes)
    }

    get prefixes(): string[] {
        return this.guildCache.guild.prefixes;
    }

    async removePrefix(prefix: string): Promise<boolean> {
        let currentPrefixes = this.prefixes;
        let found: boolean = false;
        for (let i = 0; i !== currentPrefixes.length; i++) {
            if (currentPrefixes[i] === prefix) {
                currentPrefixes.splice(i, 1);
                found = true;
            }
        }

        await this.guildWrapper.setPrefixes(currentPrefixes);
        this.guildCache.setPrefixes(currentPrefixes);

        return found;
    }

    get bigmanRole(): string {
        return this.guildCache.guild.bigmanRole;
    }

    get generalRole(): string {
        return this.guildCache.guild.generalRole;
    }

    get badmanRole(): string {
        return this.guildCache.guild.badmanRole;
    }

    get insultSubmission() : string {
        return this.guildCache.guild.insultSubmission
    }

    get roastSubmission() : string {
        return this.guildCache.guild.roastSubmission
    }

    get quoteSubmission() : string {
        return this.guildCache.guild.quoteSubmission;
    }

    get quoteChannel(): string {
        return this.guildCache.guild.quoteChannel;
    }

    get musicChannel(): string {
        return this.guildCache.guild.musicChannel;
    }
}