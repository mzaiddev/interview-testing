const express = require("express");
const router = express.Router();
const { getUserDetail, getUsers } = require("../controllers/userController.js");

// list all users
router.get("/", getUsers);

// get single user by id
router.get("/:id", getUserDetail);
module.exports = router;
