const router = require("express").Router();

const MaterialService = require("../services/materialService.js");

router.get("/:id", async (req, res) => {
  try {
    const material = await MaterialService().getMaterial(req.params.id);
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/powerLevel/:id/:power", async (req, res) => {
  try {
    const { id, power } = req.params;
    const response = await MaterialService().updatePowerLevel(id, power);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post("/quantity/:id/:qty", async (req, res) => {
  try {
    const { id, qty } = req.params;
    const response = await MaterialService().updateQuantity(id, qty);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const response = await MaterialService().deleteMaterialById(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
