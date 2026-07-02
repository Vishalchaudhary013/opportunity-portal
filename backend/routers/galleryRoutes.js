import express from 'express'
import galleryUpload from '../middleware/galleryUpload.js'
import { createGallery, deleteGallery, getGallery, getGalleryByID, updateGallery } from '../controllers/galleryController.js'
import { protect, requireSuperAdmin } from '../middleware/authMiddleware.js'
const router = express.Router()

router.post('/create',protect,requireSuperAdmin,
    galleryUpload.array('images',100),
    createGallery
)

router.get('/',getGallery)

router.get('/:id',getGalleryByID)
router.put('/update/:id',protect,requireSuperAdmin,galleryUpload.array('images',100),updateGallery)
router.delete('/delete/:id',protect,requireSuperAdmin,deleteGallery)

export default router;
