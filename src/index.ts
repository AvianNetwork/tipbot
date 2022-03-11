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
let spamChannel: Discord.TextChannel;
let priceChannel: Discord.TextChannel;

// Create the bot
const bot = new Discord.Client({
    intents: [`GUILDS`, `GUILD_MESSAGES`, `DIRECT_MESSAGES`, `GUILD_PRESENCES`],
    partials: [`CHANNEL`],
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
        console.error(`[${helper.getTime()}] Discord bot error: Spam channel not found.`);
        process.exit(1);
    } else {
        spamChannel = <Discord.TextChannel>tempSpamChannel;
    }

    const tempPriceChannel = await bot.channels.fetch(config.moderation.pricechannel);
    if (!tempPriceChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Price channel not found.`);
        process.exit(1);
    } else {
        priceChannel = <Discord.TextChannel>tempPriceChannel;
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

    // Create the logs folder if it doesn't exist yet
    fs.mkdir(`./logs`).catch(() => {});

    // Set the price in the bot presence and channel name 
    setInterval(async () => {
        const ticker = await helper.getTicker("usdt").catch(async (error) => {
            await fs.appendFile(
                `logs/exbitron.log`,
                `[${helper.getTime()}] Error while fetching Exbitron price: ${error}\n`,
            );
            logChannel.send(`[${helper.getTime()}] Error while fetching Exbitron price: ${error}`);
            return undefined;
        });
        if (ticker === undefined) return;

        bot.user?.setActivity(`💰 ${ticker[`last`]} USDT`);
        priceChannel.setName(`💰 ${ticker[`last`]} USDT`);
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
    if (!options) options = { sendToLogChannel: true, logFile: `logs/main.log` };
    if (options.sendToLogChannel === undefined || options.sendToLogChannel === null)
        options.sendToLogChannel = true;
    if (options.logFile === undefined || options.logFile === null)
        options.logFile = `logs/main.log`;

    fs.appendFile(options.logFile!, `[${helper.getTime()}] ${message}\n`);
    options.sendToLogChannel ? logChannel.send(`[${helper.getTime()}] ${message}`) : null;
};

// General error handling
process.on(`uncaughtException`, async (error) => {
    await log(`uncaughtException: ${error}`);
    process.exit(1);
});

process.on(`unhandledRejection`, async (error) => {
    await log(`unhandledRejection: ${error}`);
    process.exit(1);
});

bot.on(`disconnected`, async () => {
    await log(`[${helper.getTime()}] Disconnected.`, {
        sendToLogChannel: false,
    });
    process.exit(1);
});

bot.on(`error`, async (error) => {
    await log(`[${helper.getTime()}] Discord bot error: ${error}`, {
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
        // Project info
        case `links`:
            helper.spamOrDM(message, commands.links);
            break;

        // Wallet commands
        case `balance`:
            commands.balance(message);
            break;
        case `deposit`:
            helper.spamOrDM(message, commands.deposit);
            break;
        case `donate`:
            helper.spamOrDM(message, commands.donate);
            break;
        case `withdraw`:
            helper.spamOrDM(message, commands.withdraw);
            break;
        case `tip`:
            commands.tip(message);
            break;
        // TODO: !avn tip <@user> <amount>
        case `walletversion`:
            helper.spamOrDM(message, commands.walletversion);
            break;
        case `privkey`:
        case `privatekey`:
            helper.spamOrDM(message, commands.privatekey);
            break;

        // Market data
        case `exchanges`:
            helper.spamOrDM(message, commands.exchanges);
            break;
        // TODO: !avn <usdt|btc|ltc|rvn|doge>
        // TODO: !avn <usdt|btc|ltc|rvn|doge> <number of coins>
        // TODO: !avn cap <usdt|btc|ltc|rvn|doge>
        // TODO: !avn wavn
        // TODO: !avn sushi
        // TODO: !avn nomics <avn|wavn>

        // Explorer functions
        case `supply`:
            helper.spamOrDM(message, commands.supply);
            break;
        case `wealth`:
            helper.spamOrDM(message, commands.wealth);
            break;
        case `qr`:
            helper.spamOrDM(message, commands.qr);
            break;

        // Blockchain and mining
        case `diff`:
        case `hash`:
        case `mininginfo`:
            helper.spamOrDM(message, commands.mininginfo);
            break;
        case `miningcalc`:
            helper.spamOrDM(message, commands.miningcalc);
            break;
        case `chaininfo`:
        case `blockchaininfo`:
            helper.spamOrDM(message, commands.blockchaininfo);
            break;
        case `miners`:
            helper.spamOrDM(message, commands.miners);
            break;
        case `validateaddress`:
        case `validate`:
            helper.spamOrDM(message, commands.validate);
            break;

        // Others
        case `uptime`:
        case `help`:
            helper.spamOrDM(message, commands[command]);
            break;

        // If the command doesn't exist, send the help message
        default:
            helper.spamOrDM(message, commands.help);
            break;
    }
});

// Start the bot
bot.login(config.bot.token);
