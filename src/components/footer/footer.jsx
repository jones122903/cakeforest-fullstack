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
          <div className={`${style.flexBetween}`}>
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
              <div className="col">
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
              <div className="col">
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
              <h6 className={`${style.footerheading}`}>Simplfy Your Gifting Experience With Our App</h6>
              {/* QRcode and Storeicon */}
              <div className={`${style.qrSection}`}>
                <div>
                  <img className={`${style.qrcode}mt-4`} src={QrcodeImage} alt="QRCode" width="90" />
                </div>
                <div>
                  <img className={`${style.store}mt-4`} src={StoreImage} alt="Store Icons" width="140" />
                </div>
              </div>

              <h6 className={`${style.socialHeading}`}>Spread the Love On Social Media</h6>
              <div className={`${style.socialIconsContainer}`}>
                <div className={`${style.iconBox} ${style.facebook}`}>
                  <FaFacebook size={28} color="white" />
                </div>

                <div className={`${style.iconBox} ${style.twitter}`}>
                  <FaSquareXTwitter size={28} color="white" />
                </div>

                <div className={`${style.iconBox} ${style.youtube}`}>
                  <FaYoutube size={28} color="white" />
                </div>

                <div className={`${style.iconBox} ${style.pinterest}`}>
                  <FaPinterest size={28} color="white" />
                </div>

                <div className={`${style.iconBox} ${style.instagram}`}>
                  <FaInstagram size={28} color="white" />
                </div>

                <div className={`${style.iconBox} ${style.linkedin}`}>
                  <FaLinkedin size={28} color="white" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
