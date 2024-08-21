import React, { useEffect, useState } from 'react'
import UploadProducts from '../componenets/UploadProducts'
import SummaryApi from '../common'
import AdminProductCard from '../componenets/AdminProductCard'

const AllProducts = () => {
  const [openUploadProduct,setopenUploadProduct]=useState(false)
  const [allProduct,setallProduct]=useState([])

  const fetchAllProduct=async()=>{
    const response=await fetch(SummaryApi.allProduct.url)
    const dataResponse = await response.json()
    console.log("product data",dataResponse)
    setallProduct(dataResponse?.data || [])
    
  }

  useEffect(()=>{
    fetchAllProduct()
  },[])
  
  return (
    
    <div>
      <div className='bg-white py-2 px-4 flex justify-between items-center'>
        <h2 className='font-bold text-lg'>All Products</h2>
        <button className='border-2 border-red-600 py-1 px-3 rounded-full hover:bg-red-600 hover:text-white transition-all' onClick={()=>setopenUploadProduct(true)}>Upload Product</button>
      </div>

      <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
        {
          allProduct.map((product,index)=>{
            return(
              <AdminProductCard data={product} key={index="allProduct"} fetchdata={fetchAllProduct}/> 
            )
          })
        }
      </div>

      {/**upload product component */}
      {
        openUploadProduct && (
          <UploadProducts onClose={()=>setopenUploadProduct(false)} fetchData={fetchAllProduct}/>
        )

      }
      
    </div>
  )
}

export default AllProducts