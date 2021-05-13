require("ts-node");

const { initializeSetup } = require("./setup");

module.exports = async function () {
  await initializeSetup();
  return null;
};
