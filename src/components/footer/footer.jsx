import React from 'react'
import style from "./footer.module.css"
import QrcodeImage from '../../assets/footer/QRCode.png';
import StoreImage from '../../assets/footer/storeimg.png';
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      <div className="container-fluid">
        <div className={`${style.FooterContainer}`}>
            <div className="d-flex justify-content-between">
            <div className={` ${style.footerChild1} mb-5 row`}>
                {/* Column 1 */}
                <div className="col">
                    <ul className="list-unstyled">
                        <li >About Us</li>
                        <li className="mt-3">Sell With Us</li>
                        <li className="mt-3">Coupons & Deals</li>
                        <li className="mt-3">Cancellation & Refund</li>
                        <li className="mt-3">Terms And Conditions</li>
                        <li className="mt-3">Retail Stores</li>
                        <li className="mt-3">Career</li>
                    </ul>
                </div>

                {/* column 2 */}
                <div className="col ms-5">
                    <ul className="list-unstyled">
                        <li>Media</li>
                        <li className="mt-3">Privacy Policy</li>
                        <li className="mt-3">Reviews</li>
                        <li className="mt-3">Blogs</li>
                        <li className="mt-3">Sitemap</li>
                        <li className="mt-3">Quotes</li>
                    </ul>
                </div>

                {/* column 3 */}
                <div className="col ">
                    <ul className="list-unstyled">
                        <li>Corporate Gifts</li>
                        <li className="mt-3">Franchise</li>
                        <li className="mt-3">FAQ</li>
                        <li className="mt-3">Contact Us</li>
                        <li className="mt-3">Whatsapp</li>
                        <li className="mt-3">Download App</li>
                    </ul>
                </div>
            </div> 
            <div className={`${style.footerChild2} mb-5`}>
                <h6 className="fw-semibold text-center">Simplfy Your Gifting Experience With Our App</h6>
                {/* QRcode and Storeicon */}
                <div className='d-flex justify-content-center gap-5 mb-4 h-50'>
                  <div>
                  <img className='mt-4' src={QrcodeImage} alt="QRCode" width="90" />
                  </div>
                  <div>
                  <img className='mb-4' src={StoreImage} alt="Store Icons" width="140"/>
                  </div>
                </div>

                <h6 className='fw-semibold text-center mb-2'>Spread the Love On Social Media</h6>
                {/* social media icons */}
                <div className='d-flex justify-content-center gap-4 mt-4'>
                  <FaFacebook size={20} color='blue'/>
                  <FaSquareXTwitter size={20} color='black'/>
                  <FaYoutube size={20} color='red'/>
                  <FaPinterest size={20} color='red'/>
                  <FaInstagram size={20}/>
                  <FaLinkedin size={20}/>
                </div>

            </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Footer
