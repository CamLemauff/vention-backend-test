const db = require('../config/dbConfig.js');
const { getPowerLevel, getMaxBuild } = require("../models/weapon");
const table = 'materials';
const compositionTable = 'compositions';
const weaponsTable = 'weapons';


class Material {
  constructor(payload) {
    this.id = payload.id;
    this.power_level = payload.power_level;
    this.qty = payload.qty;
    this.deleted_at = payload.deleted_at;
  }

  static async find(id) {
    try {
      let material = await db(table).where('id', id).first();
      return new Material(material);
    } catch (e) {
      throw new Error('Material not found');
    }
  }

  static async updatePower(id, powerLevel) {
    try {
      let updatedPowerLevel = await db(table)
        .where("id", id)
        .update("power_level", powerLevel);

      if (!updatedPowerLevel) {
        throw new Error("The power level of the material " + id + " could not be updated!");
      } else {
        let allWeapons = await db(weaponsTable);

        for(var i = 0; i < allWeapons.length; i++) {
          const newPowerLevel = await getPowerLevel(allWeapons[i].id);
          return await db(weaponsTable)
            .where("id", allWeapons[i].id)
            .update("power_level", newPowerLevel);
        }

        return {
          success: true,
          updatedPowerLevel,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  static async updateQty(id, qty) {
    try {
      let updatedQuantity = await db(table)
        .where("id", id)
        .update("qty", qty);

      if (!updatedQuantity) {
        throw new Error("The quantity of the material " + id + " could not be updated!");
      } else {
        let allWeapons = await db(weaponsTable);

        for(var i = 0; i < allWeapons.length; i++) {
          const newQtyBuildable = await getMaxBuild(allWeapons[i].id);
          return await db(weaponsTable)
            .where("id", allWeapons[i].id)
            .update("qty", newQtyBuildable);
        }
        return {
          success: true,
          updatedQuantity,
        };
      }
    } catch (err) {
      throw err;
    }
  }

  static async deleteMaterial(id) {
    try {
      let deletedMaterial = await db(table)
        .where("id", id)
        .update({ deleted_at: "now" });

      if (!deletedMaterial) {
        throw new Error("Material could not be deleted");
      } else {

        return {
          success: true,
          deletedMaterial
        };
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Material;
