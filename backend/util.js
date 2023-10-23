import dotenv from "dotenv";
import CustomerUser from "./models/CustomerUser.model.js";
dotenv.config();
const JWT_KEY = process.env.JWT_KEY;
const customerToken = "customerToken";
import jwt from "jsonwebtoken";

export const errorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(500).send("Something went wrong!");
};

export const tryCatch = (controller) => async (req, res, next) => {
  try {
    await controller(req, res);
  } catch (error) {
    return next(error);
  }
};

export const restrictToCustomerOnly = async (req, res, next) => {
  try {
    const token = req.cookies[customerToken];
    const decoded = jwt.verify(token, JWT_KEY);
    const customer = await CustomerUser.findOne({
      email: decoded.email,
      password: decoded.password,
    });
    if (!customer) return res.status(401).send("Invalid or Expired Token");
    req.customer = customer;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("CustomerUser not authorized");
  }
};