import express from 'express'
import { test,updateUser,deleteUser,updateProfilePicture } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import upload from '../config/multerConfig.js';
const router = express.Router()

router.get('/',test)
router.post('/update/:id', updateUser)
router.delete('/delete/:id', verifyToken, deleteUser);
router.put('/update-profile-picture', verifyToken, upload.single('profilePicture'), updateProfilePicture);
export default router;