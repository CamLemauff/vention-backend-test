const router = require("express").Router();

const WeaponsService = require("../services/weaponsService.js");

router.get("/:id", async (req, res) => {
  try {
    const weapon = await WeaponsService().getWeapons(req.params.id);
    res.status(200).json(weapon);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/powerLevel/:id", async (req, res) => {
    try {
      const powerLevel = await WeaponsService().printPowerLevel(req.params.id);
      res.status(200).json(powerLevel);
    } catch (err) {
      res.status(500).json({ err: err.message });
    }
  });

router.get("/maxQuantity/:id", async (req, res) => {
  try {
    const maxBuildable = await WeaponsService().printMaxQuantityBuildable(req.params.id);
    res.status(200).json({ id: req.params.id, max_buildable: maxBuildable });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
