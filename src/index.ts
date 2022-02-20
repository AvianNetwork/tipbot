// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";
import fetch from "node-fetch";

import dayjs from "dayjs";
import dayjs_utc from "dayjs/plugin/utc.js";
import dayjs_timezone from "dayjs/plugin/timezone.js";
dayjs.extend(dayjs_utc);
dayjs.extend(dayjs_timezone);

// Import helper functions
import * as helper from "./helper.js";
import * as commands from "./commands.js";
import * as exbitron from "./exbitron.js";

// We can only fetch channels within the bot.on(`ready`) function
let logChannel: Discord.TextChannel;
let spamChannel: Discord.TextChannel;

// Create the bot
const bot = new Discord.Client({
    intents: [
        `GUILDS`,
        `GUILD_MESSAGES`,
        `DIRECT_MESSAGES`,
        `GUILD_PRESENCES`
    ],
    partials: [`CHANNEL`]
});

// When the bot logged in
bot.on(`ready`, async () => {
    // Set the channels
    const tempLogChannel = await bot.channels.fetch(config.moderation.logchannel);
    if (!tempLogChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Log channel not found.`);
        process.exit(1);
    } else {
        logChannel = <Discord.TextChannel>tempLogChannel;
    }

    const tempSpamChannel = await bot.channels.fetch(config.moderation.botspamchannel);
    if (!tempSpamChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Log channel not found.`);
        process.exit(1);
    } else {
        spamChannel = <Discord.TextChannel>tempSpamChannel;
    }

    // Send startup messages
    console.log(`[${helper.getTime()}] Logged in as ${bot.user?.username}#${bot.user?.discriminator} (${bot.user?.id}).`);
    logChannel.send(`[${helper.getTime()}] Logged in as ${bot.user?.username}#${bot.user?.discriminator} (${bot.user?.id}).`);

    // Set the bot presence
    setInterval(async () => {
        const ticker = await exbitron.getTicker("usdt").catch((error) => {
            console.error(`[${helper.getTime()}] Error while fetching Exbitron price: ${error}`);
            logChannel.send(`[${helper.getTime()}] Error while fetching Exbitron price: ${error}`);
            return undefined;
        });
        if (ticker === undefined) return;

        bot.user?.setActivity(`${ticker[`last`]} USDT`, { type: `WATCHING` });
    }, 60 * 1000); // Every minute
});

// General error handling
process.on(`uncaughtException`, (error) => {
    const message: string = `[${helper.getTime()}] uncaughtException: ${error}`;
    console.error(message);
    logChannel.send(message);
    process.exit(1);
});

process.on(`unhandledRejection`, (error) => {
    const message = `[${helper.getTime()}] unhandledRejection: ${error}`;
    console.error(message);
    logChannel.send(message);
    process.exit(1);
});

bot.on(`disconnected`, () => {
    const message = `[${helper.getTime()}] Disconnected.`;
    console.error(message);
    process.exit(1);
});

bot.on(`error`, (error) => {
    const message = `[${helper.getTime()}] Discord bot error: ${error}`;
    console.error(message);
    process.exit(1);
});

// When a user sends a message
bot.on(`messageCreate`, async (message: Discord.Message) => {
    // Ignore messages from ourself
    if (message.author.id === bot.user?.id) return;

    // Reply to pings
    if (message.content.includes(`<@!${bot.user?.id}>`)) {
        message.channel.send(`yes?`);
    }

    // Make sure the message starts with the prefix
    if (!message.content.startsWith(config.bot.prefix)) return;

    // Get the command and the parameters from the command
    const command = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[0];
    const parameters = message.content.slice(config.bot.prefix.length).trim().split(/ +/g).slice(1);

    switch (command) {
        case `help`:
            helper.spamOrDM(message, commands.help);
            break;

        case `links`:
            helper.spamOrDM(message, commands.links);
            break;

        case `uptime`:
            helper.spamOrDM(message, commands.uptime);
            break;

        // If the command doesn't exist, send the help message
        default:
            helper.spamOrDM(message, commands.help);
            break;
    }
});

// Start the bot
bot.login(config.bot.token);