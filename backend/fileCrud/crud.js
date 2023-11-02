const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const MyNotifies = require('../notify/schema')


app.put('/:firebaseId/removeMyCV',async(req,res) => {
    const {firebaseId } = req.params
    try{
        const findmeandupdate = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$set : {selectedCvFile : {}}}
        )
        const getmeagain = await User.findOne({fireBaseId : firebaseId})
        if(getmeagain){
            res.status(200).json({findmeandupdate,getmeagain})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:firebaseId/addToMyOldCvFiles',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const currentCv = req.body.currentCv

        const newObj = {
            selectedCvFileUrl:currentCv.selectedCvFileUrl,
            selectedCvFileName:currentCv.selectedCvFileName,
            selectedCvFileType:currentCv.selectedCvFileType
        }

        const findmeandupdate = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$set : {selectedCvFile : {}}}
        )

        const addMyBackupFiles = await User.findOneAndUpdate(
            {fireBaseId : firebaseId},
            {$push : {backupCvFiles : newObj}}
        )
        
        const getmeagain = await User.findOne({fireBaseId : firebaseId})

        res.status(200).json({findmeandupdate,addMyBackupFiles,getmeagain})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

//backupCvFiles



app.put('/:firebaseId/makeSelectedCvCurrentCv',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const selectedCv = req.body.selectedCv
        const currentCv = req.body.currentCv

        const newObj = {
            selectedCvFileUrl:selectedCv.selectedCvFileUrl,
            selectedCvFileName:selectedCv.selectedCvFileName,
            selectedCvFileType:selectedCv.selectedCvFileType
        }

        const newObjForCurrentCv = {
            selectedCvFileUrl:currentCv.selectedCvFileUrl ?? '',
            selectedCvFileName:currentCv.selectedCvFileName ?? '',
            selectedCvFileType:currentCv.selectedCvFileType ?? ''
        }

        const update = {
            $set : {selectedCvFile : newObj},
            $pull : {backupCvFiles : {selectedCvId : selectedCv.selectedCvId}},
        }
        
        const filter = {fireBaseId : firebaseId}

        const updateProfile = await User.findOneAndUpdate(filter,update)

        res.status(200).json(
            {
                updateProfile
            }
        ) 
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.put('/:firebaseId/:selectedBackupFileId/removeBackupFile', async(req,res) => {
    const {firebaseId, selectedBackupFileId} = req.params
    try{

/*     
        const filter = {fireBaseId : firebaseId}
        const update = {
            $pull: {backupCvFiles : {_id : selectedBackupFileId }}
        }

        const findmeandupdate = await User.findOneAndUpdate(filter, update)
        if(findmeandupdate){
            res.status(200).json({findmeandupdate, selectedBackupFileId})
        }  */

        const findme = await User.findOne({ fireBaseId : firebaseId})
        if(findme){
            const result = findme.backupCvFiles.some(
                object => String(object._id) === selectedBackupFileId
            )
            if(result === true){
                findme.backupCvFiles = findme.backupCvFiles.filter(
                    object => String(object._id) !== String(selectedBackupFileId)
                )
                await findme.save()
                res.status(200).json({findmeandupdate : findme, selectedBackupFileId})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


module.exports = app