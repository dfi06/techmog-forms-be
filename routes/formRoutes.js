const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/middleware.js");

const Form = require("../models/formSchema");

/**
 * @swagger
 * tags:
 *   name: Forms
 *   description: Form browsing and management
 */

/**
 * @swagger
 * /form/all:
 *   get:
 *     tags: [Forms]
 *     summary: List all forms
 *     responses:
 *       200:
 *         description: List of forms
 */
router.get("/all", async (req, res) => {
  const forms = await Form.find({});
  res.json({ forms });
});

/**
 * @swagger
 * /form/by/{form_id}:
 *   get:
 *     tags: [Forms]
 *     summary: Get a form by ID
 *     parameters:
 *       - in: path
 *         name: form_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The form data
 *       404:
 *         description: Form not found
 */
router.get("/by/:form_id", async (req, res) => {
  const { form_id } = req.params;
  const form = await Form.findById(form_id);

  res.json({ form });
});

/**
 * @swagger
 * /form/search:
 *   get:
 *     tags: [Forms]
 *     summary: Search forms by title
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Matching forms
 */
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

/**
 * @swagger
 * /form/create:
 *   post:
 *     tags: [Forms]
 *     summary: Create a new form
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner_id:
 *                 type: string
 *               owner_username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Form created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/create", authMiddleware, async (req, res) => {
  const { owner_id, owner_username } = req.body;
  const newForm = new Form({
    title: `${owner_username}'s Form`,
    owner_id,
    owner_username,
  });
  await newForm.save();
  res.status(201).json({
    message: "Form created successfully",
    form_id: newForm._id,
  });
});

/**
 * @swagger
 * /form/delete/{form_id}:
 *   delete:
 *     tags: [Forms]
 *     summary: Delete a form
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: form_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form deleted
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Form not found
 */
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

/**
 * @swagger
 * /form/save/{form_id}:
 *   put:
 *     tags: [Forms]
 *     summary: Save/update a form
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: form_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FormSave'
 *     responses:
 *       200:
 *         description: Updated form
 *       404:
 *         description: Form not found
 */
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
