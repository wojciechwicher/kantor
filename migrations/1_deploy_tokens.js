var WWTokenA = artifacts.require("WWTokenA");
var WWTokenB = artifacts.require("WWTokenB");
var Kantor = artifacts.require("Kantor");

module.exports = async function(deployer) {

    await deployer.deploy(WWTokenA);
    await deployer.deploy(WWTokenB);

    const instance1 = await WWTokenA.deployed();
    const instance2 = await WWTokenB.deployed();

    await deployer.deploy(Kantor, instance1.address, instance2.address, 7);
  }