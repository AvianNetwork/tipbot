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

export const getTicker = async (asset: string = "usdt"): Promise<{ // Set this big object so we can have type checking when using the function
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
}> => {
    return new Promise(async (resolve, reject) => {
        // Fetch the API data
        const data: any = await (await fetch(`https://www.exbitron.com/api/v2/peatio/public/markets/avn${asset}/tickers`)).json();

        // If an error has occurred, reject the promise
        if (!data || data[`error`]) {
            reject(data[`error`][0]);
            return;
        }
        
        // If no error has occurred, resolve the promise
        resolve(data[`ticker`]);
        return;
    });
};