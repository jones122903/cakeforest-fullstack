import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import style from "./Blog.module.css"

const blogData = [
  {
    img: "https://imgcdn.floweraura.com/Top 10 Best-Selling Cakes in Mumbai That Are Always in Demand - Cover-Desktop.jpg",
    title: "Top 10 Best-Selling Cakes in Mumbai That Are Always in Demand",
    desc: "Mumbai is a city of dreams, drama, and a never-ending appetite for celebration. Whether it's birthdays in Bandra, anniversaries in Andheri, or just a sweet",
    link: "https://www.floweraura.com/blog/best-selling-cakes-mumbai-are-always-demand",
  },
  {
    img: "https://imgcdn.floweraura.com/chocolate-cake-recipes-to-satisfy-every-craving.jpg",
    title: "10 Irresistible Chocolate Cake Recipes to Satisfy Every Craving",
    desc: "Chocolate cake is the ultimate comfort food, the quintessential dessert that no one can resist. Whether it’s for a special occasion or a simple treat to satisfy ,",
    link: "https://www.floweraura.com/blog/10-irresistible-chocolate-cake-recipes-satisfy-every-craving",
  },
  {
    img: "https://imgcdn.floweraura.com/noida-cover-image-d.jpg",
    title: "Noida’s Best Bakery Supplies: Top 5 Baking Suppliers You Can’t Miss!",
    desc: "Whether you're a home baker perfecting your craft or a professional running a bakery, finding high-quality baking ingredients and tools is essential.",
    link: "https://www.floweraura.com/blog/bakery-suppliers-in-noida",
  }
];

export default function BlogSection() {
  return (
    <div className="blog-container-box p-3">
      <div className="prod-category card-blog">
        <h3 className={`heading mb-4 fs-4 semibold ${style.cardHeading}`}>Cakes Related Blogs</h3>

        <Row>
          {blogData.map((item, index) => (
            <Col md={4} sm={12} key={index} className="mb-4">
              <Card >
                <Card.Img
                  variant="top"
                  src={item.img}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                {/* <Card.Body>
                  <Card.Title className={`blog-title ${style.cardTitle}`}>{item.title}</Card.Title>
                  <Card.Text className="blog-body">{item.desc}</Card.Text>
                  <a
                    href={item.link}
                    target="_self"
                    className="  peacock-color fs-6"
                    style={{textDecoration:"none"}}
                  >
                    Read More...
                  </a>
                </Card.Body> */}
              </Card>
              <div className="mt-2">
                 <Card.Title className={`blog-title mb-3 ${style.cardTitle}`}>{item.title}</Card.Title>
                  <Card.Text className=" text-secondary m-0" style={{fontSize:"3rem"}}>{item.desc}</Card.Text>
                  <a
                    href={item.link}
                    target="_self"
                    className="  peacock-color fs-6"
                    style={{textDecoration:"none"}}
                  >
                    Read More...
                  </a>
              </div>
            </Col>
          ))}
        </Row>

      </div>
    </div>
  );
}
