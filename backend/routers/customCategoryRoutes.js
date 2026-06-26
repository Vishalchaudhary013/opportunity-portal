import express from 'express'
import { createCustomCategory, deleteCustomCategory, getCustomCategory, updateCustomCategory } from '../controllers/customCategoryController.js'

const router = express.Router()

router.post('/create-category',createCustomCategory)
router.get('/:id',getCustomCategory)
router.post("/update-category/:id",updateCustomCategory)
router.delete('/:id',deleteCustomCategory)
export default router

