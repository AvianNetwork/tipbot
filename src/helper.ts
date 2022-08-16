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

/**
 * Gets the time and uses the timezone and format from the config file so we do not have to write long lines with repetitive code
 * @returns The formatted time
 */
export const getTime = (): string => {
	return dayjs().tz(config.bot.timezone[0]).format(config.bot.timezone[1]);
};

/**
 * Deletes a message after the defined timeout specified in config.ts, except if the message was sent in a DM
 * @param sentMessage The message to delete
 */
export const deleteAfterTimeout = (sentMessage: Discord.Message) => {
	if (sentMessage.channel.type === `DM`) return;

	setTimeout(sentMessage.delete, config.bot.deletetimeout);
};

/**
 * Formats the supply of the coin to a compact format
 * @param supply The current supply of the coin
 * @returns The formatted supply of the coin
 */
export const formatSupply = (supply: number) => {
	if (supply >= 1000 && supply < 1000000) return `${(supply / 1000).toFixed(2)}k`;
	if (supply >= 1000000 && supply < 1000000000) return `${(supply / 1000000).toFixed(2)}m`;
	if (supply >= 1000000000 && supply < 1000000000000) return `${(supply / 1000000000).toFixed(2)}b`;
	if (supply >= 1000000000000) return `${(supply / 1000000000000).toFixed(2)}t`;
	return supply;
};

/**
 * Check if a command is executed in a spam channel or DM, if so, executes the callback function
 * @param message The message to check
 * @param callback The callback to call if the message is valid
 */
export const spamOrDM = async (message: Discord.Message, callback: Function) => {
	// Check if the message is in a DM or in the spam channel
	if (message.channel.type === `DM` || message.channel.id === config.channels.bots) {
		// If the it is, call the callback function
		return callback(message);
	}

	// If it's not, send a message indicating the user should use the bot in the spam channel or DM
	message
		.reply({
			embeds: [
				{
					description: `**:robot: ${config.coin.name} (${config.coin.symbol}) bot :robot:**`,
					color: 1363892,
					footer: {
						text: `Avian Network`,
						icon_url: `https://explorer.avn.network/images/avian_256x256x32.png`,
					},
					fields: [
						{
							name: `Hello!`,
							value: `Please use <#${config.channels.bots}> or DM's to talk to bots`,
							inline: true,
						},
					],
				},
			],
		})
		.then(deleteAfterTimeout);
};

/**
 * Connects to the Avian RPC, sends the data specified in the arguments and returns the response
 * @param method The method to call on the RPC
 * @param params The parameters to pass to the RPC
 * @returns An array consisting of the optional error and the response from the RPC
 */
export const rpc = (method: string, params: any[]): Promise<[string | undefined, any]> => {
	return new Promise(async (resolve) => {
		// Create the request
		const data: any = await (
			await fetch(`http://${config.coin.rpc.hostname}:${config.coin.rpc.port}`, {
				method: `POST`,
				headers: {
					"Content-Type": `application/json`,
					Authorization: `Basic ${Buffer.from(
						`${config.coin.rpc.username}:${config.coin.rpc.password}`,
						`utf8`,
					).toString(`base64`)}`,
				},
				body: JSON.stringify({
					jsonrpc: `1.0`,
					id: `avn-tipbot`,
					method: method,
					params: params,
				}),
			})
		)
			.json()
			.catch(() => undefined);

		// Resolve with an error if the RPC call failed
		if (!data || !data[`id`] || data[`error`]) {
			return resolve([JSON.stringify(data[`error`]), undefined]);
		}

		// Resolve with the response from the RPC call
		resolve([undefined, data[`result`]]);
	});
};

/**
 * Fetches the price data from Exbitron and returns it
 * @param asset The asset to return the price in
 * @returns The price of the avian in the specified asset
 */
export const getTickerExbitron = async (
	asset: string = `usdt`,
): Promise<{
	// Set this big object so we can have type checking when using the function
	low: string;
	high: string;
	open: string;
	last: string;
	volume: string;
	amount: string;
	vol: string;
	avg_price: string;
	price_change_percent: string;
	at: null;
}> => {
	return new Promise(async (resolve, reject) => {
		// Fetch the API data
		const request = await fetch(
			`https://www.exbitron.com/api/v2/peatio/public/markets/avn${asset}/tickers`,
		).catch(() => undefined);
		if (!request) {
			return reject(`Error fetching data from Exbitron`);
		}

		// Parse the data
		const data: any = await request.json().catch(() => undefined);

		// If an error has occurred, reject the promise
		if (!data || data[`error`]) {
			return reject(data[`error`][0]);
		}

		// If no error has occurred, resolve the promise
		resolve(data[`ticker`]);
	});
};

/**
 * Fetches the price data from TradeOgre and returns it
 * @param asset The asset to return the price in
 * @returns The price of the avian in the specified asset
 */
export const getTickerTradeOgre = async (
	asset: string = `BTC`,
): Promise<{
	// Set this big object so we can have type checking when using the function
	success: boolean;
	initialprice: string;
	price: string;
	high: string;
	low: string;
	volume: string;
	bid: string;
	ask: string;
}> => {
	return new Promise(async (resolve, reject) => {
		// Fetch the API data
		const request: any = await fetch(`https://tradeogre.com/api/v1/ticker/${asset}-AVN`).catch(
			() => undefined,
		);
		if (!request) {
			return reject(`Error fetching data from TradeOgre`);
		}

		const data: any = await request.json().catch(() => undefined);

		// If an error has occurred, reject the promise
		if (data[`success`] !== true) {
			return reject(data[`error`]);
		}

		// If no error has occurred, resolve the promise
		resolve(data);
	});
};

/**
 * Replies to the given message with a prebuilt embed
 * @param message The message to reply to
 * @param description The description of the error
 * @param error The error itself
 */
export const sendErrorMessage = (message: Discord.Message, description: string, error: string) => {
	const date = new Date().toUTCString().replace(`,`, ` `);
	message
		.reply({
			embeds: [
				{
					description: description,
					color: 1363892,
					thumbnail: {
						url: `${config.project.explorer}images/avian_256x256x32.png`,
					},
					fields: [
						{
							name: `:x:  Error  :x:`,
							value: error,
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
		.then(deleteAfterTimeout);
};
