module.exports = async client => {
  // Log that the bot is online.
  client.logger.log(`${client.user.username}#${client.user.discriminator}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, "ready");

  // Make the bot "play the game" which is the help command with default prefix.
  client.editStatus("online", {name: `${client.config.defaultSettings.prefix}help`, type: 0});
};
