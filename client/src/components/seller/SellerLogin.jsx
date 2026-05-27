import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContex'
import axios from 'axios';
import toast from 'react-hot-toast';

function SellerLogin() {
    const { isSeller, setIsSeller, navigate } = useAppContext()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            const { data } = await axios.post('/api/seller/login', { email, password })
            if (data.success) {
                toast.success(data.message);
                setIsSeller(true);
                navigate("/seller");
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (isSeller) {
            navigate("/seller")
        }
    }, [isSeller, navigate])

    return !isSeller && (
        <form
            onSubmit={onSubmitHandler}
            className='min-h-screen flex items-center justify-center text-sm text-gray-600 py-12 px-4'
        >
            <div className='min-w-80 sm:min-w-88 p-6 rounded-lg shadow-xl border border-gray-200 w-full max-w-md'>
                <p className='text-2xl font-medium mb-6'>
                    <span className='text-primary'>Seller</span> Login
                </p>

                <div className='mb-4'>
                    <p>Email</p>
                    <input

                        type="email"
                        placeholder='Enter your email'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className='mb-6'>
                    <p>Password</p>
                    <input
                        type="password"
                        placeholder='Enter your password'
                        className='border border-gray-200 rounded w-full p-2 mt-1 outline-primary'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className='bg-primary text-white w-full py-2 rounded-md cursor-pointer'
                >
                    Login
                </button>
            </div>
        </form>
    )
}

export default SellerLogin
