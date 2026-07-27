import React, { useState } from 'react';
import { useAppContext } from '../context/AppContex';
import toast from 'react-hot-toast';

const NewsLetter = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { axios } = useAppContext();

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            const { data } = await axios.post('/api/user/subscribe', { email });

            if (data.success) {
                toast.success(data.message);
                setEmail('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Subscription failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-2 mt-24 pb-14">
            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
            <p className="md:text-lg text-gray-500/70 pb-8">
                Subscribe to get the latest offers, new arrivals, and exclusive discounts
            </p>
            <form onSubmit={onSubmitHandler} className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="email"
                    placeholder="Enter your email id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button 
                    type="submit" 
                    disabled={loading}
                    className="md:px-12 px-8 h-full text-white bg-primary hover:bg-primary/90 disabled:opacity-50 transition-all cursor-pointer rounded-md rounded-l-none font-medium flex items-center justify-center whitespace-nowrap"
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </div>
    );
};

export default NewsLetter;