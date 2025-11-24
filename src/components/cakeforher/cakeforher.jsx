import React from "react";
import style from "./cakeforher.module.css";

const Cakeforher = () => {
  const herOptions = ["Girls", "Wife", "Girlfriend", "Mother"];
  const himOptions = ["Boys", "Husband", "Boyfriend", "Father"];
  return (

    <div className=" p-5 grey-color-bg  rounded-5">
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card rounded-4 shadow-sm" style={{ height: "280px" }}>
            <div className="row g-0">
              <div className="col-7">
                <img
                  src="https://imgcdn.floweraura.com/her_25_2.jpg?tr=w-367,h-289,dpr-1.5,q-70"
                  className={`img-fluid ${style.cakeImageher} `}
                  alt="Cakes for Her"
                />
              </div>
              <div className="col-5">
                <div className="card-body h-100 d-flex flex-column justify-content-center ">
                  <h4 className="mb-3">Cakes for Her</h4>
                  <ul className="list-unstyled">
                    {herOptions.map((option, index) => (
                      <li key={index} className="mb-2">
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
        <div className="col-md-6 col-12">
          <div className="card rounded-4 shadow-sm" style={{ height: "280px" }}>
            <div className="row g-0">
              <div className="col-7">
                <img
                  src="https://imgcdn.floweraura.com/him_33_0.jpg?tr=w-367,h-289,dpr-1.5,q-70"
                  className={`img-fluid ${style.cakeImageher} `}
                  alt="Cakes for Him"
                />
              </div>
              <div className="col-5 ">
                <div className="card-body h-100 d-flex flex-column justify-content-center ">
                  <h4 className="mb-3">Cakes for Him</h4>
                  <ul className="list-unstyled">
                    {himOptions.map((option, index) => (
                      <li key={index} className="mb-2">
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
