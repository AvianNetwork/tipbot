// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";
import fetch from "node-fetch";

// Import helper functions
import * as main from "./index.js";
import * as helper from "./helper.js";

export const mininginfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Get the blockchain inforamation
    const miningInfoData = await helper.rpc(`getmininginfo`, []);

    if (miningInfoData[0]) {
        // If an error occurred while fetching the mining information, send the error message.
        await main.log(`Error while fetching mining information: ${miningInfoData[0]}`);
        helper.sendErrorMessage(
            message,
            `**:tools::robot:  ${config.coin.name} (${config.coin.symbol}) mining information  :robot::tools:**`,
            `*Error fetching mining information.*`,
        );
    } else {
        message
            .reply({
                embeds: [
                    {
                        description: `**:pick: ${config.coin.name} (${config.coin.symbol}) network mining info :pick:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `Network hashrate (X16RT)`,
                                value: `${Number(
                                    miningInfoData[1].networkhashps_x16rt / 1000000000,
                                ).toFixed(3)} GH/s`,
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
                                value: `${(
                                    miningInfoData[1].networkhashps_minotaurx / 1000000
                                ).toFixed(3)} MH/s`,
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
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
    }
};

export const miningcalc = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const algorithm = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    const hashrate = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];

    if (!algorithm || !hashrate) {
        // Make sure the user specified both an algorithm and their hashrate.
        helper.sendErrorMessage(
            message,
            `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator :abacus:**`,
            `*Please specify both an algorithm and hashrate.*`,
        );
    } else if (algorithm.toLowerCase() !== `x16rt` && algorithm.toLowerCase() !== `minotaurx`) {
        // Make sure the user specified a valid algorithm.
        helper.sendErrorMessage(
            message,
            `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator  :abacus:**`,
            `*Please specify a valid algorithm (x16rt or minotaurx).*`,
        );
    } else if (isNaN(parseFloat(hashrate)) || parseFloat(hashrate) < 0) {
        // Make sure the user specified a valid hashrate.
        helper.sendErrorMessage(
            message,
            `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator  :abacus:**`,
            `*Please specify a valid hashrate.*`,
        );
    } else {
        const algoToUse = algorithm.toLowerCase();
        const hashrateToUse = Number(parseFloat(hashrate).toFixed(3));

        const currentPriceTicker = await helper.getTicker(`usdt`).catch(async (error) => {
            await main.log(`Error while fetching price: ${error}`, {
                logFile: `exbitron.log`,
            });
            return undefined;
        });

        if (!currentPriceTicker) {
            helper.sendErrorMessage(
                message,
                `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator (${algoToUse})  :abacus:**`,
                `*An error occured while retrieving the price.*`,
            );
        } else {
            // Get the POW averages from the explorer
            const data_720: any = await (
                await fetch(`${config.project.explorer}ext/powaverages/${algoToUse}/720`)
            )
                .json()
                .catch(async (error) => {
                    await main.log(`Error while fetching POW averages: ${error}`);
                    return undefined;
                });
            const data_1440: any = await (
                await fetch(`${config.project.explorer}ext/powaverages/${algoToUse}/1440`)
            )
                .json()
                .catch(async (error) => {
                    await main.log(`Error while fetching POW averages: ${error}`);
                    return undefined;
                });

            if (!data_720 || !data_1440) {
                helper.sendErrorMessage(
                    message,
                    `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator (${algoToUse})  :abacus:**`,
                    `*An error occured while fetching the POW averages.*`,
                );
                return;
            }

            const hashavg12 = data_720[0][`nethashavg`];
            const hashavg24 = data_1440[0][`nethashavg`];

            // Get mininginfo
            const miningInfoData = await helper.rpc(`getmininginfo`, []);
            if (miningInfoData[0]) {
                // If an error occurred while fetching the mining information, send the error message.
                await main.log(`Error while fetching mining information: ${miningInfoData[0]}`);
                helper.sendErrorMessage(
                    message,
                    `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator (${algoToUse})  :abacus:**`,
                    `*Error fetching mining information.*`,
                );
                return;
            }

            // Get the current price
            const tickerData = await helper.getTicker(`usdt`).catch(async (error) => {
                await main.log(`Error while fetching price: ${error}`, {
                    logFile: `exbitron.log`,
                });
                return undefined;
            });
            if (tickerData === undefined) {
                helper.sendErrorMessage(
                    message,
                    `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator (${algoToUse})  :abacus:**`,
                    `*An error occured while retrieving the price.*`,
                );
                return;
            }

            const price = parseFloat(tickerData[`last`]);
            const mininginfo = miningInfoData[1];

            let hashrate: number;
            let hashavgraw12: number;
            let hashavgraw24: number;
            let nethash: number;
            let pcnt: number;
            let pcnt12: number;
            let pcnt24: number;
            let nethashconvert: number;
            let secssolo: number;
            let secssolo12: number;
            let secssolo24: number;
            let minssolo: number;
            let hrssolo: number;
            let hrssolo12: number;
            let hrssolo24: number;
            let unit: string;
            let nhunit: string;

            if (algoToUse === `x16rt`) {
                hashrate = hashrateToUse * 1000000; // Megahashes per second to hashes per second
                hashavgraw12 = Number((hashavg12 * 1000000000).toFixed(8));
                hashavgraw24 = Number((hashavg24 * 1000000000).toFixed(8));
                nethash = mininginfo.networkhashps_x16rt;
                pcnt = Number(((hashrate / nethash) * 100).toFixed(5));
                pcnt12 = Number(((hashrate / hashavgraw12) * 100).toFixed(5));
                pcnt24 = Number(((hashrate / hashavgraw24) * 100).toFixed(5));
                nethashconvert = Number((mininginfo.networkhashps_x16rt / 1000000000).toFixed(8));
                secssolo = (nethash / hashrate) * 60;
                secssolo12 = (hashavgraw12 / hashrate) * 60;
                secssolo24 = (hashavgraw24 / hashrate) * 60;
                minssolo = Number((secssolo / 60).toFixed(3));
                hrssolo = Number((minssolo / 60).toFixed(3));
                hrssolo12 = Number((secssolo12 / 3600).toFixed(3));
                hrssolo24 = Number((secssolo24 / 3600).toFixed(3));
                unit = `MH/s`;
                nhunit = `GH/s`;
            } else {
                hashrate = hashrateToUse * 1000; // Kilohashes per second to hashes per second
                hashavgraw12 = Number((hashavg12 * 1000000).toFixed(8));
                hashavgraw24 = Number((hashavg24 * 1000000).toFixed(8));
                nethash = mininginfo.networkhashps_minotaurx;
                pcnt = Number(((hashrate / nethash) * 100).toFixed(5));
                pcnt12 = Number(((hashrate / hashavgraw12) * 100).toFixed(5));
                pcnt24 = Number(((hashrate / hashavgraw24) * 100).toFixed(5));
                nethashconvert = Number((mininginfo.networkhashps_minotaurx / 1000000).toFixed(8));
                secssolo = (nethash / hashrate) * 60;
                secssolo12 = (hashavgraw12 / hashrate) * 60;
                secssolo24 = (hashavgraw24 / hashrate) * 60;
                minssolo = Number((secssolo / 60).toFixed(3));
                hrssolo = Number((minssolo / 60).toFixed(3));
                hrssolo12 = Number((secssolo12 / 3600).toFixed(3));
                hrssolo24 = Number((secssolo24 / 3600).toFixed(3));
                unit = `KH/s`;
                nhunit = `MH/s`;
            }

            const profitpersec = 2500 / secssolo;
            const profitpersec12 = 2500 / secssolo12;
            const profitpersec24 = 2500 / secssolo24;
            const profitpermin = Number((profitpersec * 60).toFixed(8));
            const profitpermin12 = Number((profitpersec12 * 60).toFixed(8));
            const profitpermin24 = Number((profitpersec24 * 60).toFixed(8));
            const profitperhr = Number((profitpersec * 3600).toFixed(8));
            const profitperhr12 = Number((profitpersec12 * 3600).toFixed(8));
            const profitperhr24 = Number((profitpersec24 * 3600).toFixed(8));
            const profitperday = Number((profitperhr * 24).toFixed(8));
            const profitperday12 = Number((profitperhr12 * 24).toFixed(8));
            const profitperday24 = Number((profitperhr24 * 24).toFixed(8));
            const ppminusdt = Number(price * profitpermin).toFixed(8);
            const ppminusdt12 = Number(price * profitpermin12).toFixed(8);
            const ppminusdt24 = Number(price * profitpermin24).toFixed(8);
            const pphrusdt = Number(price * profitperhr).toFixed(8);
            const pphrusdt12 = Number(price * profitperhr12).toFixed(8);
            const pphrusdt24 = Number(price * profitperhr24).toFixed(8);
            const ppdayusdt = Number(price * profitperday).toFixed(8);
            const ppdayusdt12 = Number(price * profitperday12).toFixed(8);
            const ppdayusdt24 = Number(price * profitperday24).toFixed(8);

            message
                .reply({
                    embeds: [
                        {
                            description: `**:abacus:  ${config.coin.name} (${config.coin.symbol}) Mining Calculator (${algoToUse})  :abacus:**`,
                            color: 1363892,
                            footer: {
                                text: `now = momentary, 12hr = average network hashrate over the last 12 hours, 24hr = average network hashrate over the last 24 hours,`,
                            },
                            fields: [
                                {
                                    name: `Miner Hashrate`,
                                    value: `**now:** ${
                                        hashrateToUse + unit
                                    } (${pcnt}%)\n**12hr:** ${
                                        hashrateToUse + unit
                                    } (${pcnt12}%)\n**24hr:** ${hashrateToUse + unit} (${pcnt24}%)`,
                                    inline: true,
                                },
                                {
                                    name: `Network Hashrate (${nhunit})`,
                                    value: `**now:** ${nethashconvert}\n**12hr:** ${hashavg12}\n**24hr:** ${hashavg24}`,
                                    inline: true,
                                },
                                {
                                    name: `Time to find (solo)`,
                                    value: `**now:** ${hrssolo} hrs\n**12hr:** ${hrssolo12} hrs\n**24hr:** ${hrssolo24} hrs`,
                                    inline: true,
                                },
                                {
                                    name: `${config.coin.name} per minute`,
                                    value: `**now:** ${profitpermin}\n**12hr:** ${profitpermin12}\n**24hr:** ${profitpermin24}`,
                                    inline: true,
                                },
                                {
                                    name: `${config.coin.name} per hour`,
                                    value: `**now:** ${profitperhr}\n**12hr:** ${profitperhr12}\n**24hr:** ${profitperhr24}`,
                                    inline: true,
                                },
                                {
                                    name: `${config.coin.name} per day`,
                                    value: `**now:** ${profitperday}\n**12hr:** ${profitperday12}\n**24hr:** ${profitperday24}`,
                                    inline: true,
                                },
                                {
                                    name: `USDT per minute`,
                                    value: `**now:** ${ppminusdt}\n**12hr:** ${ppminusdt12}\n**24hr:** ${ppminusdt24}`,
                                    inline: true,
                                },
                                {
                                    name: `USDT per hour`,
                                    value: `**now:** ${pphrusdt}\n**12hr:** ${pphrusdt12}\n**24hr:** ${pphrusdt24}`,
                                    inline: true,
                                },
                                {
                                    name: `USDT per day`,
                                    value: `**now:** ${ppdayusdt}\n**12hr:** ${ppdayusdt12}\n**24hr:** ${ppdayusdt24}`,
                                    inline: true,
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
    }
};

export const blockchaininfo = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Get the blockchain inforamation
    const blockchainInfoData = await helper.rpc(`getblockchaininfo`, []);

    if (blockchainInfoData[0]) {
        // If an error occurred while fetching the blockchain information, send the error message.
        await main.log(`Error while fetching blockchain information: ${blockchainInfoData[0]}`);
        helper.sendErrorMessage(
            message,
            `**:tools::robot:  ${config.coin.name} (${config.coin.symbol}) blockchain information  :robot::tools:**`,
            `*Error fetching blockchain information.*`,
        );
    } else {
        message
            .reply({
                embeds: [
                    {
                        description: `**:chains:  ${config.coin.name} (${config.coin.symbol}) blockchain information  :chains:**`,
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
                                value: `${Number(
                                    blockchainInfoData[1].size_on_disk / 1000000,
                                ).toFixed(2)} MB (${Number(
                                    blockchainInfoData[1].size_on_disk / 1000000000,
                                ).toFixed(2)} GB)`,
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
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
    }
};

export const miners = (message: Discord.Message) => {
    message
        .reply({
            embeds: [
                {
                    description: `**:pick:  ${config.coin.name} (${config.coin.symbol}) Compatible Mining Software  :pick:**\n\u200b`,
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
                            value:
                                `__rplant8 cpuminer-opt__\n*https://github.com/rplant8/cpuminer-opt-rplant/releases/tag/5.0.24*\n\n` +
                                `__litecoincash-project cpuminer-multi__\n*https://github.com/litecoincash-project/cpuminer-multi*\n\n` +
                                `__SRBMiner-multi__\n*https://github.com/doktor83/SRBMiner-Multi/releases*`,
                            inline: false,
                        },
                    ],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

export const validate = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const address = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];

    if (!address) {
        helper.sendErrorMessage(
            message,
            `**:house:  ${config.coin.name} (${config.coin.symbol}) address validator  :house:**`,
            `*Please specify an address.*`,
        );
    } else {
        const validity = config.coin.address.test(address)
            ? `:white_check_mark: Valid ${config.coin.name} address.`
            : `:x: Invalid ${config.coin.name} address.`;

        message
            .reply({
                embeds: [
                    {
                        description: `**:house:  ${config.coin.name} (${config.coin.symbol}) address validator  :house:**`,
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
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
    }
};
