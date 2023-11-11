const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const MyNotifies = require('../notify/schema')
const Advert = require('../advertsCrud/schema')



/* const sendnotifytouser = (allBody) => {
    app.put('/:selectedAdvertId/sendNotifyToOfferList',async(req,res) => {
        const {selectedAdvertId} = req.params
        try{

        }catch(err){
            res.status(500).json({message:'Internal Server Err'})
        }
    })
} */


const sendnotifies = (allBody) => {
    allBody.offerList.forEach(async(element) => {
        const newObj = {
            userFirebaseId:element.fireBaseId,
            advertId:allBody.selectedAdvertId,
            offerSenderFirebaseId:allBody.currentUserId
        }

        const userNotify = await MyNotifies.findOneAndUpdate(
            {userId : element._id},
            {$push : {offerList : newObj }},
            {new:true, upsert:true}
        )
    });
}

const addToOfferList = async (allBody) => {
    const advertdetail = await Advert.findOne({_id : allBody.selectedAdvertId})
    if(advertdetail){
        allBody.offerList.forEach(async(element) => {
            const newObj = { userFirebaseId : element.fireBaseId}
            const result = advertdetail.offerList.some(
                object => String(object.userFirebaseId) === String(element.fireBaseId)
            )
            if(!result){
                const findadvertandupdate = await Advert.findOneAndUpdate(
                    {_id : allBody.selectedAdvertId},
                    {$push : {offerList : newObj}},
                    {new:true, upsert:true}
                )
            }
        });
    }
}


app.put('/:selectedAdvertId/:currentUserId/sendNotifyToOfferList',async(req,res) => {
    const allBody = {}
    //currentuserıd = firebaseıd
    const {selectedAdvertId, currentUserId} = req.params
    try{
        const offerList = req.body.offerList
        Object.assign(allBody,{
            selectedAdvertId, offerList, currentUserId
        })
        sendnotifies(allBody)
        await addToOfferList(allBody)
        res.status(200).json({allBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

module.exports = app