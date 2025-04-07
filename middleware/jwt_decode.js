const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split("Bearer")[1];
        if (!token) {
           throw{
              'stats': 401,
              'messages': "ไม่พบ token",
            };
          }
      
        var privateKey = process.env.KEY;
        const decoded = jwt.verify(token.trim(),privateKey);
        req.auth = decoded 
        return next();

    }catch(error){
        return res.send(error)
        
    }
}