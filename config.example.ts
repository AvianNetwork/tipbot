export const config = {
    bot: {
        token: ``,
        prefix: `!avn`,
        msgtimeout: 120000, // 2 minutes
        timezone: [`Europe/Amsterdam`, `HH:mm:ss DD/MM/YYYY`],
    },
    project: {
        site: `https://avn.network/`,
        github: `https://github.com/AvianNetwork/Avian/`,
        twitter: `https://twitter.com/avianfoundation`,
        reddit: `https://www.reddit.com/r/aviannetwork`,
        discord: `https://discord.gg/xDDMYA2SqV`,
        telegram: `https://t.me/AvianNetwork`,
        telegramann: `https://t.me/AvianNetworkAnnouncements`,
        bitcointalk: `https://bitcointalk.org/index.php?topic=5377648`,
        webwallet: `https://wallet.avn.network/`,
        explorer: `https://explorer.avn.network/`,
        donationaddress: `RDs4A4sDHp4otDHQQuFSaPDYEg2xx3hbdN`,
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
    channels: {
        logging: ``,
        bots: ``,
        price: ``,
    },
    wavn: {
        contractaddress: `0x752dc265eaf6da2db0f8e4a32d5596d3f18e8701`,
        url: `https://wavn.avn.network/`,
    },
    nomics: {
        apikey: ``,
    },
};
