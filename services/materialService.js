const { find, updatePower, updateQty, deleteMaterial } = require('../models/material');

const MaterialService = () => {
  const getMaterial = async (id) => {
    return find(id);
  };

  const updatePowerLevel = async (id, powerLevel) => {
    if (!powerLevel || powerLevel === null) {
      throw new Error("Missing Power Level");
    } else if (powerLevel < 0) {
      throw new Error("Power Level can not be negative");
    }
    return updatePower(id, powerLvl);
  };

  const updateQuantity = async (id, qty) => {
    if (!qty || qty === null) {
      throw new Error("Missing Quantity");
    } else if (qty < 0) {
      throw new Error("Quantity can not be negative");
    } else {
      return updateQty(id, qty);
    }
  };

  const deleteMaterialById = async (id) => {
    return deleteMaterial(id);
  };

  return {
    getMaterial,
    updatePowerLevel,
    updateQuantity,
    deleteMaterialById
  };
};

module.exports = MaterialService;
