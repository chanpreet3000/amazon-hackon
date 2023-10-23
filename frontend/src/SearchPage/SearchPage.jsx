import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./styles.css";
import { axiosInstance } from "../axios"; 
import ProductCard from "../Homepage/ShopProducts/ProductCard/ProductCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.post("/api/customer/products/query", {
        query: query,
      });
      setProducts(response.data.products);
      setIsLoading(false);
    };
    fetchData();
  }, [query]);

  return (
    <>
      <div className="search-page">
        <h2>Looking for results: {query}</h2>
        {isLoading && (
          <div class="loader-wrapper">
            <span class="loader"></span>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="product-list">
              {products.map((product) => {
                return <ProductCard data={product} key={product._id} />;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
