const { json } = require('express');
const db = require('../config/dbConfig.js');
const table = 'weapons';
const compositionTable = 'compositions';
const materialTable = 'materials';

class Weapon {
  constructor(payload) {
    this.id = payload.id;
    this.name = payload.name;
    this.materials = payload.materials;
  }

  static async find(id) {
    try {
      let weapon = await db(table).where('id', id).first();
      return new Weapon(weapon);
    } catch (e) {
      throw new Error('Weapon not found');
    }
  }

  static async getPowerLevel(id) {
    try {
      let weapon = await db(table).where('id', id).first();
      let weaponMaterials = weapon.materials;

      if (weaponMaterials.length <= 0) {
        throw new Error("This Weapon does not have any materials associated");
      }

      const promises = weaponMaterials.map(async (weaponMaterial) => {
        const materialId = weaponMaterial;
        return await Weapon.getPowerLevelComposition(materialId);
      });

      const res = await Promise.all(promises);

      return res.reduce(
        (conc, compositionPower) => conc + compositionPower,
        0
      );
    } catch (e) {
      throw new Error("An error occured while calculating the power level of the weapon " + id);
    }
  }

  static async getPowerLevelComposition(id) {
    try {
      const material = await db(materialTable).where("id", id).first();
      const composition = await db(compositionTable).where("parent_id", id);

      if (!composition.length) {
        return material.power_level;
      } else {
        const promises = composition.map(async (nextMaterial) => {
          const nextPowerLvl = await Weapon.getPowerLevelComposition(
            nextMaterial.material_id
          );
          return nextMaterial.qty * nextPowerLvl;
        });

        const res = await Promise.all(promises);

        return res.reduce(
          (conc, compositionPower) => conc + compositionPower,
          material.power_level
        );
      }
    } catch (e) {
      throw new Error("An error occured while calculating the power level of the weapon");
    }
  }

  static async getQtyMaxBuild(id) {
    try {
      const weapon = await db(table).where('id', id).first()
      const weaponMaterials = weapon.materials;

      if (!weaponMaterials.length) {
        throw new Error("This Weapon does not have any materials associated");
      }

      const promises = weaponMaterials.map(async (weaponMaterial) => {
        const materialId = weaponMaterial;
        return await Weapon.getCompositionQtyMaxBuild(materialId);
      });

      const res = await Promise.all(promises);

      return Math.min(...res);
    } catch (e) {
      throw new Error("An error occured while calculating the maximum quantity buildable of the weapon");
    }
  }

  static async getCompositionQtyMaxBuild(id) {
    const material = await db(materialTable).where("id", id).first();
    const composition = await db(compositionTable).where("parent_id", id);
    

    if (!composition.length) {
      return material.qty;
    } else {
      const promises = composition.map(async (nextMaterial) => {
        const nextQtyMaxBuild = await Weapon.getCompositionQtyMaxBuild(
          nextMaterial.material_id
        );

        return nextQtyMaxBuild / nextMaterial.qty;
      });

      const res = await Promise.all(promises);

      return Math.floor(
        res.reduce(
          (conc, maxBuild) => conc + maxBuild,
          material.qty
        )
      );
    }
  }
}

module.exports = Weapon;