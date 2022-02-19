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

export const getTime = () => {
    return dayjs().tz(config.bot.timezone[0]).format(config.bot.timezone[1])
}

export const spamOrDM = async (message: Discord.Message, callback: Function) => {
    if (message.channel.type === `DM` || message.channel.id === config.moderation.botspamchannel) {
        callback(message);
    } else {
        message.channel.send({
            embeds: [{
                description: '**:robot: ' + config.coin.coinname + ' (' + config.coin.coinsymbol + ') Bot :robot:**',
                color: 1363892,
                footer: {
                    text: 'Avian Network',
                    icon_url: 'https://explorer.avn.network/images/avian_256x256x32.png',
                },
                fields: [
                    {
                        name: `Hello!`,
                        value: 'Please use <#' + config.moderation.botspamchannel + '> or DM\'s to talk to bots\nInitialize DM session with `!avn dm`',
                        inline: true
                    }
                ]
            }]
        }).then((sentMessage) => {
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        })
    }
};

export const sendHelpMessage = async (message: Discord.Message) => {
    message.channel.send("help");
}