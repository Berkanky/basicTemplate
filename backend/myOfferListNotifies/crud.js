const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const MyNotifies = require('../notify/schema')
const Advert = require('../advertsCrud/schema')
const { v4: uuidv4 } = require('uuid');


const findme = async(currentUserId) => {
    const myacc = await User.findOne({fireBaseId : currentUserId})
    return myacc
}

const findmynotifies = async(id) => {
    const findmynotifies = await MyNotifies.findOne({userId :id})
    return findmynotifies
}

const findadvertDetail = async (id) => {
    const advertdetail = await Advert.findOne({_id : id})
    return advertdetail
}

const senderDetailFunction = async(fid) => {
    const userdetail = await User.findOne({fireBaseId : fid})
    return userdetail
}
/* 
const getofferList = (mynotifies) => {
    let newOfferList = []
    let currentList = mynotifies.offerList
    currentList.forEach(async(element) => {
        const id = element.advertId
        const fid = element.offerSenderFirebaseId
        const advertDetail =(await findadvertDetail(id))
        const senderDetail = (await senderDetailFunction(fid))
        const newObj = {
            advertDetail:advertDetail, 
            senderDetail:senderDetail, 
            offerDetail:element
        }
        console.log(Object.keys(newObj).length)
        newOfferList.push(newObj)
    }); 

    if(!newOfferList.length){
        newOfferList[0] = {message:'no data'}
    }

    const allBody = {newOfferList}
    return allBody
} */
const getofferList = async (mynotifies) => {
    let newOfferList = [];
    let currentList = mynotifies.offerList;
  
    return new Promise(async (resolve, reject) => {
      const promises = [];
      currentList.forEach((element) => {
        promises.push(
          findadvertDetail(element.advertId).then((advertDetail) => {
            return senderDetailFunction(element.offerSenderFirebaseId).then(
              (senderDetail) => {
                const newObj = {
                  advertDetail,
                  senderDetail,
                  offerDetail: element,
                };
                newOfferList.push(newObj);
              }
            );
          })
        );
      });
      await Promise.all(promises);
      if (!newOfferList.length) {
        newOfferList[0] = { message: 'no data' };
      }
      resolve({ newOfferList });
    });
  };
  

app.get('/:currentUserId/getMyNotifies',async(req,res) => {
    const {currentUserId} = req.params
    try{

        const myacc = (await findme(currentUserId))
        const mynotifies = (await findmynotifies(myacc._id))
        const offerList = (await getofferList(mynotifies)).newOfferList
        res.status(200).json({offerList})
        
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

app.put('/:currentUserId/:selectedNotifyId/removeSelectedNotify',async(req,res) => {
    const {currentUserId, selectedNotifyId} = req.params
    try{
        const myacc = (await findme(currentUserId))
        const mynotifies = await MyNotifies.findOneAndUpdate(
          {userId : myacc._id},
          {$pull : {offerList : {_id : selectedNotifyId}}}
        ) 

        res.status(200).json({myacc, mynotifies})

    }catch(err){
      res.status(500).json({message:'Internal Server Err'})
    }
})





module.exports = app