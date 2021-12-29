'use strict';

// Load up libraries
const Discord = require('discord.js');
let moment = require('moment-timezone');
// Load config!
let config = require('config');
let coinsymbol = config.get('avn').coinsymbol;
let logChannel = config.get('moderation').logchannel;
let pm2Name = config.get('moderation').pm2Name;
config = config.get('bot');

const { Client, Intents } = require('discord.js');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_PRESENCES'], partials: ['CHANNEL']});

var aliases;
// check if any aliases are defined
try {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  aliases = require('./alias.json');
  console.log('[' + time + ' PST][' + pm2Name + '] ' + Object.keys(aliases).length + ' aliases Loaded!');
} catch (e) {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log('[' + time + ' PST][' + pm2Name + '] No aliases defined');
}
var commands = {};

const bot = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_PRESENCES'], partials: ['CHANNEL']});

bot.on('ready', function() {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log(
    '[' +
      time +
      ' PST][' +
      pm2Name +
      '] ' +
      bot.user.username +
      ' Logged in! '
  );
  bot.channels.cache.cache
    bot.channels.cache.get(logChannel)
	client.on('messageCreate', message => {

        client.channels.cache.get(logChannel).send(
      '[' +
        time +
        ' PST][' +
        pm2Name +
        '] ' +
        bot.user.username +
        ' Logged in! '
    )});
  require('./plugins.js').init();
  console.log(
    '[' +
      time +
      ' PST][' +
      pm2Name +
      '] type ' +
      config.prefix +
      'avn in Discord for a commands list.'
  );
  bot.channels.cache
    bot.channels.cache.get(logChannel)
        client.on('messageCreate', message => {

        client.channels.cache.get(logChannel).send(
      '[' +
        time +
        ' PST][' +
        pm2Name +
        '] type ' +
        config.prefix +
        'avn in Discord for a commands list.'
    )});

  change();

  var counter = 0;
  setInterval(change, 60000);

  async function change() {
  
	  let last = await getLast('usdt');
	  bot.user.setActivity(': ' + last + ' USDT', { type: 'WATCHING' }) ;
	  
	  counter++;
	  if (counter >= 1) {
	  counter = 0;
   }
  }
});

process.on('uncaughtException', err => {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log('[' + time + ' PST][' + pm2Name + '] uncaughtException: ' + err);
  bot.channels.cache
    client.channels.cache.get(logChannel)
        client.on('messageCreate', message => {

        client.channels.cache.get(logChannel).send('[' + time + ' PST][' + pm2Name + '] uncaughtException: ' + err)});
  process.exit(1); //exit node.js with an error
});

process.on('unhandledRejection', err => {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log('[' + time + ' PST][' + pm2Name + '] unhandledRejection: ' + err);
  bot.channels.cache
    client.channels.cache.get(logChannel)
    client.on('messageCreate', message => {
    client.channels.cache.get(logChannel).send('[' + time + ' PST][' + pm2Name + '] unhandledRejection: ' + err)});
  process.exit(1); //exit node.js with an error
});

bot.on('disconnected', function() {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log('[' + time + ' PST][' + pm2Name + '] Disconnected!');
  process.exit(1); //exit node.js with an error
});

bot.on('error', function(error) {
  var time = moment()
    .tz('America/Los_Angeles')
    .format('MM-DD-YYYY hh:mm a');
  console.log('[' + time + ' PST][' + pm2Name + '] error: ' + error);
  process.exit(1); //exit node.js with an error
});

function checkMessageForCommand(msg, isEdit) {
  //check if message is a command
  if (msg.author.id != bot.user.id && msg.content.startsWith(config.prefix)) {
    var cmdTxt = msg.content.split(' ')[0].substring(config.prefix.length);
    var suffix = msg.content.substring(
      cmdTxt.length + config.prefix.length + 1
    ); //add one for the ! and one for the space
//    if (msg.isMentioned(bot.user)) {
    if (msg.mentions.has(bot.user)) {
      try {
        cmdTxt = msg.content.split(' ')[1];
        suffix = msg.content.substring(
          bot.user.mention().length + cmdTxt.length + config.prefix.length + 1
        );
      } catch (e) {
	      if (message.author.bot) return false;
	      if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return false;
	      //no command
	      msg.channel.send('Yes?');
	      return;
      }
    }
    var cmd = commands[cmdTxt];
    if (cmd) {
      // Add permission check here later on ;)
      console.log(
        'treating ' +
          msg.content +
          ' from ' +
          msg.author.username +
          ' as command'
      );
      try {
        cmd.process(bot, msg, suffix, isEdit);
      } catch (e) {
        var msgTxt = 'command ' + cmdTxt + ' failed :(';
        var linebreak = '\n-------------------------------------------------\n';
        if (config.debug) {
          msgTxt += '\n' + e.stack;
        }
        var time = moment()
          .tz('America/Los_Angeles')
          .format('MM-DD-YYYY hh:mm a');
        bot.channels.cache
            client.on('messageCreate', message => {

	    client.channels.cache.get(logChannel)
	    client.channels.cache.get(logChannel).send('[' + time + ' PST][' + pm2Name + '] ' + msgTxt + linebreak)});
      }
    }
  } else {
    //message isn't a command or is from us
    //drop our own messages to prevent feedback loops
    if (msg.author == bot.user) {
      return;
    }

    if (msg.author != bot.user && msg.mentions.has(bot.user)) {
      msg.channel.send('yes?'); //using a mention here can lead to looping
    } else {
    }
  }
}

bot.on('message', msg => checkMessageForCommand(msg, false));

exports.addCommand = function(commandName, commandObject) {
  try {
    commands[commandName] = commandObject;
  } catch (err) {
    var time = moment()
      .tz('America/Los_Angeles')
      .format('MM-DD-YYYY hh:mm a');
    console.log('[' + time + ' PST][' + pm2Name + '] Error addCommand: ' + err);
    bot.channels.cache
      client.on('messageCreate', message => {

      client.channels.cache.get(logChannel)
      client.channels.cache.get(logChannel).send('[' + time + ' PST][' + pm2Name + '] Error addCommand: ' + err)});
  }
};
exports.addCustomFunc = function(customFunc) {
  try {
    customFunc(bot);
  } catch (err) {
    var time = moment()
      .tz('America/Los_Angeles')
      .format('MM-DD-YYYY hh:mm a');
    console.log(
      '[' + time + ' PST][' + pm2Name + '] Error addCustomFunc: ' + err
    );
    bot.channels.cache
      client.on('messageCreate', message => {

      client.channels.cache.get(logChannel)
      client.channels.cache.get(logChannel).send('[' + time + ' PST][' + pm2Name + '] Error addCustomFunc: ' + err)});
  }
};
exports.commandCount = function() {
  return Object.keys(commands).length;
};

bot.login(config.token);

//////////////////////
// Get last price   //
//////////////////////

function getLast(cur){

        const rp = require('request-promise');

        return new Promise((resolve, reject)=>{

                //console.log("cur="+cur);

                const https = require('https')

                const options = {

                        hostname: 'www.exbitron.com',
                        port: 443,
                        path: '/api/v2/peatio/public/markets/' + coinsymbol.toLowerCase() + cur + '/tickers',
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

                                //console.log("last="+last);

                                resolve(last);

                        })

                });

                req.on('error', error => {

                        console.error(error)
                        resolve("No Data");

                })


                req.end();
        });
}
