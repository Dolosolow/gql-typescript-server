require("ts-node");

const { closeSetup } = require("./setup");

module.exports = async function () {
  await closeSetup();
  return null;
};
