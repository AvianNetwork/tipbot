'use strict';

// Load up libraries
const Discord = require('discord.js');
let moment = require('moment-timezone');
// Load config!
let config = require('config');
let logChannel = config.get('moderation').logchannel;
let pm2Name = config.get('moderation').pm2Name;
config = config.get('bot');

const { Client, Intents } = require('discord.js');

const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES']});

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

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

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
    client.channels.cache.get(logChannel)
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
      'tipavn in Discord for a commands list.'
  );
  bot.channels.cache
    client.channels.cache.get(logChannel)
        client.on('messageCreate', message => {

        client.channels.cache.get(logChannel).send(
      '[' +
        time +
        ' PST][' +
        pm2Name +
        '] type ' +
        config.prefix +
        'tipavn in Discord for a commands list.'
    )});

  bot.user.setPresence({
     game:{
       name: 'Ready!'
     },
     status:'online'
  });

  var text = ['ravencoinlite.org'];
  var counter = 0;
  setInterval(change, 10000);

  function change() {
    bot.user.setPresence({
       game:{
         name: text[counter]
       },
       status:'online'
    });
    counter++;
    if (counter >= text.length) {
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
