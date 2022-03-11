// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";

// Import helper functions
import * as main from "./index.js";
import * as helper from "./helper.js";

const links = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    message
        .reply({
            embeds: [
                {
                    description: `**:globe_with_meridians:  ${config.coin.coinname} (${config.coin.coinsymbol}) Official Links  :globe_with_meridians:\n\u200b**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `__Project Website__`,
                            value: `*${config.project.siteurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Project GitHub__`,
                            value: `*${config.project.githuburl}*`,
                            inline: false,
                        },
                        {
                            name: `__Project Explorer__`,
                            value: `*${config.project.explorerurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Project Bitcointalk__`,
                            value: `*${config.project.bitcointalkurl}*`,
                            inline: true,
                        },
                        {
                            name: `__Project Twitter__`,
                            value: `*${config.project.twitterurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Reddit__`,
                            value: `*${config.project.redditurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Discord__`,
                            value: `*${config.project.discordurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Telegram__`,
                            value: `*${config.project.telegramurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Telegram Announcements__`,
                            value: `*${config.project.telegramannurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Coin Wrapping__`,
                            value: `*${config.wavn.coinwrapurl}*`,
                            inline: false,
                        },
                        {
                            name: `__Web Wallet__`,
                            value: `*${config.project.webwalleturl}*\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:clock: Time`,
                            value: date,
                            inline: false,
                        },
                    ],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

const exchanges = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    message
        .reply({
            embeds: [
                {
                    description: `**:chart_with_upwards_trend:  ${config.coin.coinname} (${config.coin.coinsymbol}) Exchange listings  :chart_with_upwards_trend:\n\u200b**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `:chart_with_upwards_trend:  Exbitron Exchange  :chart_with_upwards_trend:`,
                            value:
                                `https://www.exbitron.com/trading/${config.coin.coinsymbol.toLowerCase()}btc\n` +
                                `https://www.exbitron.com/trading/${config.coin.coinsymbol.toLowerCase()}usdt\n` +
                                `https://www.exbitron.com/trading/${config.coin.coinsymbol.toLowerCase()}ltc\n` +
                                `https://www.exbitron.com/trading/${config.coin.coinsymbol.toLowerCase()}rvn\n` +
                                `https://www.exbitron.com/trading/${config.coin.coinsymbol.toLowerCase()}doge\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:chart_with_upwards_trend:  Trade Ogre Exchange  :chart_with_upwards_trend:`,
                            value: `https://tradeogre.com/exchange/BTC-${config.coin.coinsymbol.toUpperCase()}\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:clock: Time`,
                            value: date,
                            inline: false,
                        },
                    ],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

const help = (message: Discord.Message) => {
    message
        .reply({
            embeds: [
                {
                    description: `__**${config.coin.coinname} (${config.coin.coinsymbol}) Tipper**__`,
                    color: 1363892,
                    fields: [
                        {
                            name: `:left_right_arrow:  Transaction fee for withdrawals  :left_right_arrow:`,
                            value: `${config.coin.paytxfee} ${config.coin.coinsymbol}\n(no fees on tips)\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:globe_with_meridians:  Project Info  :globe_with_meridians:`,
                            value: `**${config.bot.prefix} links:** List official project links\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:moneybag:  Wallet commands  :moneybag:`,
                            value:
                                `**${config.bot.prefix} balance:** Get you balance.\n` +
                                `**${config.bot.prefix} deposit:** Get your deposit address.\n` +
                                `**${config.bot.prefix} donate:** Display the Avian Foundation donation address.\n` +
                                `**${config.bot.prefix} donate <amount>:** Donate to the Avian Foundation.\n` +
                                `**${config.bot.prefix} withdraw <address> <amount>:** Withdraw ${config.coin.coinname} to specified address.\n` +
                                `**${config.bot.prefix} tip <@user> <amount>:** Mention an user with @ and the amount to tip them.\n` +
                                `**${config.bot.prefix} walletversion:** Display the bots' wallet version.\n` +
                                `**${config.bot.prefix} privatekey:** Send the private key for your wallet to your DM.\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:chart_with_upwards_trend:  Market Data  :chart_with_upwards_trend:`,
                            value:
                                `**${config.bot.prefix} exchanges:** Display ${config.coin.coinname} exchange listings.\n` +
                                `**${config.bot.prefix} <usdt|btc|ltc|rvn|doge>:** Display ${config.coin.coinname} market data.\n` +
                                `**${config.bot.prefix} <usdt|btc|ltc|rvn|doge> <number of coins>:** Calculate market value of ${config.coin.coinname} coins in the selected currency.\n` +
                                `**${config.bot.prefix} cap <usdt|btc|ltc|rvn|doge>:** Display the ${config.coin.coinname} marketcap data in the selected currency.\n` +
                                `**${config.bot.prefix} wavn:** Display w${config.coin.coinsymbol} information.\n` +
                                `**${config.bot.prefix} sushi:** Display w${config.coin.coinsymbol} SushiSwap information.\n` +
                                `**${config.bot.prefix} nomics <avn|wavn>:** Display ${config.coin.coinsymbol} or w${config.coin.coinsymbol} market information.\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:mag:  Explorer Functions  :mag:`,
                            value:
                                `**${config.bot.prefix} wealth:** Display the ${config.coin.coinname} wealth distribution\n` +
                                `**${config.bot.prefix} supply:** Display the current ${config.coin.coinname} coin supply and market capacity.\n` +
                                `**${config.bot.prefix} qr <address>:** Display QR Code for an ${config.coin.coinname} address.\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:chains:  Blockchain and Mining  :pick:`,
                            value:
                                `**${config.bot.prefix} mininginfo:** Display network mining info.\n` +
                                `**${config.bot.prefix} miningcalc <MinotaurX|X16RT> <KH/s|MH/s>:** Calculate mining returns for MinotaurX or X16RT (Supply hashrate in KH/s for MinotaurX and MH/s for X16RT).\n` +
                                `**${config.bot.prefix} blockchaininfo:** Display blockchain information.\n` +
                                `**${config.bot.prefix} miners:** Display compatible mining software.\n` +
                                `**${config.bot.prefix} validate <address>:** Validate an ${config.coin.coinname} address.\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:tools:  Bot Wallet Utilities  :tools:`,
                            value:
                                `**${config.bot.prefix} uptime:** Display current bot and wallet uptime.\n` +
                                `Replace ` +
                                "`<>`" +
                                ` with the appropriate value.`,
                            inline: false,
                        },
                    ],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

const uptime = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Get the current uptime of the wallet.
    const walletUptimeData = await helper.rpc(`uptime`, []);

    if (walletUptimeData[0]) {
        // If an error occurred while fetching the uptime, send the error message.
        message
            .reply({
                embeds: [
                    {
                        description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) bot and wallet uptime  :robot::tools:**`,
                        color: 1363892,
                        thumbnail: {
                            url: `${config.project.explorerurl}images/avian_256x256x32.png`,
                        },
                        fields: [
                            {
                                name: `:x:  Error  :x:`,
                                value: `*Error fetching uptime.*`,
                                inline: false,
                            },
                            {
                                name: `:clock: Time`,
                                value: date,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);

        // Log the error
        await main.log(`Error while fetching uptime: ${walletUptimeData[0]}`);
        return;
    } else {
        // Get the wallet uptime and bot uptime in days
        const walletUptime = Number(walletUptimeData[1] / (3600 * 24)).toLocaleString(`en-US`, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        });
        const botUptime = Number(process.uptime() / (3600 * 24)).toLocaleString(`en-US`, {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        });

        // Send the embed containing the information
        message
            .reply({
                embeds: [
                    {
                        description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) bot and wallet uptime  :robot::tools:**`,
                        color: 1363892,
                        thumbnail: {
                            url: `${config.project.explorerurl}images/avian_256x256x32.png`,
                        },
                        fields: [
                            {
                                name: `__Current wallet uptime__`,
                                value: `${walletUptime} days`,
                                inline: false,
                            },
                            {
                                name: `__Current bot uptime__`,
                                value: `${botUptime} days`,
                                inline: false,
                            },
                            {
                                name: `:clock: Time`,
                                value: date,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
    }
};

// Export functions.
export { uptime, help, links, exchanges };

import { supply, wealth, qr } from "./explorer.js";
export { supply, wealth, qr };

import { mininginfo, miningcalc, blockchaininfo, miners, validate } from "./blockchainandmining.js";
export { mininginfo, miningcalc, blockchaininfo, miners, validate };

import { balance, deposit, donate, withdraw, tip, walletversion, privatekey } from "./wallet.js";
export { balance, deposit, donate, withdraw, tip, walletversion, privatekey };
