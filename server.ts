/// <reference path="typings/botbuilder.d.ts" />
/// <reference path="typings/node/node.d.ts" />

var restify = require('restify');

import { BotConnectorBot } from 'botbuilder';
import { ILvlBot } from './bot/ILvlBot';

let bot = new ILvlBot(
    new BotConnectorBot({
        appId: process.env.APP_ID || 'YourAppId',
        appSecret: process.env.APP_SECRET || 'YourAppSecret'
    }),
    process.env.LUIS_ID,
    process.env.LUIS_KEY,
    process.env.BATTLENET_KEY
);
    

let server = restify.createServer();
server.post('/api/messages', bot.getBot().verifyBotFramework(), bot.getBot().listen());
server.listen(process.env.port || 3978, function () {
	console.log('%s listening to %s', server.name, server.url);
});