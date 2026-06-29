import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim :true
    },
    region:{
        type:String,
        enum: ["North", "South", "East", "West", "Central"],
        required: true,
    },
    state :{
        type:String,
        required:true,
    },
    district:{
        type:String,
        required:true,

    },
    city:{
        type:String,
        required:true,
    },
    address: {
        type: String,
        required: true,
    },
    phones:[
        {
            type:String,
            required:true,
        }
    ],
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    whatsapp:{
        type:String,
        required:true,
    },
    maplink:{
        type:String,
        
    },
    // optional
     coordinates: {
      latitude: Number,
      longitude: Number,
    },


},{
    timestamps:true,
})

const Branch =  mongoose.model("branch",branchSchema)

export default Branch