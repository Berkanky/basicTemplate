const express = require('express');
const app = express.Router();
const MyNotifies = require('./schema')
const User = require('../auth/schema')


app.put('/:firebaseId/notify',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const finduser = await User.findOne({fireBaseId : firebaseId})
        if(finduser){
            const finduserId = finduser._id
            const findmynotify = await MyNotifies.findOne({userId : finduserId})


            const newNotifyTemplate = {
                userId : finduserId
            }

            const welcomeMessageNew = {
                date: new Date().toLocaleString(),
                message:`${finduser.email ?? finduser.displayName ?? finduser.phoneNumber ?? '!'} Welcome`
            }

            Object.assign(newNotifyTemplate,{
                welcomeMessage:welcomeMessageNew
            })

            if(!findmynotify){
                const newnotify = new MyNotifies(newNotifyTemplate)
                await newnotify.save()
                res.status(200).json({mynotifies:newnotify})
            }else{
                const filter = {userId : finduserId}
                const update = {welcomeMessage : welcomeMessageNew}
                
                const findmynotifyandupdate = await MyNotifies.findOneAndUpdate(filter,update)
                res.status(200).json({mynotifies:findmynotifyandupdate})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})







module.exports = app