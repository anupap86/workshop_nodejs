const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const data = req.auth;
        if(data.payload.approve == false){
            throw {"stats" : 401,
                "messages" : "ไม่มีสิทธิ"
                }
        }

        
   
        return next();

    }catch(error){
        return res.send(error)
        
    }
}