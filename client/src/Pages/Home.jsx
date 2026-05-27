import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import Bestsellers from '../components/Bestsellers'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../assets/NewsLetter'


const Home=()=> {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <Bestsellers/>
        <BottomBanner/>
        <NewsLetter/>
      
    </div>
  )
}

export default Home