import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
    url : {
        type:String,
        required:true,
        trim:true,
    },
    imageType:{
        type:String,
        enum:['upload','link'],
        default:'upload'
    }
},
{
    _id:false,
})


const gallerySchema = new mongoose.Schema({

    title:{
        type:String,
        required:true,
        trim:true,

    },
    location : {
        type:String,
        required:true,
        trim:true,
    },
    images:{
        type:[imageSchema],
        required:true,
    },
    isActive:{
        type:Boolean,
        default:true,
    }

    

},
{
    timestamps:true
})

const Gallery = mongoose.model("gallery",gallerySchema)

export default Gallery