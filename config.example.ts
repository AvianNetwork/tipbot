export const config = {
    bot: {
        token: ``,
        prefix: `!avn`,
        msgtimeout: 120000, // 2 minutes
        timezone: [
            `Europe/Amsterdam`,
            `HH:mm:ss DD/MM/YYYY`,
        ],
    },
    project: {
        siteurl: `https://avn.network/`,
        githuburl: `https://github.com/AvianNetwork/Avian/`,
        twitterurl: `https://twitter.com/avianfoundation`,
        redditurl: `https://www.reddit.com/r/aviannetwork`,
        discordurl: `https://discord.gg/xDDMYA2SqV`,
        telegramurl: `https://t.me/AvianNetwork`,
        telegramannurl: `https://t.me/AvianNetworkAnnouncements`,
        bitcointalkurl: `https://bitcointalk.org/index.php?topic=5377648`,
        donationaddress: `RDs4A4sDHp4otDHQQuFSaPDYEg2xx3hbdN`,
        webwalleturl: `https://wallet.avn.network/`,
        explorerurl: `https://explorer.avn.network/`,
    },
    coin: {
        coinname: `Avian`,
        coinsymbol: `avn`,
        paytxfee: 0.01,
        address: /^[R][a-zA-Z0-9]{33}$/,
        rpc: {
            hostname: `localhost`,
            port: 1234,
            username: `username`,
            password: `password`,
        },
    },
    moderation: {
        logchannel: "",
        botspamchannel: ``,
    },
    wavn: {
        contractaddress: ``,
        polygonapikey: ``,
        coinwrapurl: `https://wavn.avn.network/`,
    },
    nomics: {
        apikey: ``,
    },
};