
import { Router } from "express";
import { createPersonne, getAllPersonnes, getPersonneById, updatePersonne, deletePersonne, createMariage } from "../controllers/personne.controller.js"
import auth from "../middlewares/auth.js"
import isAdmin from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js";

const router = Router()

router.post('/new', auth, isAdmin, upload.single('image'), createPersonne)
router.post('/mariage/:id1/:id2', auth, isAdmin, createMariage)
router.get('/all', auth, getAllPersonnes)
router.get('/:id', getPersonneById)
router.put('/:id', auth, isAdmin, upload.single('image'), updatePersonne)
router.delete('/:id', auth, isAdmin, deletePersonne)

export default router