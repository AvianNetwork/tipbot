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

// Create the bot
const bot = new Discord.Client({
    intents: [
        `GUILDS`,
        `GUILD_MESSAGES`,
        `DIRECT_MESSAGES`,
        `GUILD_PRESENCES`
    ],
    partials: [`CHANNEL`]
});

export const sendHelpMessage = (message: Discord.Message) => {
    message.channel.send({
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
                        `**${config.bot.prefix} chaininfo:** Display blockchain info.\n` +
                        `**${config.bot.prefix} miners:** Display compatible mining software.\n` +
                        `**${config.bot.prefix} validate <address>:** Validate an ${config.coin.coinname} address.\n\u200b`,
                    inline: false,
                },
                {
                    name: `:tools:  Bot Wallet Utilities  :tools:`,
                    value:
                        `**${config.bot.prefix} uptime:** Display current bot wallet uptime.\n` +
                        `**${config.bot.prefix} dm:** Start a DM session with the bot.\n\n` +
                        `Replace ` + "`<>`" + ` with the appropriate value.`,
                    inline: false,
                },

            ],
        }],
    }).then((sentMessage) => {
        if (sentMessage.channel.type === "DM") {
            return;
        } else {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        }
    });

}