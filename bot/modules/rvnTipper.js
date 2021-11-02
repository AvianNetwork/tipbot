'use strict';

const bitcoin = require('bitcoin');

let Regex = require('regex'),
  config = require('config'),
  spamchannels = config.get('moderation').botspamchannels;
let walletConfig = config.get('rvl').config;
let paytxfee = config.get('rvl').paytxfee;
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
        '__**Ravencoin Lite (RVL) Tipper**__\nTransaction Fees: **' + paytxfee + '**\n    **!tiprvl** : Displays This Message\n    **!tiprvl balance** : get your balance\n    **!tiprvl deposit** : get address for your deposits\n    **!tiprvl withdraw <ADDRESS> <AMOUNT>** : withdraw coins to specified address\n    **!tiprvl <@user> <amount>** :mention a user with @ and then the amount to tip them\n    **!tiprvl private <user> <amount>** : put private before Mentioning a user to tip them privately.\n    **!tiprvl privkey** : dump privkey for your wallet(result sent via DM)\n\n    **<> : Replace with appropriate value.**',
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
      case 'privkey':
	dumpPrivKey(msg, tipper);
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

///

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
//    message.channel.send({ embeds: [ {
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
  })}


////
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
