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

export const mininginfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Get the blockchain inforamation
    const miningInfoData = await helper.rpc(`getmininginfo`, []);

    if (miningInfoData[0]) { // If an error occurred while fetching the mining information, send the error message.
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) mining information  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
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
            if (sentMessage.channel.type === `DM`) {
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};

export const miningcalc = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const algorithm = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    const hashrate = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];

    if (!algorithm || !hashrate) { // Make sure the user specified both an algorithm and their hashrate.
        message.reply({
            embeds: [{
                description: `**:house:  ${config.coin.coinname} (${config.coin.coinsymbol}) address validator  :house:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Please specify an address.*`,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else if (algorithm.toUpperCase() !== `X16RT` || algorithm.toUpperCase() !== `MINOTAURX`) { // Make sure the user specified a valid algorithm.
        message.reply({
            embeds: [{
                description: `**:house:  ${config.coin.coinname} (${config.coin.coinsymbol}) address validator  :house:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Please specify a valid algorithm (x16rt or minotaurx).*`,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else if (isNaN(parseFloat(hashrate))){
        const algoToUse = algorithm.toUpperCase();
        const hashrateToUse = Number(parseFloat(hashrate).toFixed(3));

        const currentPriceTicker = await helper.getTicker(`usdt`).catch((error) => {
            main.log(`Error while fetching price: ${error}`);
            return undefined;
        });
    }
};

export const blockchaininfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Get the blockchain inforamation
    const blockchainInfoData = await helper.rpc(`getblockchaininfo`, []);

    if (blockchainInfoData[0]) { // If an error occurred while fetching the blockchain information, send the error message.
        message.reply({
            embeds: [{
                description: `**:tools::robot:  ${config.coin.coinname} (${config.coin.coinsymbol}) blockchain information  :robot::tools:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
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
            if (sentMessage.channel.type === `DM`) {
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
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
        if (sentMessage.channel.type === `DM`) {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });
};

export const validate = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const address = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];

    if (!address) {
        message.reply({
            embeds: [{
                description: `**:house:  ${config.coin.coinname} (${config.coin.coinsymbol}) address validator  :house:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Please specify an address.*`,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        const valid = config.coin.address.test(address);
        let validity
        if (valid) {
            validity = `:white_check_mark: Valid ${config.coin.coinname} address.`;
        } else {
            validity = `:x: Invalid ${config.coin.coinname} address.`;
        }

        message.reply({
            embeds: [{
                description: `**:house:  ${config.coin.coinname} (${config.coin.coinsymbol}) address validator  :house:**`,
                color: 1363892,
                fields: [
                    {
                        name: `Address`,
                        value: address,
                        inline: true,
                    },
                    {
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    },
                    {
                        name: `Validity`,
                        value: validity,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    }
};