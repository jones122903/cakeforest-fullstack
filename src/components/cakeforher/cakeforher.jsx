import React from "react";
import style from "./cakeforher.module.css";

const Cakeforher = () => {
  const herOptions = ["Girls", "Wife", "Girlfriend", "Mother"];
  const himOptions = ["Boys", "Husband", "Boyfriend", "Father"];
  return (

    <div className="p-3 p-sm-4 p-md-5 grey-color-bg rounded-5">
      <div className="row g-3 g-md-4">
        <div className="col-12 col-sm-6 col-md-6">
          <div className={`card rounded-4 shadow-sm ${style.cakeCard}`}>
            <div className="row g-0">
              <div className="col-7 col-sm-7">
                <img
                  src="https://imgcdn.floweraura.com/her_25_2.jpg?tr=w-367,h-289,dpr-1.5,q-70"
                  className={`img-fluid ${style.cakeImageher}`}
                  alt="Cakes for Her"
                />
              </div>
              <div className="col-5 col-sm-5">
                <div className={`card-body h-100 d-flex flex-column justify-content-center ${style.cardContent}`}>
                  <h4 className={`mb-2 mb-md-3 ${style.cardTitle}`}>Cakes for Her</h4>
                  <ul className="list-unstyled">
                    {herOptions.map((option, index) => (
                      <li key={index} className={`mb-1 mb-md-2 ${style.listItem}`}>
                        <a href="#" className="text-decoration-none text-dark">
                          {option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-6">
          <div className={`card rounded-4 shadow-sm ${style.cakeCard}`}>
            <div className="row g-0">
              <div className="col-7 col-sm-7">
                <img
                  src="https://imgcdn.floweraura.com/him_33_0.jpg?tr=w-367,h-289,dpr-1.5,q-70"
                  className={`img-fluid ${style.cakeImageher}`}
                  alt="Cakes for Him"
                />
              </div>
              <div className="col-5 col-sm-5">
                <div className={`card-body h-100 d-flex flex-column justify-content-center ${style.cardContent}`}>
                  <h4 className={`mb-2 mb-md-3 ${style.cardTitle}`}>Cakes for Him</h4>
                  <ul className="list-unstyled">
                    {himOptions.map((option, index) => (
                      <li key={index} className={`mb-1 mb-md-2 ${style.listItem}`}>
                        <a href="#" className="text-decoration-none text-dark">
                          {option}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cakeforher;
