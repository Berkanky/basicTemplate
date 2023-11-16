const express = require('express');
const app = express.Router();
const User = require('./schema')
const currentDateReturn = require('../dateFunctions/currentDate')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const readDialCodes = require('../dialCodes/dialCodesFunctions')


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
        subject: 'Signup Vertification Code',
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
        textVal:textVal,
        toEmail: allBody.email,
        currentDate:currentDate,
        errorStatus
    })
    return newBody
}



//when login, or refresh page while online
app.put('/:firebaseId/getMyDetail',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const resBody = {}

        const finduser = await User.findOne({fireBaseId : firebaseId})
        if(finduser){
            const filter = {fireBaseId : firebaseId}
            const update = {
                active : true,
                lastLoginDate:''
            }

            const findandupdate = await User.findOneAndUpdate(filter,update)   
            Object.assign(resBody,{
                currentUser:findandupdate,
                message:'yes user'
            })
            //res.status(200).json({resBody})
        }else if(!finduser){
            const newUserData = req.body.firebaseData
            Object.assign(newUserData,{
                active:true,
                fireBaseId:firebaseId
            }) 
            
            const newuser = new User(newUserData)
            await newuser.save()
            Object.assign(resBody,{
                currentUser:newuser,
                message:'No  User'
            })
            res.status(200).json({resBody})
        }

       // res.status(200).json({resBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

//when logout from acc




app.put('/:firebaseId/logout',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const filter = {fireBaseId : firebaseId}
        const update = {
            active:false,
            lastLoginDate: currentDateReturn()
        }

        const finduser = await User.findOneAndUpdate(filter,update)
        res.status(200).json({finduser})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.put('/sendEmailCheckCode',async(req,res) => {
    try{
        const checkEmailData = req.body.checkEmailData
        const allBody = {
            email:checkEmailData.email
        }
        const newBody = sendEmailFunction(allBody)
        res.status(200).json({newBody})


    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/getDialCodes',async(req,res) => {
    try{
        const newBody = readDialCodes()

        let onlyDialCodes = []

        newBody.forEach(element => {
            onlyDialCodes.push(element.dial_code)
        });


        res.status(200).json({onlyDialCodes})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})




// get current user detail

app.get('/:firebaseId/getCurrentUser',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const currentuser = await User.findOne({fireBaseId : firebaseId})
        if(currentuser){
            res.status(200).json({currentuser})
        }else{
            res.status(200).json({mesage:'no user'})
        }

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



module.exports = app