import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

import OpenAI from "openai";
import fs from "fs";
import { tryCatch } from "../util.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to preprocess text
function preprocessText(text) {
  text = text.toLowerCase();
  text = text.replace(/[^a-z\s]/g, "");
  const tokens = text.split(/\s+/);
  // Remove common stop words (you can add more to this list)
  const stopWords = new Set(["the", "a", "an", "in", "on", "at", "for", "to", "and"]);
  const filteredTokens = tokens.filter((token) => !stopWords.has(token));
  return filteredTokens;
}

// Calculate the cosine similarity between two texts
function cosineSimilarity(text1, text2) {
  const tokens1 = preprocessText(text1);
  const tokens2 = preprocessText(text2);

  // Create a vocabulary from both texts
  const vocab = new Set([...tokens1, ...tokens2]);

  // Create one-hot encoded vectors for each text
  const vector1 = [...vocab].map((word) => tokens1.filter((token) => token === word).length);
  const vector2 = [...vocab].map((word) => tokens2.filter((token) => token === word).length);

  // Calculate the dot product of the vectors
  const dotProduct = vector1.reduce((acc, val, idx) => acc + val * vector2[idx], 0);

  // Calculate the norms of the vectors
  const norm1 = Math.sqrt(vector1.reduce((acc, val) => acc + val * val, 0));
  const norm2 = Math.sqrt(vector2.reduce((acc, val) => acc + val * val, 0));

  // Calculate the cosine similarity
  if (norm1 * norm2 === 0) {
    return 0.0; // Handle division by zero
  }

  const cosineSimilarity = dotProduct / (norm1 * norm2);
  return cosineSimilarity;
}

export const relevancyListFromQuery = async (userQuery, items) => {
  const similarityThreshold = 3;
  const jsonData = fs.readFileSync(
    "C:/Users/chanp/OneDrive/Desktop/Projects/React/amazon-hackon/backend/dataset.json",
    "utf-8"
  );
  const jsonDatabase = JSON.parse(jsonData);

  const relevantProducts = [];
  for (const entry of jsonDatabase) {
    const productTitle = entry.title;
    const productBrand = entry.brand;
    const productDescription = entry.description;
    const productPrice = entry.price.toString();
    const productRating = entry.rating.toString();

    let weightedSimilarity = 0.0;
    weightedSimilarity += cosineSimilarity(userQuery, productTitle) * 30;
    weightedSimilarity += cosineSimilarity(userQuery, productBrand) * 6;
    weightedSimilarity += cosineSimilarity(userQuery, productDescription) * 50;
    weightedSimilarity += cosineSimilarity(userQuery, productPrice) * 15;
    weightedSimilarity += cosineSimilarity(userQuery, productRating) * 20;

    if (weightedSimilarity > similarityThreshold) {
      relevantProducts.push({ entry, weightedSimilarity });
    }
  }

  const sortedResults = relevantProducts
    .sort((a, b) => b.weightedSimilarity - a.weightedSimilarity)
    .map((entry) => entry.entry)
    .slice(0, items);

  return sortedResults;
};
const getResponseFromQuery = async (req, res, next) => {
  const data = req.body;
  const query = data.query;
  const responseTemplate = `You are an electronic store (which sells tv, fridge, AC and phone ) chatbot .You have to engage user in an engaging conversation and try to gain knowledge about the product they want to buy . You will need to know different details depending on the products they want to purchase for all the products you should try to find out if the user has any particular brand in mind and then find out if user has any particular specifications and then their price range.
  ASK ONLY 1 QUESTION AT A TIME AND MAKE IT MORE ENGAGING AND NOT RUDE AND DIRECT AND ONCE YOU GET ANSWER FOR ALL OF THESE QUESTIONS , YOU HAVE TO EXPRESS YOUR GRATITUDE AND COMBINE ALL THE INFORMATION GIVEN BY THE USER TO FORM A VERY VERY REDUCED and SHORT QUERY AND RETURN THAT REDUCED QUERY IN THIS FORMAT  "[Awesome! here are the products based on the query ] ||| [very very REDUCED QUERY](you have to return this only at the very end after receiving all the answers)`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: responseTemplate },
      { role: "user", content: `Give me products based on this query: ${query}` },
    ],
  });
  let content = response.choices[0].message.content;
  if (content.includes("|||")) {
    const [acknowledgement, reducedQuery] = content.split("|||").map((part) => part.trim());
    content = acknowledgement;
    const sortedJsonResults = relevancyListFromQuery(reducedQuery, 10);
    return res.status(200).send({ success: true, content, result: sortedJsonResults });
  } else {
    return res.status(200).send({ success: true, content, result: [] });
  }
};

router.post("/", tryCatch(getResponseFromQuery));
export default router;
