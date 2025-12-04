
import { Router } from "express";
import { createPicture, getAllPictures, getPicturesByMembreId, deletePicture } from "../controllers/picture.controller.js"
import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { upload } from "../middlewares/multer.js"


const router = Router()

router.post('/new', auth, upload.single('image'), createPicture)
router.get('/all', getAllPictures)
router.get('/:id', auth, getPicturesByMembreId)
router.delete('/:id', auth, isAdmin, deletePicture)

export default router