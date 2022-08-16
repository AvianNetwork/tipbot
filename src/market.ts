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
	// Fetch the data from Psolygonscan
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
		return helper.sendErrorMessage(
			message,
			`**:gift: w${config.coin.symbol} Token information :gift:**`,
			`*Error fetching the wAVN supply.*`,
		);
	}

	const date = new Date().toUTCString().replace(`,`, ` `);
	const supply = (tokenSupplyData[`result`] / 1000000000000000000n).toString();

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
};

export const sushi = async (message: Discord.Message) => {
	// Fetch the data from the Sushi api
	const sushiRequest = await fetch(
		`https://api2.sushipro.io/?chainID=137&action=get_pairs_by_token&token=${config.wavn.contractaddress}`,
	).catch(async (error) => {
		await main.log(`Error fetching the Sushi data: ${error}`, {
			logFile: `sushi.log`,
		});
		return undefined;
	});
	if (!sushiRequest) {
		return helper.sendErrorMessage(
			message,
			`**:sushi: w${config.coin.symbol} Sushi Swap Information :sushi:**`,
			`*Error fetching data from sushiswap*`,
		);
	}

	const sushiData: any = await sushiRequest.json().catch(async (error) => {
		await main.log(`Error fetching data from sushiswap: ${error}`, {
			logFile: `sushi.log`,
		});
		return undefined;
	});

	if (!sushiData) {
		return helper.sendErrorMessage(
			message,
			`**:sushi: w${config.coin.symbol} Sushi Swap Information :sushi:**`,
			`*Error fetching data from sushiswap*`,
		);
	}

	const date = new Date().toUTCString().replace(`,`, ` `);
	const numberOfResults = sushiData[0][`number_of_results`];

	if (numberOfResults < 1) {
		return message
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
	}

	// Parse the data and send the message
	const chain = sushiData[0].chain as string;
	const token = sushiData[0].token as string;
	const pairID = sushiData[1][0].Pair_ID as string;
	const Token_1_symbol = sushiData[1][0].Token_1_symbol as string;
	const Token_1_reserve = sushiData[1][0].Token_1_reserve.toFixed(8) as number;
	const Token_1_price = sushiData[1][0].Token_1_price.toFixed(8) as number;
	const Token_2_symbol = sushiData[1][0].Token_2_symbol as string;
	const Token_2_reserve = sushiData[1][0].Token_2_reserve.toFixed(8) as number;
	const Token_2_price = sushiData[1][0].Token_2_price.toFixed(8) as number;

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
};

export const price = async (message: Discord.Message) => {
	const date = new Date().toUTCString().replace(`,`, ` `);

	// Parse the currency and check if it is valid
	const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
	if (!currencyTemp) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a currency*`,
		);
	}

	const currency = currencyTemp.toLowerCase();
	if ([`usdt`, `btc`, `ltc`, `rvn`, `doge`].includes(currency) === false) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a valid currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`)*`,
		);
	}

	// Get the price data from exbitron
	const ExbitronData = await helper.getTickerExbitron(currency).catch(async (error) => {
		await main.log(`Error fetching data from Exbitron: ${error}`, {
			logFile: `exbitron.log`,
		});
		return undefined;
	});

	if (!ExbitronData) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Error fetching price data*`,
		);
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
			return helper.sendErrorMessage(
				message,
				`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
				`*Error fetching price data*`,
			);
		}
	}

	// Create the TradeOgre embed
	const TradeOgreEmbed: // See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
	| {
				name: string;
				value: string;
				inline?: boolean;
		  }[]
		| undefined = TradeOgreData
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
	let finalEmbed: {
		// See https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
		name: string;
		value: string;
		inline?: boolean;
	}[] = [
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
	if (TradeOgreEmbed) finalEmbed = finalEmbed.concat(TradeOgreEmbed);

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
	const amount = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];
	if (!amount) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify an amount*`,
		);
	}
	if (isNaN(Number(amount))) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a valid amount*`,
		);
	}

	// Parse the currency and check if it is valid
	const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
	if (!currencyTemp) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a currency*`,
		);
	}

	const currency = currencyTemp.toLowerCase();
	if ([`usdt`, `btc`, `ltc`, `rvn`, `doge`].includes(currency) === false) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a valid currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`)*`,
		);
	}

	// Get the price data from exbitron
	const ExbitronData = await helper.getTickerExbitron(currency).catch(async (error) => {
		await main.log(`Error fetching data from Exbitron: ${error}`, {
			logFile: `exbitron.log`,
		});
		return undefined;
	});

	if (!ExbitronData) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Error fetching price data*`,
		);
	}

	message
		.reply({
			embeds: [
				{
					description: `**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
					color: 1363892,
					fields: [
						{
							name: `Market value of ${amount} ${config.coin.symbol}`,
							value: `${Number(
								(Number(ExbitronData[`last`]) * Number(amount)).toFixed(8),
							)} ${currency.toUpperCase()}`,
							inline: true,
						},
					],
				},
			],
		})
		.then(helper.deleteAfterTimeout);
};

export const cap = async (message: Discord.Message) => {
	// Parse the currency and check if it is valid
	const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
	if (!currencyTemp) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`)*`,
		);
	}

	const currency = currencyTemp.toLowerCase();
	if ([`usdt`, `btc`, `ltc`, `rvn`, `doge`].includes(currency) === false) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a valid currency (\`usdt\`, \`btc\`, \`ltc\`, \`rvn\`, \`doge\`)*`,
		);
	}

	// Get the price
	const price = await helper.getTickerExbitron(currency).catch(async (error) => {
		await main.log(`Error fetching price: ${error}`, {
			logFile: `exbitron.log`,
		});
		return undefined;
	});

	// Get the supply
	const supplyData: any = await (await fetch(`${config.project.explorer}ext/getmoneysupply`))
		.text()
		.catch(async (error) => {
			await main.log(`Error fetching the supply: ${error}`);
			return undefined;
		});

	// Make sure the data is valid
	if (!supplyData || !price) {
		return helper.sendErrorMessage(
			message,
			`**:bar_chart:  ${config.coin.name} (${config.coin.symbol}) coin supply  :bar_chart:**`,
			`*Error fetching the supply or price.*`,
		);
	}

	// Parse the data and send the message
	const marketCapacity = Number((parseFloat(price[`last`]) * Number(supplyData)).toFixed(8));
	const supply = Number(parseFloat(supplyData).toFixed(8)).toString();

	message
		.reply({
			embeds: [
				{
					description: `**:bar_chart:  ${config.coin.name} (${config.coin.symbol}) coin supply  :bar_chart:**`,
					color: 1363892,
					thumbnail: {
						url: `${config.project.explorer}images/avian_256x256x32.png`,
					},
					fields: [
						{
							name: `__Total coin supply__`,
							value: supply,
							inline: false,
						},
						{
							name: `__${config.coin.symbol} current price__`,
							value: `${price[`last`]} ${currency.toUpperCase()}`,
							inline: false,
						},
						{
							name: `__Current Market Capacity__`,
							value: `${marketCapacity} ${currency.toUpperCase()}`,
							inline: false,
						},
					],
				},
			],
		})
		.then(helper.deleteAfterTimeout);
};

export const nomics = async (message: Discord.Message) => {
	// Parse the currency and check if it is valid
	const currencyTemp = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
	if (!currencyTemp) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a currency (\`avn\`, \`wavn\`)*`,
		);
	}
	const currency = currencyTemp.toLowerCase();
	if ([`avn`, `wavn`].includes(currency) === false) {
		return helper.sendErrorMessage(
			message,
			`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
			`*Please specify a valid currency (\`avn\`, \`wavn\`)*`,
		);
	}

	if (currency === `avn`) {
		const nomicsRequest = await fetch(
			`https://api.nomics.com/v1/currencies/ticker?key=${
				config.nomics.apikey
			}&ids=${config.coin.symbol.toUpperCase()}3&interval=1d&convert=USD&per-page=100&page=1`,
		).catch(() => undefined);
		if (!nomicsRequest) {
			return helper.sendErrorMessage(
				message,
				`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Price Info :chart_with_upwards_trend:**`,
				`*Error fetching the price.*`,
			);
		}

		const nomicsData: any = await nomicsRequest.json().catch(async (error) => {
			await main.log(`Error fetching data from Nomics: ${error}`, {
				logFile: `nomics.log`,
			});
			return undefined;
		});

		if (!nomicsData) {
			helper.sendErrorMessage(
				message,
				`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Market Information :chart_with_upwards_trend:**`,
				`*Error fetching data from Nomics.*`,
			);
		}

		const date = new Date().toUTCString().replace(`,`, ` `);
		message.reply({
			embeds: [
				{
					description: `**:chart_with_upwards_trend: ${nomicsData[0].name} (${nomicsData[0].symbol}) Market Information :chart_with_upwards_trend:b**`,
					color: 1363892,
					fields: [
						{
							name: `__Exchanges__`,
							value: nomicsData[0].num_exchanges,
							inline: true,
						},
						{
							name: `__Current price__`,
							value: `$${nomicsData[0].price}`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `__Change (1d)__`,
							value: `${nomicsData[0][`1d`][`price_change`]} (${nomicsData[0][`1d`][`price_change_pct`]}%)`,
							inline: true,
						},
						{
							name: `__Volume (1d)__`,
							value: `$${nomicsData[0][`1d`][`volume`]}`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `__Rank (change)__`,
							value: `${nomicsData[0].rank} (${nomicsData[0].rank_delta})`,
							inline: true,
						},
						{
							name: `__All time high__`,
							value: `$${nomicsData[0].high}`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `Data provided by Nomics`,
							value: `*https://nomics.com/assets/avn3-avian*`,
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
		});
	}

	if (currency === `wavn`) {
		const nomicsData: any = await (
			await fetch(
				`https://api.nomics.com/v1/currencies/ticker?key=${
					config.nomics.apikey
				}&ids=W${config.coin.symbol.toUpperCase()}&interval=1d&convert=USD&per-page=100&page=1`,
			)
		)
			.json()
			.catch(async (error) => {
				await main.log(`Error fetching data from Nomics: ${error}`, {
					logFile: `nomics.log`,
				});
				return undefined;
			});

		if (!nomicsData) {
			helper.sendErrorMessage(
				message,
				`**:chart_with_upwards_trend: ${config.coin.name} (${config.coin.symbol}) Market Information :chart_with_upwards_trend:**`,
				`*Error fetching data from Nomics.*`,
			);
		}

		const date = new Date().toUTCString().replace(`,`, ` `);
		message.reply({
			embeds: [
				{
					description: `**:chart_with_upwards_trend: ${nomicsData[0].name} (${nomicsData[0].symbol}) Market Information :chart_with_upwards_trend:b**`,
					color: 1363892,
					fields: [
						{
							name: `__Platform__`,
							value: nomicsData[0].platform_currency,
							inline: true,
						},
						{
							name: `__Exchanges__`,
							value: nomicsData[0].num_exchanges,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `__Current price__`,
							value: `$${nomicsData[0].price}`,
							inline: true,
						},
						{
							name: `__Change (1d)__`,
							value: `${nomicsData[0].price_change || `0.00`} (${nomicsData[0].price_change_pct || `0.00`}%)`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `__Volume (1d)__`,
							value: `$${nomicsData[0].volume || `$0.00`}`,
							inline: true,
						},
						{
							name: `__Rank (change)__`,
							value: `${nomicsData[0].rank || `Unknown`} (${nomicsData[0].rank_delta || `Unknown`})`,
							inline: true,
						},
						{
							name: `\u200b`,
							value: `\u200b`,
							inline: true,
						},
						{
							name: `__All time high__`,
							value: `$${nomicsData[0].high}`,
							inline: true,
						},
						{
							name: `Data provided by Nomics`,
							value: `*https://nomics.com/assets/wavn-wrapped-avian*`,
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
		});
	}
};
