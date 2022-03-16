import { Client, Message } from "discord.js";
import routeMessage from "./events/message";

const bot = new Client({
  intents: [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_BANS",
    "GUILD_PRESENCES",
    "GUILD_VOICE_STATES",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
  ],
  partials: ["REACTION", "MESSAGE", "CHANNEL"],
});

bot.login(process.env.BOT_TOKEN);

bot.on("ready", async () => {
  console.log(`Bot is online - ${bot.user?.tag}`);
});

bot.on("messageCreate", async (msg: Message) => {
  await routeMessage(msg);
});

export default bot;
module.exports = bot;
