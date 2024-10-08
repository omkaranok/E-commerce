import React, { useState } from 'react'
import { IoCloseSharp } from "react-icons/io5";
import productCategory from "../helpers/productCategory"
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const UploadProducts = ({
  onClose,
  fetchData
}) => {
  const [data,setData]=useState({
    productName:"",
    brandName:"",
    category:"",
    productImage:[],
    description:"",
    price:"",
    sellingPrice:""
  })
  
  const [FullScreenImage,setFullScreenImage]=useState(false)
  const [openfullScreenImage,setopenfullScreenImage]=useState("")
  
  const handleOnChange = (e)=>{
    const {name,value} = e.target
    setData((prev)=>{
      return{
        ...prev,
        [name]:value
      }
    })
  }

  const handleUploadProduct=async(e)=>{
      const file=e.target.files[0]
      const uploadImageClodinary=await uploadImage(file)

      setData((prev)=>{
        return{
          ...prev,
          productImage : [ ...prev.productImage,uploadImageClodinary.url]
        }
      })
  }

  const handleDeleteProductImage=async(index)=>{
    console.log("image index",index)
    const newProductImage =[...data.productImage]
    newProductImage.splice(index,1)

    setData((prev)=>{
      return{
        ...prev,
        productImage:[...newProductImage]
      }
    })
  }

  {/***upload product */}
  const handlesubmit=async(e)=>{
    e.preventDefault()
    // console.log("data for product",data)
    const response = await fetch(SummaryApi.uploadProduct.url,{
      method:SummaryApi.uploadProduct.method,
      credentials:'include',
      headers:{
        "content-type":"application/json"
      },
      body:JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
      toast.success(responseData?.message)
      onClose()
      fetchData()
    }

    if(responseData.error){
      toast.error(responseData?.message)
    }
  }

  return (
    <div className='fixed bg-slate-200 bg-opacity-35 w-full h-full top-0 right-0 left-0 bottom-0 flex justify-center items-center'>
        <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden '>
            <div className='flex justify-between items-center pb-3'>
                <h2 className='font-bold text-lg'>Upload Product</h2>
                <div className='w-fit ml-auto text-2xl hover:text-red-600' onClick={onClose}>
                    <IoCloseSharp/>
                </div>
            </div>

            <form className='grid p-4 gap-3 overflow-y-scroll h-full pb-20' onSubmit={handlesubmit}>
                <label htmlFor='productName'>productName:</label>
                <input 
                type='text' 
                id='productName' 
                name='productName'
                placeholder='enter product name' 
                value={data.productName} 
                onChange={handleOnChange}
                className='p-2 bg-slate-100 rounded'
                required
                />

                <label htmlFor='brandName'>Brand Name:</label>
                <input 
                type='text' 
                id='brandName' 
                name='brandName'
                placeholder='enter brand name' 
                value={data.brandName} 
                onChange={handleOnChange}
                className='p-2 bg-slate-100 rounded'
                required
                />

              <label htmlFor='category' className='mt-3'>Category :</label>
              <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                <option value={""}>Select Category</option>
                {
                  productCategory.map((el,index)=>{
                    return(
                      <option value={el.value} key={el.value+index}>{el.label}</option>
                    )
                  })
                }
              </select>

               <label htmlFor='productImage' className='mt-3'>Product Image:</label>
               <label htmlFor='uploadImageInput' >
                <div className='p-2 bg-slate-100 rounded h-32 w-full flex justify-center items-center cursor-pointer'>             
                      <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>  
                        <span className='text-4xl'><FaCloudUploadAlt/></span>
                        <p className='text-sm'>Upload Product Image</p>   
                        <input type='file' id='uploadImageInput' className='hidden ' onChange={handleUploadProduct}/>               
                      </div>     
                </div>
               </label>
               <div>
                {
                  data?.productImage[0] ? (
                    <div className='flex items-center gap-2'>
                      {
                        data.productImage.map((el,index)=>{
                          return(
                            <div className='relative'>
                              <img 
                              src={el} 
                              alt={el} 
                              width={80} 
                              height={80} 
                              className='bg-slate-100 border cursor-pointer' 
                              onClick={()=>{
                                setopenfullScreenImage(true)
                                setFullScreenImage(el)
                              }}/>

                              <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full  cursor-pointer'  onClick={()=>handleDeleteProductImage(index)}>
                               <MdDelete/>
                              </div>  
                            </div>  
                          )
                        })
                     }
                    </div> 

                  ):(
                    <p className='text-red-600 text-sm'>*Please upload product image</p>
                  )
                }
                
               </div>

               <label htmlFor='price' className='mt-3'>Price:</label>
               <input 
                type='number' 
                id='price' 
                name='price'
                placeholder='enter price' 
                value={data.price} 
                onChange={handleOnChange}
                className='p-2 bg-slate-100 rounded'
                required
                />

               <label htmlFor='sellingPrice' className='mt-3'>Selling Price:</label>
               <input 
                type='number' 
                id='sellingPrice' 
                name='sellingPrice'
                placeholder='enter selling price' 
                value={data.sellingPrice} 
                onChange={handleOnChange}
                className='p-2 bg-slate-100 rounded'
                required
                />

               <label htmlFor='description' className='mt-3'>Description :</label>
               <textarea 
                className='p-1 h-28 bg-slate-100 resize-none' 
                rows={3} 
                placeholder="enter product description"
                onChange={handleOnChange}
                name='description'
                value={data.description}
                >
 
                </textarea>
               <button className='px-3 py-2 bg-red-600 text-white hover:bg-red-700' >Upload product</button>

            </form>
        </div>

        {/** */}

        {
          openfullScreenImage && (
            <DisplayImage onClose={()=>setopenfullScreenImage(false)} imgUrl={FullScreenImage}/>

          )
        }
        
    </div>
  )
}

export default UploadProducts