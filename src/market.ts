// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";
import fetch from "node-fetch";

// Import helper functions
import * as main from "./index.js";
import * as helper from "./helper.js";

export const exchanges = (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    message
        .reply({
            embeds: [
                {
                    description: `**:chart_with_upwards_trend:  ${config.coin.name} (${config.coin.symbol}) Exchange listings  :chart_with_upwards_trend:\n\u200b**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `:chart_with_upwards_trend:  Exbitron Exchange  :chart_with_upwards_trend:`,
                            value:
                                `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}btc\n` +
                                `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}usdt\n` +
                                `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}ltc\n` +
                                `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}rvn\n` +
                                `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}doge\n\u200b`,
                            inline: false,
                        },
                        {
                            name: `:chart_with_upwards_trend:  Trade Ogre Exchange  :chart_with_upwards_trend:`,
                            value: `https://tradeogre.com/exchange/BTC-${config.coin.symbol.toUpperCase()}\n\u200b`,
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

export const wavn = async (message: Discord.Message) => {
    const tokenSupplyData: any = await (
        await fetch(
            `https://api.polygonscan.com/api?module=stats&action=tokensupply&contractaddress=${config.wavn.contractaddress}`,
        )
    )
        .json()
        .catch(async (error) => {
            await main.log(`Error fetching the supply: ${error}`, {
                logFile: `polygonscan.log`,
            });
            return undefined;
        });

    if (!tokenSupplyData || tokenSupplyData[`status`] !== `1`) {
        helper.sendErrorMessage(
            message,
            `**:gift: w${config.coin.symbol} Token information :gift:**`,
            `*Error fetching the wAVN supply.*`,
        );
        return;
    }

    const date = new Date().toUTCString().replace(`,`, ` `);
    const supply = (tokenSupplyData[`result`] / 1000000000000000000).toString();

    message.channel
        .send({
            embeds: [
                {
                    description: `**:gift: w${config.coin.symbol} Token information :gift:**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `:envelope_with_arrow:  Wrap your ${config.coin.symbol}!  :envelope_with_arrow:`,
                            value: config.wavn.url,
                            inline: false,
                        },
                        {
                            name: `:envelope:  Contract address  :envelope:`,
                            value: `[${config.wavn.contractaddress}](https://polygonscan.com/token/${config.wavn.contractaddress})`,
                            inline: false,
                        },
                        {
                            name: `:coin:  w${config.coin.symbol} Token Supply  :coin:`,
                            value: supply,
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

    return;
};

export const sushi = async (message: Discord.Message) => {
    const sushiData: any = await (
        await fetch(
            `https://api2.sushipro.io/?chainID=137&action=get_pairs_by_token&token=${config.wavn.contractaddress}`,
        )
    )
        .json()
        .catch(async (error) => {
            await main.log(`Error fetching data from sushiswap: ${error}`, {
                logFile: `sushi.log`,
            });
            return undefined;
        });

    if (!sushiData) {
        helper.sendErrorMessage(
            message,
            `**:sushi: w${config.coin.symbol} Sushi Swap Information :sushi:**`,
            `*Error fetching data from sushiswap*`,
        );
        return;
    }

    const date = new Date().toUTCString().replace(`,`, ` `);
    const numberOfResults = sushiData[0][`number_of_results`];

    if (numberOfResults < 1) {
        message
            .reply({
                embeds: [
                    {
                        description: `**:sushi: w${config.coin.symbol} Sushi Swap Information :sushi:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `No pairs found for w${config.coin.symbol}`,
                                value: `\u200b`,
                                inline: false,
                            },
                            {
                                name: `Add liquidity on Sushi Swap!`,
                                value: `*https://app.sushi.com/add/ETH/${config.wavn.contractaddress}*`,
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
    } else {
        const chain: string = sushiData[0].chain;
        const token: string = sushiData[0].token;
        const pairID: string = sushiData[1][0].Pair_ID;
        const Token_1_symbol: string = sushiData[1][0].Token_1_symbol;
        const Token_1_reserve: number = sushiData[1][0].Token_1_reserve.toFixed(8);
        const Token_1_price: number = sushiData[1][0].Token_1_price.toFixed(8);
        const Token_2_symbol: string = sushiData[1][0].Token_2_symbol;
        const Token_2_reserve: number = sushiData[1][0].Token_2_reserve.toFixed(8);
        const Token_2_price: number = sushiData[1][0].Token_2_price.toFixed(8);

        message
            .reply({
                embeds: [
                    {
                        description: `**:sushi: w${config.coin.symbol} Sushi Swap Information :sushi:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `\u200b\n**Sushi Swap Analytics**`,
                                value: `*https://analytics-polygon.sushi.com/pairs/${pairID}*`,
                                inline: false,
                            },
                            {
                                name: `**PooCoin Charts**`,
                                value: `*https://polygon.poocoin.app/tokens/${token}*\n\u200b`,
                                inline: false,
                            },
                            {
                                name: `:chains:  Chain  :chains:`,
                                value: chain,
                                inline: true,
                            },
                            {
                                name: `:coin:  ${Token_2_symbol} Token ID  :coin:`,
                                value: token,
                                inline: true,
                            },
                            {
                                name: `:scales:  Pair ID  :scales:`,
                                value: pairID,
                                inline: true,
                            },
                            {
                                name: `:chart_with_upwards_trend:  ${Token_2_symbol} Price  :chart_with_upwards_trend:`,
                                value: `${Token_1_price} ${Token_1_symbol}`,
                                inline: true,
                            },
                            {
                                name: `\u200b`,
                                value: `\u200b`,
                                inline: true,
                            },
                            {
                                name: `:bank:  ${Token_2_symbol} Reserve  :bank:`,
                                value: `${Token_2_reserve} ${Token_2_symbol}`,
                                inline: true,
                            },
                            {
                                name: `:chart_with_upwards_trend:  ${Token_1_symbol} Price  :chart_with_upwards_trend:`,
                                value: `${Token_2_price} ${Token_2_symbol}`,
                                inline: true,
                            },
                            {
                                name: `\u200b`,
                                value: `\u200b`,
                                inline: true,
                            },
                            {
                                name: `:bank:  ${Token_1_symbol} Reserve  :bank:`,
                                value: `${Token_1_reserve} ${Token_1_symbol}`,
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
