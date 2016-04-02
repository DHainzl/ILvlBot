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
var http = require('http');

export class ILvlBot <T extends DialogCollection> {
	bot: T;
    getBot(): T { return this.bot; }
    
    luisUrl: string;
	battlenetKey: string;

	constructor(bot: T, luisId: string, luisKey: string, battlenetKey: string) {
		this.bot = bot;
        this.luisUrl = this.generateLUISUrl(luisId, luisKey);
        this.battlenetKey = battlenetKey;
		
        this.addDialogs();
	}

    addDialogs() {
        let dialog = new LuisDialog(this.luisUrl);
		console.log('dialog is ', dialog);
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
		
        if (!charData.name) {
            session.send('No name given ...');
        } else if (!charData.realm) {
            session.send('No realm given ...');
        } else {
			console.log('got data, sending it to battle net');
            this.getItems(charData.name, charData.realm, (err, body) => {
				console.log('got data from battle net!', body);
				session.send(`${charData.name}@${charData.realm} has an item level of ${body.items.averageItemLevelEquipped}/${body.items.averageItemLevel}`);
            });
        } 
    }
	
	private generateLUISUrl(id: string, key: string): string {
		return `https://api.projectoxford.ai/luis/v1/application?id=${id}&&subscription-key=${key}`;
	}
	private getItems(name: string, realm: string, cb: (err: string, data: any) => void) {
		let url = `https://eu.api.battle.net/wow/character/${realm}/${name}?fields=items&locale=en_GB&apikey=${this.battlenetKey}`;
		let body = '';
		
		console.log('Getting', url);

		http.get(url, function(res) {
			res.on('data', chunk => body += chunk);
			res.on('end', () => cb(null, body));
		}).on('error', function(err) {
			cb(err, null);
		});
	}
}