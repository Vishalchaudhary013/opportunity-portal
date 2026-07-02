import fs from "fs";
import Gallery from "../models/galleryModel.js";

export const createGallery = async(req,res) =>{
    try {
        const {title,location} = req.body

        let imageLinks = req.body.imageLinks || []

        if(!Array.isArray(imageLinks)){
            imageLinks = imageLinks ? [imageLinks] : []
        }

        const images = [];
        if(req.files && req.files.length >0) {
            req.files.forEach((file) => {
                images.push({
                    url: `/uploads/gallery/${file.filename}`,
                    imageType: "upload",
                });
            });
        }

        imageLinks.forEach((link)=>{
            if(link.trim()){
                images.push({
                    url:link,
                    imageType : "link",
                })
            }


        })

        const gallery = await Gallery.create({
            title,
            location,
            images
        })

        return res.status(200).json({
            success:true,
            message:"Gallery created successfully",
            data:gallery,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }

}

export const getGallery = async(req,res)=>{
    try {
        const gallery = await Gallery.find().sort({createdAt : -1})

        return res.status(200).json({
            success:true,
            data:gallery
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}

export const getGalleryByID = async(req,res)=>{
    try {
        const gallery = await Gallery.findById(req.params.id)

        if(!gallery){
            return res.status(404).json({
                success:false,
                message:"Gallery not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Gallery Founded",
            data:gallery
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}


export const updateGallery = async (req, res) => {
  try {
    const { title, location } = req.body;

    let imageLinks = req.body.imageLinks || [];

    if (!Array.isArray(imageLinks)) {
      imageLinks = imageLinks ? [imageLinks] : [];
    }

    const gallery = await Gallery.findById(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found.",
      });
    }

    
    gallery.title = title || gallery.title;
    gallery.location = location || gallery.location;

    
    if (req.body.updateExistingImages === 'true') {
      let kept = req.body.keptExistingImages;
      if (!kept) kept = [];
      if (!Array.isArray(kept)) kept = [kept];
      const keptUrls = new Set(kept);

      // find images that are  removed
      const imagesToRemove = gallery.images.filter(img => !keptUrls.has(img.url));
      
      // delete files from filesystem
      imagesToRemove.forEach(img => {
        if (img.imageType === "upload" && fs.existsSync("." + img.url)) {
          fs.unlinkSync("." + img.url);
        }
      });

      // keep only the ones that were not removed
      gallery.images = gallery.images.filter(img => keptUrls.has(img.url));
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        gallery.images.push({
          url: `/uploads/gallery/${file.filename}`,
          imageType: "upload",
        });
      });
    }

    imageLinks.forEach((link) => {
      if (link.trim()) {
        gallery.images.push({
          url: link,
          imageType: "link",
        });
      }
    });

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully.",
      data: gallery,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGallery = async(req,res)=>{
    try {
        const gallery = await Gallery.findById(req.params.id)
        if(!gallery){
            return res.status(404).json({
                success:false,
                message:"Gallery not found"
            })
        }
        gallery.images.forEach((img) => {

            if (
                img.imageType === "upload" &&
                fs.existsSync("." + img.url)
            ) {
                fs.unlinkSync("." + img.url);
            }

        });

        await gallery.deleteOne();

        return res.status(200).json({
            success:true,
            message:"Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
        
    }
}