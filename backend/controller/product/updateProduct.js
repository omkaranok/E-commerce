const uploadProductPermission=require('../../helpers/permission.js')
const productModel = require('../../models/productModel.js')

async function updateProductController(req,res){
    try {

        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }
        
        const { _id, ...resBody}=req.body
        
        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)

        res.json({
            message:"Product updated successfully",
            data:updateProduct,
            success:true,
            error:false
        })

    } catch (error) {
        res.json({
            message : error.message || error  ,
            error : true,
            success : false,
        })
    }
}

module.exports=updateProductController