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
                            name: `:chart_with_upwards_trend:  TradeOgre Exchange  :chart_with_upwards_trend:`,
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

    message
        .reply({
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

export const price = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);

    // Parse the currency and check if it is valid
    const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    if (!currencyTemp) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify a currency*`,
        );
        return;
    }

    const currency = currencyTemp.toLowerCase();

    // Make sure the user provided a valid currency
    if ([`usdt`, `btc`, `ltc`, `rvn`, `doge`].includes(currency) === false) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify a valid currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`]*`,
        );
        return;
    }

    // Get the price data from exbitron
    const ExbitronData = await helper.getTickerExbitron(currency).catch(async (error) => {
        await main.log(`Error fetching data from Exbitron: ${error}`, {
            logFile: `exbitron.log`,
        });
        return undefined;
    });

    if (!ExbitronData) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Error fetching price data*`,
        );
        return;
    }

    // Get the price data from TradeOgre
    let TradeOgreData:
        | {
              success: boolean;
              initialprice: string;
              price: string;
              high: string;
              low: string;
              volume: string;
              bid: string;
              ask: string;
          }
        | undefined;
    if ([`btc`, `ltc`].includes(currency) === true) {
        TradeOgreData = await helper.getTickerTradeOgre(currency).catch(async (error) => {
            await main.log(`Error fetching data from TradeOgre: ${error}`, {
                logFile: `tradeogre.log`,
            });
            return undefined;
        });

        if (!TradeOgreData) {
            helper.sendErrorMessage(
                message,
                `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
                `*Error fetching price data 1*`,
            );
            return;
        }
    }

    // Create the TradeOgre embed
    const TradeOgreEmbed: Discord.EmbedFieldData[] | undefined = TradeOgreData
        ? [
              {
                  name: `\u200b`,
                  value: `\u200b`,
                  inline: false,
              },
              {
                  name: `TradeOgre (${config.coin.symbol.toUpperCase()}/${currency.toUpperCase()})`,
                  value: `https://tradeogre.com/exchange/${currency.toUpperCase()}-${config.coin.symbol.toUpperCase()}`,
                  inline: false,
              },
              {
                  name: `:record_button: Last`,
                  value: Number(TradeOgreData[`price`]).toFixed(8),
                  inline: true,
              },
              {
                  name: `:arrow_down: Low`,
                  value: Number(TradeOgreData[`low`]).toFixed(8),
                  inline: true,
              },
              {
                  name: `:arrow_up: High`,
                  value: Number(TradeOgreData[`high`]).toFixed(8),
                  inline: true,
              },
              {
                  name: `Open`,
                  value: Number(TradeOgreData[`initialprice`]).toFixed(8),
                  inline: true,
              },
              {
                  name: `Volume(${currency.toUpperCase()})`,
                  value: `${Number(TradeOgreData[`volume`]).toFixed(8)} ${currency.toUpperCase()}`,
                  inline: true,
              },
              {
                  name: `\u200b`,
                  value: `\u200b`,
                  inline: true,
              },
              {
                  name: `Bid`,
                  value: `${Number(TradeOgreData[`bid`]).toFixed(8)} ${currency.toUpperCase()}`,
                  inline: true,
              },
              {
                  name: `Ask`,
                  value: `${Number(TradeOgreData[`ask`]).toFixed(8)} ${currency.toUpperCase()}`,
                  inline: true,
              },
              {
                  name: `\u200b`,
                  value: `\u200b`,
                  inline: true,
              },
          ]
        : undefined;

    // Init the embed and fill it with the Exbitron data
    let finalEmbed: Discord.EmbedFieldData[] = [
        {
            name: `Exbitron (${config.coin.symbol.toUpperCase()}/${currency.toUpperCase()})`,
            value: `https://www.exbitron.com/trading/${config.coin.symbol.toLowerCase()}${currency}`,
            inline: false,
        },
        {
            name: `:record_button: Last`,
            value: Number(ExbitronData[`last`]).toFixed(8),
            inline: true,
        },
        {
            name: `:arrow_down: Low`,
            value: Number(ExbitronData[`low`]).toFixed(8),
            inline: true,
        },
        {
            name: `:arrow_up: High`,
            value: Number(ExbitronData[`high`]).toFixed(8),
            inline: true,
        },
        {
            name: `Open`,
            value: Number(ExbitronData[`open`]).toFixed(8),
            inline: true,
        },
        {
            name: `Volume (${currency.toUpperCase()})`,
            value: `${Number(ExbitronData[`volume`]).toFixed(8)} ${currency.toUpperCase()}`,
            inline: true,
        },
        {
            name: `Volume (${config.coin.symbol})`,
            value: `${Number(ExbitronData[`amount`]).toFixed(2)} ${config.coin.symbol}`,
            inline: true,
        },
        {
            name: `Change`,
            value: ExbitronData[`price_change_percent`],
            inline: true,
        },
    ];

    // Add the TradeOgre data if it exists
    if (TradeOgreEmbed) {
        finalEmbed = finalEmbed.concat(TradeOgreEmbed);
    }

    // Add the date
    finalEmbed.push({
        name: `:clock: Time`,
        value: date,
        inline: false,
    });

    message
        .reply({
            embeds: [
                {
                    description: `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
                    color: 1363892,
                    fields: finalEmbed,
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

export const convert = async (message: Discord.Message) => {
    // Parse the amount and check if it is valid
    const amount = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    if (!amount) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify an amount*`,
        );
        return;
    }
    if (isNaN(Number(amount))) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify a valid amount*`,
        );
        return;
    }
    
    // Parse the currency and check if it is valid
    const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];
    if (!currencyTemp) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify a currency*`,
        );
        return;
    }

    const currency = currencyTemp.toLowerCase();
    if ([`usdt`, `btc`, `ltc`, `rvn`, `doge`].includes(currencyTemp.toLowerCase()) === false) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Please specify a valid currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`]*`,
        );
        return;
    }

    // Get the price data from exbitron
    const ExbitronData = await helper.getTickerExbitron(currency).catch(async (error) => {
        await main.log(`Error fetching data from Exbitron: ${error}`, {
            logFile: `exbitron.log`,
        });
        return undefined;
    });

    if (!ExbitronData) {
        helper.sendErrorMessage(
            message,
            `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
            `*Error fetching price data*`,
        );
        return;
    }

    message
        .reply({
            embeds: [
                {
                    description: `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
                    color: 1363892,
                    fields: [{
                        name: `Market value of ${amount} ${config.coin.symbol}`,
                        value: `${Number((Number(ExbitronData[`last`]) * Number(amount)).toFixed(8))} ${currency.toUpperCase()}`,
						inline: true
                    }],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};
