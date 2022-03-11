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
            `**:gift: w${config.coin.coinsymbol} Token information :gift:**`,
            `*Error fetching the wAVN supply.*`,
        );
        return;
    }

    const date = new Date().toUTCString().replace(`,`, ` `);
    const supply = parseFloat((tokenSupplyData[`result`] / 1000000000000000000).toFixed(18)).toString();

    message.channel
        .send({
            embeds: [
                {
                    description: `**:gift: w${config.coin.coinsymbol} Token information :gift:**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `:envelope_with_arrow:  Wrap your ${config.coin.coinsymbol}!  :envelope_with_arrow:`,
                            value: config.wavn.url,
                            inline: false,
                        },
                        {
                            name: `:envelope:  Contract address  :envelope:`,
                            value: `[${config.wavn.contractaddress}](https://polygonscan.com/token/${config.wavn.contractaddress})`,
                            inline: false,
                        },
                        {
                            name: `:coin:  w${config.coin.coinsymbol} Token Supply  :coin:`,
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
