var express = require('express');
var router = express.Router();
var userSchema = require('../model/user.model')


//แสดงรายการproducts ทั้งหมด
router.get('/products', async function(req, res, next) {
  try{    
    let id = req.auth.payload.id;
    let products = await userSchema.findById(id);
  
    res.send({"status" : 200,
      "messages" : "sucess",
      "Data":["สำเร็จ",products.product]
  })
  }catch(error){
    res.send(error)
  }
  });

  //เพิ่มรายการproduct
router.post('/products', async function(req, res, next) {
    try{
      let id = req.auth.payload.id;
        let {products_name ,products_stock}   = req.body
        let products = await userSchema.findOne(
          { _id: id },
          {  product: { $elemMatch: { name: products_name  } }   }
        );
        if (products.product.length > 0) {
            throw{"status" : 400,
                "messages" : "ไม่สำเร็จ",
                "Data":["รายการนี้มีอยู่แล้ว"]
            }
        }
        
        await userSchema.findByIdAndUpdate(id,{
          $push:{
            product:{
              name: products_name,
              stock: products_stock
            }
          }
        })

        res.send({"status" : 201,
          "messages" : "sucess",
          "Data":["บันทึกสำเร็จ",{
              name: products_name,
              stock: products_stock
          }]
      })
    }catch(error){
        res.send(error)

    }   
  });

//ดูรายการproduct 1รายการ
  router.get('/products/:product_id', async function(req, res, next) {
    try{    
      let id = req.auth.payload.id;
      let product_id =req.params.product_id;
      let product = await userSchema.findOne(
        { _id: id },
        {  product: { $elemMatch: { _id: product_id } }   }
      );

      if (product.product.length == 0 ) {
        throw{"status" : 400,
            "messages" : "ไม่สำเร็จ",
            "Data":["ไม่มีรายการนี้"]
        }
    }      
  
      return res.send({
        "status": 200,
        "message": "success",
        "data": ["สำเร็จ", product]
      });
    }catch(error){
      res.send(error)
    }
    });

//แก้ไขรายการproduct
  router.put('/products/:product_id', async function(req, res, next) {
    try{        
      let id = req.auth.payload.id;
      let product_id =req.params.product_id;
      let {products_name ,products_stock} = req.body
      let user = await userSchema.findById(id);

      let isDuplicate = user.product.some(p => p.name === products_name && p._id.toString() !== product_id);
      if (isDuplicate) {
        throw {
          stats: 400,
          messages: "ไม่สำเร็จ",
          Data: ["ชื่อสินค้านี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น"]
        };
      }

      await userSchema.updateOne(({ _id: id },{  product: { $elemMatch: { _id: product_id } }   }),{
        $set:{         
            'product.$.name': products_name,
            'product.$.stock': products_stock
         
        }
      })

      res.send({"status" : 201,
        "messages" : "sucess",
        "Data":["บันทึกสำเร็จ",{
            name: products_name,
            stock: products_stock
        }]
    })

    }catch(error){
      res.send(error)

    }
    
  });

//ลบรายการอาหารในproducts
  router.delete('/products/:product_id', async function(req, res, next) {
    try{        
      let id = req.auth.payload.id;
      let product_id =req.params.product_id;

      let product = await userSchema.findOne(
        { _id: id },
        {  product: { $elemMatch: { _id: product_id } }   }
      );

      if (product.product.length == 0) {
        throw{"status" : 400,
            "messages" : "ไม่สำเร็จ",
            "Data":["ไม่มีรายการนี้"]
        }
    }    
      await userSchema.updateOne(
        { _id: id },
        {
          $pull: {
            product: { _id: product_id }
          }
        }
      );

      res.send({"status" : 200,
        "messages" : "sucess",
        "Data":["ลบสำเร็จ",{
          "รายการ":product.product[0].name
        }]
    })

    }catch(error){
      res.send(error)

    }
    
  });

module.exports = router;