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

export const supply = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const price = await exbitron.getTicker(`usdt`).catch((error) => {
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
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        const marketCapacity = Number(parseFloat(price[`last`]) * Number(supplyData)).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });
        const supply = Number(supplyData).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) coin supply  :bar_chart:**`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
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

export const wealth = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
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
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
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
            if (sentMessage.channel.type === `DM`) {
                return;
            } else {
                setTimeout(() => {
                    sentMessage.delete();
                }, config.bot.msgtimeout);
            }
        });
    } else {
        const supply = Number(wealthData.supply).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top125 = Number(wealthData.t_1_25.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top125ttl = Number(wealthData.t_1_25.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top2650 = Number(wealthData.t_26_50.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top2650ttl = Number(wealthData.t_26_50.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top5175 = Number(wealthData.t_51_75.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top5175ttl = Number(wealthData.t_51_75.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top76100 = Number(wealthData.t_76_100.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top76100ttl = Number(wealthData.t_76_100.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top101150 = Number(wealthData.t_101_150.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top101150ttl = Number(wealthData.t_101_150.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top151200 = Number(wealthData.t_151_200.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top151200ttl = Number(wealthData.t_151_200.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        const top201plus = Number(wealthData.t_201plus.percent).toLocaleString(`en-US`, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const top201plusttl = Number(wealthData.t_201plus.total).toLocaleString(`en-US`, { minimumFractionDigits: 8, maximumFractionDigits: 8 });

        message.reply({
            embeds: [{
                description: `**:bar_chart:  ${config.coin.coinname} (${config.coin.coinsymbol}) Wealth Distribution Information  :bar_chart:**`,
                color: 1363892,
                fields: [
                    {
                        name: `__:mag:  ${config.coin.coinname} (${config.coin.coinsymbol}) Explorer  :mag:__`,
                        value: `*${config.explorer.explorerurl}richlist*`,
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

export const qr = async (message: Discord.Message) => {
    const date = new Date().toUTCString().replace(`,`, ` `);
    const address = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    console.log(address)
    if (!address) { // Make sure the user specified an address.
        message.reply({
            embeds: [{
                description: `**  ${config.coin.coinname} (${config.coin.coinsymbol}) QR Code  **`,
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
    } else if (!config.coin.address.test(address)) { // Make sure it's an valid address.
        message.reply({
            embeds: [{
                description: `**  ${config.coin.coinname} (${config.coin.coinsymbol}) QR Code  **`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
                },
                fields: [
                    {
                        name: `:x:  Error  :x:`,
                        value: `*Please specify a valid address.*`,
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
                description: `**  ${config.coin.coinname} (${config.coin.coinsymbol}) QR Code  **`,
                color: 1363892,
                thumbnail: {
                    url: `${config.explorer.explorerurl}images/avian_256x256x32.png`,
                },
                image: {
                    url: `${config.explorer.explorerurl}qr/${address}`
                },
                fields: [
                    {
                        name: `__QR Code for:__`,
                        value: address,
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
    }
};