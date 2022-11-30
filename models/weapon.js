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

  //Function to find a weapon by id
  static async find(id) {
    try {
      let weapon = await db(table).where('id', id).first();
      return new Weapon(weapon);
    } catch (e) {
      throw new Error('Weapon not found');
    }
  }

  //Function to get the power level of a weapon
  static async getPowerLevel(id) {
    try {
      //Get the weapon from the database
      let weapon = await db(table).where('id', id).first();
      let weaponMaterials = weapon.materials;

      //Check if the weapon have materials associated with it
      if (weaponMaterials.length <= 0) {
        throw new Error("This Weapon does not have any materials associated");
      }

      //Get the power level for every composition associated with the materials
      const promises = weaponMaterials.map(async (weaponMaterial) => {
        const materialId = weaponMaterial;
        return await Weapon.getPowerLevelComposition(materialId);
      });

      //Wait for all the calls to be finished
      const res = await Promise.all(promises);

      //Native iterative function to calculate the sum of the power level of the compositions
      return res.reduce(
        (conc, compositionPower) => conc + compositionPower,
        0
      );
    } catch (e) {
      throw new Error("An error occured while calculating the power level of the weapon " + id);
    }
  }

  //Recursive function to get the power level for all the compositions associated with a material
  static async getPowerLevelComposition(id) {
    try {
      //Get the material from the database
      const material = await db(materialTable).where("id", id).first();
      const composition = await db(compositionTable).where("parent_id", id);

      //Check if the material has any composition and returns the power level of the material. If there is still a composition associated, calls the function again
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

  //Function to get the maximum buildable quantity for a weapon
  static async getQtyMaxBuild(id) {
    try {
      //Get the weapon from the database
      const weapon = await db(table).where('id', id).first()
      const weaponMaterials = weapon.materials;

      //Check if the weapon have materials associated with it
      if (!weaponMaterials.length) {
        throw new Error("This Weapon does not have any materials associated");
      }

      //Get the quantity of the parent_id for every composition associated with the materials
      const promises = weaponMaterials.map(async (weaponMaterial) => {
        const materialId = weaponMaterial;
        return await Weapon.getCompositionQtyMaxBuild(materialId);
      });

      //Wait for all the calls to be finished
      const res = await Promise.all(promises);

      //Native function to return the miminum value of all the quantities of the compositions
      return Math.min(...res);
    } catch (e) {
      throw new Error("An error occured while calculating the maximum quantity buildable of the weapon");
    }
  }

  //Recursive function to get the maximum buildable quantity for all the compositions associated with a material
  static async getCompositionQtyMaxBuild(id) {
    //Get the material from the database
    const material = await db(materialTable).where("id", id).first();
    const composition = await db(compositionTable).where("parent_id", id);
    

    //Check if the material has any composition and returns the quantity of the material. If there is still a composition associated, calls the function again
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