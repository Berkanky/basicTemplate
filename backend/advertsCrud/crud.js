const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const MyNotifies = require('../notify/schema')
const Advert = require('./schema')
const { v4: uuidv4 } = require('uuid');


app.get('/:firebaseId/getMyAdverts',async(req,res)=> {
    const {firebaseId} = req.params
    try{
        let allAdverts = await Advert.find()
        if(allAdverts.length > 0 ){
            allAdverts = allAdverts.filter(
                (object) => String(object.advertAdminFirebaseId) === String(firebaseId)
            )
            res.status(200).json({allAdverts})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/findUsers',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const searchUser = req.body.searchUser

        let allUsers = await User.find()

        if(allUsers.length > 0){
            const findedUser = allUsers.filter(
                object => {
                    const returnName = String(object.name).includes(searchUser)
                    const returnEmail = String(object.email).includes(searchUser)
                    const returnLastName = String(object.surName).includes(searchUser)
                    return returnName || returnEmail || returnLastName
                }
            )
            res.status(200).json({findedUser})
        }

    }catch(err){
        res.status(500).json({message:'Internal Server'})
    }
})


app.post('/:firebaseId/postAdvert',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        const newData = req.body.newData
        Object.assign(newData,{
            advertAdminId:findme._id,
            advertAdminFirebaseId:firebaseId
        })
        const newPostAdvert = new Advert(newData)
        await newPostAdvert.save()
        res.status(200).json({newPostAdvert})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/:firebaseId/:selectedAdvertId/removeSelectedAdvert', async(req,res) => {
    const {firebaseId, selectedAdvertId} = req.params
    try{
        const filter = {_id : selectedAdvertId}

        const findandremove = await Advert.findOneAndDelete({_id : selectedAdvertId})
        res.status(200).json({findandremove})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }   
})

module.exports = app