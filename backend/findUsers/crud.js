const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const currentDateReturn = require('../dateFunctions/currentDate')
const { v4: uuidv4 } = require('uuid');
const Advert = require('../advertsCrud/schema')


const findEachUser = async (resBody) => {
    let newUsersList = []

    resBody.offerList.forEach(element => {
        const result = resBody.allUsersList.find(
            object => String(object.fireBaseId) === String(element.userFirebaseId)
        )
        if(result){
            newUsersList.push(result)
        }
    });

    const newBody = {newUsersList}
    return newBody
}

const findAdvert = async (selectedAdvertId) => {
    const advert = await Advert.findOne({_id : selectedAdvertId})
    if(advert){
        return advert
    }
}

const getAllUsersList =async () => {
    let allUsersList = await User.find()
    const newBody = {allUsersList}
    return newBody
}

app.put('/:selectedAdvertId/findUsersWithId',async(req,res) => {
    const {selectedAdvertId} = req.params
    try{
        const advertDetail = await findAdvert(selectedAdvertId)

        let allUsersList = (await getAllUsersList()).allUsersList

        let offerList = advertDetail.offerList
        const resBody =  {
            offerList:offerList,allUsersList
        }
        const newBody = await findEachUser(resBody)

        res.status(200).json({offerList:newBody.newUsersList})

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



module.exports = app