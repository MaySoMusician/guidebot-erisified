// This event executes when a new guild (server) is joined.

module.exports = async (client, guild) => {
  guild.fetchAllMembers();
  await client.wait(2000);
  const owner = guild.members.get(guild.ownerID);
  client.logger.cmd(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${owner.username}#${owner.discriminator} (${guild.ownerID})`);
};
