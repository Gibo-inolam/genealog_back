
import { Router } from "express";
import { register, login, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js"
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/all', auth, isAdmin, getAllUsers)
// router.get('/:id',auth, isAdmin, getUserById)
router.put('/:id', auth, isAdmin, updateUser)
router.delete('/:id', auth, isAdmin, deleteUser)

export default router