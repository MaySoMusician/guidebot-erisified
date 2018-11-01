exports.run = async (client, message, args, level) => {// eslint-disable-line no-unused-vars
  if (!args || args.length < 1) return client.replyMessage(message, "Must provide a command to reload. Derp.");

  let response = await client.unloadCommand(args[0]);
  if (response) return client.replyMessage(message, `Error Unloading: ${response}`);

  response = client.loadCommand(args[0]);
  if (response) return client.replyMessage(message, `Error Loading: ${response}`);

  client.replyMessage(message, `The command \`${args[0]}\` has been reloaded`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "reload",
  category: "System",
  description: "Reloads a command that\"s been modified.",
  usage: "reload [command]"
};
