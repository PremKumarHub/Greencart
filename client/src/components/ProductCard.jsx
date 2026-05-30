import React from 'react';
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContex";
const ProductCard = ({ product }) => {

    const { currency, addtoCart, removeFromCart, cartItems, navigate } = useAppContext()
    return product && (
        <div
            onClick={() => {
                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
                scrollTo(0, 0)
            }}
            className="border border-gray-500/20 rounded-md md:px-4 px-2 py-2 bg-white w-full hover:shadow-sm transition-all"
        >

            <div className="group cursor-pointer flex items-center justify-center px-1">
                <img className="group-hover:scale-105 transition max-w-[100px] md:max-w-36 h-[100px] md:h-36 object-contain" src={product.images?.[0] || product.image?.[0] || assets.upload_area} alt={product.name} />
            </div>
            <div className="text-gray-500/60 text-sm mt-2">
                <p className="text-[10px] md:text-sm">{product.category}</p>
                <p className="text-gray-700 font-medium text-sm md:text-lg truncate w-full">{product.name}</p>
                <div className="flex items-center gap-0.5">
                    {Array(5).fill('').map((_, i) => (

                        <img key={i} className="md:w-3.5 w-2.5" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" />

                    ))}
                    <p className='text-[10px] md:text-sm'>({4})</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between mt-2 md:mt-3 gap-2">
                    <p className="md:text-xl text-sm font-medium text-primary">
                        {currency} {product.offerPrice}{""} <span className="text-gray-500/60 md:text-sm text-[10px] line-through ml-1">{product.price}</span>
                    </p>
                    <div onClick={(e) => { e.stopPropagation(); }} className="text-primary w-full md:w-auto">
                        {!cartItems?.[product._id] ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 w-full md:w-[80px] h-8 md:h-[34px] rounded cursor-pointer text-xs md:text-sm font-medium hover:bg-primary/20 transition"
                                onClick={() => addtoCart(product._id)}
                            >
                                <img src={assets.cart_icon} alt="cart icon" className='w-3 md:w-4'/>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2 w-full md:w-20 h-8 md:h-[34px] bg-primary/25 rounded select-none">
                                <button
                                    onClick={() => removeFromCart(product._id)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center text-sm">{cartItems[product._id]}</span>
                                <button
                                    onClick={() => addtoCart(product._id)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};
export default ProductCard
