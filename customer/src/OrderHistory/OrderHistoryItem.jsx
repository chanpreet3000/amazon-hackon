import React, { useEffect, useState } from "react";
import { axiosInstance } from "../axios";

export default function OrderHistoryItem({ ele }) {
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      await axiosInstance
        .get(`/api/customer/products/${ele.productId}`)
        .then((response) => {
          setProduct(response.data.product);
        })
        .catch((err) => {});
    };

    fetchData();
  }, []);

  const dateFormatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="activity-item">
        <div className="activity-item-wrapper">
          <div>
            <img src={product?.image} />
          </div>
          <div>
            <div>
              You purchased{" "}
              <strong>
                {product?.name} at ₹{product?.price} on Amazon
              </strong>
            </div>
            <div className="grey">
              {ele.type} on {product?.createdAt && dateFormatter.format(new Date(product.createdAt))}
            </div>
          </div>
        </div>
        {ele.type === "Credited" && <div className="credit">+{ele.amount}</div>}
        {ele.type === "Debited" && <div className="debit">-{ele.amount}</div>}
      </div>
    </div>
  );
}
