import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContex'; // adjust the path as needed
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';


function Navbar() {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, setCartItems, authLoading } = useAppContext();
    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
            }
        }
        catch (error) {
            toast.error(error.message)
        }
        // Always clear client state regardless of server response
        setUser(null);
        setCartItems({});
        navigate('/');
    }
    useEffect(() => {
        if (typeof searchQuery === "string" && searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery])
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to="/" onClick={() => setOpen(false)}>
                <img src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">

                <NavLink to="/">Home</NavLink>
                <NavLink to="/Products">All  product</NavLink>
                <NavLink to="/my-orders">My orders</NavLink>


                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input
                        value={searchQuery} // <-- THIS is important!
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
                        type="text"
                        placeholder="Search products"
                    />

                    <img src={assets.search_icon} className='w-4 h-4' />
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {authLoading ? (
                    <button disabled className="opacity-50 cursor-not-allowed px-8 py-2 bg-green-500 text-white rounded-full">
                        Login
                    </button>
                ) : !user ? (
                    <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-green-500 hover:bg-green-600 transition text-white rounded-full">
                        Login
                    </button>
                ) : user && (
                    <div className='relative group'>
                        <img src={assets.profile_icon} className='w-10' alt='' />
                        <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
                            <li onClick={() => navigate("my-orders")} className='p-1.5 px-3 hover:bg-primary/10 cursor-pointer'>
                                My Orders
                            </li >
                            <li onClick={logout} className='p-1.5 p1-3 hover:bg-primary/10 cursor-pointer'>logout</li>
                        </ul>
                    </div>
                )}
            </div>
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="cart" className='w-6 opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-green-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt='menu' />
                </button>
            </div>


            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 bottom-0 overflow-hidden bg-white/95 backdrop-blur-md transition-all z-50 ${open ? 'w-full sm:w-80' : 'w-0'}`}>
                <div className='flex flex-col text-gray-700 h-full'>
                    <div onClick={() => setOpen(false)} className='flex items-center gap-4 p-6 cursor-pointer border-b border-gray-100'>
                        <img className='h-4 rotate-180 opacity-60' src={assets.black_arrow_icon} alt="" />
                        <p className='font-medium'>Back</p>
                    </div>
                    
                    <div className='flex flex-col py-2'>
                        <NavLink 
                            onClick={() => setOpen(false)} 
                            className={({isActive}) => `py-4 px-8 border-b border-gray-50 flex items-center justify-between transition-colors ${isActive ? 'bg-green-50 text-green-600 font-semibold' : 'hover:bg-gray-50'}`} 
                            to="/"
                        >
                            <span>Home</span>
                            <img src={assets.arrow_right_icon_colored} className='w-3 opacity-40' alt="" />
                        </NavLink>
                        
                        <NavLink 
                            onClick={() => setOpen(false)} 
                            className={({isActive}) => `py-4 px-8 border-b border-gray-50 flex items-center justify-between transition-colors ${isActive ? 'bg-green-50 text-green-600 font-semibold' : 'hover:bg-gray-50'}`} 
                            to="/Products"
                        >
                            <span>All Products</span>
                            <img src={assets.arrow_right_icon_colored} className='w-3 opacity-40' alt="" />
                        </NavLink>
                        
                        {user && (
                            <NavLink 
                                onClick={() => setOpen(false)} 
                                className={({isActive}) => `py-4 px-8 border-b border-gray-50 flex items-center justify-between transition-colors ${isActive ? 'bg-green-50 text-green-600 font-semibold' : 'hover:bg-gray-50'}`} 
                                to="/my-orders"
                            >
                                <span>My Orders</span>
                                <img src={assets.arrow_right_icon_colored} className='w-3 opacity-40' alt="" />
                            </NavLink>
                        )}
                        
                        <NavLink 
                            onClick={() => setOpen(false)} 
                            className={({isActive}) => `py-4 px-8 border-b border-gray-50 flex items-center justify-between transition-colors ${isActive ? 'bg-green-50 text-green-600 font-semibold' : 'hover:bg-gray-50'}`} 
                            to="/contact"
                        >
                            <span>Contact</span>
                            <img src={assets.arrow_right_icon_colored} className='w-3 opacity-40' alt="" />
                        </NavLink>
                    </div>

                    <div className='mt-auto p-8 border-t border-gray-100'>
                        {!user ? (
                            <button 
                                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium shadow-lg shadow-green-200 transition-all active:scale-95" 
                                onClick={() => {
                                    setOpen(false);
                                    setShowUserLogin(true);
                                }}
                            > 
                                Login 
                            </button>
                        ) : (
                            <div className='flex flex-col gap-4'>
                                <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                                    <img src={assets.profile_icon} className='w-10' alt='' />
                                    <div>
                                        <p className='text-xs text-gray-500'>Logged in as</p>
                                        <p className='font-medium text-sm truncate'>{user.name || 'User'}</p>
                                    </div>
                                </div>
                                <button 
                                    className="w-full py-3 bg-white border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-all" 
                                    onClick={() => {
                                        setOpen(false);
                                        logout();
                                    }}
                                > 
                                    Logout 
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
