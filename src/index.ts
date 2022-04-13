// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";
import fs from "fs/promises";

// Import helper functions
import * as helper from "./helper.js";
import * as commands from "./commands.js";

// We can only fetch channels within the bot.on(`ready`) function
let logChannel: Discord.TextChannel;
let priceChannel: Discord.VoiceChannel;

// Create the bot
const bot = new Discord.Client({
    intents: [`GUILDS`, `GUILD_MESSAGES`, `DIRECT_MESSAGES`, `GUILD_PRESENCES`],
    partials: [`CHANNEL`],
});

// When the bot logged in
bot.on(`ready`, async () => {
    // Delete and create the logs folder if it does not exist yet
    await fs
        .stat(`./logs`)
        .then(async () => {
            await fs.rm(`./logs`, { recursive: true }).catch(() => {});
        })
        .catch(() => {});
    await fs.mkdir(`./logs`).catch(() => {});

    // Set the channels
    const tempLogChannel = await bot.channels.fetch(config.channels.logging);
    if (!tempLogChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Log channel not found.`);
        process.exit(1);
    } else {
        logChannel = <Discord.TextChannel>tempLogChannel;
    }

    const tempPriceChannel = await bot.channels.fetch(config.channels.price);
    if (!tempPriceChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Price channel not found.`);
        process.exit(1);
    } else {
        priceChannel = <Discord.VoiceChannel>tempPriceChannel;
    }

    // Send startup messages
    console.log(
        `[${helper.getTime()}] Logged in as ${bot.user?.username}#${bot.user?.discriminator} (${
            bot.user?.id
        }).`,
    );
    logChannel.send(
        `[${helper.getTime()}] Logged in as ${bot.user?.username}#${bot.user?.discriminator} (${
            bot.user?.id
        }).`,
    );
    await fs.appendFile(
        `logs/main.log`,
        `[${helper.getTime()}] Logged in as ${bot.user?.username}#${bot.user?.discriminator} (${
            bot.user?.id
        }).\n`,
    );

    // Set the price in the bot presence and channel name
    setInterval(async () => {
        const ticker = await helper.getTickerExbitron(`usdt`).catch(async (error) => {
            await fs.appendFile(
                `logs/exbitron.log`,
                `[${helper.getTime()}] Error while fetching Exbitron price: ${error}\n`,
            );
            logChannel.send(`[${helper.getTime()}] Error while fetching Exbitron price: ${error}`);
            return undefined;
        });
        if (ticker === undefined) return;

        bot.user?.setActivity(`${ticker[`last`]} USDT`, { type: `WATCHING` });
        priceChannel.setName(`${ticker[`last`]} USDT`);
    }, 60 * 1000); // Every minute
});

// Function to send messages to the log channel and the log file
export const log = async (
    message: string,
    options?: {
        sendToLogChannel?: boolean;
        logFile?: string;
    },
) => {
    if (!options) options = { sendToLogChannel: true, logFile: `main.log` };
    if (options.sendToLogChannel === undefined || options.sendToLogChannel === null)
        options.sendToLogChannel = true;
    if (options.logFile === undefined || options.logFile === null) options.logFile = `main.log`;

    await fs.appendFile(`logs/${options.logFile}`, `[${helper.getTime()}] ${message}\n`);
    options.sendToLogChannel ? await logChannel.send(`[${helper.getTime()}] ${message}`) : null;
};

// General error handling
process.on(`uncaughtException`, async (error) => {
    await log(`uncaughtException: ${error}`);
});

process.on(`unhandledRejection`, async (error) => {
    await log(`unhandledRejection: ${error}`);
});

bot.on(`disconnected`, async () => {
    await log(`Disconnected.`, {
        sendToLogChannel: false,
    });
    process.exit(1);
});

bot.on(`error`, async (error) => {
    await log(`Discord bot error: ${error}`, {
        sendToLogChannel: false,
    });
    process.exit(1);
});

// When a user sends a message
bot.on(`messageCreate`, async (message: Discord.Message) => {
    // Ignore messages from ourself
    if (message.author.id === bot.user?.id) return;

    // Reply to pings
    if (message.content.includes(`<@!${bot.user?.id}>`)) {
        message.reply(`yes?`);
    }

    // Make sure the message starts with the prefix
    if (!message.content.startsWith(config.bot.prefix)) return;

    // Get the command and the parameters from the command
    const command = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[0];

    switch (command) {
        // Wallet commands
        case `balance`:
            commands.balance(message);
            break;
        case `tip`:
            commands.tip(message);
            break;
        case `privkey`:
        case `privatekey`:
            helper.spamOrDM(message, commands.privatekey);
            break;
        case `deposit`:
        case `donate`:
        case `withdraw`:
        case `walletversion`:
            helper.spamOrDM(message, commands[command]);
            break;

        // Market data
        case `exchanges`:
        case `wavn`:
        case `sushi`:
        case `price`:
        case `convert`:
        case `cap`:
        case `nomics`:
            helper.spamOrDM(message, commands[command]);
            break;
        case `usdt`:
        case `btc`:
        case `ltc`:
        case `rvn`:
        case `doge`:
            helper.spamOrDM(message, commands.priceDeprecated);
            break;

        // Explorer functions
        case `supply`:
        case `wealth`:
        case `qr`:
            helper.spamOrDM(message, commands[command]);
            break;

        // Blockchain and mining
        case `diff`:
        case `hash`:
        case `mininginfo`:
            helper.spamOrDM(message, commands.mininginfo);
            break;
        case `miningcalc`:
        case `miners`:
            helper.spamOrDM(message, commands[command]);
            break;
        case `chaininfo`:
        case `blockchaininfo`:
            helper.spamOrDM(message, commands.blockchaininfo);
            break;
        case `validateaddress`:
        case `validate`:
            helper.spamOrDM(message, commands.validate);
            break;

        // Others
        case `dm`:
            commands.dmDeprecated(message);
            break;
        case `links`:
        case `uptime`:
        case `help`:
            helper.spamOrDM(message, commands[command]);
            break;

        // If no command was specified, send the help message
        case ``:
            helper.spamOrDM(message, commands.help);
            break;

        // If the command does not exist, do not do anything
        default:
            break;
    }
});

// Start the bot
bot.login(config.bot.token);
