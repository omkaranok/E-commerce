const addToCartModel = require("../../models/cartProduct.js")

const addToCartViewProduct = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({
            userId : currentUser
        }).populate('productId')

        // console.log("All products:", JSON.stringify(allProduct, null, 2))

        res.json({
            data : allProduct,
            success : true,
            error : false
        })

    }catch(err){
        console.error("Error in addToCartViewProduct:", err)
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports=addToCartViewProduct