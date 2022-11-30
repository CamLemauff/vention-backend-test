const { find, getPowerLevel, getQtyMaxBuild } = require('../models/weapon');

const WeaponsService = () => {
  // Call the function to get a weapon by id
  const getWeapons = async (id) => {
    return find(id);
  };

  // Call the function to print the power level of a specific weapon
  const printPowerLevel = async (id) => {
    if(!id || id === null) {
      throw new Error("Id missing to print the power level");
    }
    return getPowerLevel(id);
  };

  // Call the function to print the maximum buidlable quantity of a specific weapon
  const printMaxQuantityBuildable = async (id) => {
    if(!id || id === null) {
      throw new Error("Id missing to print the maximum quantity buildable");
    }
    return getQtyMaxBuild(id);
  };

  return {
    getWeapons,
    printPowerLevel,
    printMaxQuantityBuildable
  };
};

module.exports = WeaponsService;
