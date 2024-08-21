import SummaryApi from "../common"
import { toast } from "react-toastify"

const addToCard = async(e,id) => {
    e?.stopPropagation()
    e?.preventDefault()

    const response=await fetch(SummaryApi.addToCartProduct.url,{
        method:SummaryApi.addToCartProduct.method,
        credentials:'include',
        headers:{
            "content-type":'application/json'
        },
        
        body:JSON.stringify(
            { productId : id }
        )

    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData.message)
    }

    if(responseData.error){
        toast.success(responseData.message)
    }


    return responseData
    
}

export default addToCard