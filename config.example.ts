export const config = {
    "bot": {
        "token": "",
        "prefix": "!avn",
        "msgtimeout": 120000, // 2 minutes
        "timezone": [
            "Europe/Amsterdam",
            "HH:mm:ss DD/MM/YYYY"
        ]
    },
    "project": {
        "siteurl": "",
        "githuburl": "",
        "twitterurl": "",
        "redditurl": "",
        "discordurl": "",
        "telegramurl": "",
        "telegramannurl": "",
        "bitcointalkurl": "",
        "donationaddress": "",
        "webwalleturl": ""
    },
    "coin": {
        "coinname": "avian",
        "coinsymbol": "avn",
        "paytxfee": 0.005,
        "rpc": {
            "host": "localhost",
            "port": 1234,
            "user": "username",
            "pass": "password"
        }
    },
    "moderation": {
        "pm2Name": "TipBot",
        "perms": [
            "[MEMBER]"
        ],
        "botDev": "[Developer Team]",
        "logchannel": "",
        "botspamchannel": ""
    },
    "explorer": {
        "explorerurl": "",
        "explorertxurl": "",
        "exploreraddressurl": ""
    },
    "wavn": {
        "contractaddress": "",
        "polygonapikey": "",
        "coinwrapurl": ""
    },
    "nomics": {
        "apikey": ""
    }
}