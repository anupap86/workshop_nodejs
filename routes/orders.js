var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')


//แสดงorders ทุกรายการ
router.get('/orders', async function(req, res, next) {
    try{
        let id = req.auth.payload.id;
        let products = await userSchema.findById(id);                
        res.send({"status" : 200,
              "messages" : "sucess",
              "Data":["สำเร็จ",products.order]
          })

    }catch(error){
        res.send(error);
    }
 
  
});

//แสดงorders ทั้งหมดของproductนั้น
router.get('/products/:product_id/orders', async function(req, res, next) {
    try{
        let id = req.auth.payload.id;
        let product_id = req.params.product_id
        let user = await userSchema.findOne({ _id: id });
        
         
      const filteredOrders = user.order.filter(
        o => o.product_id.toString() === product_id.toString()
      );     
        res.send({"status" : 200,
              "messages" : "sucess",
              "Data":["สำเร็จ",filteredOrders]
          })

    }catch(error){
        res.send(error);
    }
  
});

//เพิ่มorderในproduct
router.post('/products/:product_id/orders', async function(req, res, next) {
    try{
        let id = req.auth.payload.id;
        let product_id = req.params.product_id
        let { orders_number} = req.body
        let user = await userSchema.findOne(
            { _id: id },
            {  product: { $elemMatch: { _id: product_id } }   }
            ); 
        if (orders_number > user.product[0].stock){
            throw {"status" : 400,
                "messages" : "ไม่สำเร็จ",
                "data":[{
                    "เหลือในstock":user.product[0].stock
                }]
                }
        }
        let orderItem = {
            product_id: user.product[0]._id,
            nameOrder: user.product[0].name ,
            number: orders_number,
            time: new Date()
          };

         await userSchema.updateOne(({ _id: id },{  product: { $elemMatch: { _id: product_id } }   }),{
                $set:{              
                    'product.$.stock': user.product[0].stock - orders_number
                 
                },
                $push:{
                    order:orderItem
                  }
              })
        
        res.send({"status" : 200,
            "messages" : "สำเร็จ",
            "data":[{
                "รายการ":orderItem.nameOrder,
                "จำนวน":orderItem.number,
                "เวลา":orderItem.time

            }]
            });

    }catch(error){
        res.send(error)
    }
 
  });

module.exports = router;