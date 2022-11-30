const { find, getPowerLevel, getQtyMaxBuild } = require('../models/weapon');

const WeaponsService = () => {
  const getWeapons = async (id) => {
    return find(id);
  };

  const printPowerLevel = async (id) => {
    if(!id || id === null) {
      throw new Error("Id missing to print the power level");
    }
    return getPowerLevel(id);
  };

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
