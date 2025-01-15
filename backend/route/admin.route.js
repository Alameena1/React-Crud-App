import express from "express";
import { adminSignin, getAllUsers, updateUser, deleteUser, addNewUser, signout } from "../controllers/admin.controller.js";
import { verifyToken, authorizeAdmin } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signin", adminSignin); // Admin sign-in does not require token verification

// Protect these routes with token verification and admin authorization
router.get("/users", getAllUsers);

router.delete('/delete/:id',verifyToken,authorizeAdmin, deleteUser);
router.put("/users/:id",verifyToken,authorizeAdmin, updateUser);
router.post("/addUser",verifyToken,authorizeAdmin,addNewUser)
router.get("/signout",signout)

export default router;  
