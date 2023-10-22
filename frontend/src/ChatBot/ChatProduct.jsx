import React from "react";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Link } from "react-router-dom";
export default function ChatProduct({ data }) {
  return (
    <Link to={`/`} className="chat-product">
      <div className="image">
        <img src={data.image} draggable={false} />
      </div>
      <div className="container">
        <div className="title">
          <div>{data.title}</div>
        </div>
        <div className="rating">
          <strong>Rating : {data.rating}/5</strong>
        </div>
        <div className="price">
          <strong>₹{data.price}</strong>
        </div>
      </div>
    </Link>
  );
}
