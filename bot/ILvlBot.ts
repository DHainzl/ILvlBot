import {
    DialogCollection,
    CommandDialog,
    DialogAction,
    Prompts,
    LuisDialog,
    EntityRecognizer, 
    Session,
    IDialogResult
} from 'botbuilder';

var bnet = require('battlenet-api');
var request = require('request');
var bnetKey: string = '';

export class ILvlBot <T extends DialogCollection> {
	bot: T;
    getBot(): T { return this.bot; }
    
    luisUrl: string;
	battlenetKey: string;

	constructor(bot: T, luisId: string, luisKey: string, battlenetKey: string) {
		this.bot = bot;
        this.luisUrl = this.generateLUISUrl(luisId, luisKey);
        this.battlenetKey = battlenetKey;
		bnetKey = battlenetKey;
		console.log('constructor', bnetKey);
        this.addDialogs();
	}

    addDialogs() {
        let dialog = new LuisDialog(this.luisUrl);
		this.bot.add('/', dialog);
        
        dialog.on('FindItemLevel', [
            this.processLanguage,
            this.getCharacterName,
            this.getRealm,
            this.getIlvl
        ]);
		
        dialog.onDefault(DialogAction.send("I could not understand your request."));
    }
    
    private processLanguage(session: Session, args, next) {
		console.log('processing language');
        var name = EntityRecognizer.findEntity(args.entities, 'CharacterName');
        var realm = EntityRecognizer.findEntity(args.entities, 'RealmName');
        
        var charData = session.dialogData.character = {
            name: name && name.entity,
            realm: realm && realm.entity
        };
        
        if (!charData.name) {
            Prompts.text(session, "What is the name of the character?");
        } else {
            next();
        }  
    }
    
    private getCharacterName(session: Session, results, next) {
        var charData = session.dialogData.character;
		console.log('getcharname', charData);
        
        if (results.response) {
            charData.name = results.response;
        }
        
        if (!charData.realm) {
            Prompts.text(session, "What is the realm of the character?");
        } else {
            next();
        }
    }
    
    private getRealm(session: Session, results, next) {
        var charData = session.dialogData.character;
        console.log('getrealm', charData);
		
        if (results.response) {
            charData.realm = results.response;
        }  
        next();
    }
    
    private getIlvl(session: Session, args, next) {
        var charData = session.dialogData.character;
        console.log('getilvl', charData);
		console.log('bnet key', bnetKey);
		
        if (!charData.name) {
            session.send('No name given ...');
        } else if (!charData.realm) {
            session.send('No realm given ...');
        } else {
			console.log('got data, sending it to battle net');
			bnet.wow.character.items({
				origin: 'eu',
				realm: 'antonidas',
				name: 'hoazl'
			}, bnetKey, function (err, body) {
				if (err) {
					console.log(err);
					session.send('Error getting data from battle.net ....');
				} else {			
					console.log('Got data!');
					session.send(`${charData.name}@${charData.realm} has an item level of ${body.items.averageItemLevelEquipped}/${body.items.averageItemLevel}`);
				}
            });
        }
    }
	
	private generateLUISUrl(id: string, key: string): string {
		return `https://api.projectoxford.ai/luis/v1/application?id=${id}&&subscription-key=${key}`;
	}
}