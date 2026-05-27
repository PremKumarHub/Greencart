import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContex';
import toast from 'react-hot-toast';

const InputField = ({ type = 'text', placeholder, name, value, onChange }) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    value={value}
    onChange={onChange}
  />
);

function AddAdress() {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: user?._id || user?.id,
          firstName: address.firstName,
          lastName: address.lastName,
          email: address.email,
        address: address.street,
        city: address.city,
        state: address.state,
        zip: address.zipcode,
        country: address.country,
        phone: address.phone,
      };
      const { data } = await axios.post('/api/address/add', payload);
      if (data.success) {
        toast.success(data.message || 'Address added successfully');
        navigate('/cart');
      } else {
        toast.error(data.message || 'Failed to add address');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    }
  };

  return (
    <div className="mt-16 pb-16">
      <p>
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="firstName"
                type="text"
                placeholder="First name"
                value={address.firstName}
                onChange={handleChange}
              />
              <InputField
                name="lastName"
                type="text"
                placeholder="Last name"
                value={address.lastName}
                onChange={handleChange}
              />
            </div>

            <InputField
              name="email"
              type="email"
              placeholder="Email address"
              value={address.email}
              onChange={handleChange}
            />

            <InputField
              name="street"
              type="text"
              placeholder="Street"
              value={address.street}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="city"
                type="text"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
              />
              <InputField
                name="country"
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="zipcode"
                type="text"
                placeholder="Zipcode"
                value={address.zipcode}
                onChange={handleChange}
              />
              <InputField
                name="state"
                type="text"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
              />
            </div>

            <InputField
              name="phone"
              type="text"
              placeholder="Phone"
              value={address.phone}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase"
            >
              Save address
            </button>
          </form>
        </div>
        <img
          className="md:mr-16 mb-16 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
}

export default AddAdress;
