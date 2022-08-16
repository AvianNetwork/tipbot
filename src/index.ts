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

// Create the bots
const bot = new Discord.Client({
    intents: [`GUILDS`, `GUILD_MESSAGES`, `DIRECT_MESSAGES`, `GUILD_PRESENCES`],
    partials: [`CHANNEL`],
});
const infoBots = [
    {
        function: `price`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
    {
        function: `marketcap`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
    {
        function: `supply`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
    {
        function: `X16RT_hashrate`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
    {
        function: `MinotaurX_hashrate`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
    {
        function: `wavn_price`,
        bot: new Discord.Client({
            intents: [`GUILDS`],
        }),
    },
];

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

    // Fetch the log channel
    const tempLogChannel = await bot.channels.fetch(config.channels.logging);
    if (!tempLogChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Log channel not found.`);
        process.exit(1);
    }

    // Set the log channel
    logChannel = tempLogChannel as Discord.TextChannel;

    // Fetch the price channel
    const tempPriceChannel = await bot.channels.fetch(config.channels.price);
    if (!tempPriceChannel) {
        console.error(`[${helper.getTime()}] Discord bot error: Price channel not found.`);
        process.exit(1);
    }

    // Set the price channel
    priceChannel = tempPriceChannel as Discord.VoiceChannel;

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

    // Set the bot's presence
    bot.user?.setActivity(`!avn help | Watching the Avian Network server`);

    // Set the price in the bot presence and channel name, and change the nicknames of info bots
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

        // Set the price channels name
        priceChannel.setName(`${ticker[`last`]} USDT`);

        // Set nicknames and activity for info bots
        infoBots.forEach(async (bot) => {
            // Get the supply
            const supplyData: any = await (await fetch(`${config.project.explorer}ext/getmoneysupply`))
                .text()
                .catch(async (error) => {
                    await log(`Error fetching the supply: ${error}`);
                    return undefined;
                });

            // Make sure the data is valid
            if (!supplyData) {
                return;
            }

            // Get the blockchain inforamation
            const miningInfoData = await helper.rpc(`getmininginfo`, []);
            if (!miningInfoData || !miningInfoData[1]) {
                await log(
                    `Error fetching the mining info: ${
                        miningInfoData[0] || miningInfoData || `Unknown error`
                    }`,
                );
                return;
            }

            // To set a nickname
            const guild = bot.bot.guilds.cache.get(config.bot.guild);
            if (!guild) {
                return;
            }

            switch (bot.function) {
                case `price`:
                    await guild.me?.setNickname(`${ticker[`last`]} USDT`).catch(log);
                    bot.bot.user?.setActivity(`the AVN price (${ticker[`price_change_percent`]})`, {
                        type: `WATCHING`,
                    });
                    break;
                case `marketcap`:
                    await guild.me
                        ?.setNickname(
                            `${Number((parseFloat(ticker[`last`]) * Number(supplyData)).toFixed(2))} USDT`,
                        )
                        .catch(log);
                    bot.bot.user?.setActivity(`the AVN market cap (${ticker[`price_change_percent`]})`, {
                        type: `WATCHING`,
                    });
                    break;

                case `supply`:
                    await guild.me?.setNickname(`${helper.formatSupply(Number(supplyData))} AVN`).catch(log);
                    bot.bot.user?.setActivity(`the AVN supply`, {
                        type: `WATCHING`,
                    });
                    break;

                case `X16RT_hashrate`:
                    const hashrate_X6RT = Number(
                        miningInfoData[1][`networkhashps_x16rt`] / 1000000000,
                    ).toFixed(3);
                    await guild.me?.setNickname(`${hashrate_X6RT} GH/s`).catch(log);
                    bot.bot.user?.setActivity(`the X16RT hashrate`, {
                        type: `WATCHING`,
                    });
                    break;

                case `MinotaurX_hashrate`:
                    const hashrate_MinotaurX = Number(
                        miningInfoData[1][`networkhashps_minotaurx`] / 1000000,
                    ).toFixed(3);
                    await guild.me?.setNickname(`${hashrate_MinotaurX} MH/s`).catch(log);
                    bot.bot.user?.setActivity(`the MinotaurX hashrate`, {
                        type: `WATCHING`,
                    });
                    break;

                case `wavn_price`:
                    // Fetch Nomics data
                    const nomicsRequest = await fetch(
                        `https://api.nomics.com/v1/currencies/ticker?key=${
                            config.nomics.apikey
                        }&ids=W${config.coin.symbol.toUpperCase()}&interval=1d&convert=USD&per-page=100&page=1`,
                    ).catch(() => undefined);
                    if (!nomicsRequest) {
                        return;
                    }

                    const nomicsData: any = await nomicsRequest.json().catch(async (error) => {
                        await log(`Error fetching data from Nomics: ${error}`, {
                            logFile: `nomics.log`,
                        });
                        return undefined;
                    });

                    if (!nomicsData) {
                        return;
                    }

                    // Set the nickname and activity
                    const wavnPrice = Number(nomicsData[0][`price`]);
                    await guild.me?.setNickname(`${wavnPrice} USDT`).catch(log);
                    bot.bot.user?.setActivity(`the WAVN price`, {
                        type: `WATCHING`,
                    });
                    break;
            }
        });
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
process.on(`uncaughtException`, async (error, origin) => await log(`uncaughtException: ${error}\nOrigin: ${origin}`));

process.on(`unhandledRejection`, async (reason) => await log(`unhandledRejection: ${reason}`));

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
    if (message.content.includes(`<@!${bot.user?.id}>`)) message.reply(`yes?`);

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

// Start the bots
bot.login(config.bot.tokens.main);
Object.values(config.bot.tokens.info).forEach((token, i) => infoBots[i].bot.login(token));
