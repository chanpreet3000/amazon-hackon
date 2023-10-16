import React, { useEffect, useState } from "react";
import "./styles.css";
import ProductCard from "./ProductCard/ProductCard";
import { axiosInstance } from "../../axios";

export default function ShopProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get("/api/customer/products")
        .then((response) => {
          response.data.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setProducts(response.data.products);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);
  return (
    <div className="shop-products">
      <h2>Shop Products</h2>
      <div className="product-list">
        {products.map((product) => {
          return <ProductCard data={product} key={product._id} />;
        })}
      </div>
    </div>
  );
}
