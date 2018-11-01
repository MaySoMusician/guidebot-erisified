module.exports = (client) => {

  /*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
  client.permlevel = message => {
    let permlvl = 0;

    const permOrder = client.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.channel.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
  };

  /*
  GUILD SETTINGS FUNCTION

  This function merges the default settings (from config.defaultSettings) with any
  guild override you might have for particular guild. If no overrides are present,
  the default settings are used.

  */
  client.getSettings = (guild) => {
    const defaults = client.config.defaultSettings || {};
    if (!guild) return defaults;
    const guildData = client.settings.get(guild) || {};
    const returnObject = {};
    Object.keys(defaults).forEach((key) => {
      returnObject[key] = guildData[key] ? guildData[key] : defaults[key];
    });
    return returnObject;
  };

  /*
  SINGLE-LINE AWAITMESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await client.awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

  */
  /* Commented out because there are no function in Eris corresponding to 'awaitMessages' in Discord.js
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };*/


  /*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
  */
  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise")
      text = await text;
    if (typeof evaled !== "string")
      text = require("util").inspect(text, {depth: 1});

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");

    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      client.logger.log(`Loading Command: ${commandName}`);
      const props = require(`../commands/${commandName}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        client.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
  
    if (command.shutdown) {
      await command.shutdown(client);
    }
    const mod = require.cache[require.resolve(`../commands/${commandName}`)];
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    for (let i = 0; i < mod.parent.children.length; i++) {
      if (mod.parent.children[i] === mod) {
        mod.parent.children.splice(i, 1);
        break;
      }
    }
    return false;
  };

  /*
  VERY-LONG-MESSAGE SENDING UTILITIES

  These functions are for sending certainly long messages, for example which exceed
  Discord's message length limit. They are really useful for sending list of something,
  or showing some error messages, but Eris doesn't implement them, while Discord.js does.
  But you don't need to feel sadnees any more; HERE THEY ARE!
  */

  // Splits a string into multiple chunks at a designated character that do not exceed a specific length.
  // text (Type: string): Content to split
  // maxLength=1950 (Type: number): Maximum character length per message piece
  // char="\n" (Type: string): Character to split the message with
  // prepend="" (Type: string): Text to prepend to every piece except the first
  // append="" (Type: string): Text to prepend to every piece except the last
  client.splitMessage = (text, {maxLength = 1950, char = "\n", prepend = "", append = ""} = {}) => {
    if (text.length <= maxLength) return text;
    const splitText = text.split(char);

    if (splitText.length === 1) throw new Error("Message esceeds the max length and contains no split characters.");

    const messages = [""];
    let msg = 0;
    for (let i = 0; i < splitText.length; i++) {
      if (messages[msg].length + splitText[i].length + 1 > maxLength) {
        messages[msg] += append;
        messages.push(prepend);
        msg++;
      }
      messages[msg] += (messages[msg].length > 0 && messages[msg] !== prepend ? char : "") + splitText[i];
    }
    return messages;
  };

  // Escapes any Discord-flavour markdown in a string.
  // text (Type: string): Content to escape
  // onlyCodeBlock=false (Type: boolean): Whether to only escape codeblocks (takes priority)
  // onlyInlineCode=false (Type: boolean): Whether to only escape inline code
  client.escapeMarkdown = (text, onlyCodeBlock = false, onlyInlineCode = false) => {
    if (onlyCodeBlock) return text.replace(/```/g, "`\u200b``");
    if (onlyInlineCode) return text.replace(/\\(`|\\)/g, "$1").replace(/(`|\\)/g, "\\$1");
    return text.replace(/\\(\*|_|`|~|\\)/g, "$1").replace(/(\*|_|`|~|\\)/g, "\\$1");
  };

  client.createMessageExtended = (channelID, content, file, {split, code} = {}) => {
    return new Promise((resolve) => {
      if (content) {
        if (split && typeof split !== "object") split = {};
  
        // Resolves a StringResolvable to a string.
        const resolveString = data => {
          if (typeof data === "string") return data;
          if (data instanceof Array) return data.join("\n");
          return String(data);
        };
  
        // Wrap everything in a code block
        if (typeof code !== "undefined" && (typeof code !== "boolean" || code === true)) {
          content = client.escapeMarkdown(resolveString(content), true);
          content = `\`\`\`${typeof code !== "boolean" ? code || "" : ""}\n${content}\n\`\`\``;
          if (split) {
            split.prepend = `\`\`\`${typeof code !== "boolean" ? code || "" : ""}\n`;
            split.append = "\n```";
          }
        }
  
        // Split the content
        if (split) content = client.splitMessage(content, split);
      }
      resolve({
        channelID: channelID,
        content: content,
        file: file
      });
    }).then(args => {
      const { channelID, content, file} = args;
      if (content instanceof Array) {
        for (let i = 0; i < content.length; i++) {
          if (i === content.length - 1) return client.createMessage(channelID, content[i], file);
          else client.createMessage(channelID, content[i]);
        }
      } else {
        return client.createMessage(channelID, content, file);
      }
    });
  };

  /*
  SINGLE-LINE REPLY

  A simple way to reply a user's message.
  */
  
  client.replyMessage = (message, text) => {
    return message.channel.createMessage(`<@${message.author.id}>, ${text}`);
  };

  /* MISCELANEOUS NON-CRITICAL FUNCTIONS */
  
  // EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
  // later, this conflicts with native code. Also, if some other lib you use does
  // this, a conflict also occurs. KNOWING THIS however, the following 2 methods
  // are, we feel, very useful in code. 
  
  // <String>.toPropercase() returns a proper-cased string such as: 
  // "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });

  // <Array>.random() returns a single random element from an array
  // [1, 2, 3, 4, 5].random() can return 1, 2, 3, 4 or 5.
  Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });

  // `await client.wait(1000);` to "pause" for 1 second.
  client.wait = require("util").promisify(setTimeout);

  // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    client.logger.error(`Uncaught Exception: ${errorMsg}`);
    // Always best practice to let the code crash on uncaught exceptions. 
    // Because you should be catching them anyway.
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    client.logger.error(`Unhandled rejection: ${err}`);
  });
};
