'use strict';

const bitcoin = require('bitcoin');

let Regex = require('regex'),
  config = require('config'),
  spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('rvl').config;
let paytxfee = config.get('rvl').paytxfee;
let polygonapikey = config.get('wrvl').polygonapikey;
let contractaddress = config.get('wrvl').contractaddress;
let coinwrapurl = config.get('wrvl').coinwrapurl;
const rvn = new bitcoin.Client(walletConfig);

exports.commands = ['tiprvl'];
exports.tiprvl = {
  usage: '<subcommand>',
  description:
    '__**Ravencoin Lite (RVL) Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **!tiprvl** : Displays This Message\n    **!tiprvl balance** : get your balance\n    **!tiprvl deposit** : get address for your deposits\n    **!tiprvl withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvl <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvl private <user> <amount>** : put private before Mentioning a user to tip them privately.\n\n    has a default txfee of ' + paytxfee,
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
        '__**Ravencoin Lite (RVL) Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **!tiprvl** : Displays This Message\n    **!tiprvl balance** : get your balance\n    **!tiprvl deposit** : get address for your deposits\n    **!tiprvl withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvl <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvl private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **!tiprvl privkey** : dump privkey for your wallet(result sent via DM)\n    **!tiprvl <usdt|btc|ltc|rvn|doge>** : Display RVL market data\n    **!tiprvl wrvl** : Display wRVL information\n    **!tiprvl diff** : Display current network difficulty\n    **!tiprvl hash** : Display current network hashrate\n    **!tiprvl mininginfo** : Display network mining info\n    **!tiprvl chaininfo** : Display blockchain info\n\n    **<> : Replace with appropriate value.**',
      channelwarning = 'Please use <#bot_spot> or DMs to talk to bots.';
    switch (subcommand) {
      case 'help':
        privateorSpamChannel(msg, channelwarning, doHelp, [helpmsg]);
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
        getPrice(msg, 'usdt');
        break;
      case 'btc':
	getPrice(msg, 'btc');
	break;
      case 'rvn':
	getPrice(msg, 'rvn');
	break;
      case 'doge':
        getPrice(msg, 'doge');
        break;
      case 'ltc':
	getPrice(msg, 'ltc');
	break;
      case 'privkey':
	dumpPrivKey(msg, tipper);
      break;
      case 'wrvl':
	getWRVL(msg);
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
      case 'chaininfo':
	getBlockchainInfo(msg);
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

function doHelp(message, helpmsg) {
  message.reply(helpmsg);
}

function doBalance(message, tipper) {
  rvn.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      console.log(err);
      message.reply('Error getting Ravencoin Lite (RVL) balance.').then(msg => {
                                setTimeout(() => msg.delete(), 10000)
                              });
    } else {
    message.channel.send({ embeds: [ {
//    message.channel.send({ embeds: [ {
    description: '**:bank::money_with_wings::moneybag:Ravencoin Lite (RVL) Balance sent!:moneybag::money_with_wings::bank:**',
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
   
	  setTimeout(() => msg.delete(), 10000)
         
  });

    message.author.send({ embeds: [ {
//    message.channel.send({ embeds: [ {
    description: '**:bank::money_with_wings::moneybag:Ravencoin Lite (RVL) Balance!:moneybag::money_with_wings::bank:**',
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
  } ] }).then(msg => {
              setTimeout(() => msg.delete(), 10000)
         });
    }
  });
}

function doDeposit(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      console.log(err);
      message.reply('Error getting your Ravencoin Lite (RVL) deposit address.').then(message => message.delete(10000));
    } else {
    message.channel.send({ embeds: [ {
    description: '**:bank::card_index::moneybag:Ravencoin Lite (RVL) Address!:moneybag::card_index::bank:**',
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
  } ] });
    }
  });
}

function doWithdraw(message, tipper, words, helpmsg) {
  if (words.length < 4) {
    doHelp(message, helpmsg);
    return;
  }

  var address = words[2],
    amount = getValidatedAmount(words[3]);

  if (amount === null) {
    message.reply("I don't know how to withdraw that much Ravencoin Lite (RVL)...").then(message => message.delete(10000));
    return;
  }

  rvn.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Ravencoin Lite (RVL) balance.').then(message => message.delete(10000));
    } else {
      if (Number(amount) + Number(paytxfee) > Number(balance)) {
        message.channel.send('Please leave atleast ' + paytxfee + ' Ravencoin Lite (RVL) for transaction fees!');
        return;
      }
      rvn.sendFrom(tipper, address, Number(amount), function(err, txId) {
        if (err) {
          message.reply(err.message).then(message => message.delete(10000));
        } else {
        message.channel.send({embeds: [ {
        description: '**:outbox_tray::money_with_wings::moneybag:Ravencoin Lite (RVL) Transaction Completed!:moneybag::money_with_wings::outbox_tray:**',
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
      } ] });
      }
    });
    }
  });
}

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
    message.reply("I don't know how to tip that much Ravencoin Lite (RVL)...").then(message => message.delete(10000));
    return;
  }

  rvn.getBalance(tipper, 1, function(err, balance) {
    if (err) {
      message.reply('Error getting Ravencoin Lite (RVL) balance.').then(message => message.delete(10000));
    } else {
      if (Number(amount) + Number(paytxfee) > Number(balance)) {
        message.channel.send('Please leave atleast ' + paytxfee + ' Ravencoin Lite (RVL) for transaction fees!');
        return;
      }

      if (!message.mentions.users.first()){
           message
            .reply('Sorry, I could not find a user in your tip...')
            .then(message => message.delete(10000));
            return;
          }
      if (message.mentions.users.first().id) {
        sendRVN(bot, message, tipper, message.mentions.users.first().id.replace('!', ''), amount, prv);
      } else {
        message.reply('Sorry, I could not find a user in your tip...').then(message => message.delete(10000));
      }
    }
  });
}

function sendRVN(bot, message, tipper, recipient, amount, privacyFlag) {
  getAddress(recipient.toString(), function(err, address) {
    if (err) {
      message.reply(err.message).then(msg => {
                                setTimeout(() => msg.delete(), 10000)
                              });
    } else {
          rvn.sendFrom(tipper, address, Number(amount), 1, null, null, function(err, txId) {
              if (err) {
                message.reply(err.message).then(msg => {
                                setTimeout(() => msg.delete(), 10000)
                              });
		} else {
                  message.channel.send({ embeds: [ {
                  description: '**:money_with_wings::moneybag:Ravencoin Lite (RVL) Transaction Completed!:moneybag::money_with_wings:**',
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
                      value: '**' + amount.toString() + '**',
                      inline: true
                    },
                    {
                      name: '__Fee__',
                      value: '**' + paytxfee.toString() + '**',
                      inline: true
                    }
                  ]
                } ] }).then(msg => {
                                setTimeout(() => msg.delete(), 10000)
                              });
                }
              }
	  );
    }
  });
}

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

// Dump private wallet key

function dumpPrivKey(message, tipper) {
  getAddress(tipper, function(err, address) {
    if (err) {
      console.log(err);
      message.reply('Error getting your Ravencoin Lite (RVL) deposit address.').then(message => message.delete(10000));
    } else {

    rvn.dumpPrivKey(address, function(err, privkey) {

	    if (err) {
		    message.reply(err.message).then(msg => {
			    setTimeout(() => msg.delete(), 10000)
		    });
	    } else {

		    message.channel.send({ embeds: [ {
    description: '**:closed_lock_with_key::money_with_wings::moneybag:Ravencoin Lite (RVL) PrivKey sent!:moneybag::money_with_wings::closed_lock_with_key:**',
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

          setTimeout(() => msg.delete(), 60000)

  });

    message.author.send({ embeds: [ {
//    message.channel.send({ embeds: [ {
	    description: '**:closed_lock_with_key:::money_with_wings::moneybag:Ravencoin Lite (RVL) Privkey:moneybag::money_with_wings::closed_lock_with_key:**',
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
  } ] }).then(msg => {
              setTimeout(() => msg.delete(), 60000)
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
                            setTimeout(() => msg.delete(), 10000)
                    });
            } else {
                    message.channel.send({ embeds: [ {

			    description: '**:pick: Ravencoin Lite (RVL) Network difficulty :pick:**',
			    color: 1363892,
			    fields: [
				    {
					    name: 'Network Difficulty',
					    value: '**' + difficulty + '**',
					    inline: false
				    }
			    ]

		    } ] }).then(msg => {
			    setTimeout(() => msg.delete(), 60000)
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

				setTimeout(() => msg.delete(), 10000)

			});
			
		} else {
		
                    message.channel.send({ embeds: [ {

                            description: '**:pick: Ravencoin Lite (RVL) Network hashrate :pick:**',
                            color: 1363892,
                            fields: [
                                    {
                                            name: 'Network hashrate',
                                            value: '**' + Number(hashrate / 1000000000).toFixed(3)+ ' GH/s**',
                                            inline: false
                                    }
                            ]

                    } ] }).then(msg => {
                            setTimeout(() => msg.delete(), 60000)
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

                                setTimeout(() => msg.delete(), 10000)

                        });

                } else {

                    message.channel.send({ embeds: [ {

                            description: '**:pick: Ravencoin Lite (RVL) network mining info :pick:**',
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
                            setTimeout(() => msg.delete(), 60000)
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

                                setTimeout(() => msg.delete(), 10000)

                        });

                } else {

                    message.channel.send({ embeds: [ {

                            description: '**:chains:  Ravencoin Lite (RVL) blockchain info  :chains:**',
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
							                            setTimeout(() => msg.delete(), 60000)
							                    });
			                }
		        })

}

///////////////////////
// Get market prices //
///////////////////////

function getPrice(message, cur){
            const https = require('https')
		const options = {
                  hostname: 'www.exbitron.com',
                  port: 443,
                  path: '/api/v2/peatio/public/markets/rvl' + cur + '/tickers',
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

			  message.channel.send({ embeds: [ {

                                  description: '**:chart_with_upwards_trend: Ravencoin Lite (RVL) Price Info :chart_with_upwards_trend:**',

                                  color: 1363892,

                                  fields: [
					  {
					  	  name: 'Exbitron (RVL/'+cur.toUpperCase()+')',
						  value: '**https://exbitron.com**\nhttps://www.exbitron.com/trading/rvl'+cur,
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
					  	  name: 'Volume(RVL)',
						  value: amount + ' RVL',
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

                                  setTimeout(() => msg.delete(), 60000)

                          });


                  })

                })

        req.on('error', error => {

                console.error(error)

        })

        req.end();
	
	// If BTC, also retrieve Trade Ogre
	
	if(cur == 'btc'){
	
		                const options = {
                  hostname: 'tradeogre.com',
                  port: 443,
                  path: '/api/v1/ticker/'+ cur.toUpperCase() +'-RVL',
                  method: 'GET',
                }

                const req = https.request(options, res => {
                  //console.log(`statusCode: ${res.statusCode}`)
                  res.on('data', d => {

                          var d = JSON.parse(d);
                          var djson = JSON.stringify(d);
                          console.log("d=" + djson);
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

                                  description: '**:chart_with_upwards_trend: Ravencoin Lite (RVL) Price Info :chart_with_upwards_trend:**',

                                  color: 1363892,

                                  fields: [
                                          {
                                                  name: 'Trade Ogre (RVL/'+cur.toUpperCase()+')',
                                                  value: '**https://tradeogre.com**\nhttps://tradeogre.com/exchange/'+ cur.toUpperCase() +'-RVL',
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

                                  setTimeout(() => msg.delete(), 60000)

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

//////////////////////////////
// Retrieve wRVL information//
//////////////////////////////

function getWRVL(message){
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

                                  description: '**:gift: wRVL Token Information :gift:\n\u200b**',

                                  color: 1363892,

                                  fields: [
					  {
						  name: ':envelope_with_arrow:  Wrap your RVL!  :envelope_with_arrow:',
                                                  value: '' + coinwrapurl,
                                                  inline: false
                                          },
					  {
						  name: ':envelope:  Contract address  :envelope:',
                                                  value: contractaddress +'\nhttps://polygonscan.com/token/' + contractaddress,
                                                  inline: false
                                          },
                                          {
						  name: ':coin:  wRVL Token Supply  :coin:',
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

                                  setTimeout(() => msg.delete(), 60000)

                          });

                  })

                })

        req.on('error', error => {

                console.error(error)

        })
        req.end();

        return;

}


function inPrivateorSpamChannel(msg) {
  if (msg.channel.type == 'dm' || isSpam(msg)) {
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
  return amount.match(/^[0-9]+(\.[0-9]+)?$/) ? amount : null;
}

function txLink(txId) {
   return config.explorer.explorertxurl + txId;
}

function addyLink(address) {
  return config.explorer.exploreraddressurl + address;
}
