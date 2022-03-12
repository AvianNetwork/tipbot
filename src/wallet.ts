// Import the config variables
import { config } from "../config.js";

// Import the required packages
import Discord from "discord.js";

// Import helper functions
import * as main from "./index.js";
import * as helper from "./helper.js";

export const balance = async (message: Discord.Message) => {
    const balanceData = await helper.rpc(`getbalance`, [message.author.id, 1]);
    if (balanceData[0]) {
        await main.log(
            `Error while fetching balance for user ${message.author.id}: ${balanceData[0]}`,
        );
        helper.sendErrorMessage(
            message,
            `**:bank::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) balance :moneybag::money_with_wings::bank:**`,
            `An errror occured while fetching your balance.`,
        );
        return;
    } else {
        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:bank::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Balance sent!:moneybag::money_with_wings::bank:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Success!`,
                                    value: `**:lock: Balance sent via DM**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        // Send the balance via DM
        message.author
            .send({
                embeds: [
                    {
                        description: `**:bank::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Your balance!:moneybag::money_with_wings::bank:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `__User__`,
                                value: `<@${message.author.id}>`,
                                inline: false,
                            },
                            {
                                name: `__Balance__`,
                                value: `**${JSON.stringify(balanceData[1])}**`,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                helper.sendErrorMessage(
                    message,
                    `**:bank::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) balance :moneybag::money_with_wings::bank:**`,
                    `**Balance was not able to be sent via DM, do you have DM's disabled?**`,
                );
            });
    }
};

export const deposit = async (message: Discord.Message) => {
    // Check if the user already has a deposit address
    const addressesByAccount = await helper.rpc(`getaddressesbyaccount`, [message.author.id]);
    if (addressesByAccount[0]) {
        await main.log(
            `Error while generating new address for user ${message.author.id}: ${addressesByAccount[0]}`,
        );
        helper.sendErrorMessage(
            message,
            `**:moneybag::card_index::bank: ${config.coin.name} (${config.coin.symbol}) deposit address :moneybag::card_index::bank:**`,
            `An error occured while generating a new deposit address.`,
        );
        return;
    }

    if (addressesByAccount[1].length > 0) {
        // If the user already has a deposit address, send it
        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:bank::card_index::moneybag: ${config.coin.name} (${config.coin.symbol}) Deposit address sent!:moneybag::card_index::bank:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Success!`,
                                    value: `**:lock: Deposit address sent via DM**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        message.author
            .send({
                embeds: [
                    {
                        description: `**:bank::card_index::moneybag: ${config.coin.name} (${config.coin.symbol}) Your deposit address!:moneybag::card_index::bank:**`,
                        color: 1363892,
                        thumbnail: {
                            url: `${config.project.explorer}qr/${JSON.stringify(
                                addressesByAccount[1][0],
                            )}`,
                        },
                        fields: [
                            {
                                name: `__User__`,
                                value: `<@${message.author.id}>`,
                                inline: false,
                            },
                            {
                                name: `__Deposit Address__`,
                                value: `**${JSON.stringify(addressesByAccount[1][0])}**`,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                helper.sendErrorMessage(
                    message,
                    `**:moneybag::card_index::bank: ${config.coin.name} (${config.coin.symbol}) deposit address :moneybag::card_index::bank:**`,
                    `**Deposit address was not able to be sent via DM, do you have DM's disabled?**`,
                );
            });
    } else {
        // If the user does not have a deposit address, generate one and send it
        const newAddress = await helper.rpc(`getnewaddress`, [message.author.id]);
        if (newAddress[0]) {
            await main.log(
                `Error while generating new address for user ${message.author.id}: ${newAddress[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:moneybag::card_index::bank: ${config.coin.name} (${config.coin.symbol}) deposit address :moneybag::card_index::bank:**`,
                `An error occured while generating a new deposit address.`,
            );
            return;
        }

        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:bank::card_index::moneybag: ${config.coin.name} (${config.coin.symbol}) Deposit address sent!:moneybag::card_index::bank:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Success!`,
                                    value: `**:lock: Deposit address sent via DM**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        message.author
            .send({
                embeds: [
                    {
                        description: `**:bank::card_index::moneybag: ${config.coin.name} (${config.coin.symbol}) Your deposit address!:moneybag::card_index::bank:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `__User__`,
                                value: `<@${message.author.id}>`,
                                inline: false,
                            },
                            {
                                name: `__Deposit Address__`,
                                value: `**${JSON.stringify(newAddress[1])}**`,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                helper.sendErrorMessage(
                    message,
                    `**:moneybag::card_index::bank: ${config.coin.name} (${config.coin.symbol}) deposit address :moneybag::card_index::bank:**`,
                    `**Deposit address was not able to be sent via DM, do you have DM's disabled?**`,
                );
            });
    }
};

export const donate = async (message: Discord.Message) => {
    // Check if the user wanted to donate
    const amount = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    if (!isNaN(Number(amount)) && isFinite(Number(amount)) && parseFloat(amount) > 0) {
        // If the user wants to donate
        // Get the balance of the user
        const balance = await helper.rpc(`getbalance`, [message.author.id]);
        if (balance[0]) {
            await main.log(
                `Error while getting balance of user ${message.author.id}: ${balance[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) donating :outbox_tray::money_with_wings::moneybag:**`,
                `An error occured while getting your balance.`,
            );
            return;
        }

        // Check if the user has enough balance to donate
        if (parseFloat(balance[1]) < parseFloat(amount) + config.coin.txfee) {
            helper.sendErrorMessage(
                message,
                `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) donating :outbox_tray::money_with_wings::moneybag:**`,
                `You do not have enough balance to donate. Take the fee (${config.coin.txfee}) into account as well.`,
            );
            return;
        }

        // Make the transaction
        const txidData = await helper.rpc(`sendfrom`, [
            message.author.id,
            config.project.donationaddress,
            amount,
        ]);
        if (txidData[0]) {
            await main.log(
                `Error while donating to ${config.project.donationaddress}: ${txidData[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) donating :outbox_tray::money_with_wings::moneybag:**`,
                `An error occured while donating.`,
            );
            return;
        }

        // Send the message
        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Donation Sent!  :moneybag::money_with_wings::outbox_tray:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `Success!`,
                                    value: `:lock:  Donation receipt sent via DM`,
                                    inline: true,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        message.author
            .send({
                embeds: [
                    {
                        description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Donation Sent!  :moneybag::money_with_wings::outbox_tray:**`,
                        color: 1363892,
                        footer: {
                            text: `Thank you for donating to the Avian Foundation!`,
                            icon_url: `https://explorer.avn.network/images/avian_256x256x32.png`,
                        },
                        fields: [
                            {
                                name: `__Sender__`,
                                value: `<@${message.author.id}>`,
                                inline: true,
                            },
                            {
                                name: `__Receiver__`,
                                value: `**${config.project.donationaddress}**\n${config.project.explorer}address/${config.project.donationaddress}`,
                                inline: true,
                            },
                            {
                                name: `__txid__`,
                                value: `**${txidData[1]}**\n${config.project.explorer}tx/${txidData[1]}`,
                                inline: false,
                            },
                            {
                                name: `__Amount__`,
                                value: `**${amount}**`,
                                inline: true,
                            },
                            {
                                name: `__Fee__`,
                                value: `**${config.coin.txfee.toString()}**\n\u200b`,
                                inline: true,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                message
                    .reply({
                        embeds: [
                            {
                                description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Donation Sent!  :moneybag::money_with_wings::outbox_tray:**`,
                                color: 1363892,
                                fields: [
                                    {
                                        name: `__User__`,
                                        value: `<@${message.author.id}>`,
                                        inline: false,
                                    },
                                    {
                                        name: `Uh oh!`,
                                        value: `**Donation receipt was not able to be sent via DM, do you have DM's disabled?**`,
                                        inline: false,
                                    },
                                    {
                                        name: `Your donation was sent successfully and your txid is:`,
                                        value: `**${txidData[1]}**\n${config.project.explorer}tx/${txidData[1]}`,
                                        inline: false,
                                    },
                                ],
                            },
                        ],
                    })
                    .then(helper.deleteAfterTimeout);
            });
    } else {
        // If the user did not want to donate, show the donate menu
        message
            .reply({
                embeds: [
                    {
                        description: `**:outbox_tray::money_with_wings::moneybag:  ${config.coin.name} (${config.coin.symbol}) Donation Address  :moneybag::money_with_wings::outbox_tray:**\n\u200b`,
                        color: 1363892,
                        footer: {
                            text: `Thank you for donating to the Avian Foundation!`,
                            icon_url: `https://explorer.avn.network/images/avian_256x256x32.png`,
                        },
                        fields: [
                            {
                                name: `__Avian Foundation donation adress__`,
                                value: `${config.project.donationaddress}\n*(Send ${config.coin.name} only)*`,
                                inline: false,
                            },
                            {
                                name: `__To donate from your bot wallet__`,
                                value: "`!avn donate <amount>`",
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
        return;
    }
};

export const withdraw = async (message: Discord.Message) => {
    const address = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[1];
    const amount = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];

    // Check if the address is valid
    if (address && config.coin.address.test(address)) {
        // Check if it is an valid amount
        if (!isNaN(Number(amount)) && isFinite(Number(amount)) && parseFloat(amount) > 0) {
            // Get the balance of the user
            const balance = await helper.rpc(`getbalance`, [message.author.id]);
            if (balance[0]) {
                await main.log(
                    `Error while getting balance of user ${message.author.id}: ${balance[0]}`,
                );
                helper.sendErrorMessage(
                    message,
                    `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdraw :outbox_tray::money_with_wings::moneybag:**`,
                    `An error occured while getting your balance.`,
                );
                return;
            }

            // Check if the user has enough balance to withdraw
            if (parseFloat(balance[1]) < parseFloat(amount) + config.coin.txfee) {
                helper.sendErrorMessage(
                    message,
                    `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdraw :outbox_tray::money_with_wings::moneybag:**`,
                    `You do not have enough balance to withdraw. Take the fee (${config.coin.txfee}) into account as well.`,
                );
                return;
            }

            // Make the transaction
            const txidData = await helper.rpc(`sendfrom`, [
                message.author.id,
                address,
                Number(amount),
            ]);
            if (txidData[0]) {
                await main.log(
                    `Error while donating to ${config.project.donationaddress}: ${txidData[0]}`,
                );
                helper.sendErrorMessage(
                    message,
                    `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdraw :outbox_tray::money_with_wings::moneybag:**`,
                    `An error occured while withdrawing.`,
                );
                return;
            }

            // Send the message
            if (message.channel.type !== `DM`) {
                message
                    .reply({
                        embeds: [
                            {
                                description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Transaction completed! :outbox_tray::money_with_wings::moneybag:**`,
                                color: 1363892,
                                fields: [
                                    {
                                        name: `Success!`,
                                        value: `:lock:  Withdrawal receipt sent via DM`,
                                        inline: true,
                                    },
                                ],
                            },
                        ],
                    })
                    .then(helper.deleteAfterTimeout);
            }
            message.author
                .send({
                    embeds: [
                        {
                            description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdrawal sent!  :moneybag::money_with_wings::outbox_tray:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__Sender__`,
                                    value: `<@${message.author.id}>`,
                                    inline: true,
                                },
                                {
                                    name: `__Receiver__`,
                                    value: `**${config.project.donationaddress}**\n${config.project.explorer}address/${config.project.donationaddress}`,
                                    inline: true,
                                },
                                {
                                    name: `__txid__`,
                                    value: `**${txidData[1]}**\n${config.project.explorer}tx/${txidData[1]}`,
                                    inline: false,
                                },
                                {
                                    name: `__Amount__`,
                                    value: `**${amount}**`,
                                    inline: true,
                                },
                                {
                                    name: `__Fee__`,
                                    value: `**${config.coin.txfee.toString()}**\n\u200b`,
                                    inline: true,
                                },
                            ],
                        },
                    ],
                })
                .catch(() => {
                    // If the user has their DMs disabled, send an error message
                    message
                        .reply({
                            embeds: [
                                {
                                    description: `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdrawal sent!  :moneybag::money_with_wings::outbox_tray:**`,
                                    color: 1363892,
                                    fields: [
                                        {
                                            name: `__User__`,
                                            value: `<@${message.author.id}>`,
                                            inline: false,
                                        },
                                        {
                                            name: `Uh oh!`,
                                            value: `**Withdrawal receipt was not able to be sent via DM, do you have DM's disabled?**`,
                                            inline: false,
                                        },
                                        {
                                            name: `Your withdrawal was sent successfully and your txid is:`,
                                            value: `**${txidData[1]}**\n${config.project.explorer}tx/${txidData[1]}`,
                                            inline: false,
                                        },
                                    ],
                                },
                            ],
                        })
                        .then(helper.deleteAfterTimeout);
                });
        } else {
            helper.sendErrorMessage(
                message,
                `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdraw :outbox_tray::money_with_wings::moneybag:**`,
                `Please enter a valid amount.`,
            );
            return;
        }
    } else {
        helper.sendErrorMessage(
            message,
            `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Withdraw :outbox_tray::money_with_wings::moneybag:**`,
            `Invalid address.`,
        );
        return;
    }
};

export const tip = async (message: Discord.Message) => {
    // Parse the user ID and amount
    const mentions = message.mentions.users.toJSON();
    if (mentions.length !== 1) {
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `Please mention one user.`,
        );
        return;
    }

    // Make sure the to get tipped user isn't a bot nor the user itself
    if (mentions[0].bot || mentions[0].id === message.author.id) {
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `You cannot tip yourself nor bots.`,
        );
        return;
    }

    const userID = mentions[0].id;
    const amount = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)[2];

    // Check if the amount is valid
    if (isNaN(Number(amount)) || !isFinite(Number(amount)) || Number(amount) < 0) {
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `Please enter a valid amount.`,
        );
        return;
    }

    // Get the balance of the user
    const balance = await helper.rpc(`getbalance`, [message.author.id]);
    if (balance[0]) {
        await main.log(`Error while getting balance of user ${message.author.id}: ${balance[0]}`);
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `An error occured while getting your balance.`,
        );
        return;
    }

    // Check if the user has enough balance to tip
    if (parseFloat(balance[1]) < parseFloat(amount) + config.coin.txfee) {
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `You do not have enough balance to tip. Take the fee (${config.coin.txfee}) into account as well.`,
        );
        return;
    }

    // Make the tip
    const tipData = await helper.rpc(`move`, [message.author.id, userID, Number(amount)]);
    if (tipData[0]) {
        await main.log(`Error while donating to ${config.project.donationaddress}: ${tipData[0]}`);
        helper.sendErrorMessage(
            message,
            `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
            `An error occured while tipping.`,
        );
        return;
    }

    // Inform the user the tip was successful
    if (message.channel.type !== "DM") {
        message.channel
            .send({
                embeds: [
                    {
                        description: `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `Success!`,
                                value: `:lock:  Tip receipt sent via your DM.`,
                                inline: true,
                            },
                        ],
                    },
                ],
            })
            .then(helper.deleteAfterTimeout);
    }

    message.author
        .send({
            embeds: [
                {
                    description: `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `__Sender__`,
                            value: `<@${message.author.id}>`,
                            inline: true,
                        },
                        {
                            name: `__Receiver__`,
                            value: `<@${userID}>`,
                            inline: true,
                        },
                        {
                            name: `__Amount__`,
                            value: `**${amount} ${config.coin.symbol}**`,
                            inline: true,
                        },
                    ],
                },
            ],
        })
        .catch(() => {
            // If the user has DMs disabled, send a message in the public channel
            message.channel
                .send({
                    embeds: [
                        {
                            description: `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Uh oh!`,
                                    value: `**:x:  The receipt was not able to be sent via DM, do you have DM's disabled?**`,
                                    inline: false,
                                },
                                {
                                    name: `__Tip status__`,
                                    value: `**Sent!**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        });

    // DM the tip recipient
    mentions[0]
        .send({
            embeds: [
                {
                    description: `**:money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Tip :moneybag::money_with_wings:**`,
                    color: 1363892,
                    fields: [
                        {
                            name: `__Sender__`,
                            value: `<@${message.author.id}>`,
                            inline: true,
                        },
                        {
                            name: `__Amount__`,
                            value: `**${amount} ${config.coin.symbol}**`,
                            inline: true,
                        },
                    ],
                },
            ],
        })
        .catch(() => {});
};

export const walletversion = async (message: Discord.Message) => {
    const networkInfoData = await helper.rpc(`getnetworkinfo`, []);
    if (networkInfoData[0]) {
        helper.sendErrorMessage(
            message,
            `**:outbox_tray::money_with_wings::moneybag: ${config.coin.name} (${config.coin.symbol}) Wallet Version :outbox_tray::money_with_wings::moneybag:**`,
            `An error occured while getting the wallet version.`,
        );
        return;
    }

    // Send the message
    message.channel
        .send({
            embeds: [
                {
                    description: `**:robot: ${config.coin.name} (${config.coin.symbol}) Bot wallet version information :robot:**`,
                    color: 1363892,
                    footer: {
                        text: `Avian Network`,
                        icon_url: `https://explorer.avn.network/images/avian_256x256x32.png`,
                    },
                    fields: [
                        {
                            name: `__Wallet Version__`,
                            value: `**${networkInfoData[1]["version"]}**`,
                            inline: true,
                        },
                        {
                            name: `__Sub version__`,
                            value: `**${networkInfoData[1]["subversion"]}**`,
                            inline: true,
                        },
                        {
                            name: `__Protocol version__`,
                            value: `**${networkInfoData[1]["protocolversion"]}**`,
                            inline: true,
                        },
                    ],
                },
            ],
        })
        .then(helper.deleteAfterTimeout);
};

export const privatekey = async (message: Discord.Message) => {
    // Get the address of the user
    const addressesByAccount = await helper.rpc(`getaddressesbyaccount`, [message.author.id]);
    if (addressesByAccount[0]) {
        await main.log(
            `Error while getting the address for user ${message.author.id}: ${addressesByAccount[0]}`,
        );
        helper.sendErrorMessage(
            message,
            `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key:moneybag::money_with_wings::closed_lock_with_key:**`,
            `An error occured while getting your address.`,
        );
        return;
    }

    if (addressesByAccount[1].length > 0) {
        // If the user already has an address, send the private key of it
        const privateKey = await helper.rpc(`dumpprivkey`, [addressesByAccount[1][0]]);
        if (privateKey[0]) {
            await main.log(
                `Error while dumping private key for user ${message.author.id}: ${privateKey[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                `An error occured while dumping your private key.`,
            );
            return;
        }

        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key sent:moneybag::money_with_wings::closed_lock_with_key:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Success!`,
                                    value: `**:lock: Private key sent via DM**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        message.author
            .send({
                embeds: [
                    {
                        description: `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) your private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `__User__`,
                                value: `<@${message.author.id}>`,
                                inline: false,
                            },
                            {
                                name: `__Private key__`,
                                value: `**${privateKey[1]}**`,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                helper.sendErrorMessage(
                    message,
                    `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                    `**Your private key was not able to be sent via DM, do you have DM's disabled?**`,
                );
            });
    } else {
        // If the user does not have an address, generate one and send the private key of it
        const newAddress = await helper.rpc(`getnewaddress`, [message.author.id]);
        if (newAddress[0]) {
            await main.log(
                `Error while generating new address for user ${message.author.id}: ${newAddress[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:moneybag::card_index::bank: ${config.coin.name} (${config.coin.symbol}) deposit address :moneybag::card_index::bank:**`,
                `An error occured while generating a new deposit address.`,
            );
            return;
        }

        const privateKey = await helper.rpc(`dumpprivkey`, [newAddress[1]]);
        if (privateKey[0]) {
            await main.log(
                `Error while dumping private key for user ${message.author.id}: ${privateKey[0]}`,
            );
            helper.sendErrorMessage(
                message,
                `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                `An error occured while dumping your private key.`,
            );
            return;
        }

        if (message.channel.type !== `DM`) {
            message
                .reply({
                    embeds: [
                        {
                            description: `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key sent:moneybag::money_with_wings::closed_lock_with_key:**`,
                            color: 1363892,
                            fields: [
                                {
                                    name: `__User__`,
                                    value: `<@${message.author.id}>`,
                                    inline: false,
                                },
                                {
                                    name: `Success!`,
                                    value: `**:lock: Private key sent via DM**`,
                                    inline: false,
                                },
                            ],
                        },
                    ],
                })
                .then(helper.deleteAfterTimeout);
        }

        message.author
            .send({
                embeds: [
                    {
                        description: `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) your private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                        color: 1363892,
                        fields: [
                            {
                                name: `__User__`,
                                value: `<@${message.author.id}>`,
                                inline: false,
                            },
                            {
                                name: `__Private key__`,
                                value: `**${privateKey[1]}**`,
                                inline: false,
                            },
                        ],
                    },
                ],
            })
            .catch(() => {
                // If the user has their DMs disabled, send an error message
                helper.sendErrorMessage(
                    message,
                    `**:closed_lock_with_key::money_with_wings::moneybag:${config.coin.name} (${config.coin.symbol}) private key:moneybag::money_with_wings::closed_lock_with_key:**`,
                    `**Your private key was not able to be sent via DM, do you have DM's disabled?**`,
                );
            });
    }
};
