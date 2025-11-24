import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './allcake.module.css';

export default function AllCake() {
  const cakeCategories = [
    {
      id: 1,
      title: 'Cakes Combos',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Kids Cakes',
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e5b80c87?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Pinata Cakes',
      image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Pull Me Up Cakes',
      image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: 'Bento Cakes',
      image: 'https://images.unsplash.com/photo-1562440499-64c9a4c7abcf?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop'
    }
  ];

  return (

    <div className="">
      {/* Top Section - Birthday and Anniversary */}
      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        <div className="col-12 col-sm-6 col-md-6">
          <div className={`card rounded-4 overflow-hidden ${style.cakeCard}`}>
            <img
              src="https://imgcdn.floweraura.com/birthday_cake_rectangle_card_3.jpg"
              className={`card-img-top ${style.cardImage}`}
              alt="Birthday Cakes"
            />
            <div className={`card-body d-flex justify-content-between align-items-center ${style.cardBody}`}>
              <h4 className={style.cardTitle}>Birthday Cakes</h4>
              <button className="btn-viewall">VIEW ALL</button>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6">
          <div className={`card rounded-4 overflow-hidden ${style.cakeCard}`}>
            <img
              src="https://imgcdn.floweraura.com/anniversary_cake_rectangle_card_1_0.jpg"
              className={`card-img-top ${style.cardImage}`}
              alt="Anniversary Cakes"
            />
            <div className={`card-body d-flex justify-content-between align-items-center ${style.cardBody}`}>
              <h4 className={style.cardTitle}>Anniversary Cakes</h4>
              <button className="btn-viewall">VIEW ALL</button>
            </div>
          </div>
        </div>
      </div>




    </div>

  );
}