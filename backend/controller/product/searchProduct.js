const productModel = require("../../models/productModel")

const SearchProduct = async(req,res)=>{
    try {
        const query = req.query.q

        const regex = new RegExp(query,'i','g')

        const product = await productModel.find({
            "$or":[
                {
                    productName:regex
                },

                {
                    category:regex
                }
            ]
        })

        res.json({
            data:product,
            message:"Search product success",
            error:false,
            success:true
        })

    } catch (error) {
        res.json({
            message : error.message || error ,
            error : true,
            success : false,
        })
    }
}

module.exports=SearchProduct