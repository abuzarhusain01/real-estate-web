import React from 'react'
import Link from 'next/link';

const footer = () => {
  return (
    <footer className="bg-[#f9f5f1] text-gray-800 py-12">
      <div className="max-w-7xl mx-auto   px-4 grid grid-cols-1 md:grid-cols-3 gap-60">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <img src="/f2logo.png" alt="" className=' h-[60px]  w-[70px] ' />
          <span className="text-gray-600">
            F2<span className="text-teal-400">Realtors</span>
          </span>
        </Link>
        <div>
          <h2 className="text-2xl  mb-4">About Us</h2>
          <p className="text-gray-600">
            At  F2 Realtors, we pride ourselves on being a trusted and reputable
            name in the  F2 Realtors industry with years of experience.
          </p>
        </div>

        <div>
          <h2 className="text-2xl  mb-4">Contact Info</h2>
          <p className="text-teal-600">F2 Fintech Pvt Ltd, A-25, M-1 Arv Park, A-Block, Sector 63, Noida</p>
          <p className="text-teal-600">contact@info.com</p>
          <p className="text-teal-600">+918810600135</p>
          <span className='text-[#f9f5f1] text-[5px] hover:text-gray-300 '>4BU24R</span>
        </div>
      </div>

      <div className="border-t px-6 border-gray-200 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto ">
        <p className="text-lg  text-gray-600 mb-4 md:mb-0">
          Copyright © 2025 <span>
            F2<span className="text-teal-600">Realtors</span>
          </span>
        </p>
        <div className="flex space-x-4 text-black text-xl">
          <i className="fab fa-twitter"></i>
          <i className="fab fa-pinterest"></i>
          <i className="fab fa-youtube"></i>
          <i className="fab fa-instagram"></i>


        </div>
      </div>
    </footer>
  );
}


export default footer
