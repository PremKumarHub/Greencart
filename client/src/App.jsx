import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import { Toaster } from "react-hot-toast"
import Footer from './components/Footer'
import { useAppContext } from './context/AppContex'
import Login from './components/Login'
import AllProducts from './Pages/AllProducts'
import ProductCategory from './Pages/ProductCategory'
import ProductDetails from './Pages/ProductDetails'
import Cart from './Pages/Cart'
import AddAdress from './Pages/AddAdress'
import MyOrders from './Pages/MyOrders'
import Loading from './Pages/seller/Loading'
import axios from 'axios';



// Seller Pages
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './Pages/seller/SellerLayout'
import ProductList from './Pages/seller/ProductList'
import Orders from './Pages/seller/Orders'
import AddProduct from './Pages/seller/AddProduct' // ✅ MISSING IMPORT FIXED

// Add this line right here 👇
axios.defaults.withCredentials = true;

function App() {
  const isSellerPath = useLocation().pathname.includes("seller")
  const { showUserLogin, isSeller } = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      <Toaster />
      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>

          {/* User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<AllProducts />} />
          <Route path='/products/:category' element={<ProductCategory />} />
          <Route path='/products/:category/:id' element={<ProductDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/add-address' element={<AddAdress />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path='/Loading' element={<Loading />} />
          <Route path='/loader' element={<Loading />} />

          {/* Seller Routes */}
          <Route path='/seller' element={isSeller ? <SellerLayout /> : <SellerLogin />}>
            <Route index element={<AddProduct />} />
            <Route path='product-list' element={<ProductList />} />
            <Route path='orders' element={<Orders />} />
          </Route>

        </Routes>
      </div>
      {!isSellerPath && <Footer />}
      {showUserLogin && <Login />}
    </div>
  )
}

export default App
