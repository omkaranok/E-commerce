
import { Outlet } from 'react-router-dom';
import Header from './componenets/Header';
import Footer from './componenets/Footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common/index.js';
import Context from './context/index.js';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice.js';

function App() {
  const dispatch=useDispatch()
  const [cartProductCount,setcartProductCount]=useState(0)

  const fetchUserDetails=async()=>{
    const dataResponse= await fetch(SummaryApi.current_user.url,{
      method:SummaryApi.current_user.method,
      credentials:'include'
    })

    const dataApi=await dataResponse.json()
    
    if(dataApi.success){
       dispatch(setUserDetails(dataApi.data))
    }
  }

  const fetchUserAddToCart = async()=>{
    const dataResponse= await fetch(SummaryApi.addToCartProductCount.url,{
      method:SummaryApi.addToCartProductCount.method,
      credentials:'include'
    })

    const dataApi=await dataResponse.json()

    console.log("dataapi",dataApi)

    setcartProductCount(dataApi?.data?.count)

  }

  useEffect(()=>{
    fetchUserDetails()
    {/**/}
    fetchUserAddToCart()
  },[])

  return (
    <>
     <Context.Provider value={{
      fetchUserDetails, //user details fetch
      cartProductCount, //current user add to cart product count
      fetchUserAddToCart
     }}>

      <ToastContainer position='top-center' />
      <Header/>
      <main className='min-h-[calc(100vh-120px)] pt-16'>
        <Outlet/>
      </main>
      <Footer/>
      </Context.Provider>
    </>
  );
}

export default App;
