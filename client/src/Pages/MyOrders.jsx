import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContex'
import { dummyOrders } from '../assets/assets'
import toast from 'react-hot-toast'

function MyOrders() {
  const [myorders, setmyOrders] = useState([])
  const { currency, axios, user } = useAppContext()

  const fetchMyOrders = async () => {

    try{
      const {data}= await axios.post('/api/order/user', { userId: user?._id })
      console.log('fetchMyOrders response:', data)
      if(data.success){
        setmyOrders(data.orders)
        if(!data.orders || data.orders.length === 0){
          toast('No orders found for this account')
        }
      } else {
        toast.error(data.message || 'Failed to fetch orders')
        setmyOrders([])
      }
    }
    catch(error){
      console.log(error);
      toast.error(error.message || 'Failed to fetch orders')
    }
  }

  useEffect(() => {
    if(user){
      fetchMyOrders()
    }

  }, [user])

  return (
    <div className='mt-16 pb-16'>
      <div className='flex flex-col items-end w-max mb-8'>
        <p className='text-2xl font-medium uppercase'> My orders </p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      {myorders.map((order, index) => (
        <div key={index} className='border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl'>
          <p className='flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col'>
            <span>OrderId: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>Total Amount: {currency}{order.amount}</span>
          </p>

          {order.items.map((item, itemIndex) => (
            <div key={itemIndex}
              className={`relative bg-white text-gray-500/70 ${order.items.length !== index+1 ? 'border-b border-gray-300' : ''} flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}>
              <div className='flex items-center mb-4 md:mb-0'>
                <div className='bg-primary/10 p-4 rounded-lg'>
                  <img src={item.productId?.images?.[0] || item.productId?.image?.[0]} alt="" className='w-16 h-16' />
                </div>
                <div>
                  <h2>{item.productId?.name}</h2>
                  <p>Category: {item.productId?.category}</p>
                </div>
              </div>
              <div className='flex flex-col justify-center md:ml-8 mb-4 md:mb-0'>
                <p>Quantity: {item.quantity || 1}</p>
                <p>Status: {order.status === 'pending' ? 'Order placed' : (order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A')}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <p className='text-primary text-lg font-medium'>
                Amount: {currency}{(item.productId?.offerPrice || 0) * (item.quantity || 1)}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MyOrders

