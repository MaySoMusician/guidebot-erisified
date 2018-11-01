module.exports = async (client, error, id) => {
  client.logger.log(`An error event was sent by Eris, from Shard ${id}: \n${JSON.stringify(error)}`, "error");
};
