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
