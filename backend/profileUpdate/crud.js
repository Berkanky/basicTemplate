const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')

const sendEmailFunction = (allBody) => {

    const newBody = {}
    const currentDate = new Date().toLocaleString()
    const randomId = uuidv4()
    const textVal = 'Please Copy UID and Enter in Client -> '
    const errorStatus = {
        result:false
    }
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yusufbk92@gmail.com',
          pass: 'nyfiapkrazpbbgto'
        }
      });
      var mailOptions = {
        from: 'yusufbk92@gmail.com',
        to: allBody.email,
        subject: 'Vertification Code For Delete Account Process !',
        html: `
            <div style="display: flex;justify-content: space-between;">
                <div>${textVal}</div>
                <a style="font-weight:bold;text-decoration:none;margin-left:5%;">${randomId}</a>
            </div>
            <div>${currentDate}</div>
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          Object.assign(errorStatus,{
            result:true
          })
        } else {
            Object.assign(errorStatus,{
                result:false
            })
          console.log('Email sent: ' + info.response);
        }
      });

    Object.assign(newBody,{
        vertificationId:randomId,
        uid:randomId,
        textVal:textVal,
        toEmail: allBody.email,
        currentDate:currentDate,
        errorStatus
    })
    return newBody
}


app.put('/:firebaseId/getUidForDeleteAcc',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const allBody = {
                email:findme.email ?? ''
            }

            const newBody = sendEmailFunction(allBody)
            res.status(200).json({newBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


//global update


app.put('/:firebaseId/updateMyProfile',async(req,res) =>{
    const {firebaseId} = req.params
    try{
        const newData = req.body.newData
        const filter = {fireBaseId : firebaseId}
        const update = newData

        const finduser = await User.findOneAndUpdate(filter,update)
        res.status(200).json({finduser})
    }catch(err){
        res.status(500).json({message:'Internal Server err'})
    }
})


//delete the acc


app.put('/:firebaseId/deleteAcc',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const mynotifies = await MyNotifies.findOneAndRemove({userId : findme._id})
            const findmeandremove = await User.findOneAndRemove({fireBaseId : firebaseId})

            res.status(200).json({message:'User Deleted !',mynotifies,findmeandremove,findme})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


module.exports = app