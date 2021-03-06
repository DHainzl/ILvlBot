// Downloaded at 2016-04-01 from 
// https://github.com/Microsoft/BotBuilder/blob/master/Node/lib/botbuilder.d.ts
// 
//=============================================================================
//
// INTERFACES
//
//=============================================================================

/** A communication message recieved from a User or sent out of band from a Bot. */
export interface IMessage {
    /** What kind of message is this. */
    type?: string;

    /** Bot.Connector Id for the message (always assigned by transport.) */
    id?: string;

    /** Bot.Connector ConverationId id for the conversation (always assigned by transport.) */
    conversationId?: string;

    /** Timestamp of when the message was created. */
    created?: string;

    /** (if translated) The OriginalText of the message. */
    sourceText?: string;

    /** (if translated) The language of the OriginalText of the message. */
    sourceLanguage?: string;

    /** The language that the Text is expressed in. */
    language?: string;

    /** The text of the message (this will be target language depending on flags and destination.)*/
    text?: string;

    /** Array of attachments that can be anything. */
    attachments?: IAttachment[];

    /** ChannelIdentity that sent the message. */
    from?: IChannelAccount;

    /** ChannelIdentity the message is sent to. */
    to?: IChannelAccount;

    /** Account to send replies to (for example, a group account that the message was part of.) */
    replyTo?: IChannelAccount;

    /** The message Id that this message is a reply to. */
    replyToMessageId?: string;

    /** List of ChannelAccounts in the conversation (NOTE: this is not for delivery means but for information.) */
    participants?: IChannelAccount[];

    /** Total participants in the conversation.  2 means 1:1 message. */
    totalParticipants?: number;

    /** Array of mentions from the channel context. */
    mentions?: IMention[];

    /** Place in user readable format: For example: "Starbucks, 140th Ave NE, Bellevue, WA" */
    place?: string;

    /** Channel Message Id. */
    channelMessageId?: string;

    /** Channel Conversation Id. */
    channelConversationId?: string;

    /** Channel specific properties.  For example: Email channel may pass the Subject field as a property. */
    channelData?: any;

    /** Location information (see https://dev.onedrive.com/facets/location_facet.htm) */
    location?: ILocation;

    /** Hashtags for the message. */
    hashtags?: string[];

    /** Required to modify messages when manually reading from a store. */
    eTag?: string;
}

/** An attachment. */
export interface IAttachment {
    /** (REQUIRED) mimetype/Contenttype for the file, either ContentUrl or Content must be set depending on the mimetype. */
    contentType: string;

    /** Url to content. */
    contentUrl?: string;

    /** Content Payload (for example, lat/long for contentype="location". */
    content?: any;

    /** (OPTIONAL-CARD) FallbackText - used for downlevel clients, should be simple markup with links. */
    fallbackText?: string;

    /** (OPTIONAL-CARD) Title. */
    title?: string;

    /** (OPTIONAL-CARD) link to use for the title. */
    titleLink?: string;

    /** (OPTIONAL-CARD) The Text description the attachment. */
    text?: string;

    /** (OPTIONAL-CARD) Thumbnail associated with attachment. */
    thumbnailUrl?: string;
}

/** Information needed to route a message. */
export interface IChannelAccount {
    /** Display friendly name of the user. */
    name?: string;

    /** Channel Id that the channelAccount is to be communicated with (Example: GroupMe.) */
    channelId: string;

    /** Channel Address for the channelAccount (Example: @thermous.) */
    address: string;

    /** Id - global intercom id. */
    id?: string;

    /** Is this account id an bot? */
    isBot?: boolean;
}

/** Mention information. */
export interface IMention {
    /** The mentioned user. */
    mentioned?: IChannelAccount;

    /** Sub Text which represents the mention (can be null or empty.) */
    text?: string;
}

/** A GEO location. */
export interface ILocation {
    /** Altitude. */
    altitude?: number;

    /** Latitude for the user when the message was created. */
    latitude: number;

    /** Longitude for the user when the message was created. */
    longitude: number;
}

/** Address info passed to Bot.beginDialog() calls. Specifies the address of the user to start a conversation with. */
export interface IBeginDialogAddress {
    /** Address of user to begin dialog with. */
    to: IChannelAccount;

    /** Optional "from" address for the bot. Required if IConnectorSession.defaultFrom hasn't been specified. */
    from?: IChannelAccount;

    /** Optional language to use when messaging the user. */
    language?: string;

    /** Optional text to initialize the dialogs message with. Useful for scenarios where the dialog being called is expecting to be replying to something the user said. */
    text?: string;
}

/** Plugin for localizing messages sent to the user by a bot. */
export interface ILocalizer {
    /**
     * Loads a localized string for the specified language.
     * @param language Desired language of the string to return.
     * @param msgid String to use as a key in the localized string table. Typically this will just be the english version of the string.
     */
    gettext(language: string, msgid: string): string;

    /**
     * Loads the plural form of a localized string for the specified language.
     * @param language Desired language of the string to return.
     * @param msgid Singular form of the string to use as a key in the localized string table.
     * @param msgid_plural Plural form of the string to use as a key in the localized string table.
     * @param count Count to use when determining whether the singular or plural form of the string should be used.
     */
    ngettext(language: string, msgid: string, msgid_plural: string, count: number): string;
}

/** 
 * Action object which exposes a partial set of session functionality and can be used to capture 
 * messages sent to a child dialog.
 */
interface ISessionAction {
    /** Data for the user that's persisted across all conversations with the bot. */
    userData: any;

    /** Data that's only visible to the current dialog. */
    dialogData: any;

    /** Does not capture anything and proceedes to the next parent dialog in the callstack. */
    next(): void;

    /**
     * Ends all of the dialogs children and returns control to the current dialog. This permanently 
     * captures back the users replies.
     * @param result Optional results to pass to dialogResumed().
     */
    endDialog<T>(result?: IDialogResult<T>): void;
    
    /**
     * Sends a simple text message to the user. The message will be localized using the sessions 
     * configured ILocalizer and if arguments are passed in the message will be formatted using
     * sprintf-js. See https://github.com/alexei/sprintf.js for documentation. 
     * @param msg Text of the message to send.
     * @param args Optional arguments used to format the final output string. See https://github.com/alexei/sprintf.js for documentation. 
     */
    send(msg: string, ...args: any[]): void;
    /**
     * Sends a message to the user.
     * @param msg Message to send.
     */
    send(msg: IMessage): void;
}

/** Persisted session state used to track a conversations dialog stack. */
export interface ISessionState {
    /** Dialog stack for the current session. */
    callstack: IDialogState[];

    /** Timestamp of when the session was last accessed. */
    lastAccess: number;
}

/** An entry on the sessions dialog stack. */
export interface IDialogState {
    /** ID of the dialog. */
    id: string;

    /** Persisted state for the dialog. */
    state: any;
}

/** 
  * Results returned by a child dialog to its parent via a call to session.endDialog(). 
  */
export interface IDialogResult<T> {
    /** The reason why the current dialog is being resumed. */
    resumed: ResumeReason;

    /** ID of the child dialog thats ending. */
    childId?: string;

    /** If an error occured the child dialog can return the error to the parent. */
    error?: Error;

    /** The users response. */
    response?: T;
}

/** Options passed to  */
export interface IPromptOptions {
    /** Optional retry prompt to send if the users response isn't understood. Default is to just reprompt with "I Didn't understand." plus the original prompt. */
    retryPrompt?: string;

    /** Optional maximum number of times to reprompt the user. Default value is 2. */
    maxRetries?: number;

    /** Optional reference date when recognizing times. Date expressed in ticks using Date.getTime(). */
    refDate?: number;

    /** Optional type of list to render for PromptType.choice. Default value is ListStyle.list. */
    listStyle?: ListStyle;
}

/** Arguments passed to the built-in prompts beginDialog() call. */
export interface IPromptArgs extends IPromptOptions {
    /** Type of prompt invoked. */
    promptType: PromptType;

    /** Initial message to send to user. */
    prompt: string;

    /** Enum values for a choice prompt. */
    enumsValues?: string[];
}

/** Dialog result returned by a system prompt. */
export interface IPromptResult<T> extends IDialogResult<T> {
    /** Type of prompt completing. */
    promptType?: PromptType;
}

/** Result returned from an IPromptRecognizer. */
export interface IPromptRecognizerResult<T> extends IPromptResult<T> {
    /** Returned from a prompt recognizer to indicate that a parent dialog handled (or captured) the utterance. */
    handled?: boolean;
}

/** Strongly typed Text Prompt Result. */
export interface IPromptTextResult extends IPromptResult<string> { }

/** Strongly typed Number Prompt Result. */
export interface IPromptNumberResult extends IPromptResult<number> { }

/** Strongly typed Confirm Prompt Result. */
export interface IPromptConfirmResult extends IPromptResult<boolean> { } 

/** Strongly typed Choice Prompt Result. */
export interface IPromptChoiceResult extends IPromptResult<IFindMatchResult> { }

/** Strongly typed Time Prompt Result. */
export interface IPromptTimeResult extends IPromptResult<IEntity> { }

/** Plugin for recognizing prompt responses recieved by a user. */
export interface IPromptRecognizer {
    /**
      * Attempts to match a users reponse to a given prompt.
      * @param args Arguments passed to the recognizer including that language, text, and prompt choices.
      * @param callback Function to invoke with the result of the recognition attempt.
      */
    recognize<T>(args: IPromptRecognizerArgs, callback: (result: IPromptRecognizerResult<T>) => void): void;
}

/** Arguments passed to the IPromptRecognizer.recognize() method.*/
export interface IPromptRecognizerArgs {
    /** Type of prompt being responded to. */
    promptType: PromptType;

    /** Text of the users response to the prompt. */
    text: string;

    /** Language of the text if known. */
    language?: string;

    /** For choice prompts the list of possible choices. */
    enumValues?: string[];

    /** Optional reference date when recognizing times. */
    refDate?: number;

    /**
     * Lets a prompt recognizer compare its confidence that it understood an utterance with the prompts parent. 
     * The callback will return true if the utterance was processed by the parent. This function lets a
     * parent of the prompt handle utterances like "what can I say?" or "nevermind". 
     * @param language The langauge of the utterance taken from IMessage.language.
     * @param utterance The users utterance taken from IMessage.text.
     * @param score The dialogs confidence level on a scale of 0 to 1.0 that it understood the users intent.
     * @param callback Function to invoke with the result of the comparison. If handled is true the dialog should not process the utterance.
     */
    compareConfidence(language: string, utterance: string, score: number, callback: (handled: boolean) => void): void;
}

/** Global configuration options for the Prompts dialog. */
export interface IPromptsOptions {
    /** Replaces the default recognizer (SimplePromptRecognizer) used to recognize prompt replies. */
    recognizer?: IPromptRecognizer
}

/** A recognized intent. */
export interface IIntent {
    /** Intent that was recognized. */
    intent: string;

    /** Confidence on a scale from 0.0 - 1.0 that the proper intent was recognized. */
    score: number;
}

/** A recognized entity. */
export interface IEntity {
    /** Type of entity that was recognized. */
    type: string;

    /** Value of the recognized entity. */
    entity: string;

    /** Start position of entity within text utterance. */
    startIndex?: number;

    /** End position of entity within text utterance. */
    endIndex?: number;

    /** Confidence on a scale from 0.0 - 1.0 that the proper entity was recognized. */
    score?: number;
}

/** Arguments passed to intent handlers when invoked. */
export interface IIntentArgs {
    /** Array of intents that were recognized. */
    intents: IIntent[];

    /** Array of entities that were recognized. */
    entities: IEntity[];
}

/** Arguments passed to command handlers when invoked. */
export interface ICommandArgs {
    /** Compiled expression that was matched. */
    expression: RegExp;

    /** List of values that matched the expression. */
    matches: RegExpExecArray;
}

/** Additional data parameters supported by the BotConnectorBot. */
export interface IBotConnectorMessage extends IMessage {
    /** Private Bot opaque data associated with a user (across all channels and conversations.) */
    botUserData?: any;

    /** Private Bot opaque state data associated with a conversation. */
    botConversationData?: any;

    /** Private Bot opaque state data associated with a user in a conversation. */
    botPerUserInConversationData?: any;
}

/** Arguments padded to the constructor of a session. */
export interface ISessionArgs {
    /** Collection of dialogs to use for routing purposes. Typically this is just the bot. */
    dialogs: DialogCollection;

    /** Unique ID of the dialog to use when starting a new conversation with a user. */
    dialogId: string;

    /** Optional arguments to pass to the conversations initial dialog. */
    dialogArgs?: any;

    /** Optional localizer to use when localizing the bots responses. */
    localizer?: ILocalizer;
}

/** Signature of error events fired from a session. */
export interface ISessionErrorEvent {
    (err: Error): void;
}

/** Signature of message related events fired from a session. */
export interface ISessionMessageEvent {
    (message: IMessage): void;
}

/** Signature of error events fired from bots. */
export interface IBotErrorEvent {
    (err: Error, message): void;
}

/** Signature of message related events fired from bots. */
export interface IBotMessageEvent {
    (message): void;
}

/** result returnd from a call to EntityRecognizer.findBestMatch() or EntityRecognizer.findAllMatches(). */
export interface IFindMatchResult {
    /** Index of the matched value. */
    index: number;

    /** Value that was matched.  */
    entity: string;

    /** Confidence score on a scale from 0.0 - 1.0 that an value matched the users utterance. */
    score: number;
}

/** Storage abstraction used to persist session state & user data. */
export interface IStorage {
    /**
      * Loads a value from storage.
      * @param id ID of the value being loaded.
      * @param callaback Function used to receive the loaded value.
      */
    get(id: string, callback: (err: Error, data: any) => void): void;

    /**
      * Saves a value to storage.
      * @param id ID of the value to save.
      * @param data Value to save.
      * @param callback Optional function to invoke with the success or failure of the save.
      */
    save(id: string, data: any, callback?: (err: Error) => void): void;
}

/** Options used to configure the BotConnectorBot. */
export interface IBotConnectorOptions {
    /** URL of API endpoint to connect to for outgoing messages. */
    endpoint?: string;

    /** Bots application ID. */
    appId?: string;

    /** Bots application secret. */
    appSecret?: string;

    /** Default "from" address used in calls to ConnectorSession.beginDialog(). */
    defaultFrom?: IChannelAccount;
    
    /** Optional localizer used to localize the bots responses to the user. */
    localizer?: ILocalizer;

    /** Dialog to launch when a user initiates a new conversation with a bot. Default value is '/'. */
    defaultDialogId?: string;

    /** Optional arguments to pass to the initial dialog for a conversation. */
    defaultDialogArgs?: any;

    /** Sets a welcome message to send anytime a bot is added to a group conversation like a slack channel. */
    groupWelcomeMessage?: string;

    /** Sets a welcome message to send anytime a user is added to a group conversation the bots a member of like a slack channel. */
    userWelcomeMessage?: string;

    /** Sets a goodbye message to send anytime a user asks to end a conversation. */
    goodbyeMessage?: string;
}

/** Options used to configure the SkypeBot. */
export interface ISkypeBotOptions {
    /** Storage system to use for persisting Session.userData values. By default the MemoryStorage is used. */
    userStore?: IStorage;

    /** Storage system to use for persisting Session.sessionState values. By default the MemoryStorage is used. */
    sessionStore?: IStorage;

    /** Maximum time (in milliseconds) since ISessionState.lastAccess before the current session state is discarded. Default is 4 hours. */
    maxSessionAge?: number;

    /** Optional localizer used to localize the bots responses to the user. */
    localizer?: ILocalizer;

    /** Dialog to launch when a user initiates a new conversation with a bot. Default value is '/'. */
    defaultDialogId?: string;

    /** Optional arguments to pass to the initial dialog for a conversation. */
    defaultDialogArgs?: any;

    /** Sets the message to send when a user adds the bot as a contact. */
    contactAddedmessage?: string;

    /** Sets the message to send when the bot is added to a group chat. */
    botAddedMessage?: string;

    /** Sets the message to send when a bot is removed from a group chat. */
    botRemovedMessage?: string;

    /** Sets the message to send when a user joins a group chat monitored by the bot. */
    memberAddedMessage?: string;

    /** Sets the message to send when a user leaves a group chat monitored by the bot. */
    memberRemovedMessage?: string;
}

/** Options used to configure the SlackBot. */
export interface ISlackBotOptions {
    /** Maximum time (in milliseconds) since ISessionState.lastAccess before the current session state is discarded. Default is 4 hours. */
    maxSessionAge?: number;

    /** Optional localizer used to localize the bots responses to the user. */
    localizer?: ILocalizer;

    /** Dialog to launch when a user initiates a new conversation with a bot. Default value is '/'. */
    defaultDialogId?: string;

    /** Optional arguments to pass to the initial dialog for a conversation. */
    defaultDialogArgs?: any;
    
    /** Maximum time (in milliseconds) that a bot continues to recieve ambient messages after its been @mentioned. Default 5 minutes.  */
    ambientMentionDuration?: number;
}

/** Address info passed to SlackBot.beginDialog() calls. Specifies the address of the user or channel to start a conversation with. */
export interface ISlackBeginDialogAddress {
    /** ID of the user to begin a conversation with. If this is specified channel should be blank. */
    user?: string;
    
    /** ID of the channel to begin a conversation with. If this is specified user should be blank. */
    channel?: string;

    /** Optional team ID. If specified the SlackSession.teamData will be loaded. */
    team?: string;

    /** Optional text to initialize the dialogs message with. Useful for scenarios where the dialog being called is expecting to be replying to something the user said. */
    text?: string;
}

/** Options used to configure the TextBot. */
export interface ITextBotOptions {
    /** Storage system to use for persisting Session.userData values. By default the MemoryStorage is used. */
    userStore?: IStorage;

    /** Storage system to use for persisting Session.sessionState values. By default the MemoryStorage is used. */
    sessionStore?: IStorage;

    /** Maximum time (in milliseconds) since ISessionState.lastAccess before the current session state is discarded. Default is 4 hours. */
    maxSessionAge?: number;

    /** Optional localizer used to localize the bots responses to the user. */
    localizer?: ILocalizer;

    /** Dialog to launch when a user initiates a new conversation with a bot. Default value is '/'. */
    defaultDialogId?: string;

    /** Optional arguments to pass to the initial dialog for a conversation. */
    defaultDialogArgs?: any;
}

/** Signature for function passed as a step to DialogAction.waterfall(). */
export interface IDialogWaterfallStep {
    <T>(session: Session, result?: IDialogResult<T>, skip?: (results?: IDialogResult<any>) => void): any;
}


//=============================================================================
//
// ENUMS
//
//=============================================================================

/** Reason codes for why a dialog was resumed. */
export enum ResumeReason {
    /** The user completed the child dialog and a result was returned. */
    completed,

    /** The user did not complete the child dialog for some reason. They may have exceeded maxRetries or canceled. */
    notCompleted,

    /** The user requested to cancel the current operation. */
    canceled,

    /** The user requested to return to the previous step in a dialog flow. */
    back,

    /** The user requested to skip the current step of a dialog flow. */
    forward,

    /** A captured utterance that resulted in a new child dialog being pushed onto the stack is completing. */
    captureCompleted,

    /** The child was forcibly ended by a parent. */
    childEnded
}

/**
  * Type of prompt invoked.
  */
export enum PromptType {
    /** The user is prompted for a string of text. */
    text,

    /** The user is prompted to enter a number. */
    number,

    /** The user is prompted to confirm an action with a yes/no response. */
    confirm,

    /** The user is prompted to select from a list of choices. */
    choice,

    /** The user is prompted to enter a time. */
    time
}

/** Type of list to render for PromptType.choice prompt. */
export enum ListStyle { 
    /** No list is rendered. This is used when the list is included as part of the prompt. */
    none, 
    
    /** Choices are rendered as an inline list of the form "1. red, 2. green, or 3. blue". */
    inline, 
    
    /** Choices are rendered as a numbered list. */
    list 
}

//=============================================================================
//
// CLASSES
//
//=============================================================================

/**
 * Manages the bots conversation with a user.
 */
export class Session {
    /**
     * Registers an event listener. Events:
     * - error: An error occured. [ISessionErrorEvent]
     * - send: A message should be sent to the user. [ISessionMessageEvent]
     * - quit: The bot would like to end the conversation. [Function]
     * @param event Name of the event.
     * @param listener Function to invoke.
     */
    on(event: string, listener: Function): void;

    /** Sessions configuration args. */
    protected args: ISessionArgs;

    /** Provides derived classes with access to the sessions localizer. */
    protected localizer: ILocalizer;

    /** ID of the dialog to start for any new conversations. */
    protected dialogId: string;

    /** Optional arguments to pass to the dialog when starting a new conversation. */
    protected dialogArgs: any;

    /**
     * Creates an instance of the session.
     * @param args Sessions configuration options.
     */
    constructor(args: ISessionArgs);

    /**
     * Dispatches a message for processing. The session will call thr appropriate middleware based
     * on the messages type. Consumers can install middleware to either intercept or augment certain
     * messages.
     * @param sessionState The current session state. 
     * @param message The message to dispatch.
     */
    dispatch(sessionState: ISessionState, message: IMessage): Session;

    /** The sessions collection of available dialogs & middleware for message routing purposes. */
    dialogs: DialogCollection;

    /** Sessions current state information. */
    ISessionState: ISessionState;

    /** The message recieved from the user. For bot originated messages this may only contain the "to" & "from" fields. */
    message: IMessage;

    /** Data for the user that's persisted across all conversations with the bot. */
    userData: any;

    /** Data that's only visible to the current dialog. */
    dialogData: any;

    /**
     * Signals that an error occured. 
     * @param err Error that occured.
     */
    error(err: Error): Session;

    /**
     * Loads a localized string for the messages language. If arguments are passed the localized string
     * will be treated as a template and formatted using sprintf-js. See https://github.com/alexei/sprintf.js for documentation. 
     * @param msgid String to use as a key in the localized string table. Typically this will just be the english version of the string.
     * @param args Optional arguments used to format the final output string. See https://github.com/alexei/sprintf.js for documentation. 
     */
    gettext(msgid: string, ...args: any[]): string;

    /**
     * Loads the plural form of a localized string for the messages language. The output string will be formatted to 
     * include the count by replacing %d in the string with the count.
     * @param msgid Singular form of the string to use as a key in the localized string table. Use %d to specify where the count should go.
     * @param msgid_plural Plural form of the string to use as a key in the localized string table. Use %d to specify where the count should go.
     * @param count Count to use when determining whether the singular or plural form of the string should be used.
     */
    ngettext(msgid: string, msgid_plural: string, count: number): string;

    /**
     * Ends the session without sending a message. For user originated conversations the bot always 
     * needs to reply with something, even if it's an empty message. 
     */
    send(): Session;
    /**
     * Sends a simple text message to the user. The message will be localized using the sessions 
     * configured ILocalizer and if arguments are passed in the message will be formatted using
     * sprintf-js. See https://github.com/alexei/sprintf.js for documentation. 
     * @param msg Text of the message to send.
     * @param args Optional arguments used to format the final output string. See https://github.com/alexei/sprintf.js for documentation. 
     */
    send(msg: string, ...args: any[]): Session;
    /**
     * Sends a message to the user.
     * @param msg Message to send.
     */
    send(msg: IMessage): Session;

    /** Returns a native message the bot receieved. */
    getMessageReceived(): any;
    
    /**
     * Sends a message in the channels native format.
     * @param msg Message formated in the channels native format.
     */
    sendMessage(msg: any): Session;

    /**
     * Returns true if a message has been sent for this session.
     */
    messageSent(): boolean;

    /**
     * Passes control of the conversation to a new dialog. The current dialog will be suspended 
     * until the child dialog completes. Once the child ends the current dialog will receive a
     * call to dialogResumed() where it can inspect any results returned from the child. 
     * @param id Unique ID of the dialog to start.
     * @param args Optional arguments to pass to the dialogs begin() method.
     */
    beginDialog<T>(id: string, args?: T): Session;

    /**
     * Ends the current dialog and starts a new one its place. The parent dialog will not be 
     * resumed until the new dialog completes. 
     * @param id Unique ID of the dialog to start.
     * @param args Optional arguments to pass to the dialogs begin() method.
     */
    replaceDialog<T>(id: string, args?: T): Session;

    /**
     * Ends the current dialog. The dialogs parent will be resumed.
     * @param result Optional results to pass to the parent dialog.
     */
    endDialog<T>(result?: IDialogResult<T>): Session;

    /**
     * Lets a dialog compare its confidence that it understood an utterance with it's parent. The
     * callback will return true if the utterance was processed by the parent. This function lets a
     * parent of the dialog handle messages not understood by the dialog. 
     * @param language The langauge of the utterance taken from IMessage.language.
     * @param utterance The users utterance taken from IMessage.text.
     * @param score The dialogs confidence level on a scale of 0 to 1.0 that it understood the users intent.
     * @param callback Function to invoke with the result of the comparison. If handled is true the dialog should not process the utterance.
     */
    compareConfidence(language: string, utterance: string, score: number, callback: (handled: boolean) => void): void;

    /**
     * Clears the sessions callstack and restarts the conversation with the default (root) dialog.
     * @param dialogId Unique ID of the dialog to start.
     * @param dialogArgs Optional arguments to pass to the dialogs begin() method.
     */
    reset<T>(dialogId: string, dialogArgs?: T): Session;

    /**
     * Returns true if the session has been reset.
     */
    isReset(): boolean;

    /**
     * Creates a reply message object with a formatted text string. The text will be localized and
     * the languge of the original message will be copied over. Derived classes can use this to 
     * manually format a reply message.   
     * @param text Text or template string for the reply. This will be localized using session.gettext().
     * @param args Optional arguments used to format the message text when Text is a template. 
     */
    public createMessage(text: string, args?: any[]): IMessage;
}

/**
 * Base class for all dialogs. Dialogs are the core component of the BotBuilder 
 * framework. Bots use Dialogs to manage arbitrarily complex conversations with
 * a user. 
 */
export abstract class Dialog {
    /**
     * Called when a new dialog session is being started.
     * @param session Session object for the current conversation.
     * @param args Optional arguments passed to the dialog by its parent.
     */
    begin<T>(session: Session, args?: T): void;

    /**
     * Called when a new reply message has been recieved from a user.
     *
     * Derived classes should implement this to process the message recieved from the user.
     * @param session Session object for the current conversation.
     */
    abstract replyReceived(session: Session): void;

    /**
     * A child dialog has ended and the current one is being resumed.
     * @param session Session object for the current conversation.
     * @param result Result returned by the child dialog.
     */
    dialogResumed<T>(session: Session, result: IDialogResult<T>): void;

    /**
     * Called when a child dialog is wanting to compare its confidence for an utterance with its parent.
     * This lets the parent determine if it can do a better job of responding to the utterance then
     * the child can. This is useful for handling things like "quit" or "what can I say?".  
     * @param action Methods to lookup dialog state data and control what happens as a result of the 
     * comparison. Dialogs should at least call action.next() to signal a non-match.
     * @param language The langauge of the utterance taken from IMessage.language.
     * @param utterance The users utterance taken from IMessage.text.
     * @param score The childs confidence level on a scale of 0 to 1.0 that it understood the users intent.
     */
    compareConfidence(action: ISessionAction, language: string, utterance: string, score: number): void;
}

/**
 * A collection of dialogs & middleware that's used for routing purposes. Bots typically derive from this class.
 */
export class DialogCollection {
    /**
     * Adds a set of dialogs to the collection.
     * @param dialogs Map of dialogs to add to the collection. The map should be keyed off the dialogs ID.
     */
    add(dialogs: { [id: string]: Dialog; }): DialogCollection;
    /**
     * Adds a simple dialog to the collection thats based on the passed in closure.
     * @param id Unique ID of the dialog.
     * @param fn Closure to base dialog on. The closure will be called anytime a message is recieved 
     * from the user or when the dialog is being resumed. You can check for args.resumed to tell that 
     * your being resumed.
     */
    add(id: string, fn: (session: Session, args?: any) => void): DialogCollection;
    /**
     * Adds a simple dialog to the collection thats based on the passed in waterfall. See DialogAction.waterfall()
     * for details.
     * @param id Unique ID of the dialog.
     * @param waterfall Waterfall of steps to execute.
     */
    add(id: string, waterfall: IDialogWaterfallStep[]): DialogCollection;
    /**
     * Adds a dialog to the collection.
     * @param id Unique ID of the dialog.
     * @param dialog Dialog to add.
     */
    add(id: string, dialog: Dialog): DialogCollection;

    /**
     * Returns a dialog given its ID.
     * @param id ID of the dialog to lookup. 
     */
    getDialog(id: string): Dialog;

    /**
     * Returns an array of middleware to invoke. 
     */
    getMiddleware(): { (session: Session, next: Function): void; }[];

    /**
     * Returns true if a dialog with a given ID exists within the collection.
     * @param id ID of the dialog to lookup. 
     */
    hasDialog(id: string): boolean;

    /**
     * Registers a piece of middleware that will be called for every message receieved.
     */
    use(middleware: (session: Session, next: Function) => void): void;
}

/** Dialog actions offer shortcuts to implementing common actions. */
export class DialogAction {
    /**
     * Returns a closure that will send a simple text message to the user. 
     * @param msg Text of the message to send.
     * @param args Optional arguments used to format the final output string. See https://github.com/alexei/sprintf.js for documentation. 
     */
    static send(msg: string, ...args: any[]): (session: Session) => void;

    /**
     * Returns a closure that will passes control of the conversation to a new dialog.  
     * @param id Unique ID of the dialog to start.
     * @param args Optional arguments to pass to the dialogs begin() method.
     */
    static beginDialog<T>(id: string, args?: T): (session: Session, args: T) => void; 

    /**
     * Returns a closure that will end the current dialog.
     * @param result Optional results to pass to the parent dialog.
     */
    static endDialog(result?: any): (session: Session) => void;

    /**
     * Returns a closure that will prompt the user for information in an async waterfall like 
     * sequence. When the closure is first invoked it will execute the first function in the
     * waterfall and the results of that prompt will be passed as input to the second function
     * and the result of the second passed to the third and so on.  
     *
     * Each step within the waterfall may optionally return a ResumeReson to influence the flow 
     * of the waterfall:
     * - ResumeReason.forward: skips the next function in the waterfall.
     * - ResumeReason.back: returns to the previous function in the waterfall.
     * - ResumeReason.canceled: ends the waterfall all together.
     * 
     * Calling other dialog like built-in prompts can influence the flow as well. If a child dialog
     * returns either ResumeReason.forward or ResumeReason.back it will automatically be handled.
     * If ResumeReason.canceled is returnd it will be handed to the step for processing which can
     * then decide to cancel the action or not.
     * @param steps Steps of a waterfall.
     */
    static waterfall(steps: IDialogWaterfallStep[]): (session: Session, args: any) => void;
}

/**
 * Built in built-in prompts that can be called from any dialog. 
 */
export class Prompts extends Dialog {
    /**
     * Processes messages received from the user. Called by the dialog system. 
     * @param session Session object for the current conversation.
     */
    replyReceived(session: Session): void;

    /**
     * Updates global options for the Prompts dialog. 
     * @param options Options to set.
     */
    static configure(options: IPromptsOptions): void;

    /**
     * Captures from the user a raw string of text. 
     * @param session Session object for the current conversation.
     * @param prompt Message to send to the user.
     */
    static text(session: Session, prompt: string): void;

    /**
     * Prompts the user to enter a number.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static number(session: Session, prompt: string, options?: IPromptOptions): void;

    /**
     * Prompts the user to confirm an action with a yes/no response.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static confirm(session: Session, prompt: string, options?: IPromptOptions): void;

    /**
     * Prompts the user to choose from a list of options.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param choices List of choices as a pipe ('|') delimted string.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static choice(session: Session, prompt: string, choices: string, options?: IPromptOptions): void;
    /**
     * Prompts the user to choose from a list of options.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param choices List of choices expressed as an Object map. The objects field names will be used to build the list of values.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static choice(session: Session, prompt: string, choices: Object, options?: IPromptOptions): void;
    /**
     * Prompts the user to choose from a list of options.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param choices List of choices as an array of strings.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static choice(session: Session, prompt: string, choices: string[], options?: IPromptOptions): void;

    /**
     * Prompts the user to enter a time.
     * @param session Session object for the current conversation.
     * @param prompt Initial message to send the user.
     * @param options Optional flags parameters to control the behaviour of the prompt.
     */
    static time(session: Session, prompt: string, options?: IPromptOptions): void;
}

/**
 * Implements a simple pattern based recognizer for parsing the built-in prompts. Derived classes can 
 * inherit from SimplePromptRecognizer and override the recognize() method to change the recognition
 * of one or more prompt types. 
 */
export class SimplePromptRecognizer implements IPromptRecognizer {
    /**
      * Attempts to match a users reponse to a given prompt.
      * @param args Arguments passed to the recognizer including that language, text, and prompt choices.
      * @param callback Function to invoke with the result of the recognition attempt.
      */
    recognize(args: IPromptRecognizerArgs, callback: (result: IPromptResult<any>) => void): void;
}

/**
 * Base class for an intent based dialog where the incoming message is sent to an intent recognizer
 * to first identify any intents & entities. The top intent will be used to lookup a handler that 
 * will be used process the recieved message.
*/
export abstract class IntentDialog extends Dialog {
    /**
     * Processes messages received from the user. Called by the dialog system. 
     * @param session Session object for the current conversation.
     */
    replyReceived(session: Session): void;

    /**
     * Adds a IntentGroup to the dialog. 
     * @param group Group to add to dialog.
     */
    addGroup(group: IntentGroup): IntentDialog;

    /**
     * The handler will be called anytime the dialog is started for a session. Call next() to continue default processing.
     * @param fn Handler to invoke when the dialog is started.
     */
    onBegin(fn: (session: Session, args: any, next: () => void) => void): IntentDialog;

    /**
     * Executes a block of code when the given intent is recognized. Use DialogAction.send() or
     * DialogEnd.endDialog() to implement common actions.
     * @param intent Intent to trigger on.
     * @param fn Handler to invoke when the intent is triggered. The handler will be passed any 
     * recognized intents & entities via the args. The handler will also be invoked when a dialog
     * started by the handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    on(intent: string, fn: (session: Session, args?: IIntentArgs) => void): IntentDialog;
    /**
     * Executes a waterfall of steps when an intent is triggered. See DialogAction.waterfall() for
     * details.
     * @param intent Intent to trigger on.
     * @param waterfall Waterfall steps to execute.
     */
    on(intent: string, waterfall: IDialogWaterfallStep[]): IntentDialog;
   /**
     * Begins a dialog anytime the intent is triggered. 
     * @param intent Intent to trigger on.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the IIntentArgs 
     * generated by the dialog.
     */
    on(intent: string, dialogId: string, dialogArgs?: any): IntentDialog;

    /**
     * Executes a block of code when an unknown intent is recognized. Use DialogAction.send() or
     * DialogAction.endDialog() to implement common actions.
     * @param fn Handler to invoke when the intent is triggered. The handler will be passed any 
     * recognized intents & entities via the args. The handler will also be invoked when a dialog
     * started by the handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    onDefault(fn: (session: Session, args?: IIntentArgs) => void): IntentDialog;
    /**
     * Executes a waterfall of steps when an unknown intent is recognized. See DialogAction.waterfall() 
     * for details.
     * @param waterfall Waterfall steps to execute.
     */
    onDefault(waterfall: IDialogWaterfallStep[]): IntentDialog;
    /**
     * Begins a dialog when an unknown intent is recognized.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the IIntentArgs 
     * generated by the dialog.
     */
    onDefault(dialogId: string, dialogArgs?: any): IntentDialog;

    /** Returns the minimum score needed for an intent to be triggered. */
    getThreshold(): number;

    /**
     * Sets the minimum score needed for an intent to be triggered. The default value is 0.1.
     * @param score Minimum score needed to trigger an intent.
     */
    setThreshold(score: number): IntentDialog;

    /**
     * Called to recognize the intents & entities for a received message.
     *
     * Derived classes should implement this method with the logic needed to perform the actual intent recognition.
     * @param session Session object for the current conversation.
     * @param callback Callback to invoke with the results of the intent recognition step.
     */
    protected abstract recognizeIntents(session: Session, callback: (err: Error, intents?: IIntent[], entities?: IEntity[]) => void): void;
}

/**
 * Defines a related group of intent handlers. Primarily useful for dialogs with a large number of 
 * intents or for team development where you want seperate developers to more easily work on the same bot. 
 */
export class IntentGroup {
    /**
     * Creates a new IntentGroup. The group needs to be labled with a unique ID for
     * routing purposes.
     * @param id Unique ID of the intent group.
     */
    constructor(id: string);

    /**
     * Returns the groups ID.
     */
    getId(): string;

    /**
     * Executes a block of code when the given intent is recognized. Use DialogAction.send() or
     * DialogAction.endDialog() to implement common actions.
     * @param intent Intent to trigger on.
     * @param fn Handler to invoke when the intent is triggered. The handler will be passed any 
     * recognized intents & entities via the args. The handler will also be invoked when a dialog
     * started by the handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    on(intent: string, fn: (session: Session, args?: IIntentArgs) => void): IntentDialog;
    /**
     * Executes a waterfall of steps when an intent is triggered. See DialogAction.waterfall() for
     * details.
     * @param intent Intent to trigger on.
     * @param waterfall Waterfall steps to execute.
     */
    on(intent: string, waterfall: IDialogWaterfallStep[]): IntentDialog;
    /**
     * Begins a dialog anytime the intent is triggered. 
     * @param intent Intent to trigger on.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the IIntentArgs 
     * generated by the dialog.
     */
    on(intent: string, dialogId: string, dialogArgs?: any): IntentDialog;
}

/**
 * Routes incoming messages to a Luis app hosted on http://luis.ai for intent recognition.
 * Once a messages intent has been recognized it will rerouted to a registered intent handler, along
 * with any entities, for further processing. 
 */
export class LuisDialog extends IntentDialog {
    /**
     * Creates a new instance of a LUIS dialog.
     * @param serviceUri URI for LUIS App hosted on http://luis.ai.
     */
    constructor(serviceUri: string);

    /**
     * Performs the step of recognizing intents & entities when a message is recieved vy the dialog. Called by IntentDialog.
     * @param session Session object for the current conversation.
     * @param callback Callback to invoke with the results of the intent recognition step.
     */
    protected recognizeIntents(session: Session, callback: (err: Error, intents?: IIntent[], entities?: IEntity[]) => void): void;
}

/**
 * Utility class used to parse & resolve common entities like datetimes received from LUIS.
 */
export class EntityRecognizer {
    /**
     * Searches for the first occurance of an specific entity type within a set.
     * @param entities Set of entities to search over.
     * @param type Type of entity to find.
     */
    static findEntity(entities: IEntity[], type: string): IEntity;
    
    /**
     * Finds all occurences of a specific entity type within a set.
     * @param entities Set of entities to search over.
     * @param type Type of entity to find.
     */
    static findAllEntities(entities: IEntity[], type: string): IEntity[];

    /**
     * Parses and resolves a time from a user utterance.
     * @param utterance Text utterance to parse. 
     * @returns A valid Date object if the user spoke a time otherwise null.
     */   
    static parseTime(utterance: string): Date;

    /**
     * Resolves a time from a set of entities.
     * @param entities Array of entities.
     * @returns A valid Date object if datetime entities were found otherwise null.
     */
    static parseTime(entities: IEntity[]): Date;

    /**
     * Calculates a Date from a set of datetime entities.
     * @param entities List of entities to extract date from.
     * @returns The successfully calculated Date or null if a date couldn't be determined. 
     */
    static resolveTime(entities: IEntity[]): Date;

    /**
     * Recognizes a time from a users uetterance.
     * @param utterance Text utterance to parse.
     * @param refDate Optional reference date user to calculate the finale date.
     * @returns An entity containing the resolved date if successfull or null if a date couldn't be determined. 
     */
    static recognizeTime(utterance: string, refDate?: Date): IEntity;

    /**
     * Parses a number from a users utterance.
     * @param utterance Text utterance to parse.
     * @returns A valid number otherwise undefined. 
     */
    static parseNumber(utterance: string): number;

    /**
     * Resolves a number from a set of entities.
     * @param entities List of entities to extract number from.
     * @returns A valid number otherwise undefined. 
     */
    static parseNumber(entities: IEntity[]): number;

    /**
     * Parses a boolean from a users utterance.
     * @param utterance Text utterance to parse.
     * @returns A valid boolean otherwise undefined. 
     */
    static parseBoolean(utterance: string): boolean;
    
    /**
     * Finds the best match for a users utterance in a list of values.
     * @param choices Pipe ('|') delimited list of values to compare against the users utterance. 
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findBestMatch(choices: string, utterance: string, threshold?: number): IFindMatchResult;
    /**
     * Finds the best match for a users utterance in a list of values.
     * @param choices Object used to generate the list of choices. The objects field names will be used to 
     * build the list of choices.
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findBestMatch(choices: Object, utterance: string, threshold?: number): IFindMatchResult;
    /**
     * Finds the best match for a users utterance in a list of values.
     * @param choices Array of strings to compare against the users utterance.
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findBestMatch(choices: string[], utterance: string, threshold?: number): IFindMatchResult;

    /**
     * Finds all possible matches for a users utterance in a list of values.
     * @param choices Pipe ('|') delimited list of values to compare against the users utterance. 
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findAllMatches(choices: string, utterance: string, threshold?: number): IFindMatchResult[];
    /**
     * Finds all possible matches for a users utterance in a list of values.
     * @param choices Object used to generate the list of choices. The objects field names will be used to 
     * build the list of choices.
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findAllMatches(choices: Object, utterance: string, threshold?: number): IFindMatchResult[];
    /**
     * Finds all possible matches for a users utterance in a list of values.
     * @param choices Array of strings to compare against the users utterance.
     * @param utterance Text utterance to parse.
     * @param threshold Optional minimum score needed for a match to be considered. The default value is 0.6.
     */
    static findAllMatches(choices: string[], utterance: string, threshold?: number): IFindMatchResult[];

    /**
     * Returns an array of choices give a pipe delimted string.
     * @param choices Pipe ('|') delimited list of values to compare against the users utterance. 
     */
    static expandChoices(choices: string): string[];
    /**
     * Returns an array of choices given an Object.
     * @param choices Object used to generate the list of choices. The objects field names will be used to 
     * build the list of choices.
     */
    static expandChoices(choices: Object): string[];
    /**
     * Returns an array of choices.
     * @param choices Array of strings. This array will just be echoed back.
     */
    static expandChoices(choices: string[]): string[];
}

/**
 * Enables the building of a /command style bots. Regular expressions are matched against a users
 * responses and used to trigger handlers when matched.
 */
export class CommandDialog extends Dialog {
    /**
     * Processes messages received from the user. Called by the dialog system. 
     * @param session Session object for the current conversation.
     */
    replyReceived(session: Session): void;

    /**
     * The handler will be called anytime the dialog is started for a session. Call next() to continue default processing.
     * @param fn Handler to invoke when the dialog is started.
     */
    onBegin(fn: (session: Session, args: any, next: () => void) => void): CommandDialog;

    /**
     * Triggers the handler when the pattern is matched. Use DialogAction.send() or
     * DialogAction.endDialog() to implement common actions.
     * @param pattern A regular expression to match against.
     * @param fn Handler to invoke when the pattern is matched. The handler will be passed the expression
     * that was matched via the args. The handler will also be invoked when a dialog started by the 
     * handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    matches(pattern: string, fn: (session: Session, args?: ICommandArgs) => void): CommandDialog;
    /**
     * Triggers the handler when the pattern is matched. Use DialogAction.send() or
     * DialogAction.endDialog() to implement common actions.
     * @param patterns Array of regular expressions to match against.
     * @param fn Handler to invoke when the pattern is matched. The handler will be passed the expression
     * that was matched via the args. The handler will also be invoked when a dialog started by the 
     * handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    matches(patterns: string[], fn: (session: Session, args?: ICommandArgs) => void): CommandDialog;
    /**
     * Executes a waterfall of steps when the pattern is matched. See DialogAction.waterfall() for
     * details.
     * @param patterns Array of regular expressions to match against.
     * @param waterfall Waterfall steps to execute.
     */
    matches(pattern: string, waterfall: IDialogWaterfallStep[]): IntentDialog;
    /**
     * Executes a waterfall of steps when the pattern is matched. See DialogAction.waterfall() for
     * details.
     * @param patterns A regular expression to match against.
     * @param waterfall Waterfall steps to execute.
     */
    matches(patterns: string[], waterfall: IDialogWaterfallStep[]): IntentDialog;
    /**
     * Begins a dialog when the pattern is matched.
     * @param pattern A regular expression to match against.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the ICommandArgs 
     * generated by the dialog.
     */
    matches(pattern: string, dialogId: string, dialogArgs?: any): CommandDialog;
    /**
     * Begins a dialog when one of the specified patterns is matched.
     * @param patterns Array of regular expressions to match against.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the ICommandArgs 
     * generated by the dialog.
     */
    matches(patterns: string[], dialogId: string, dialogArgs?: any): CommandDialog;

    /**
     * Executes a block of code when an unknown pattern is received.
     * @param fn Handler to invoke when the pattern is matched. The handler will be passed the expression
     * that was matched via the args. The handler will also be invoked when a dialog started by the 
     * handler returns. Check for args.resumed to detect that you're being resumed. 
     */
    onDefault(fn: (session: Session, args?: ICommandArgs) => void): CommandDialog;
    /**
     * Executes a waterfall of steps when an unknown pattern is received. See DialogAction.waterfall() 
     * for details.
     * @param waterfall Waterfall steps to execute.
     */
    onDefault(waterfall: IDialogWaterfallStep[]): IntentDialog;
    /**
     * Begins a dialog when an unknown pattern is received.
     * @param dialogId ID of the dialog to begin.
     * @param dialogArgs Optional args to pass to the dialog. These will be merged with the ICommandArgs 
     * generated by the dialog.
     */
    onDefault(dialogId: string, dialogArgs?: any): CommandDialog;
}

/** Default in memory storage implementation for storing user & session state data. */
export class MemoryStorage implements IStorage {
    /**
      * Loads a value from storage.
      * @param id ID of the value being loaded.
      * @param callaback Function used to receive the loaded value.
      */
    get(id: string, callback: (err: Error, data: any) => void): void;

    /**
      * Saves a value to storage.
      * @param id ID of the value to save.
      * @param data Value to save.
      * @param callback Optional function to invoke with the success or failure of the save.
      */
    save(id: string, data: any, callback?: (err: Error) => void): void;

    /**
     * Deletes a value from storage.
     * @param id ID of the value to delete.
     */
    delete(id: string): void;
}

/**
 * Connects your bots dialogs to the Bot Framework.
 */
export class BotConnectorBot extends DialogCollection {
    /**
     * @param options Optional configuration settings for the bot.
     */
    constructor(options?: IBotConnectorOptions);

    /**
     * Registers an event listener to get notified of bot related events. 
     * The message to passed to events will be of type IBotConnectorMessage. Events:
     * - error: An error occured. [IBotErrorEvent]
     * - reply: A reply to an existing message was sent. [IBotMessageEvent]
     * - send: A new message was sent to start a new conversation. [IBotMessageEvent]
     * - quit: The bot has elected to ended the current conversation. [IBotMessageEvent]
     * - Message: A user message was received. [IBotMessageEvent]
     * - DeleteUserData: The user has requested to have their data deleted. [IBotMessageEvent]
     * - BotAddedToConversation: The bot has been added to a conversation. [IBotMessageEvent]
     * - BotRemovedFromConversation: The bot has been removed from a conversation. [IBotMessageEvent]
     * - UserAddedToConversation: A user has joined a conversation monitored by the bot. [IBotMessageEvent]
     * - UserRemovedFromConversation: A user has left a conversation monitored by the bot. [IBotMessageEvent]
     * - EndOfConversation: The user has elected to end the current conversation. [IBotMessageEvent]
     * @param event Name of event to listen for.
     * @param listener Function to invoke.
     */
    on(event: string, listener: Function): void;

    /**
     * Updates the bots configuration settings.
     * @param options Configuration options to set.
     */
    configure(options: IBotConnectorOptions): void;

    /**
     * Returns a piece of Express or Restify compliant middleware that will ensure only messages from the Bot Framework are processed.
     * NOTE: Also requires configuring of the bots appId and appSecret.
     * @param options Optional configuration options to pass in.
     * @example
     * <pre><code>
     * var bot = new builder.BotConnectorBot();
     * app.use(bot.verifyBotFramework({ appId: 'your appId', appSecret: 'your appSecret' }));
     * </code></pre>
     */
    verifyBotFramework(options?: IBotConnectorOptions): (req, res, next) => void;

    /**
     * Returns a piece of Express or Restify compliant middleware that will route incoming messages to the bot. 
     * NOTE: The middleware should be mounted to route that receives an HTTPS POST.
     * @param options Optional configuration options to pass in.
     * @example
     * <pre><code>
     * var bot = new builder.BotConnectorBot();
     * app.post('/v1/messages', bot.listen());
     * </code></pre>
     */
    listen(options?: IBotConnectorOptions): (req, res) => void;

    /**
     * Starts a new conversation with a user.
     * @param address Address of the user to begin the conversation with.
     * @param dialogId Unique ID of the bots dialog to begin the conversation with.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    beginDialog(address: IBeginDialogAddress, dialogId: string, dialogArgs?: any): void;
}

/**
 * Adds additional properties for working with Bot Framework bots.
 */
export class BotConnectorSession extends Session {
    /** Group data that's persisted across all members of a conversation. */
    conversationData: any;

    /** User data that's persisted on a per conversation basis. */
    perUserConversationData: any;
}

/**
 * Connects your bots dialogs to Skype.
 */
export class SkypeBot extends DialogCollection {
    /**
     * @param botService Skype BotService() instance.
     * @param options Optional configuration settings for the bot.
     */
    constructor(botService: any, options?: ISkypeBotOptions);

    /**
     * Registers an event listener to get notified of bot related events. 
     * The message to passed to events will be a skype message. Events:
     * - error: An error occured. [IBotErrorEvent]
     * - reply: A reply to an existing message was sent. [IBotMessageEvent]
     * - send: A new message was sent to start a new conversation. [IBotMessageEvent]
     * - quit: The bot has elected to ended the current conversation. [IBotMessageEvent]
     * - message: This event is emitted for every received message. [IBotMessageEvent]
     * - personalMessage: This event is emitted for every 1:1 chat message. [IBotMessageEvent]
     * - groupMessage: This event is emitted for every group chat message. [IBotMessageEvent]
     * - threadBotAdded: This event is emitted when the bot is added to group chat. [IBotMessageEvent]
     * - threadAddMember: This event is emitted when some users are added to group chat. [IBotMessageEvent]
     * - threadBotRemoved: This event is emitted when the bot is removed from group chat. [IBotMessageEvent]
     * - threadRemoveMember: This event is emitted when some users are removed from group chat. [IBotMessageEvent]
     * - contactAdded: This event is emitted when users add the bot as a buddy. [IBotMessageEvent]
     * - threadTopicUpdated: This event is emitted when the topic of a group chat is updated. [IBotMessageEvent]
     * - threadHistoryDisclosedUpdate: This event is emitted when the "history disclosed" option of a group chat is changed. [IBotMessageEvent]
     * @param event Name of event to listen for.
     * @param listener Function to invoke.
     */
    on(event: string, listener: Function): void;

    /**
     * Updates the bots configuration settings.
     * @param options Configuration options to set.
     */
    configure(options: ISkypeBotOptions): SkypeBot;
    
    /**
     * Starts a new conversation with a user.
     * @param address Address of the user to begin the conversation with.
     * @param dialogId Unique ID of the bots dialog to begin the conversation with.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    beginDialog(address: IBeginDialogAddress, dialogId: string, dialogArgs?: any): SkypeBot;
}

/**
 * Adds additional properties and methods for working with Skype bots.
 */
export class SkypeSession extends Session {
    /**
     * Escapes &, <, and > characters in a text string. These characters are reserved in Slack for 
     * control codes so should always be escaped when returning user generated text.
     */
    escapeText(text: string): string;
    
    /**
     * Unescapes &amp;, &lt;, and &gt; characters in a text string. This restores a previously
     * escaped string.
     */
    unescapeText(text: string): string;
}

/**
 * Connects your bots dialogs to Slack via BotKit. See http://howdy.ai/botkit/ for details.
 */
export class SlackBot extends DialogCollection {
    /**
     * Creates a new instance of the Slack bot using BotKit. 
     * @param controller Controller created from a call to Botkit.slackbot().
     * @param bot The bot created from a call to controller.spawn(). 
     * @param options Optional configuration settings for the bot.
     */
    constructor(controller: any, bot: any, options?: ISlackBotOptions);

    /**
     * Registers an event listener to get notified of bot related events. 
     * The message to passed to events will a slack message. Events:
     * - error: An error occured. [IBotErrorEvent]
     * - reply: A reply to an existing message was sent. [IBotMessageEvent]
     * - send: A new message was sent to start a new conversation. [IBotMessageEvent]
     * - quit: The bot has elected to ended the current conversation. [IBotMessageEvent]
     * - message_received: The bot received a message. [IBotMessageEvent]
     * - bot_channel_join: The bot has joined a channel. [IBotMessageEvent]
     * - user_channel_join: A user has joined a channel. [IBotMessageEvent]
     * - bot_group_join: The bot has joined a group. [IBotMessageEvent]
     * - user_group_join: A user has joined a group. [IBotMessageEvent]
     * @param event Name of event to listen for.
     * @param listener Function to invoke.
     */
    on(event: string, listener: Function): void;

    /**
     * Updates the bots configuration settings.
     * @param options Configuration options to set.
     */
    configure(options: ISlackBotOptions): void;

    /**
     * Begins listening for incoming messages of the specified types. Types:
     * - ambient: Ambient messages are messages that the bot can hear in a channel, but that do not mention the bot in any way.
     * - direct_mention: Direct mentions are messages that begin with the bot's name, as in "@bot hello".
     * - mention: Mentions are messages that contain the bot's name, but not at the beginning, as in "hello @bot". 
     * - direct_message: Direct messages are sent via private 1:1 direct message channels. 
     * @param types The type of events to listen for,
     * @param dialogId Optional ID of the bots dialog to begin for new conversations.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    listen(types: string[], dialogId?: string, dialogArgs?: any): SlackBot;

    /**
     * Begins listening for messages sent to the bot. The bot will recieve direct messages, 
     * direct mentions, and mentions. One the bot has been mentioned it will continue to receive
     * ambient messages from the user that mentioned them for a short period of time. This time
     * can be configured using ISlackBotOptions.ambientMentionDuration.
     * @param dialogId Optional ID of the bots dialog to begin for new conversations.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    listenForMentions(dialogId?: string, dialogArgs?: any): SlackBot;

    /**
     * Starts a new conversation with a user.
     * @param address Address of the user to begin the conversation with.
     * @param dialogId Unique ID of the bots dialog to begin the conversation with.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    beginDialog(address: IBeginDialogAddress, dialogId: string, dialogArgs?: any): void;
}

/**
 * Adds additional properties and methods for working with Slack bots.
 */
export class SlackSession extends Session {
    /** Data that's persisted on a per team basis. */
    teamData: any;

    /** Data that's persisted on a per channel basis. */
    channelData: any;
    
    /**
     * Escapes &, <, and > characters in a text string. These characters are reserved in Slack for 
     * control codes so should always be escaped when returning user generated text.
     */
    escapeText(text: string): string;
    
    /**
     * Unescapes &amp;, &lt;, and &gt; characters in a text string. This restores a previously
     * escaped string.
     */
    unescapeText(text: string): string;
}

/**
 * Generic TextBot which lets you drive your bots dialogs from either the console or
 * pratically any other bot platform.
 *
 * There are primarily 2 ways of using the TextBot either purely event driven (preferred) or in
 * mixed mode where you pass a callback to the TextBot.processMessage() method and also listen
 * for events. In this second mode the first reply or error will be returned via the callback and
 * any additonal replies will be delivered as events. Should you decide to ignore the events just
 * be aware that any additional replies from the bot will be lost. 
 */
export class TextBot extends DialogCollection {
    /**
     * @param options Optional configuration settings for the bot.
     */
    constructor(options?: ITextBotOptions);

    /**
     * Registers an event listener to get notified of bot related events. 
     * The message to passed to events will be an IMessage. Events:
     * - error: An error occured. [IBotErrorEvent]
     * - reply: A reply to an existing message was sent. [IBotMessageEvent]
     * - send: A new message was sent to start a new conversation. [IBotMessageEvent]
     * - quit: The bot has elected to ended the current conversation. [IBotMessageEvent]
     * - message: This event is emitted for every received message. [IBotMessageEvent]
     * @param event Name of event to listen for.
     * @param listener Function to invoke.
     */
    on(event: string, listener: Function): void;

    /**
     * Updates the bots configuration settings.
     * @param options Configuration options to set.
     */
    configure(options: ITextBotOptions): void;

    /**
     * Starts a new conversation with a user.
     * @param address Address of the user to begin the conversation with.
     * @param dialogId Unique ID of the bots dialog to begin the conversation with.
     * @param dialogArgs Optional arguments to pass to the dialog.
     */
    beginDialog(address: IBeginDialogAddress, dialogId: string, dialogArgs?: any): void;

    /**
     * Processes a message received from the user.
     * @param message Message to process.
     * @param callback Optional callback used to return bots initial reply or an error. If ommited all 
     * replies and errors will be returned as events.
     */
    processMessage(message: IMessage, callback?: (err: Error, reply: IMessage) => void): void;

    /**
     * Begins monitoring console input from stdin. The bot can quit using a call to endDialog() to exit the
     * app.
     */
    listenStdin(): void;
}
