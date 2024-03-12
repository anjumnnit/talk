const express = require("express");
const { registerUser ,fetchUsers, loginuser, allUsers } = require("../controller/user");
const { protect } = require("../middleware/authMiddleware");

const userRoute = express.Router();
const router = express.Router();
//routes are for register ,login and fetchusers

router.route("/").get(protect,allUsers);
userRoute.post("/" , registerUser);
userRoute.post("/login" , loginuser);
userRoute.get("/" , fetchUsers);

module.exports = userRoute;