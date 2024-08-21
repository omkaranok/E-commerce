const userModel = require("../../models/userModels")

async function userDetailsController(req,res){
    try {
        console.log("userId",req.userId)
        const user=await userModel.findById(req.userId)
        res.status(200).json({
            data:user,
            error:false,
            success:true,
            message:"User details"
        })
        // console.log("user",user)
    } catch (error) {
        res.status(400).json({
            message:error || error.message,
            error:true,
            success:false
        })
    }
}

module.exports=userDetailsController