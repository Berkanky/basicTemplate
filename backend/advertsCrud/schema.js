const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const locationSchema = new mongoose.Schema({
    lat:{
        type:String,
        required:false,
        default:''
    },
    lng:{
        type:String,
        required:false,
        default:'',
    },
    radius:{
        type:String,
        required:false,
        default:700
    }
})

const offerListSchema = new mongoose.Schema(
    {
        userFirebaseId:{
            type:String,
            required:false,
        }
    }
)


const imageSchema = new mongoose.Schema(
    {
        imageUrl:{
            type:String,
            required:false
        },
        Date:{
            type:String,
            required:false,
            default:new Date().toLocaleString()
        },
        imageId:{
            type:String,
            required:false,
            default:uuidv4()
        },
        imageType:{
            type:String,
            required:false,
        },
        imageName:{
            type:String,
            required:false
        }
    }
)


const advertSchema = new mongoose.Schema({
    advertId:{
        type:String,
        required:false
    },
    advertImages:[imageSchema],
    advertAdminId:{
        type:String,
        required:false
    },
    advertAdminFirebaseId:{
        type:String,
        required:false
    },
    advertPostedDate:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    activityImage:{
        type:String,
        required:false,
        default:''
    },
    activityName:{
        type:String,
        required:false,
        default:''
    },
    activityStartDate:{
        type:String,
        required:false,
        default:''
    },
    activityStartHour:{
        type:String,
        required:false,
        default:''
    },
    activityType:{
        type:String,
        required:false,
        default:''
    },
    description:{
        type:String,
        required:false,
        default:''
    },
    minRange:{
        type:Number,
        required:false,
        default:0
    },
    maxRange:{ //user member
        type:Number,
        required:false,
        default:0
    },
    limitActive:{
        type:Boolean,
        required:false,
        default:false
    },
    locationDetails:{
        type:locationSchema,
        required:false
    },
    offerList:[offerListSchema],
    updatedDate:{
        type:String,
        required:false,
        default:''
    },
    memberList:[offerListSchema]
})



const Advert = mongoose.model("advertSchema",advertSchema)
module.exports = Advert


