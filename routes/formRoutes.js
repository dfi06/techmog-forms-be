const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/middleware.js");

const Form = require("../models/formSchema");

router.get("/all", async (req, res) => {
  const forms = await Form.find({});
  res.json({ forms });
});

router.get("/by/:form_id", async (req, res) => {
  const { form_id } = req.params;
  const form = await Form.findById(form_id);

  res.json({ form });
});
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const forms = await Form.find({
      title: { $regex: q, $options: "i" },
    });

    res.json({ forms });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", authMiddleware, async (req, res) => {
  const { owner_id, owner_username } = req.body;
  const newForm = new Form({ title: "def", owner_id, owner_username });
  await newForm.save();
  res.status(201).json({
    message: "Form created successfully",
    form_id: newForm._id,
  });
});

router.delete("/delete/:form_id", authMiddleware, async (req, res) => {
  try {
    const { form_id } = req.params;
    const form = await Form.findById(form_id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!form.owner_id.equals(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await form.deleteOne();

    res.status(200).json({
      message: "Form deleted successfully",
      form_id: form_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/save/:form_id", authMiddleware, async (req, res) => {
  const { form_id } = req.params;
  const newForm = req.body.form;
  try {
    const form = await Form.findByIdAndUpdate(form_id, newForm, {
      after: true,
    });
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    return res.json({ form });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
