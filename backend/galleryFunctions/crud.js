const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const currentDateReturn = require('../dateFunctions/currentDate')
const { v4: uuidv4 } = require('uuid');



app.put('/:firebaseId/addImages',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const newAddedImages = req.body.newAddedImages

        let newAddedImagesUpdate = []
        newAddedImages.forEach(async(element) => {
            const newObj = {
                imageUrl:element.url,
                imageId:uuidv4(),
                imageDate:new Date().toLocaleString()
            } 
            newAddedImagesUpdate.push(newObj)
        });

        const findme = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$push : {myImages : {$each :newAddedImagesUpdate }}}
        )
        const updatedDocument = findme;

        res.status(200).json({newAddedImagesUpdate})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/deleteAllSelecteds',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const selectedImages = req.body.selectedImages
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            selectedImages.forEach(element => {
                const result = findme.myImages.find(
                    object => String(object._id ) === String(element._id)
                )
                if(result){
                    findme.myImages = findme.myImages.filter(
                        object => String(object._id) !== String(result._id)
                    )
                }
            });

            await findme.save()
            res.status(200).json({findme, selectedImages})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



//remove current Image

app.put('/:firebaseId/removeProfilePic',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const filter = {fireBaseId : firebaseId}
        const update = {userImage : ''}

        const findandupdateprofile = await User.findOneAndUpdate(filter,update)
        res.status(200).json({findandupdateprofile})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

//sync with googleImage

app.put('/:firebaseId/syncWithGoogleImage',async(req,res) => {
    const {firebaseId } = req.params
    try{
        const resBody = {}

        const googleImage = req.body.googleImage
        const filter = { fireBaseId : firebaseId }
        const checkGoogleImage = (googleImage) => {
            const check = googleImage !== '' && googleImage !== null ? true : false
            return check
        }

        if(checkGoogleImage() === true){
            const update = { userImage : googleImage }
            const findoneandupdate = await User.findOneAndUpdate(filter,update)
            Object.assign(resBody,{
                finduser:findoneandupdate,
                newImage:googleImage
            })
        }else{
            Object.assign(resBody,{
                message:'Google Picture Not Found !',
            })
        }
        res.status(200).json({resBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



module.exports = app