import React from "react";
import "./styles.css";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Link } from "react-router-dom";
export default function ProductCard({ data }) {
  return (
    <Link to={`/`} className="product">
      <div className="image">
        <img src={data.image} draggable={false} />
      </div>
      <div className="container">
        <div className="title">
          <div>{data.title}</div>
          <img className="prime" src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Prime_logo.png"></img>
        </div>
        <div className="rating">
          <strong>Rating : {data.rating}/5</strong>
        </div>
        <div className="price">
          <strong>₹{data.price}</strong>
        </div>
        <div className="description">{data.description}</div>
        <div className="description">{data.specifications}</div>
        <div className="date">
          Sold by <strong>{data.title}</strong>
        </div>
        <InsertLinkIcon className="link" />
      </div>
    </Link>
  );
}
