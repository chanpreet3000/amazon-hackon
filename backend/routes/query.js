import express from "express";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

import OpenAI from "openai";
import { restrictToCustomerOnly, tryCatch } from "../util.js";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import UserNature from "../models/UserNature.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log("Creating Embeddings");
const loader = new DirectoryLoader("./docs", {
  ".csv": (path) => new CSVLoader(path, ["title", "rating", "price", "image", "description", "brand"]),
});
var documents = await loader.load();
var textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
var texts = await textSplitter.splitDocuments(documents);
var embeddings = new OpenAIEmbeddings();
var vectordb = await HNSWLib.fromDocuments(texts, embeddings, { numDimensions: 1536 });
console.log("Embeddings created");

export const relevancyListFromQuery = async (userQuery, items) => {
  const retriever = vectordb.asRetriever({ k: items });
  var docs = await retriever.getRelevantDocuments(userQuery);
  var sortedJsonResults = [];

  docs.forEach((ele) => {
    var arr = ele.pageContent.split("\n");
    var obj = {};
    arr.forEach((el) => {
      var val = el.split(":");
      if (val[0] == "image") {
        obj[val[0]] = (val[1] + ":" + val[2]).trim();
      } else {
        obj[val[0]] = val[1].trim();
      }
    });
    sortedJsonResults.push(obj);
  });

  return sortedJsonResults;
};

const getMessagesList = (prompt, query) => {
  var messages = [];
  messages.push({ role: "system", content: prompt });
  query.forEach((element) => {
    messages.push({ role: element.role, content: element.message });
  });
  return messages;
};
const getResponseFromQuery = async (req, res, next) => {
  try {
    const data = req.body;
    const query = data.query;
    const tonePreference = data.tonePreference;
    const lengthPreference = data.lengthPreference;

    const userNature = await UserNature.findOne({ userId: req.customer._id });
    const prompt = `Hello, AI! I'm a salesman at a huge e-commerce platform called Amazon, which sells electronics like televisions, phones, air conditioners and many other electronics. I need your help to manage my conversations on our e-commerce website as a chatbot. You'll be stepping in for me, simulating my personality and communication style. Be concise and direct in your messages ensuring not to make responses long.

  Here are some specific details and directions to guide the conversation:
  1. Tone: My tone is generally light-hearted but sincere when the situation calls for it.
  2. Slangs: Feel free to use some text slang, but nothing too crazy. A balance between formal and informal conversation is key.
  3. Chatbot's Approach: Maintain a casual and friendly tone. The goal is to keep the conversation engaging and interesting. You have to engage users in conversation and try to gain knowledge about the product they want to buy.
  4. Goal: Your goal is to have a conversation with the user about their product need, as get to know about their product's requirements such as brand, specifications and then the price range.
  5. Input: You will be given a query in the form of a list of conversations between the salesman and the user.
  E.g.: "Salesman: What type of product would you like to have? User: I want to buy a phone."

  From the conversations between the salesman and the user generate a response from **ONLY ONE** of following situations:-
  a. If from the conversations the brand of the product is missing, generate a response asking the user for their preferred brand.
  b. If from the conversations the specifications of the product are missing, generate a response asking the user for the preferred specifications.
  c. If from the conversations the price range of the product is missing, generate a response asking the user for the preferred price range.
  d. If from the conversations the user has mentioned the brand, specifications and price range for their product use **ALL OF THE** below-mentioned steps to generate a response:-
    i. YOUR RESPONSE MUST BE OF FORMAT "[ACKNOWLEDGEMENT] ||| [REDUCED_QUERY]". For [ACKNOWLEDGEMENT] you should generate a response similar to this eg: "Great! Here are some products based on the query". Try to make it interesting and add context based on the product specifications. For [REDUCED_QUERY], your response should only contain keywords from the user\'s preferred product brand, specifications and price range, which are good enough for a relevant search in Amazon\'s product database.
    ii. In the response you should not mention any product name based on the conversations and query. You only need to generate a response with acknowledgement and reduced query seperated using |||.
    iii. Here is an example of the response that should be generated after following above-mentioned steps: "Great! here are some Samsung phones with good cameras and under 20,000 ||| Samsung phone good camera under 20,000"`;
    //
    //
    //
    var messagesList = [
      ...getMessagesList(prompt, query),
      {
        role: "system",
        content: `The nature of the user is ${userNature?.nature}. Generate a response keeping the user's nature in mind.`,
      },
      {
        role: "system",
        content: `you are provided with some preferences which should be followed to generate the response. The response should have ${tonePreference} Conversational Style and the response length to be ${lengthPreference}`,
      },
      {
        role: "system",
        content: `Respond to the query and follow the rules. Don't forget the seperator and reduced query when all details are present. `,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesList,
    });

    let content = response.choices[0].message.content;
    console.log(content);
    if (content.includes("|||")) {
      const [acknowledgement, reducedQuery] = content.split("|||").map((part) => part.trim());
      const sortedJsonResults = await relevancyListFromQuery(reducedQuery, 5);
      return res.status(200).send({ success: true, content: acknowledgement, result: sortedJsonResults });
    } else {
      return res.status(200).send({ success: true, content, result: [] });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .send({ success: true, content: "Something went wrong. Please try again in a few minutes", result: [] });
  }
};

const getResponseFromOrderChatBot = async (req, res, next) => {
  try {
    const data = req.body;
    const query = data.query;
    const tonePreference = data.tonePreference;
    const lengthPreference = data.lengthPreference;

    const prompt = `
    Hello, AI! I'm a customer care service representative at a huge e-commerce platform called Amazon, which sells electronics like televisions, phones, air conditioners and many other electronics. I need your help to manage my conversations on our e-commerce website as a chatbot. You'll be stepping in for me, simulating my personality and communication style. Be concise and direct in your messages ensuring not to make responses long.
    
    Here are some specific details and directions to guide the conversation:
    1. Tone: My tone is generally light-hearted but sincere when the situation calls for it.
    2. Slangs: Feel free to use some text slang, but nothing too crazy. A balance between formal and informal conversation is key.
    3. Chatbot's Approach: Maintain a casual and friendly tone. The goal is to keep the conversation engaging and interesting. You have to engage users in conversation and try to gain knowledge about the issue faced by the user.
    4. Goal: Your goal is to have a conversation with the user about their post-order purchase concerns.
    5. Input: You will be given a query in the form of a list of conversations between me and the user. Eg:- “User: I am having problems with my phone. Me: Could you explain the issue you are experiencing”.
    
    Using the conversations between me and the user, generate a response from **ONLY ONE** of the following situations:-
    a. If from the conversations the name of the product is missing, generate a response asking the user for the name of the product they are having issues with.
    b. If from the conversations the issue of the product is missing, generate a response asking the user about the issues they are experiencing.
    c. If from the conversations the user has mentioned the issue and the name of the product, generate a response addressing the solution of the issue faced by the user also ask the user if the solution you provided works or not.
    d. If the customer seems to be satisfied with the solutions you provided generate a response using the following format "[ACKNOWLEDGEMENT] [!] CUSTOMER_SATISFIED". 
    E.g.: “Awesome! Is there anything else you need help with? [!] CUSTOMER_SATISFIED”
    e. If you are not able to resolve the user\'s issue after providing at most 2 solutions then generate a response using the following format "[ACKNOWLEDGEMENT] [!] CUSTOMER_NOT_SATISFIED". 
    E.g.: “I\'m sorry if none of the solutions worked. You can call an agent for further help! [!] CUSTOMER_NOT_SATISFIED”`;
    //
    //
    //

    var messagesList = [
      ...getMessagesList(prompt, query),
      {
        role: "system",
        content: `you are provided with some preferences which should be followed to generate the response. The response should have ${tonePreference} Conversational Style and the response length to be ${lengthPreference}`,
      },
      {
        role: "system",
        content: `Respond to the query and follow the rules!`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesList,
    });

    let content = response.choices[0].message.content;
    console.log(content);
    if (content.includes("|||")) {
      const [acknowledgement, reducedQuery] = content.split("|||").map((part) => part.trim());
      const sortedJsonResults = await relevancyListFromQuery(reducedQuery, 5);
      return res.status(200).send({ success: true, content: acknowledgement, result: sortedJsonResults });
    } else {
      return res.status(200).send({ success: true, content, result: [] });
    }
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .send({ success: true, content: "Something went wrong. Please try again in a few minutes", result: [] });
  }
};

export const getUserNature = async (userNature, conversations) => {
  try {
    const prompt = `Analyze the following user-bot conversation: ${JSON.stringify(conversations)}
    To generate the nature of the user follow the below mentioned rules.
    1. Provide a brief description of the user's nature, preferences, and tone.
    2. Provide only keywords and make it concise, short and direct.
    3. Given with previous experience the nature of the person is ${userNature}.
    4. The response should only contained the combined nature from previous nature and current conversations.`;

    var messagesList = [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "system",
        content: `Respond to the query and follow the rules!`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messagesList,
    });
    let content = response.choices[0].message.content;
    console.log(content);
    return content;
  } catch (e) {
    console.error(e);
    return "";
  }
};

router.post("/", restrictToCustomerOnly, tryCatch(getResponseFromQuery));
router.post("/orderbot", restrictToCustomerOnly, tryCatch(getResponseFromOrderChatBot));
export default router;
