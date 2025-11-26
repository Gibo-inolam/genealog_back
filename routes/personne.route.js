
import { Router } from "express";
import { createPersonne, getAllPersonnes, getPersonneById, updatePersonne, deletePersonne, createMariage } from "../controllers/personne.controller.js"

const router = Router()

router.post('/new', createPersonne)
router.post('/mariage/:id1/:id2', createMariage)
router.get('/all', getAllPersonnes)
router.get('/:id', getPersonneById)
router.put('/:id', updatePersonne)
router.delete('/:id', deletePersonne)

export default router