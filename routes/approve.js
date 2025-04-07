var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')


router.put('/:id/approve' , async function(req,res,next){
    try{ 
        let {id} = req.params
        let user = await userSchema.findById(id)
        if(user.approve){
          throw{"status" : 400,
            "messages" : "ไม่สำเร็จเพราะได้ทำการapproveไปเรียบร้อยแล้ว",
            "data": [{
              "username":user.username,
              "name":user.name
            }]          
            }
        }
        await userSchema.findByIdAndUpdate(id,{
          approve:true
          },{new: true})
        res.send({"status" : 200,
          "messages" : "สำเร็จ",
          "data": [{
            "username":user.username,
            "name":user.name
          }]          
          }) 
  }catch (error){
    res.status(500).send(error)
  }
    

})

module.exports = router;