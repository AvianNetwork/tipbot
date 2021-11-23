'use strict';

const bitcoin = require('bitcoin');

let Regex = require('regex'),
 config = require('config'),
 spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('avn').config;
let paytxfee = config.get('avn').paytxfee;
let polygonapikey = config.get('wavn').polygonapikey;
let contractaddress = config.get('wavn').contractaddress;
let coinwrapurl = config.get('wavn').coinwrapurl;
let coinname = config.get('avn').coinname;
let coinsymbol = config.get('avn').coinsymbol;
let prefix = config.get('bot').prefix;
let msgtimeout = config.get('bot').msgtimeout;
let errmsgtimeout = config.get('bot').errmsgtimeout;
let projectsiteurl = config.get('project').siteurl;
let projectgithub = config.get('project').githuburl;
let projecttwitter = config.get('project').twitterurl;
let projectreddit = config.get('project').redditurl;
let projectdiscord = config.get('project').discordurl;
let projecttelegram = config.get('project').telegramurl;
let projecttelegramann = config.get('project').telegramannurl;

let oldcoinsymbol = "RVL";


const rvn = new bitcoin.Client(walletConfig);

exports.commands = ['avn'];
//console.log(exports.commands);
let text = exports.commands.toString();
let botcmd = text.replace("['", "");
botcmd = botcmd.replace("']", "");
//console.log('botcmd='+botcmd);

exports.avn = {
  usage: '<subcommand>',
  description:
  '__**' + coinname + ' (' + coinsymbol + ') Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **' + prefix + botcmd + '** : Displays This Message\n    **' + prefix + botcmd + ' balance** : get your balance\n    **' + prefix + botcmd + ' deposit** : get address for your deposits\n    **' + prefix + botcmd + ' withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **' + prefix + botcmd + ' <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **' + prefix + botcmd + ' private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **' + prefix + botcmd + ' privkey** : dump privkey for your wallet(result sent via DM)\n    **' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge>** : Display ' + coinsymbol + ' market data\n    **' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge> <number of coins>** : Calculate market value of ' + coinsymbol + ' coins in selected currency\n    **' + prefix + botcmd + ' exchanges** : Display ' + coinsymbol + ' exchange listings\n    **' + prefix + botcmd + ' wavn** : Display w' + coinsymbol + ' information\n    **' + prefix + botcmd + ' sushi** : Display w' + coinsymbol + ' Sushi Swap Information\n    **' + prefix + botcmd + ' diff** : Display current network difficulty\n    **' + prefix + botcmd + ' hash** : Display current network hashrate\n    **' + prefix + botcmd + ' mininginfo** : Display network mining info\n    **' + prefix + botcmd + ' miningcalc <MH/s>** : Calculate mining returns (MH/s)\n    **' + prefix + botcmd + ' chaininfo** : Display blockchain info\n\n   **<> : Replace with appropriate value.**',
    process: async function(bot, msg, suffix) {
    let tipper = msg.author.id.replace('!', ''),
      words = msg.content
	.trim()
        .split(' ')
        .filter(function(n) {
	  return n !== '';
        }),
      subcommand = words.length >= 2 ? words[1] : 'help',
      helpmsg =
        '__**' + coinname + ' (' + coinsymbol + ') Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **' + prefix + botcmd + '** : Displays This Message\n    **' + prefix + botcmd + ' balance** : get your balance\n    **' + prefix + botcmd + ' deposit** : get address for your deposits\n    **' + prefix + botcmd + ' withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **' + prefix + botcmd + ' <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **' + prefix + botcmd + ' private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **' + prefix + botcmd + ' privkey** : dump privkey for your wallet(result sent via DM)\n    **' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge>** : Display ' + coinsymbol + ' market data\n    **' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge> <number of coins>** : Calculate market value of ' + coinsymbol + ' coins in selected currency\n    **' + prefix + botcmd + ' exchanges** : Display ' + coinsymbol + ' exchange listings\n    **' + prefix + botcmd + ' wavn** : Display w' + coinsymbol + ' information\n    **' + prefix + botcmd + ' sushi** : Display w' + coinsymbol + ' Sushi Swap Information\n    **' + prefix + botcmd + ' diff** : Display current network difficulty\n    **' + prefix + botcmd + ' hash** : Display current network hashrate\n    **' + prefix + botcmd + ' mininginfo** : Display network mining info\n    **' + prefix + botcmd + ' miningcalc <MH/s>** : Calculate mining returns (MH/s)\n    **' + prefix + botcmd + ' chaininfo** : Display blockchain info\n\n    **<> : Replace with appropriate value.**',
      channelwarning = 'Please use <#bot_spot> or DMs to talk to bots.';
    switch (subcommand) {
      case 'help':
	privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
        break;
      case 'dm':
	dmMe(msg);
	break;
      case 'balance':
        doBalance(msg, tipper);
        break;
      case 'deposit':
        privateorSpamChannel(msg, channelwarning, doDeposit, [tipper]);
        break;
      case 'withdraw':
        privateorSpamChannel(msg, channelwarning, doWithdraw, [tipper, words, helpmsg]);
        break;
      case 'usdt':
        getPrice(msg, 'usdt', words[2]);
        break;
      case 'btc':
	getPrice(msg, 'btc', words[2]);
	break;
      case 'rvn':
	getPrice(msg, 'rvn', words[2]);
	break;
      case 'doge':
        getPrice(msg, 'doge', words[2]);
        break;
      case 'ltc':
	getPrice(msg, 'ltc', words[2]);
	break;
      case 'privkey':
	dumpPrivKey(msg, tipper);
      break;
      case 'wavn':
	getWAVN(msg);
      break;
      case 'sushi':
	getSushi(msg);
      break;
      case 'diff':
	getDifficulty(msg);
      break;
      case 'hash':
	getNetworkHashPs(msg);
      break;
      case 'mininginfo':
	getMiningInfo(msg);
      break;
      case 'miningcalc':
	miningCalc(msg, words[2]);
      break;
      case 'chaininfo':
	getBlockchainInfo(msg);
      break;
      case 'exchanges':
	listExchanges(msg);
      break;
      case 'links':
	listURLs(msg);
      break;
      case 'validate':
      case 'validateaddr':
	validateAddress(msg, words[2]);
      break;
      default:
        doTip(bot, msg, tipper, words, helpmsg);
    }
  }
};

function privateorSpamChannel(message, wrongchannelmsg, fn, args) {
  if (!inPrivateorSpamChannel(message)) {
    message.reply(wrongchannelmsg);
    return;
  }
  fn.apply(null, [message, ...args]);
}

//////////////////////////
// Display help message //
//////////////////////////

function doHelp(message, helpmsg) {
//  message.reply(helpmsg);

    message.channel.send({ embeds: [ {
	
	    description: '__**' + coinname + ' (' + coinsymbol + ') Tipper**__',
	        color: 1363892,
	        fields: [
			    {
				    name: ':left_right_arrow:  Transaction Fees  :left_right_arrow:',
			            value: '' + paytxfee + ' ' + coinsymbol + '\n\u200b',
			            inline: false
		            },
			    {
				    name: ':globe_with_meridians:  Project Info  :globe_with_meridians:',
				    value: '**' + prefix + botcmd + ' links** : List official project links\n\u200b',
				    inline: false
			    },
			    {
				    name: ':moneybag:  Wallet commands  :moneybag:',
				      value: '**' + prefix + botcmd + ' balance** : get your balance\n**' + prefix + botcmd + ' deposit** : get address for your deposits\n**' + prefix + botcmd + ' withdraw <address> <amount>** : withdraw coins to specified address\n**' + prefix + botcmd + ' <@user> <amount>** : mention a user with @ and then the amount to tip them\n**' + prefix + botcmd + ' private <user> <amount>** : put private before Mentioning a user to tip them privately.\n**' + prefix + botcmd + ' privkey** : dump privkey for your wallet(result sent via DM)\n\u200b',
				      inline: false
			    },
			    {
			    
				    name: ':chart_with_upwards_trend:  Market Data  :chart_with_upwards_trend:',
				    value: '**' + prefix + botcmd + ' exchanges** : Display ' + coinsymbol + ' exchange listings\n**' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge>** : Display ' + coinsymbol + ' market data\n**' + prefix + botcmd + ' <usdt|btc|ltc|rvn|doge> <number of coins>** : Calculate market value of ' + coinsymbol + ' coins in selected currency\n**' + prefix + botcmd + ' wavn** : Display w' + coinsymbol + ' information\n**' + prefix + botcmd + ' sushi** : Display w' + coinsymbol + ' Sushi Swap Information\n\u200b',
				    inline: false
			    },
			    {
				   name: ':chains:  Blockchain and Mining  :pick:',
				   value: '**' + prefix + botcmd + ' diff** : Display current network difficulty\n**' + prefix + botcmd + ' hash** : Display current network hashrate\n**' + prefix + botcmd + ' mininginfo** : Display network mining info\n**' + prefix + botcmd + ' miningcalc <MH/s>** : Calculate mining returns (MH/s)\n**' + prefix + botcmd + ' chaininfo** : Display blockchain info**\n' + prefix + botcmd + ' validate <address>** : Validate ' + coinsymbol + ' address\n\n**' + prefix + botcmd + ' dm** : Start a DM session with the bot. \n\n**<> : Replace with appropriate value.**',
				   inline: false
			    }

			    ]
	      } ] }).then(msg => {
		      
		      let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);

		      if(message.channel.type == 'DM'){
						                                      
			      clearTimeout(publichantimeout);
						                              
		      }
	
	      });

}

////////////////////////////////////////
// Retrieve and display users balance //
////////////////////////////////////////

function doBalance(message, tipper) {
	
	rvn.getBalance(tipper, 1, function(err, balance) {

		if (err) {

			console.log(err);

			message.reply('Error getting ' + coinname + ' (' + coinsymbol + ') balance.').then(msg => {
                        
				setTimeout(() => msg.delete(), 10000)
                              
			});
    
		} else {
			
			// if not a DM respond with public chan message
			if(message.channel.type !== 'DM'){
	    
				message.channel.send({ embeds: [ {
					description: '**:bank::money_with_wings::moneybag:' + coinname + ' (' + coinsymbol + ') Balance sent!:moneybag::money_with_wings::bank:**',
					color: 1363892,
					fields: [

						{
							name: '__User__',
							value: '<@' + message.author.id + '>',
							inline: false
						},
						{
							name: 'Success!',
							value: '**:lock: Balance sent via DM**',
							inline: false
						}

					]
		    
				} ] }).then(msg => {
	  
					setTimeout(() => msg.delete(), msgtimeout)
  
				});
	    
			}
		
			// DM user their balance
			message.author.send({ embeds: [ {
			    
				description: '**:bank::money_with_wings::moneybag:' + coinname + ' (' + coinsymbol + ') Balance!:moneybag::money_with_wings::bank:**',
				color: 1363892,
				fields: [
				
					{
						name: '__User__',
						value: '<@' + message.author.id + '>',
						inline: false
					},
					{
						name: '__Balance__',
						value: '**' + balance.toString() + '**',
						inline: false
					}

				]
		
			} ] }).catch(error => {
			
				// If error(DMs disabled) be sane and send a notification to public chan
				message.channel.send({ embeds: [ {
                                        description: '**:bank::money_with_wings::moneybag:' + coinname + ' (' + coinsymbol + ') Balance :moneybag::money_with_wings::bank:**',
                                        color: 1363892,
                                        fields: [

                                                {
                                                        name: '__User__',
                                                        value: '<@' + message.author.id + '>',
                                                        inline: false
                                                },
                                                {
                                                        name: 'Uh oh!',
                                                        value: '**:x:  Balance was not able to be sent via DM, do you have DM\'s disabled?**',
                                                        inline: false
                                                }

                                        ]

                                } ] }).then(msg => {

                                        setTimeout(() => msg.delete(), msgtimeout)

                                })

			});

		}
	
	});
	
}

/////////////////////////
// Get deposit address //
////////////////////////

function doDeposit(message, tipper) {

	getAddress(tipper, function(err, address) {

		if (err) {

			console.log(err);
			message.reply('Error getting your ' + coinname + ' (' + coinsymbol + ') deposit address.').then(message => message.delete(10000));

		} else {
			
			// reply for public chan
			if(message.channel.type !== 'DM'){
	
				message.channel.send({ embeds: [ {
			    
					description: '**:bank::card_index::moneybag: ' + coinname + ' (' + coinsymbol + ') Address :moneybag::card_index::bank:**',
					color: 1363892,
					fields: [
      
						{
							name: 'Success!',
							value: ':lock: Deposit address sent via DM',
							inline: false
						}
					]

				} ] }).then(msg => {

					setTimeout(() => msg.delete(), msgtimeout)

				});
			}

			// DM the user the deposit address
			message.author.send({ embeds: [ {

				description: '**:bank::card_index::moneybag:' + coinname + ' (' + coinsymbol + ') Address!:moneybag::card_index::bank:**',
				color: 1363892,
				fields: [

					{
						name: '__User__',
						value: '<@' + message.author.id + '>',
						inline: false
					},
					{
						name: '__Address__',
						value: '**' + address + '**',
						inline: false
					}
		    
				]

			} ] }).catch(error => {
				
				// If error(DMs disabled) be sane and send a notification to public chan
                                message.channel.send({ embeds: [ {
					description: '**:bank::card_index::moneybag:' + coinname + ' (' + coinsymbol + ') Address :bank::card_index::moneybag:**',
                                        color: 1363892,
                                        fields: [

                                                {
                                                        name: '__User__',
                                                        value: '<@' + message.author.id + '>',
                                                        inline: false
                                                },
                                                {
                                                        name: 'Uh oh!',
                                                        value: '**:x:  Address was not able to be sent via DM, do you have DM\'s disabled?**',
                                                        inline: false
                                                }

                                        ]

                                } ] }).then(msg => {

                                        setTimeout(() => msg.delete(), msgtimeout)

                                })

                        }); 

		}


	});

}

///////////////////////
// Make a withdrawal //
///////////////////////

function doWithdraw(message, tipper, words, helpmsg) {

	if (words.length < 4) {
		
		doHelp(message, helpmsg);
		return;
	
	}

	var address = words[2],
	amount = getValidatedAmount(words[3]);
	
	if (amount === null) {

		message.reply("I don't know how to withdraw that much " + coinname + " (" + coinsymbol + ")...").then(msg => {
	    
			setTimeout(() => msg.delete(), errmsgtimeout)
    
		});

		return;
	}
	
	rvn.getBalance(tipper, 1, function(err, balance) {

		if (err) {

			message.reply('Error getting ' + coinname + ' (' + coinsymbol + ') balance.').then(msg => {
	      
				setTimeout(() => msg.delete(), errmsgtimeout)
      
			});

		} else {

			if (Number(amount) + Number(paytxfee) > Number(balance)) {

				message.channel.send('Please leave atleast ' + paytxfee + ' ' + coinname + ' (' + coinsymbol + ') for transaction fees!').then(msg => {
		       
					setTimeout(() => msg.delete(), errmsgtimeout)
	
				});
				return;
      
			}

			rvn.sendFrom(tipper, address, Number(amount), function(err, txId) {

				if (err) {

					message.reply(err.message).then(msg => {

						setTimeout(() => msg.delete(), errmsgtimeout)
		      
					});

				} else {

					// If public chan send reply
					if(message.channel.type !== 'DM'){

						message.channel.send({embeds: [ {

							description: '**:outbox_tray::money_with_wings::moneybag:  ' + coinname + ' (' + coinsymbol + ') Transaction Completed!  :moneybag::money_with_wings::outbox_tray:**',
							color: 1363892,
							fields: [
								
								{
								
									name: 'Success!',
									value: ':lock:  Withdrawal receipt sent via DM',
									inline: true
								}

							]

						} ] }).then(msg => {
							
							setTimeout(() => msg.delete(), msgtimeout)

						});

					}
					
					// DM user their withdrawal receipt
					message.author.send({embeds: [ {


						description: '**:outbox_tray::money_with_wings::moneybag:  ' + coinname + ' (' + coinsymbol + ') Withdrawal Sent!  :moneybag::money_with_wings::outbox_tray:**',
						color: 1363892,
						fields: [

							{
								name: '__Sender__',
								value: '<@' + message.author.id + '>',
								inline: true
							},
							{
								name: '__Receiver__',
								value: '**' + address + '**\n' + addyLink(address),
								inline: true
							},
							{
								name: '__txid__',
								value: '**' + txId + '**\n' + txLink(txId),
								inline: false
							},
							{
								name: '__Amount__',
								value: '**' + amount.toString() + '**',
								inline: true
							},
							{
								name: '__Fee__',
								value: '**' + paytxfee.toString() + '**',
								inline: true
							}
        
						]

					} ] }).catch(error => {
                               
						// If error(DMs disabled) be sane and send a notification to public chan
						message.channel.send({ embeds: [ {

							description: '**:outbox_tray::money_with_wings::moneybag: ' + coinname + ' (' + coinsymbol + ') Withdrawal :outbox_tray::money_with_wings::moneybag:**',
							color: 1363892,
							fields: [

	                                                {
        	                                                name: '__User__',
                	                                        value: '<@' + message.author.id + '>',
                        	                                inline: false
                                	                },
                                        	        {
                                                	        name: 'Uh oh!',
                                                        	value: '**:x:  Receipt was not able to be sent via DM, do you have DM\'s disabled?**',
	                                                        inline: false
        	                                        },
							{
								name: 'Your withdrawal was sent successfully and your txid is:',
								value: '**' + txId + '**\n' + txLink(txId),
								inline: false
							}
        	                                
							]

						} ] }).then(msg => {

							setTimeout(() => msg.delete(), msgtimeout)
        	                        
						})
					
					});

				}

			});

		}

	});

}

/////////////////
// Send a tip  //
/////////////////

function doTip(bot, message, tipper, words, helpmsg) {

	if (words.length < 3 || !words) {

		doHelp(message, helpmsg);
		return;

	}

	var prv = false;
	var amountOffset = 2;

	if (words.length >= 4 && words[1] === 'private') {
		
		prv = true;
		amountOffset = 3;
	
	}

	let amount = getValidatedAmount(words[amountOffset]);
  
	if (amount === null) {

		message.reply("I don't know how to tip that much " + coinname + " (" + coinsymbol + ")...").then(msg => {

			setTimeout(() => msg.delete(), errmsgtimeout)

		});
		return;
	}
	
	rvn.getBalance(tipper, 1, function(err, balance) {

		if (err) {

			message.reply('Error getting ' + coinname + ' (' + coinsymbol + ') balance.').then(msg => {
				
				setTimeout(() => msg.delete(), errmsgtimeout)
      
			});

		} else {

			if (Number(amount) + Number(paytxfee) > Number(balance)) {

				message.channel.send('Please leave atleast ' + paytxfee + ' ' + coinname + ' (' + coinsymbol + ') for transaction fees!').then(msg => {
		
					setTimeout(() => msg.delete(), errmsgtimeout)
	
				});
				return;
      
			}

			if (!message.mentions.users.first()){
	
				message.reply('Sorry, I could not find a user in your tip...').then(msg => {
				
					setTimeout(() => msg.delete(), errmsgtimeout)
					
				
				});
				return;

			}

			if (message.mentions.users.first().id) {

				sendRVN(bot, message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);

			} else {

				message.reply('Sorry, I could not find a user in your tip...').then(msg => {

					setTimeout(() => msg.delete(), errmsgtimeout)
	
				});
      
			}

		}

	});

}

////////////////////
// Send function  //
////////////////////

function sendRVN(bot, message, tipper, recipient, amount, privacyFlag) {
	
	getAddress(recipient.toString(), function(err, address) {

		if (err) {
			message.reply(err.message).then(msg => {
			
				setTimeout(() => msg.delete(), errmsgtimeout)
      
			});

		} else {

			rvn.sendFrom(tipper, address, Number(amount), 1, null, null, function(err, txId) {

				if (err) {

					message.reply(err.message).then(msg => {
			
						setTimeout(() => msg.delete(), errmsgtimeout)
					
					});
				
				} else {
					
					// Reply if called from public channel
					if(message.channel.type !== 'DM'){
						
						message.channel.send({embeds: [ {

                                                        description: '**:outbox_tray::money_with_wings::moneybag:  ' + coinname + ' (' + coinsymbol + ') Tip Sent!  :moneybag::money_with_wings::outbox_tray:**',
                                                        color: 1363892,
                                                        fields: [

								{
                                                                        name: 'Success!',
									value: ':lock:  Tip receipt sent via DM',
									inline: true
									
								}

							]

						} ] }).then(msg => {

							setTimeout(() => msg.delete(), msgtimeout)

						});
					
					}
					
					// DM user tip receipt
					message.author.send({ embeds: [ {
						
						description: '**:money_with_wings::moneybag:  ' + coinname + ' (' + coinsymbol + ') Tip Sent!  :moneybag::money_with_wings:**',
						color: 1363892,
						fields: [

							{
								name: '__Sender__',
								value: '<@' + message.author.id + '>',
								inline: true
							},
							{
								name: '__Receiver__',
								value: '<@' + recipient + '>',
								inline: true
							},
							{
								name: '__txid__',
								value: '**' + txId + '**\n' + txLink(txId),
								inline: false
							},
							{
								name: '__Amount__',
								value: '**' + amount.toString() + ' ' + coinsymbol + '**',
								inline: true
							},
							{
								name: '__Fee__',
								value: '**' + paytxfee.toString() + '**',
								inline: true
							}

						]

					} ] }).catch(error => {

						// If error(DMs disabled) be sane and send a notification to public chan
						message.channel.send({ embeds: [ {

                                                        description: '**:money_with_wings::moneybag: ' + coinname + ' (' + coinsymbol + ') Tip :money_with_wings::moneybag:**',
                                                        color: 1363892,
                                                        fields: [

                                                        {
                                                                name: '__User__',
                                                                value: '<@' + message.author.id + '>',
                                                                inline: false
                                                        },
                                                        {
                                                                name: 'Uh oh!',
                                                                value: '**:x:  Receipt was not able to be sent via DM, do you have DM\'s disabled?**',
                                                                inline: false
                                                        },
                                                        {
                                                                name: 'Your tip was successfully sent and your txid is:',
                                                                value: '**' + txId + '**\n' + txLink(txId),
                                                                inline: false
                                                        }

                                                        ]

                                                } ] }).then(msg => {

                                                        setTimeout(() => msg.delete(), msgtimeout)

                                                })

                                        });

					// DM tip recipient a notification
					let user = message.mentions.users.first();

					user.send({ embeds: [ {
			      
						description: '**:gift::money_with_wings::moneybag: You have received an ' + coinname + ' (' + coinsymbol + ') Tip! :moneybag::money_with_wings::gift:**',
						color: 1363892,
						fields: [

							{
								name: '__Sender__',
								value: '<@' + message.author.id + '>',
								inline: true
							},
							{
								name: '__txid__',
								value: '**' + txId + '**\n' + txLink(txId),
								inline: false
							},
							{
								name: '__Amount__',
								value: '**' + amount.toString() + ' ' + coinsymbol+ '**',
								inline: true
							}

						]

					} ] }).catch(error => {
						
						// If error(DMs disabled) be sane and send a notification to public chan
                                                message.channel.send({ embeds: [ {

                                                        description: '**:money_with_wings::moneybag: ' + coinname + ' (' + coinsymbol + ') Tip :money_with_wings::moneybag:**',
                                                        color: 1363892,
                                                        fields: [

                                                        {
                                                                name: '__User__',
                                                                value: '<@' + message.author.id + '>',
                                                                inline: false
                                                        },
                                                        {
								name: '__Notice:__',
                                                                value: '**:x:  Tip receipt notification was not able to be sent to <@' + recipient + '> (DMs disabled)**',
                                                                inline: false
                                                        },
                                                        {
								name: '__Status__',
                                                                value: 'Tip sent successfully',
                                                                inline: false
                                                        }

                                                        ]

                                                } ] }).then(msg => {

                                                        setTimeout(() => msg.delete(), msgtimeout)

                                                })

                                        });

				}

			});

		}

	});

}

///////////////////////////////
// Get user deposit address  //
///////////////////////////////

function getAddress(userId, cb) {

	rvn.getAddressesByAccount(userId, function(err, addresses) {

		if (err) {

			cb(err);

		} else if (addresses.length > 0) {

			cb(null, addresses[0]);

		} else {

			rvn.getNewAddress(userId, function(err, address) {

				if (err) {

					cb(err);

				} else {

					cb(null, address);

				}

			});

		}

	});
}

/////////////////////////////
// Dump private wallet key //
/////////////////////////////

function dumpPrivKey(message, tipper) {

	getAddress(tipper, function(err, address) {

		if (err) {

			console.log(err);

			message.reply('Error getting your ' + coinname + ' (' + coinsymbol + ') deposit address.').then(message => message.delete(10000));

		} else {
    
			rvn.dumpPrivKey(address, function(err, privkey) {
	    
				if (err) {

					message.reply(err.message).then(msg => {
			    
						setTimeout(() => msg.delete(), errmsgtimeout)

					});

					} else {
						
						// Reply for public channel
						if(message.channel.type !== 'DM'){

							message.channel.send({ embeds: [ {
		    
							
								description: '**:closed_lock_with_key::money_with_wings::moneybag:' + coinname + ' (' + coinsymbol + ') PrivKey sent!:moneybag::money_with_wings::closed_lock_with_key:**',
								color: 1363892,
								fields: [
								
									{
									
										name: '__User__',

										value: '<@' + message.author.id + '>',

										inline: false

									},

									{

										name: 'Success!',

										value: '**:lock: Wallet privkey sent via DM**',

										inline: false

									}


								]


							} ] }).then(msg => {


								setTimeout(() => msg.delete(), msgtimeout)


							});
						}
						
						// DM user their privkey
						message.author.send({ embeds: [ {
						
							description: '**:closed_lock_with_key::money_with_wings::moneybag:' + coinname + ' (' + coinsymbol + ') Privkey:moneybag::money_with_wings::closed_lock_with_key:**',
							color: 1363892,
							fields: [

								{
									name: '__User__',
									value: '<@' + message.author.id + '>',
									inline: false
								},
								{
									name: 'Wallet PrivKey',
									value: '**' + privkey.toString() + '**',
									inline: false
								},
								{
									name: 'Keep it secret.',
									value: '**Keep it safe.**',
									inline: false
								}

							]

						} ] }).catch(error => {


							// If error(DMs disabled) be sane and send a notification to public chan

							message.channel.send({ embeds: [ {

                                                        
								description: '**:closed_lock_with_key::money_with_wings::moneybag: ' + coinname + ' (' + coinsymbol + ') Privkey :money_with_wings::moneybag::closed_lock_with_key:**',
								color: 1363892,
								fields: [
								
									{
										name: '__User__',
										value: '<@' + message.author.id + '>',
										inline: false
									},
									{
										name: '__Notice:__',
										value: '**:x:  Wallet private key was not able to be sent (DMs disabled)\nCowardly refusing to display it in public.**',
										inline: false
									},
									{
										name: '__Status__',
										value: 'Please enable DMs and re-try',
										inline: false
									}

								]

							} ] }).then(msg => {
                                                        
								setTimeout(() => msg.delete(), msgtimeout)
                                                
							})
                                        
						});
  
					}

			});

		}

	})

}

/////////////////////////
// get network difficulty
/////////////////////////

function getDifficulty(message) {
	
    rvn.getDifficulty(function(err, difficulty) {

	    if (err) {
            
		    message.reply(err.message).then(msg => {
        
			    setTimeout(() => msg.delete(), errmsgtimeout)
                    
		    });

	    } else {
            
		    message.channel.send({ embeds: [ {

			    description: '**:pick: ' + coinname + ' (' + coinsymbol + ') Network difficulty :pick:**',
			    color: 1363892,
			    fields: [
	
				    {
					    name: 'Network Difficulty',
					    value: '**' + difficulty + '**',
					    inline: false
				    }
			    
			    ]

		    } ] }).then(msg => {

			    let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			                            
			    if(message.channel.type == 'DM'){
							                                    
				    clearTimeout(publichantimeout);
							                            
			    }

		    });
	    }  
    })
}

////////////////////////
// get network hashrate
////////////////////////

function getNetworkHashPs(message){

	rvn.getNetworkHashPs(function(err, hashrate) {
	
		if (err) {
			
			message.reply(err.message).then(msg => {

				setTimeout(() => msg.delete(), errmsgtimeout)

			});
			
		} else {
		
                    message.channel.send({ embeds: [ {

                            description: '**:pick: ' + coinname + ' (' + coinsymbol + ') Network hashrate :pick:**',
                            color: 1363892,
                            fields: [
                                    {
                                            name: 'Network hashrate',
                                            value: '**' + Number(hashrate / 1000000000).toFixed(3)+ ' GH/s**',
                                            inline: false
                                    }
                            ]

                    } ] }).then(msg => {

			    let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			                                
			    if(message.channel.type == 'DM'){
			
				    clearTimeout(publichantimeout);
				
			    }
		    });		
		}
	})
	
}

///////////////////////
// get mining info ////
///////////////////////

function getMiningInfo(message){


        rvn.getMiningInfo(function(err, mininginfo) {

		var time = new Date();

		if (err) {

                        message.reply(err.message).then(msg => {

                                setTimeout(() => msg.delete(), errmsgtimeout)

                        });

                } else {

                    message.channel.send({ embeds: [ {

                            description: '**:pick: ' + coinname + ' (' + coinsymbol + ') network mining info :pick:**',
                            color: 1363892,
                            fields: [
				    {
				    	    name: 'Chain',
					    value: '' + mininginfo.chain.toString() + '',
					    inline: true
				    },
				    {
				            name: '\u200b',
				            value: '\u200b',
				            inline: true
                                    },
				    {
					    name: 'Blocks',
					    value: '' + mininginfo.blocks.toString() + '',
					    inline: true
				    },
				    {
                                            name: 'Network hashrate',
                                            value: '' + Number(mininginfo.networkhashps / 1000000000).toFixed(3)+ ' GH/s',
                                            inline: true
                                    },
				    {
				    	    name: 'Network difficulty',
					    value: '' + Number(mininginfo.difficulty) + '',
					    inline: true
				    },
				    {
                                            name: ':clock: Time',
		                            value: '' + time,
                                            inline: false
                                    }
				    
                            ]

                    } ] }).then(msg => {

			    let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			    
			    if(message.channel.type == 'DM'){
								                                    
				    clearTimeout(publichantimeout);
							                            
			    }
		    });
                }
        })

}

/////////////////////////
// get blockchain info //
/////////////////////////

function getBlockchainInfo(message){


        rvn.getBlockchainInfo(function(err, chaininfo) {

                var time = new Date();

                if (err) {

                        message.reply(err.message).then(msg => {

                                setTimeout(() => msg.delete(), errmsgtimeout)

                        });

                } else {

                    message.channel.send({ embeds: [ {

                            description: '**:chains:  ' + coinname + ' (' + coinsymbol + ') blockchain info  :chains:**',
                            color: 1363892,
                            fields: [
                                    {
                                            name: 'Chain',
                                            value: '' + chaininfo.chain.toString() + '',
                                            inline: true
                                    },
                                    {
                                            name: 'Blocks',
                                            value: '' + chaininfo.blocks.toString() + '',
                                            inline: true
                                    },
                                    {
                                            name: 'Headers',
                                            value: '' + chaininfo.headers.toString() + '',
                                            inline: true
                                    },
                                    {
                                            name: 'Network difficulty',
                                            value: '' + Number(chaininfo.difficulty) + '',
                                            inline: true
                                    },
                                    {
                                            name: 'Size on disk',
                                            value: '' + Number(chaininfo.size_on_disk / 1000000).toFixed(2) + ' MB (' + Number(chaininfo.size_on_disk / 1000000000).toFixed(2) + ' GB)',
                                            inline: true
                                    },
				    {
                                            name: 'Difficulty Algo',
                                            value: '' + String(chaininfo.difficulty_algorithm) + '',
                                            inline: true
                                    },
				    {
                                            name: 'Best Blockhash',
                                            value: '' + String(chaininfo.bestblockhash) + '',
                                            inline: true
                                    },
				    {
                                            name: ':clock: Time',
                                            value: '' + time,
                                            inline: false
                                    }

                            ]

		    } ] }).then(msg => {
		
			    let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			                                
			    if(message.channel.type == 'DM'){
								                                    
				    clearTimeout(publichantimeout);
								                            
			    }

		    });
		
		}
		
	})

}

////////////////////////////////////////
// Get market prices or value of coins//
////////////////////////////////////////

function getPrice(message, cur, amt){
            
	const https = require('https')

	const options = {
		hostname: 'www.exbitron.com',
		port: 443,
		path: '/api/v2/peatio/public/markets/' + oldcoinsymbol.toLowerCase() + cur + '/tickers',
		method: 'GET',
	}
                
	const req = https.request(options, res => {
		//console.log(`statusCode: ${res.statusCode}`)
		res.on('data', d => {
                          
			var d = JSON.parse(d);
			var djson = JSON.stringify(d);
			//console.log("d=" + djson);
			var time = Number(d['at'] * 1000);
			var time = new Date(time);
			var low = d['ticker'].low;
			var low = Number(low).toFixed(8);
			var high = d['ticker'].high;
			var high = Number(high).toFixed(8);
			var open = d['ticker'].open;
			var open = Number(open).toFixed(8);
			var last = d['ticker'].last;
			var last = Number(last).toFixed(8);
			var volume = d['ticker'].volume;
			var volume = Number(volume).toFixed(8);
			var amount = d['ticker'].amount;
			var amount = Number(amount).toFixed(2);
			var avg = d['ticker'].avg_price;
			var avg = Number(avg).toFixed(8);
			var change = d['ticker'].price_change_percent;
			  
			if(!isNaN(amt)){
				  
				var worth = Number(last * amt).toFixed(8);	  
				sendWorth(worth);
			  
			}else{
				  
				message.channel.send({ embeds: [ {
					  
					description: '**:chart_with_upwards_trend: ' + coinname + ' (' + coinsymbol + ') Price Info :chart_with_upwards_trend:**',
					color: 1363892,
					fields: [
						  
						{
							name: 'Exbitron (' + coinsymbol + '/'+cur.toUpperCase()+')',
							value: '**https://exbitron.com**\nhttps://www.exbitron.com/trading/'+oldcoinsymbol.toLowerCase()+cur,
							inline: false
						},
						{
							name: 'Last',
							value: last,
							inline: true
						},
						{
							name: ':arrow_down: Low',
							value: low,
							inline: true
						},
						{
							name: ':arrow_up: High',
							value: high,
							inline: true
						},
						{
							name: 'Open',
							value: open,
							inline: true
						},
						{
							name: 'Volume('+cur.toUpperCase()+')',
							value: volume + ' '+cur.toUpperCase(),
							inline: true
						},
						{
							name: 'Volume(' + coinsymbol + ')',
							value: amount + ' ' + coinsymbol,
							inline: true
						},
						{
							name: 'Change',
							value: change,
							inline: true
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true
						},
						{
							name: 'Time',
							value: '' + time,
							inline: false
						}
	                                  
					]
	                          
				} ] }).then(msg => {
					  
					let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
					                              
					if(message.channel.type == 'DM'){
					
						clearTimeout(publichantimeout);
									                                  
					}
					
				});
				  
			}
	                
		})

	})
	
	function sendWorth(worth){
		
		message.channel.send({ embeds: [ {
			
			description: '**:chart_with_upwards_trend: ' + coinname + ' (' + coinsymbol + ') Price Info :chart_with_upwards_trend:**',
			color: 1363892,
			fields: [
				
				{
					name: 'Market value of ' + amt + ' ' + coinsymbol,
					value: '' + worth + ' ' + cur.toUpperCase(),
					inline: true
				}
			]
					
		} ] }).then(msg => {
			
			let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			                                        
			if(message.channel.type == 'DM'){
									                                                
				clearTimeout(publichantimeout);
									                                        
			}
		});

	
	}
	
	req.on('error', error => {
		
		console.error(error)

        })

        req.end();
	
	// If BTC, also retrieve Trade Ogre
	
	if(cur == 'btc' && isNaN(amt)){
		
		const options = {
			
			hostname: 'tradeogre.com',
			port: 443,
			path: '/api/v1/ticker/'+ cur.toUpperCase() +'-'+oldcoinsymbol.toUpperCase(),
			method: 'GET',
		}

                const req = https.request(options, res => {
			//console.log(`statusCode: ${res.statusCode}`)
			res.on('data', d => {
			
				var d = JSON.parse(d);
				var djson = JSON.stringify(d);
				//console.log("d=" + djson);
				var time = Number(d.success);
				var time = new Date(time);
				var low = d.low;
				var low = Number(low).toFixed(8);
				var high = d.high;
				var high = Number(high).toFixed(8);
				var open = d.initialprice;
				var open = Number(open).toFixed(8);
				var last = d.price;
				var last = Number(last).toFixed(8);
				var volume = d.volume;
				var volume = Number(volume).toFixed(8);
				var bid = d.bid;
				var bid = Number(bid).toFixed(8);
				var ask = d.ask;
				var ask = Number(ask).toFixed(8);

				message.channel.send({ embeds: [ {
                                  
					description: '**:chart_with_upwards_trend: ' + coinname + ' (' + coinsymbol + ') Price Info :chart_with_upwards_trend:**',
					color: 1363892,
					fields: [
					
						{
							name: 'Trade Ogre (' + coinsymbol.toUpperCase() + '/'+cur.toUpperCase()+')',
							value: '**https://tradeogre.com**\nhttps://tradeogre.com/exchange/'+ cur.toUpperCase() +'-'+oldcoinsymbol.toUpperCase(),
							inline: false
						},
						{
							name: 'Last',
							value: last,
							inline: true
						},
						{
							name: ':arrow_down: Low',
							value: low,
							inline: true
						},
						{
							name: ':arrow_up: High',
							value: high,
							inline: true
						},
						{
							name: 'Open',
							value: open,
							inline: true
						},
						{
							name: 'Volume('+cur.toUpperCase()+')',
							value: volume + ' '+cur.toUpperCase(),
							inline: false
						},
						{
							name: 'Bid',
							value: bid,
							inline: true
						},
						{
							name: 'Ask',
							value: ask,
							inline: true
						},
						{
							name: '\u200b',
							value: '\u200b',
							inline: true
						},
						{
							name: 'Time',
							value: '' + time,
							inline: false
						}


					]

					} ] }).then(msg => {
						
						let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
						                                        
						if(message.channel.type == 'DM'){
												                                                
							clearTimeout(publichantimeout);
												                                        
						}
					
					});
                  
			})

		})
			
		req.on('error', error => {
			
			console.error(error)
        
		})
        
		req.end();
	
	}
        
	return;

}


//////////////////////////////////////
// Retrieve wrapped coin information//
/////////////////////////////////////

function getWAVN(message){
                
	const https = require('https')
	const options = {
        
		hostname: 'api.polygonscan.com',
		port: 443,
		path: '/api?module=stats&action=tokensupply&contractaddress=' + contractaddress + '&apikey=' + polygonapikey,
		method: 'GET'
	
	}
	// console.log(options);
	const req = https.request(options, res => {
		//console.log(`statusCode: ${res.statusCode}`)
                //console.log(req);
		res.on('data', d => {
                
			var d = JSON.parse(d);
			//console.log("d.result=" + d.result);
			var supply = Number(d.result / 1000000000000000000).toFixed(18);
			//console.log("suppply="+ supply);
			var time = new Date();

			message.channel.send({ embeds: [ {
                                  
				description: '**:gift: w' + coinsymbol + ' Token Information :gift:\n\u200b**',
				color: 1363892,
				fields: [
					
					{
						name: ':envelope_with_arrow:  Wrap your ' + coinsymbol + '!  :envelope_with_arrow:',
						value: '' + coinwrapurl,
						inline: false
					},
					{
						name: ':envelope:  Contract address  :envelope:',
						value: contractaddress +'\nhttps://polygonscan.com/token/' + contractaddress,
						inline: false
					},
					{
						name: ':coin:  w' + coinsymbol + ' Token Supply  :coin:',
						value: '' + supply,
						inline: true
					},
					{
						name: ':clock: Time',
						value: '' + time,
						inline: false
					}

				]
 
			} ] }).then(msg => {

				let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
				                                                
				if(message.channel.type == 'DM'){

					clearTimeout(publichantimeout);
											                                                
				}
			  
			});
		  
		})
		
		
	})
	        
	req.on('error', error => {
		
		console.error(error)
		
	})
	req.end();
	
	return;

}

////////////////////////
// Get Sushi Swap data//
////////////////////////

function getSushi(message){

	const https = require('https')
        
	const options = {
        
		hostname: 'api2.sushipro.io',
		port: 443,
		path: '/?chainID=137&action=get_pairs_by_token&token=' + contractaddress,
		method: 'GET'
	}
	// console.log(options);
	const req = https.request(options, res => {
	// console.log(`statusCode: ${res.statusCode}`)
	// console.log(req);
	res.on('data', d => {
                          
		var d = JSON.parse(d);
		var number_of_results =  Number(d[0].number_of_results);
			  
		if(number_of_results == 0){
				  
			var time = new Date();
				  
			message.channel.send({ embeds: [ {
					  
				description: '**:sushi: W' + coinsymbol + ' Sushi Swap Information :sushi:**',
				color: 1363892,
				fields: [
						  
					{
						name: 'No pairs found for W' + coinsymbol,
						value: '\u200b',
						inline: false
					},
					{
						name: 'Add liquidity on Sushi Swap!',
						value: '*https://app.sushi.com/add/ETH/' + contractaddress + '*',
						inline: false
					},
					{
						name: ':clock: Time',
						value: '' + time,
						inline: false
					}
                                  
				]

			} ] }).then(msg => {
                                  
				let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
				                                
				if(message.channel.type == 'DM'){
									                                        
					clearTimeout(publichantimeout);
									                                
				}
			
			});
			
		}else{
			  
			var chain = String(d[0].chain);
			var token = String(d[0].token);
			var pairID = String(d[1][0].Pair_ID);
			var Token_1_symbol = String(d[1][0].Token_1_symbol); 
			var Token_1_price = Number(d[1][0].Token_1_price).toFixed(8);
			var Token_2_symbol = String(d[1][0].Token_2_symbol);
			var Token_2_price = Number(d[1][0].Token_2_price).toFixed(8);
			var Token_1_reserve = Number(d[1][0].Token_1_reserve).toFixed(8); 
			var Token_2_reserve = Number(d[1][0].Token_2_reserve).toFixed(8);
			var Token_1_name = String(d[1][0].Token_1_name);
			var Token_2_name = String(d[1][0].Token_2_name);

			var time = new Date();

			message.channel.send({ embeds: [ {

				description: '**:sushi: ' + Token_2_symbol + '/' + Token_1_symbol + ' Sushi Swap Information :sushi:**\n\n**Sushi Swap Analytics**\n*https://analytics-polygon.sushi.com/pairs/' + pairID + '*\n\n**PooCoin Charts**\n*https://polygon.poocoin.app/tokens/' + token + '\n\u200b*',
				color: 1363892,
				fields: [
					
					{
						name: ':chains:  Chain  :chains:',
						value: '' + chain,
						inline: true
					},
					{
						name: ':coin:  ' + Token_2_symbol + ' Token ID  :coin:',
						value: '' + token,
						inline: true
					},
					{
						name: ':scales:  Pair ID  :scales:',
						value: '' + pairID,
						inline: true
					},
					{
						name: ':chart_with_upwards_trend:  ' + Token_2_symbol + ' Price  :chart_with_upwards_trend:',
						value: Token_1_price + ' '+ Token_1_symbol,
						inline: true
					},
					{
						name: '\u200b',
						value: '\u200b',
						inline: true
					},
					{
						name: ':bank:  ' + Token_2_symbol + ' Reserve  :bank:',
						value: ''+ Token_2_reserve + ' ' + Token_2_symbol,
						inline: true
					},
					{
						name: ':chart_with_upwards_trend:  ' + Token_1_symbol + ' Price  :chart_with_upwards_trend:',
						value: Token_2_price + ' '+ Token_2_symbol,
						inline: true
					},
					{
						name: '\u200b',
						value: '\u200b',
						inline: true
					},
					{
						name: ' :bank:  ' + Token_1_symbol + ' Reserve  :bank:',
						value: ''+ Token_1_reserve + ' ' + Token_1_symbol,
						inline: true
					},
					{
						name: ':clock: Time',
						value: '' + time,
						inline: false
					}

                                  ]

			} ] }).then(msg => {
				
				let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
				                                
				if(message.channel.type == 'DM'){
									                                        
					clearTimeout(publichantimeout);
									                                
				}

			});
			  
		}
	
	})
	
	})

	req.on('error', error => {

                console.error(error)

        })
        req.end();
        return;

}

////////////////////////////////////////////
/// miningCalc - Calculate mininig returns
////////////////////////////////////////////

function miningCalc(message, hashrate) {
		
	rvn.getDifficulty(function(err, difficulty) {
			
		if (err) {
				
			message.reply(err.message).then(msg => {
					
				setTimeout(() => msg.delete(), 10000)
				
			});
			
		} else {
				
			var netdiff = difficulty
			difficulty = difficulty.toString().replace(".", "").padEnd(13, "0");
			difficulty = Number(difficulty);
			// check for negative number
			if(hashrate <= 0){
			
				hashrate = "Please supply a positive number in ";
				hashpersec = "0";
				secondsSolo = "0";
				minutesSolo = ":infinity:";
				hoursSolo = ":infinity:";
				profitability = "0";

			}else if(isNaN(hashrate)){
				
				hashrate = "Please supply a number in ";
				hashpersec = "0";
				secondsSolo = "0";
				minutesSolo = ":infinity:";
				hoursSolo = ":infinity:";
				profitability = "0";

			}else{
					
				//console.log("difficulty="+difficulty);
				var hashpersec = Number(hashrate * 1000000);
				//console.log("hashpersec="+hashpersec)
				var secondsSolo = Number(difficulty * 4294967296 / hashpersec / 10000000000000);
				//console.log("secondsSolo="+secondsSolo);
				var minutesSolo = Number(secondsSolo / 60).toFixed(2);
				var hoursSolo = Number(secondsSolo / 360).toFixed(2);
				var profitability = Number(hashpersec * 86400 * 2500 * 1000000000000 / difficulty / 4294967296).toFixed(8);
				var hrlyprofit = Number(profitability / 24).toFixed(8);
				var minuteprofit = Number(hrlyprofit / 60).toFixed(8);
				//console.log("profitability="+profitability);
				
			}
				
			var time = new Date();
				
			message.channel.send({ embeds: [ {
					
				description: '**:abacus: ' + coinsymbol + ' Mining Calculator :abacus:\n\u200b**',
				color: 1363892,
				fields: [
				
					{
						name: 'Hashrate',
						value: '' + hashrate + 'MH/s',
						inline: true
					},
					{
						name: 'Difficulty',
						value: '' + netdiff + '',
						inline: true
					},
					{
						name: 'Time to find (solo)',
						value: hoursSolo + ' hrs (' + minutesSolo + ' mins)',
						inline: true
					},
					{
						name: '' + coinsymbol + ' per minute',
						value: '' + minuteprofit,
						inline: true
					},
					{
						name: '' + coinsymbol + ' per hour',
						value: '' + hrlyprofit,
						inline: true
					},
					{
						name: '' + coinsymbol + ' per day',
						value: '' + profitability,
						inline: true
					},
					{
						name: ':clock: Time',
						value: '' + time,
						inline: false
					}

				]

        
			} ] }).then(msg => {
				
				let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
				
				if(message.channel.type == 'DM'){
									                                        
					clearTimeout(publichantimeout);
									                                
				}
			});
			
		}
			
		return;
		
	})
}

///////////////////////////////////
// List current exchange listings
///////////////////////////////////

function listExchanges(message){

	var time = new Date();

	message.channel.send({ embeds: [ {
	
		description: '**:chart_with_upwards_trend:  ' + coinname + ' (' + coinsymbol + ') Exchange listings  :chart_with_upwards_trend:\n\u200b**',

        
		color: 1363892,


                fields: [

			{
			name: ':chart_with_upwards_trend:  Exbitron Exchange  :chart_with_upwards_trend:',
                        value: 'https://www.exbitron.com/trading/rvlbtc\nhttps://www.exbitron.com/trading/rvlusdt\nhttps://www.exbitron.com/trading/rvlltc\nhttps://www.exbitron.com/trading/rvlrvn\nhttps://www.exbitron.com/trading/rvldoge\n\u200b',
                        inline: false
                        },
                        {
			name: ':chart_with_upwards_trend:  Trade Ogre Exchange  :chart_with_upwards_trend:',
			value: 'https://tradeogre.com/exchange/BTC-RVL\n\u200b',
                        inline: false
                        },
                        {
			name: ':chart_with_upwards_trend:  Solidus Exchange  :chart_with_upwards_trend:',
                        value: 'https://exchange.solidus.finance/markets/RVL_BTC\nhttps://exchange.solidus.finance/markets/RVL_USDT\nhttps://exchange.solidus.finance/markets/RVL_RVN\n\u200b',
                        inline: true
                        },
                        {
                        name: ':clock: Time',
                        value: '' + time,
                        inline: false
                        }

		]


	} ] }).then(msg => {
	
		let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);

		if(message.channel.type == 'DM'){
		
			clearTimeout(publichantimeout);

		}
	});


}

////////////////////////////////
// List official project links//
///////////////////////////////

function listURLs(message){

        var time = new Date();

		message.channel.send({ embeds: [ {
		
			description: '**:globe_with_meridians:  ' + coinname + ' (' + coinsymbol + ') Official Links  :globe_with_meridians:\n\u200b**',
	                color: 1363892,
        	        fields: [

                	        {
                        		name: '__Project Website__',
        	                	value: '*' + projectsiteurl + '*',
	                	        inline: false
        	                },
                	        {
                        		name: '__Project GitHub__',
	                        	value: '*' + projectgithub + '*',
	        	                inline: false
        	                },
				{
					name: '__Project Twitter__',
					value: '*' + projecttwitter + '*',
					inline: false
				},
				{
					name: '__Reddit__',
					value: '*' + projectreddit + '*',
					inline: false
				},
				{
			
					name: '__Discord__',
					value: '*' + projectdiscord + '*',
					inline: false
				},
				{
					name: '__Telegram__',
					value: '*' + projecttelegram + '*',
					inline: false
				},
				{
					name: '__Telegram Announcements__',
					value: '*' + projecttelegramann + '*',
					inline: false
				},
        	                {
                		        name: '__Coin Wrapping__',
	                	        value: '*' + coinwrapurl + '*\n\u200b',
	                        	inline: true
	                        },
        	                {
	        	                name: ':clock: Time',
	                	        value: '' + time,
	                        	inline: false
	                        }

        	        ]


	        } ] }).then(msg => {

			let publichantimeout = setTimeout(() => msg.delete(), msgtimeout);
			                
			if(message.channel.type == 'DM'){
						                        
				clearTimeout(publichantimeout);
						                
			}
	        });

}

///////////////////////////////
// validate a wallet address //
///////////////////////////////

function validateAddress(message, address){

	var address = address;
	//console.log("address="+address);

        rvn.validateAddress(address, function(err, addr) {
                var time = new Date();

                if (err) {

                        message.reply(err.message).then(msg => {

                                setTimeout(() => msg.delete(), errmsgtimeout)

                        });

                } else {

			var addr =  JSON.stringify(addr);
			var addr =  JSON.parse(addr);
		
			if(addr.isvalid === true){

				var validity = ':white_check_mark: Valid ' + coinsymbol + ' address';

			}else if(addr.isvalid === false){

				var validity = ':x: Invalid ' + coinsymbol + ' address';

			}
			
			message.channel.send({ embeds: [ {

			    description: '**:house:  ' + coinname + ' (' + coinsymbol + ') address validator  :house:**',
                            color: 1363892,
                            fields: [
                                    {
                                            name: 'Address',
                                            value: '' + address + '',
                                            inline: true
                                    },
                                    {
                                            name: '\u200b',
                                            value: '\u200b',
                                            inline: true
                                    },
                                    {
                                            name: 'Validity',
                                            value: '' + validity + '',
                                            inline: true
                                    }

                            ]

                    } ] }).then(msg => {
                            setTimeout(() => msg.delete(), msgtimeout)
                    });
                }
        })

}

/////////////////////////////////
// Start a DM session with user//
////////////////////////////////
function dmMe(message){

	message.channel.send({ embeds: [ {

		description: '**:robot: ' + coinname + ' (' + coinsymbol + ') Bot :robot:**',
		color: 1363892,
		fields: [

			{
				name: '__DM session__',
				value: 'Initiating',
				inline: false
			}

		]

	} ] }).then(msg => {
		                        
		setTimeout(() => msg.delete(), msgtimeout)

	});

	message.author.send({ embeds: [ {
                                                
		description: '**:robot:  ' + coinname + ' (' + coinsymbol + ') Bot  :robot:**',
		color: 1363892,
		fields: [
                                                        
			{
				name: '__At your service!__',
				value: 'Type `!avn` to get started!',
				inline: false
			}
                                                
		]

	} ] }).catch(error => {

		// If error(DMs disabled) be sane and send a notification to public chan
		message.channel.send({ embeds: [ {

			description: '**:robot: ' + coinname + ' (' + coinsymbol + ') Bot :robot:**',
			color: 1363892,
			fields: [

				{
					name: '__User__',
					value: '<@' + message.author.id + '>',
					inline: false
				},
				{
					name: '__Uh oh!__',
					value: '**:x:  I couldn\'t send you a DM, do you have DM\'s disabled?**',
					inline: false
				}
                                                        
			]
                                                
		} ] }).then(msg => {
                                                        
			setTimeout(() => msg.delete(), msgtimeout)
                                                
		})
                                        
	});
}

//////////////////////////////

function inPrivateorSpamChannel(msg) {
	
	if (msg.channel.type == 'DM' || isSpam(msg)) {
		return true;
	} else {
		return false;
	}

}

function isSpam(msg) {
	
	return spamchannels.includes(msg.channel.id);

};


function getValidatedAmount(amount) {

	amount = amount.trim();

	if (amount.toLowerCase().endsWith('rvl')) {

		amount = amount.substring(0, amount.length - 3);

	}

	if (amount.toLowerCase().endsWith('avn')) {

		amount = amount.substring(0, amount.length - 3);

	}

	return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;

}

function txLink(txId) {
	return config.explorer.explorertxurl + txId;
}

function addyLink(address) {
	return config.explorer.exploreraddressurl + address;
}
