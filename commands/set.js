// This command is to modify/edit guild configuration. Perm Level 3 for admins
// and owners only. Used for changing prefixes and role names and such.

// Note that there's no "checks" in this basic version - no config "types" like
// Role, String, Int, etc... It's basic, to be extended with your deft hands!

// Note the **destructuring** here. instead of `args` we have :
// [action, key, ...value]
// This gives us the equivalent of either:
// const action = args[0]; const key = args[1]; const value = args.slice(2);
// OR the same as:
// const [action, key, ...value] = args;
exports.run = async (client, message, [action, key, ...value], level) => { // eslint-disable-line no-unused-vars

  // Retrieve current guild settings (merged) and overrides only.
  const settings = message.settings;
  const defaults = client.config.defaultSettings;
  const overrides = client.settings.get(message.channel.guild.id);
  if (!client.settings.has(message.channel.guild.id)) client.settings.set(message.channel.guild.id, {});
  
  // Edit an existing key value
  if (action === "edit") {
    // User must specify a key.
    if (!key) return client.replyMessage(message, "Please specify a key to edit");
    // User must specify a key that actually exists!
    if (!defaults[key]) return client.replyMessage(message, "This key does not exist in the settings");
    const joinedValue = value.join(" ");
    // User must specify a value to change.
    if (joinedValue.length < 1) return client.replyMessage(message, "Please specify a new value");
    // User must specify a different value than the current one.
    if (joinedValue === settings[key]) return client.replyMessage(message, "This setting already has that value!");
    
    // If the guild does not have any overrides, initialize it.
    if (!client.settings.has(message.channel.guild.id)) client.settings.set(message.channel.guild.id, {});

    // Modify the guild overrides directly.
    client.settings.set(message.channel.guild.id, joinedValue, key);

    // Confirm everything is fine!
    client.replyMessage(message, `${key} successfully edited to ${joinedValue}`);
  } else
  
  // Resets a key to the default value
  if (action === "del" || action === "reset") {
    if (!key) return client.replyMessage(message, "Please specify a key to reset.");
    if (!defaults[key]) return client.replyMessage(message, "This key does not exist in the settings");
    if (!overrides[key]) return client.replyMessage(message, "This key does not have an override and is already using defaults.");
    
    // Good demonstration of the custom awaitReply method in `./modules/functions.js` !
    // HOWEVER, we haven't get that one yet for some reasons.
    // So the setting will be deleted without ANY warnings
    client.replyMessage(message, `By right, you'll be asked if you surely want to reset ${key} to the default value, with a wonderful custom *reply* function. HOWEVER we haven't get that yet for some reasons. In short, the setting will be reset without ANY warning.\nBut don't worry. We've kept a backup here: **${settings[key]}**`);
    client.settings.delete(message.channel.guild.id, key);
    client.replyMessage(message, `${key} was successfully reset to default.`);

    /*const response = await client.awaitReply(message, `Are you sure you want to reset ${key} to the default value?`);

    // If they respond with y or yes, continue.
    if (["y", "yes"].includes(response.toLowerCase())) {
      // We delete the `key` here.
      client.settings.delete(message.channel.guild.id, key);
      client.replyMessage(message, `${key} was successfully reset to default.`);
    } else
    // If they respond with n or no, we inform them that the action has been cancelled.
    if (["n","no","cancel"].includes(response)) {
      client.replyMessage(message, `Your setting for \`${key}\` remains at \`${settings[key]}\``);
    }*/
  } else
  
  if (action === "get") {
    if (!key) return client.replyMessage(message, "Please specify a key to view");
    if (!defaults[key]) return client.replyMessage(message, "This key does not exist in the settings");
    const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
    client.replyMessage(message, `The value of ${key} is currently ${settings[key]}${isDefault}`);
  } else {
    // Otherwise, the default action is to return the whole configuration;
    const array = [];
    Object.entries(settings).forEach(([key, value]) => {
      array.push(`${key}${" ".repeat(20 - key.length)}::  ${value}`); 
    });
    await client.createMessageExtended(message.channel.id, `= Current Guild Settings =\n${array.join("\n")}`, null, {code: "asciidoc"});
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["setting", "settings", "conf"],
  permLevel: "Administrator"
};

exports.help = {
  name: "set",
  category: "System",
  description: "View or change settings for your server.",
  usage: "set <view/get/edit> <key> <value>"
};
