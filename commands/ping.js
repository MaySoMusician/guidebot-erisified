exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.createMessage("Ping?");
  msg.edit(`Pong! Latency is ${msg.timestamp - message.timestamp}ms.`);
  if (message.channel.guild) {
    const currentShard = client.shards.get(client.guildShardMap[message.channel.guild.id]);
    msg.edit(`Pong! Latency is ${msg.timestamp - message.timestamp}ms. API Latency is ${Math.round(currentShard.latency)}ms`);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "ping",
  category: "Miscelaneous",
  description: "It like... Pings. Then Pongs. And it's not Ping Pong.",
  usage: "ping"
};
