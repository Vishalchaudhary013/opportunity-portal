import express from 'express'
import galleryUpload from '../middleware/galleryUpload.js'
import { createGallery, deleteGallery, getGallery, getGalleryByID, updateGallery } from '../controllers/galleryController.js'
const router = express.Router()

router.post('/create',
    galleryUpload.array('images',100),
    createGallery
)

router.get('/',getGallery)

router.get('/:id',getGalleryByID)
router.put('/update/:id',updateGallery)
router.delete('/delete/:id',deleteGallery)

export default router;
