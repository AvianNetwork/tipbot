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

export const getTicker = async (): Promise<{
    "at": string,
    "ticker": {
        "low": string,
        "high": string,
        "open": string,
        "last": string,
        "volume": string,
        "amount": string,
        "vol": string,
        "avg_price": string,
        "price_change_percent": string,
        "at": null,
    },
}> => {
    const data: {
        "at": string,
        "ticker": {
            "low": string,
            "high": string,
            "open": string,
            "last": string,
            "volume": string,
            "amount": string,
            "vol": string,
            "avg_price": string,
            "price_change_percent": string,
            "at": null,
        },
    } = <any>await (await fetch("https://www.exbitron.com/api/v2/peatio/public/markets/avnusdt/tickers")).json();

    return data;
};