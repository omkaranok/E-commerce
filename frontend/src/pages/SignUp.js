import React,{useState} from 'react'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import loginIcons from '../assest/signin.gif'
import imageTobase64 from '../helpers/imageTobase64'; 
import SummaryApi from '../common/index.js';
import { toast } from 'react-toastify';

const SignUp = () => {

  const [showPassword,setshowPassword] =useState(false)
  const [showConfirmPassword,setshowConfirmPassword]=useState(false)
    const [data,setData]=useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        profilePic:""
    })

    const navigate = useNavigate()

    const handleOnChange=(e)=>{
        const  {name,value}=e.target

        setData((prev)=>{
            return{
                ...prev,
                [name]:value
            }
        })
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()

        if(data.password === data.confirmPassword){
            // console.log("SummaryApi.SignUp.url",SummaryApi.SignUp.url)
            const dataResponse=await fetch(SummaryApi.SignUp.url,{
                method:SummaryApi.SignUp.method,
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify(data)
            })
    
            const dataApi=await dataResponse.json()
            
            if(dataApi.success){
                toast.success(dataApi.message)
                navigate("/login")
            }

            if(dataApi.error){
                toast.error(dataApi.message)
            }

        }else{
            toast.error("Please check password and confirm password")
        }       
    }

    const handleUploadPic=async(e)=>{
      const file=e.target.files[0]
      
      const imagePic=await imageTobase64(file)
      console.log("imagePic",imagePic)
      setData((prev)=>{
        return{
          ...prev,
          profilePic:imagePic
        }
      })
    }

    console.log("data login",data)
  return (
    <section id='login'>
        <div className='mx-auto  container p-4'>
            <div className='bg-white  py-5 w-full p-2 max-w-sm mx-auto'>
                <div className='w-20 h-20  mx-auto relative overflow-hidden rounded-full'>
                    <div>
                      <img src={data.profilePic || loginIcons} alt ='login-icons'/>
                    </div>
                    <form>
                      <label>
                        <input type="file" className='hidden' onChange={handleUploadPic}/>
                        <div className='text-xs bg-opacity-80 cursor-pointer bg-slate-200 pb-4 pt-5 text-center absolute bottom-0 w-full'>
                          Upload photo
                        </div>
                      </label>                      
                    </form>
                </div>

                <form className='pt-5 flex flex-col gap-2 ' onSubmit={handleSubmit}>
                <div className='grid '>
                        <label>Name:</label>
                        <div className='bg-slate-200 p-2'>
                            <input 
                            type='text' 
                            placeholder='enter your name' 
                            name='name'
                            value={data.name}
                            onChange={handleOnChange}
                            required
                            className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>

                    <div className='grid '>
                        <label>Email:</label>
                        <div className='bg-slate-200 p-2'>
                            <input 
                            type='email' 
                            placeholder='enter email' 
                            name='email'
                            value={data.email}
                            onChange={handleOnChange}
                            required
                            className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>

                    <div>
                        <label>Password:</label>
                        <div className='bg-slate-200 p-2 flex'>
                            <input 
                            type={showPassword ?"text":"password"} 
                            placeholder='enter password'
                            value={data.password} 
                            name='password'
                            onChange={handleOnChange}
                            required
                            className='w-full h-full outline-none bg-transparent'/>
                            <div className='cursor-pointer text-xl' onClick={()=>setshowPassword((prev)=>!prev)}>
                                <span>
                                    {
                                        showPassword ? (
                                            <FaEyeSlash/>
                                        )
                                        :
                                        (
                                            <FaEye/>
                                        )
                                    }
                                </span>
                            </div>
                        </div>
    
                    </div>

                    <div>
                        <label>Confirm Password:</label>
                        <div className='bg-slate-200 p-2 flex'>
                            <input 
                            type={showConfirmPassword ?"text":"password"} 
                            placeholder='enter confirm password'
                            value={data.confirmPassword} 
                            name='confirmPassword'
                            onChange={handleOnChange}
                            required
                            className='w-full h-full outline-none bg-transparent'/>
                            <div className='cursor-pointer text-xl' onClick={()=>setshowConfirmPassword((prev)=>!prev)}>
                                <span>
                                    {
                                        showConfirmPassword ? (
                                            <FaEyeSlash/>
                                        )
                                        :
                                        (
                                            <FaEye/>
                                        )
                                    }
                                </span>
                            </div>
                        </div>
                        
                    </div>

                    <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4 '>Sign Up</button>
                </form>

                <p className='my-4'>Already have account?<Link to={"/login"} className='text-red-600 hover:text-red-700'>Sign up</Link></p>
            </div>
        </div>
    </section>
  )
}

export default SignUp