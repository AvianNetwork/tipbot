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

// Function to get the time and use the timezone and format from the config file so we don't have to write long lines with repetitive code
export const getTime = () => {
    return dayjs().tz(config.bot.timezone[0]).format(config.bot.timezone[1])
}

// Mainly used for commands handling
export const spamOrDM = async (message: Discord.Message, callback: Function) => {
    // Check if the message is in a DM or in the spam channel
    if (message.channel.type === `DM` || message.channel.id === config.moderation.botspamchannel) {
        // If the it is, call the callback function (which usually executes the repsonse to a command)
        callback(message);
    } else {
        // If it isn't, send a message indicating the user should use the bot in the spam channel or DM
        message.channel.send({
            embeds: [{
                description: `**:robot: ${config.coin.coinname} (${config.coin.coinsymbol}) bot :robot:**`,
                color: 1363892,
                footer: {
                    text: `Avian Network`,
                    icon_url: `https://explorer.avn.network/images/avian_256x256x32.png`,
                },
                fields: [
                    {
                        name: `Hello!`,
                        value: `Please use <#${config.moderation.botspamchannel}> or DM\'s to talk to bots\nInitialize DM session with` + '`!avn dm`',
                        inline: true
                    }
                ]
            }]
        }).then((sentMessage) => {
            // Delete the message after the the message timeout defined in the config file has expired
            setTimeout(() => {
                sentMessage.delete();
            }, config.bot.msgtimeout);
        })
    }
};

export const rpc = (method: string, params: any[]): Promise<[string | undefined, any]> => { // [error, result]
    return new Promise(async (resolve, reject) => {
        // Create the request
        const data: any = await (await fetch(`http://${config.coin.rpc.host}:${config.coin.rpc.port}`, {
            method: `POST`,
            headers: {
                "Content-Type": `application/json`,
                Authorization: `Basic ${Buffer.from(`${config.coin.rpc.user}:${config.coin.rpc.pass}`, `utf8`).toString(`base64`)}`,
            },
            body: JSON.stringify({
                jsonrpc: `1.0`,
                id: `avn-tipbot`,
                method: method,
                params: params,
            }),
        })).json().catch(() => undefined);
    
        // Resolve with an error if the RPC call failed
        if (!data || !data[`id`] || data[`error`] || !data[`result`]) {
            resolve([JSON.stringify(data[`error`]), undefined]);
        } else {
            resolve([undefined, data[`result`]]);
        }
    });
};