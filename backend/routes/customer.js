import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CustomerUser from "../models/CustomerUser.model.js";
import OrderHistory from "../models/OrderHistory.model.js";
import { tryCatch } from "../util.js";
const JWT_KEY = process.env.JWT_KEY;
const customerToken = "customerToken";
import fs from "fs";
import { relevancyListFromQuery } from "./query.js";
import UserBotFeedback from "../models/UserBotFeedback.model.js";
//
//
//
//
//API CUSTOMER ROUTES HANDLERS
const restrictToCustomerOnly = async (req, res, next) => {
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
    return res.status(401).send("CustomerUser not authorized");
  }
};
const handleCustomerSignUp = async (req, res) => {
  const user = await CustomerUser.findOne({ email: req.body.email });
  if (user) return res.status(400).send(`Account with email ${req.body.email} already exists`);

  const data = req.body;
  const encryptedPassword = await bcrypt.hash(req.body.password, 10);

  await CustomerUser.create({
    name: {
      firstName: data.first_name,
      lastName: data.last_name,
    },
    email: data.email,
    password: encryptedPassword,
    walletId: data.walletId,
  });
  return res.status(200).send({ success: true });
};

const handleCustomerLogin = async (req, res) => {
  const user = await CustomerUser.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(`Account with email ${req.body.email} does not exists`);

  const check = await bcrypt.compare(req.body.password, user.password);
  if (!check) return res.status(400).send(`Please check your details`);

  const token = jwt.sign(
    {
      email: user.email,
      password: user.password,
    },
    JWT_KEY
  );
  res.cookie(customerToken, token);
  return res.status(200).send({ success: true });
};

const getCustomerDashboardData = async (req, res) => {
  return res.status(200).send({ success: true, user_data: req.customer });
};

const createCustomerOrderHistory = async (req, res) => {
  const order_history = await OrderHistory.create({
    userId: req.customer._id,
    productId: req.body.product_id,
    amount: req.body.amount,
  });
  return res.status(200).send({ success: true, order_history });
};

const getCustomerOrderHistory = async (req, res) => {
  const orders = await OrderHistory.find({ userId: req.customer._id });
  return res.status(200).send({ success: true, orders });
};

const getProducts = async (req, res) => {
  async function getRandomItems(data, count) {
    const randomItems = [];
    const maxIndex = data.length;

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * maxIndex);
      randomItems.push(data[randomIndex]);
    }

    return randomItems;
  }
  const rawData = fs.readFileSync("C:/Users/chanp/OneDrive/Desktop/Projects/React/amazon-hackon/backend/dataset.json");
  const dataset = JSON.parse(rawData);

  const products = await getRandomItems(dataset, 10);
  return res.status(200).send({ success: true, products });
};

const getProductsFromQuery = async (req, res) => {
  const data = req.body;
  const query = data.query;
  const products = await relevancyListFromQuery(query, 20);
  return res.status(200).send({ success: true, products });
};

const storeUserFeedback = async (req, res) => {
  const data = req.body;
  const userBotFeedback = await UserBotFeedback.create({
    userId: req.customer._id,
    feedback: data.feedback,
    conversations: data.conversations,
  });
  return res.status(200).send({ success: true, userBotFeedback });
};

//
//
//
//
//API CUSTOMER ROUTES
router.post("/user/signup", tryCatch(handleCustomerSignUp));
router.post("/user/login", tryCatch(handleCustomerLogin));
router.get("/products", tryCatch(getProducts));
router.post("/products/query", tryCatch(getProductsFromQuery));
router.get("/dashboard", restrictToCustomerOnly, tryCatch(getCustomerDashboardData));
router.post("/orders/new", restrictToCustomerOnly, tryCatch(createCustomerOrderHistory));
router.get("/orders", restrictToCustomerOnly, tryCatch(getCustomerOrderHistory));
router.post("/feedback", restrictToCustomerOnly, tryCatch(storeUserFeedback));

export default router;
