const addToCardModel = require("../../models/cartProduct")

const countAddToCartProduct=async(req,res)=>{
    try {
      const userId=req.userId  

      const count = await addToCardModel.countDocuments({
        userId:userId
      })

      res.json({
        data:{
            count:count
        },
        message:"ok",
        error:false,
        success:true
      })

    } catch (err) {
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        }) 
    }
}

module.exports=countAddToCartProduct