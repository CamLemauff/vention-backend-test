const router = require("express").Router();

const MaterialService = require("../services/materialService.js");

//GET request to get a material by id
router.get("/:id", async (req, res) => {
  try {
    const material = await MaterialService().getMaterial(req.params.id);
    res.status(200).json(material);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//POST request to update the power level of a specific material
router.post("/powerLevel/:id/:power", async (req, res) => {
  try {
    const { id, power } = req.params;
    const response = await MaterialService().updatePowerLevel(id, power);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//POST request to update the quantity of a specific material
router.post("/quantity/:id/:qty", async (req, res) => {
  try {
    const { id, qty } = req.params;
    const response = await MaterialService().updateQuantity(id, qty);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//DELETE request to delete a specific material
router.delete("/:id", async (req, res) => {
  try {
    const response = await MaterialService().deleteMaterialById(req.params.id);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
