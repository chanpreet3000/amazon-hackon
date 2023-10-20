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

function relevancyListFromQuery(userQuery) {
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
    weightedSimilarity += cosineSimilarity(userQuery, productTitle) * 8;
    weightedSimilarity += cosineSimilarity(userQuery, productBrand) * 10;
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
    .slice(0, 10);

  return sortedResults;
}
const getResponseFromQuery = async (req, res, next) => {
  const data = req.body;
  const query = data.query;
  const responseTemplate = `You are an e-commerce virtual agent chat bot.
  Your task is to make user shopping experience more interactive and better.
  You should strictly follow all the rules mentioned below:-
  - User will provide a query and would expect to get results/relevant products based on the query.
  - User should mention the following details in the query to get the best results.
      ## RULES
      - Brand of the product should be mentioned or at least the user mentions that any brand is acceptable in the query. (It is a required field)
      - Specifications of the product is mentioned in the query. Eg: 14MP camera, cotton clothes, or mentions details about the products or "any specifications". (It is a required field)
      - User should mention the price range of the product in the query. (It is a required field)
      - User can also mention the rating of the product required in the query. (It is a not a required field)
  
  - If you think the user's query does not follows the above mentioned rules. You need to follow the rules mentioned below.
      - If there are multiple rules that are not followed above. Ask the user to give a missing detail (Ensure that you ask the user to provide only a single missing details in the query). Eg:- If the user's query is missing [brand, price and specifications] you only need to ask the user to either provide a brand or price-range or specifications.
      - Eg if you think the brand, price, specifications is missing. Ask for only one detail at a time.
      - To answer this type of query return the result.

  - If you think the user's query follows the above mentioned rules. Generate a response follow the below mentioned rules.
      - Generate a simple response for the acknowledgement of the user's query.
      - Also generate a reduced query (only important keywords) which can be used by the system admins to do relevancy search for fetch products from knowledge database.
      - You are only required to respond with the acknowledgement of the query and not with the results based on the query.
      - Use this format to answer this type of query "[Acknowledgement] ||| [REDUCED QUERY]" Eg: "Awesome! here are the products based on the query ||| [Append the reduced query for relevancy search here] (This is very important rule to follow).
  Stricly adhere to the above guidlines and be professional`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: responseTemplate },
      { role: "user", content: `Give me products based on this query: ${query}` },
    ],
  });
  let content = response.choices[0].message.content;
  console.log(content);
  if (content.includes("|||")) {
    const [acknowledgement, reducedQuery] = await content.split("|||").map((part) => part.trim());
    content = acknowledgement;
    const sortedJsonResults = relevancyListFromQuery(reducedQuery);
    return res.status(200).send({ success: true, content, result: sortedJsonResults });
  } else {
    return res.status(200).send({ success: true, content, result: [] });
  }
};

router.get("/", tryCatch(getResponseFromQuery));
export default router;
