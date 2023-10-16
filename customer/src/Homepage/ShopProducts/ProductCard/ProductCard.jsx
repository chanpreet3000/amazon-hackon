import React from "react";
import "./styles.css";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Link } from "react-router-dom";
export default function ProductCard({ data }) {
  const dateFormatter = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });
  const formattedDate = dateFormatter.format(new Date(data.createdAt));

  return (
    <Link to={`/products/${data._id}`} className="product">
      <div className="image">
        <img src={data.image} draggable={false} />
      </div>
      <div className="container">
        <div className="title">
          <div>{data.name}</div>
          <div className="row">
            <div>₹{data.price}</div>
            <img
              src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
              className="fassured"
            />
          </div>
        </div>
        <div className="description">{data.description}</div>
        <div className="description">{data.specifications}</div>
        <div className="date">
          Sold by <strong>{data.retailerName}</strong> on <strong>{formattedDate}</strong>
        </div>
        <InsertLinkIcon className="link" />
      </div>
    </Link>
  );
}
