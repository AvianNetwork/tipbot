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
import * as main from "./index.js";
import * as helper from "./helper.js";
import * as exbitron from "./exbitron.js";

export const help = (message: Discord.Message) => {
    message.reply({
        embeds: [{
            description: `__**${config.coin.coinname} (${config.coin.coinsymbol}) Tipper**__`,
            color: 1363892,
            fields: [
                {
                    name: `:left_right_arrow:  Transaction fee for withdrawals  :left_right_arrow:`,
                    value: `${config.coin.paytxfee} ${config.coin.coinsymbol}\n(no fees on tips)\n\u200b`,
                    inline: false
                },
                {
                    name: `:globe_with_meridians:  Project Info  :globe_with_meridians:`,
                    value: `**${config.bot.prefix} links:** List official project links\n\u200b`,
                    inline: false
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
                        `**${config.bot.prefix} tip private <user> <amount>:** Put private before Mentioning a user to tip them privately.\n` + // TODO: update description
                        `**${config.bot.prefix} walletversion:** Display the bots' wallet version.\n` +
                        `**${config.bot.prefix} privkey:** Send the private key for your wallet to your DM.\n\u200b`,
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
                        `**${config.bot.prefix} diff:** Display the current network difficulty.\n` +
                        `**${config.bot.prefix} hash:** Display the current network hashrate.\n` +
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
                        `**${config.bot.prefix} dm:** Start a DM session with the bot.\n\n` +
                        `Replace ` + "`<>`" + ` with the appropriate value.`,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
}

export const links = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    message.reply({
        embeds: [{
            description: `**:globe_with_meridians:  ${config.coin.coinname} (${config.coin.coinsymbol}) Official Links  :globe_with_meridians:\n\u200b**`,
            color: 1363892,
            fields: [
                {
                    name: `__Project Website__`,
                    value: `*${config.project.siteurl}*`,
                    inline: false
                },
                {
                    name: `__Project GitHub__`,
                    value: `*${config.project.githuburl}*`,
                    inline: false
                },
                {
                    name: `__Project Explorer__`,
                    value: `*${config.explorer.explorerurl}*`,
                    inline: false
                },
                {
                    name: `__Project Bitcointalk__`,
                    value: `*${config.project.bitcointalkurl}*`,
                    inline: true
                },
                {
                    name: `__Project Twitter__`,
                    value: `*${config.project.twitterurl}*`,
                    inline: false
                },
                {
                    name: `__Reddit__`,
                    value: `*${config.project.redditurl}*`,
                    inline: false
                },
                {
                    name: `__Discord__`,
                    value: `*${config.project.discordurl}*`,
                    inline: false
                },
                {
                    name: `__Telegram__`,
                    value: `*${config.project.telegramurl}*`,
                    inline: false
                },
                {
                    name: `__Telegram Announcements__`,
                    value: `*${config.project.telegramannurl}*`,
                    inline: false
                },
                {
                    name: `__Coin Wrapping__`,
                    value: `*${config.wavn.coinwrapurl}*`,
                    inline: false
                },
                {
                    name: `__Web Wallet__`,
                    value: `*${config.project.webwalleturl}*\n\u200b`,
                    inline: false
                },
                {
                    name: `:clock: Time`,
                    value: date,
                    inline: false
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const uptime = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    // Get the current uptime of the wallet.
    const walletUptimeData = await helper.rpc(`uptime`, []);

    if (walletUptimeData[0]) { // If an error occurred while fetching the uptime, send the error message.
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) bot and wallet uptime  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Error fetching uptime.*`,
                        inline: false
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });

        // Log the error
        main.log(`Error while fetching uptime: ${walletUptimeData[0]}`);
        return;
    } else {
        // Get the wallet uptime and bot uptime in days
        const walletUptime = Number(walletUptimeData[1] / (3600 * 24)).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        const botUptime = Number(process.uptime() / (3600 * 24)).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

        // Send the embed containing the information
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) bot and wallet uptime  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
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
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};

export const blockchaininfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    // Get the blockchain inforamation
    const blockchainInfoData = await helper.rpc(`getblockchaininfo`, []);

    if (blockchainInfoData[0]) { // If an error occurred while fetching the blockchain information, send the error message.
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) blockchain information  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Error fetching blockchain information.*`,
                        inline: false,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        message.reply({
            embeds: [{
                description: `**:chains:  ${config.coin.coinname} (${config.coin.coinsymbol}) blockchain information  :chains:**`,
                color: 1363892,
                fields: [
                    {
                        name: `Network difficulty (X16RT)`,
                        value: JSON.stringify(blockchainInfoData[1].difficulty_x16rt),
                        inline: true,
                    },
                    {
                        name: `Headers`,
                        value: JSON.stringify(blockchainInfoData[1].headers),
                        inline: true,
                    },
                    {
                        name: `Chain`,
                        value: blockchainInfoData[1].chain,
                        inline: true,
                    },
                    {
                        name: `Network difficulty (MinotaurX)`,
                        value: JSON.stringify(blockchainInfoData[1].difficulty_minotaurx),
                        inline: true,
                    },
                    {
                        name: `Blocks`,
                        value: JSON.stringify(blockchainInfoData[1].blocks),
                        inline: true,
                    },
                    {
                        name: `Size on disk`,
                        value: `${Number(blockchainInfoData[1].size_on_disk / 1000000).toFixed(2)} MB (${Number(blockchainInfoData[1].size_on_disk / 1000000000).toFixed(2)} GB)`,
                        inline: true,
                    },
                    {
                        name: `Best Blockhash`,
                        value: blockchainInfoData[1].bestblockhash,
                        inline: true,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};

export const chaininfo = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    message.reply({
        embeds: [{
            description: `**:chains:  ${config.coin.coinname} (${config.coin.coinsymbol}) blockchain information  :chains:**`,
            color: 1363892,
            fields: [
                {
                    name: `:x:  Error  :x:`,
                    value: `Please use ` + "`!blockchaininfo`" + ` to get the current blockchain information.`,
                    inline: false
                },
                {
                    name: `:clock: Time`,
                    value: date,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const miners = (message: Discord.Message) => {
    message.reply({
        embeds: [{
            description: `**:pick:  ${config.coin.coinname} (${config.coin.coinsymbol}) Compatible Mining Software  :pick:**\n\u200b`,
            color: 1363892,
            fields: [
                {
                    name: `**NVIDIA GPU ( X16RT )**\n\u200b`,
                    value:
                        `__T-Rex Miner ( <= v19.14)__\n*https://github.com/trexminer/T-Rex/releases/tag/0.19.14*\n\n` +
                        `__CryptoDredge__\nhttps://cryptodredge.org/get/\n\n` +
                        `__WildRig-Multi__\nhttps://github.com/andru-kun/wildrig-multi\n\u200b`,
                    inline: false,
                },
                {
                    name: `__AMD GPU ( X16RT )__\n\u200b`,
                    value:
                        `__TeamRedMiner__\n*https://github.com/todxx/teamredminer*\n\n` +
                        `__WildRig-Multi__\n*https://github.com/andru-kun/wildrig-multi*\n\u200b`,
                    inline: false,
                },
                {
                    name: `__CPU ( MinotaurX )__\n\u200b`,
                    value: `__rplant8 cpuminer-opt__\n*https://github.com/rplant8/cpuminer-opt-rplant/releases/tag/5.0.24*\n\n` +
                        `__litecoincash-project cpuminer-multi__\n*https://github.com/litecoincash-project/cpuminer-multi*\n\n` +
                        `__SRBMiner-multi__\n*https://github.com/doktor83/SRBMiner-Multi/releases*`,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const exchanges = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    message.reply({
        embeds: [{
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
                    inline: false
                },
                {
                    name: `:chart_with_upwards_trend:  Trade Ogre Exchange  :chart_with_upwards_trend:`,
                    value: `https://tradeogre.com/exchange/BTC-${config.coin.coinsymbol.toUpperCase()}\n\u200b`,
                    inline: false
                },
                {
                    name: `:clock: Time`,
                    value: date,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const diff = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    message.reply({
        embeds: [{
            description: `**:chart_with_upwards_trend:  ${config.coin.coinname} (${config.coin.coinsymbol}) Difficulty  :chart_with_upwards_trend:\n\u200b**`,
            color: 1363892,
            fields: [
                {
                    name: `:x:  Error  :x:`,
                    value: `Please use ` + "`!blockchaininfo` or `!mininginfo`" + ` to get the current difficulty.`,
                    inline: false
                },
                {
                    name: `:clock: Time`,
                    value: date,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const hash = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    message.reply({
        embeds: [{
            description: `**:chart_with_upwards_trend:  ${config.coin.coinname} (${config.coin.coinsymbol}) network hashrate  :chart_with_upwards_trend:\n\u200b**`,
            color: 1363892,
            fields: [
                {
                    name: `:x:  Error  :x:`,
                    value: `Please use ` + "`!mininginfo`" + ` to get the current network hashrate.`,
                    inline: false
                },
                {
                    name: `:clock: Time`,
                    value: date,
                    inline: false,
                },
            ],
        }],
    }).then((sentMessage) => {
        // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
        // If it was sent in a DM, don't delete it.
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const mininginfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");

    // Get the blockchain inforamation
    const miningInfoData = await helper.rpc(`getmininginfo`, []);

    if (miningInfoData[0]) { // If an error occurred while fetching the mining information, send the error message.
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) mining information  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Error fetching mining information.*`,
                        inline: false,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        message.reply({
            embeds: [{
                description: `**:pick: ${config.coin.coinname} (${config.coin.coinsymbol}) network mining info :pick:**`,
                color: 1363892,
                fields: [
                    {
                        name: `Network hashrate (X16RT)`,
                        value: `${Number(miningInfoData[1].networkhashps_x16rt / 1000000000).toFixed(3)} GH/s`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `Network difficulty (X16RT)`,
                        value: JSON.stringify(miningInfoData[1].difficulty_x16rt),
                        inline: true,
                    },
                    {
                        name: `Network hashrate (MinotaurX)`,
                        value: `${(miningInfoData[1].networkhashps_minotaurx / 1000000).toFixed(3)} MH/s`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `Network difficulty (MinotaurX)`,
                        value: JSON.stringify(miningInfoData[1].difficulty_minotaurx),
                        inline: true,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};

export const supply = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");
    const price = await exbitron.getTicker("usdt").catch((error) => {
        main.log(`Error fetching price: ${error}`);
        return undefined;
    });
    const supplyData: any = await (await fetch(`${config.explorer.explorerurl}ext/getmoneysupply`)).text().catch((error) => {
        main.log(`Error fetching the supply: ${error}`);
        return undefined;
    });

    if (!supplyData || !price) {
        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) coin supply  :bar_chart:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Error fetching the supply or price.*`,
                        inline: false,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        const marketCapacity = Number(parseFloat(price[`last`]) * Number(supplyData)).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });
        const supply = Number(supplyData).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) coin supply  :bar_chart:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `__Total coin supply__`,
                        value: supply,
                        inline: false,
                    },
                    {
                        name: `__Current Market Capacity__`,
                        value: `${marketCapacity} USDT`,
                        inline: false,
                    }
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};

export const wealth = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(",", " ");
    const wealthData: any = await (await fetch(`${config.explorer.explorerurl}ext/getdistribution`)).json().catch((error) => {
        main.log(`Error fetching the supply: ${error}`);
        return undefined;
    });

    if (!wealthData) {
        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) wealth distribution information  :bar_chart:**`,
                color: 1363892,
                thumbnail: {
                    url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Error fetching the wealth distribution.*`,
                        inline: false,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        const supply = Number(wealthData.supply).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top125 = Number(wealthData.t_1_25.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top125ttl = Number(wealthData.t_1_25.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top2650 = Number(wealthData.t_26_50.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top2650ttl = Number(wealthData.t_26_50.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top5175 = Number(wealthData.t_51_75.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top5175ttl = Number(wealthData.t_51_75.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top76100 = Number(wealthData.t_76_100.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top76100ttl = Number(wealthData.t_76_100.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top101150 = Number(wealthData.t_101_150.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top101150ttl = Number(wealthData.t_101_150.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top151200 = Number(wealthData.t_151_200.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top151200ttl = Number(wealthData.t_151_200.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top201plus = Number(wealthData.t_201plus.percent).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top201plusttl = Number(wealthData.t_201plus.total).toLocaleString("en-US", { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) Wealth Distribution Information  :bar_chart:**`,
                color: 1363892,
                fields: [
                    {
                        name: `__:mag:  ${config.coin.coinname} (${config.coin.coinsymbol}) Explorer  :mag:__`,
                        value: `*https://explorer.avn.network/richlist*`,
                        inline: false,
                    },
                    {
                        name: `__Total coin supply__`,
                        value: supply,
                        inline: false,
                    },
                    {
                        name: `__Top 1-25__`,
                        value: `${top125}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top125ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 26-50__`,
                        value: `${top2650}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top2650ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 51-75__`,
                        value: `${top5175}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top5175ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 76-100__`,
                        value: `${top76100}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top76100ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 100-150__`,
                        value: `${top101150}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top101150ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 151-200__`,
                        value: `${top151200}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top151200ttl,
                        inline: true,
                    },
                    {
                        name: `__Top 201+__`,
                        value: `${top201plus}%`,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `__Total coins held__`,
                        value: top201plusttl,
                        inline: true,
                    },
                    {
                        name: `:clock: Time`,
                        value: date,
                        inline: false,
                    },
                ],
            }],
        }).then((sentMessage) => {
            // If the message was sent in the spam channel, delete it after the timeout specified in the config file.
            // If it was sent in a DM, don't delete it.
            if (sentMessage.channel.type === "DM") {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};