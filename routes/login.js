var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


router.post('/login' , async function(req,res,next) {
    try{

        let {username,password} = req.body
        let user = await userSchema.findOne({username:username});
        let checkpassword = await bcrypt.compare(password,user.password)
        var privateKey = process.env.KEY;
        var payload = {
            "id":user.id,
            "role":user.role,
            "approve":user.approve
        }
        var token = await jwt.sign({payload}, privateKey, { expiresIn: '1h' });
 
        if(checkpassword){
            res.send({"status" : 200,
                "messages" : "สำเร็จ",
                "data": [token]          
                })
        }else{
            throw{"status" : 400,
                "messages" : "ไม่สำเร็จ"
                }
        }
        


    }catch(error){
        res.send(error)
    }
    
})


module.exports = router;