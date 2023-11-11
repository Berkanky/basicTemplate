const mongoose = require('mongoose');

const welcomeMessageObject = new mongoose.Schema({
    date:{
        type:String,
        required:false,
    },
    message:{
        type:String,
        required:false,
    }
})



const offerListSchema = new mongoose.Schema({
    userFirebaseId:{
        type:String,
        required:false
    },
    date:{
        type:String,
        required:false,
        default:new Date().toLocaleString()
    },
    message:{
        type:String,
        required:false,
        default:'You Have Notification !'
    },
    advertId:{
        type:String,
        required:false,
    },
    offerSenderFirebaseId:{
        type:String,
        required:false
    }
})


const MyNotifiesSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    welcomeMessage:{
        type:welcomeMessageObject,
        required:false
    },
    offerList:[offerListSchema]
}) 

const MyNotifies = mongoose.model('MyNotifies',MyNotifiesSchema)
module.exports = MyNotifies