import * as Discord from 'discord.js';
import {GuildChannel, GuildMember, Message, MessageReaction, PartialMessage, User} from 'discord.js';
import * as properties from '../resources/config.json'
import Command from "./commands/model/Command";
import GuildHandler from "./GuildHandler";

const client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});
let guildHandler: GuildHandler;

client.on("ready", async () => {
    Command.prefixes = properties.bot.prefixes;

    guildHandler = new GuildHandler(client); //Init the GuildHandler

    client.user.setPresence({activity: {name: 'with Big People!'}, status: 'online'}).catch(console.error); //Setting the bot status
    console.log("Bot has started");
});

client.on("message", async (message) => {
    let messageInterceptor = await guildHandler.getGuildMessageInterceptor(message.guild.id);
    let commandHandler = await guildHandler.getGuildCommandHandler(message.guild.id);
    if (message.author.bot || await messageInterceptor.intercepted(message, false)) return;
    commandHandler.execute(message);
});

client.on("messageUpdate", async (oldMessage: Message, newMessage: Message) => {
    if (newMessage.partial) newMessage = await newMessage.fetch();
    if (newMessage.author.bot) return;
    await (await guildHandler.getGuildMessageInterceptor(newMessage.guild.id)).intercepted(newMessage, true);
});

client.on("messageDelete", async (message: Message | PartialMessage) => {
    await (await guildHandler.getGuildVotingHandler(message.guild.id)).handleMessageDelete(await guildHandler.getGuildMiddleware(message.guild.id), message.id)
});


client.on('messageReactionAdd', async (messageReaction: MessageReaction, user: User) => {
    let votingHandler = await guildHandler.getGuildVotingHandler(messageReaction.message.guild.id);
    await votingHandler.handleVote(messageReaction, user);
})

client.on('messageReactionRemove', async (messageReaction: MessageReaction, user: User) => {
    let votingHandler = await guildHandler.getGuildVotingHandler(messageReaction.message.guild.id);
    await votingHandler.handleVote(messageReaction, user);
});

client.on('guildMemberAdd', async (member : GuildMember) => {
    let defaultRoleHandler = await guildHandler.getDefaultRoleHandler(member.guild.id);
    await defaultRoleHandler.onChannelJoin(member); //todo on role update, check and give user
});

client.on('channelDelete', async (channel : GuildChannel) => {
    if(channel.type !== "text") return;
    let channelHandler = await guildHandler.getChannelHandler(channel.guild.id);
    await channelHandler.onChannelDelete(channel.id);
});

function startBot() {
    client.login(properties.bot.token).catch(error => console.log("Error logging in; " + error));
}

export {startBot}

/*
TODO Make sure only the needed guild cache is loaded

Code-review: Split the listeners to their respective handlers
Code-review: Add comments and proper documentation
 */