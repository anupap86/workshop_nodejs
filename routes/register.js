var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')
var bcrypt = require('bcrypt');

router.post('/register', async function(req, res, next) {  
    try{ 
        let {username,password,name} = req.body
        let hashpassword = await bcrypt.hash(password,10);

        let user = new userSchema({
            username: username,
            password: hashpassword,
            name: name,
        })

        let existingUser = await userSchema.findOne({ username: req.body.username });
        if (existingUser) {
            throw{"status" : 400,
                "messages" : "ไม่สำเร็จ",
                "Data":["Username นี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น"]
            }
        }

        await user.save()
        res.send({"status" : 201,
            "messages" : "sucess",
            "Data":["บันทึกสำเร็จ",{
                username: username,
                name: name
            }]
        })   
  }catch (error){
    res.send(error)
  }
});

module.exports = router;
