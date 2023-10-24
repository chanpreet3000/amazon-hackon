## Amazon Hackon Project README
# DEMO
- Deployed on Website: [Website Link](http://ec2-34-229-147-48.compute-1.amazonaws.com/)
- PPT of our prototype: [Canva Link](https://www.canva.com/design/DAFw4NszU2k/pi87rXGRJKg5QSQUy2eIyg/edit)
- Video of our prototype: [Video Link](https://www.youtube.com/watch?v=57UqK5mQd6A&ab_channel=ChanpreetSingh)

  [![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/57UqK5mQd6A/0.jpg)](https://www.youtube.com/watch?v=57UqK5mQd6A)
- Images of our chat-bot
  ![image](https://github.com/chanpreet3000/amazon-hackon/assets/66767005/84cbb440-93f2-49d3-be8b-accbfdc61827)
  ![image](https://github.com/chanpreet3000/amazon-hackon/assets/66767005/28384875-6204-4442-b282-ec57a32b553e)
  ![image](https://github.com/chanpreet3000/amazon-hackon/assets/66767005/110961a1-bdf4-4048-919f-b6eff6d86084)

# Introduction
Welcome to the Amazon Customer Assistant Chatbot project, your friendly virtual shopping companion! In the world of online shopping, we understand that finding the right product can sometimes be overwhelming. Imagine you're in a physical store looking for a TV, and a knowledgeable salesperson is there to assist you. They consider your room size, budget, and preferences to guide you towards the perfect choice. This personalized approach is what we call "Customer Obsession."
However, in the online shopping landscape, it often feels like you're navigating the vast digital aisles all by yourself. That's where the Amazon Customer Assistant Chatbot comes to the rescue. Our mission is to replicate the experience of having that friendly salesperson but in the digital realm. We are genuinely obsessed with ensuring your satisfaction as a customer.

# Project Overview
Our Goal
Our primary objective is to provide you with expert advice, recommendations, and suggestions, so you can confidently make the best choices when shopping on Amazon. Whether you're looking for a TV or any other product, our chatbot is here to simplify your online shopping journey.

# How It Works
Our chatbot is powered by a state-of-the-art Language Model (LLM) based on OpenAI API. When you interact with our chatbot, it uses this advanced model to understand your queries, preferences, and needs and generates a query based on all that information then we do a vector similarity search with our database based on the query generated by our LLM model. It then provides you with personalized, informative, and relevant responses, by matching just like a seasoned salesperson would in a physical store.

# Features
1. Personalized Recommendations: Our chatbot considers your individual requirements, such as budget, room size, and features, to suggest products that best match your needs.
2. Real-Time Assistance: Get immediate responses to your queries, ensuring you have the information you need when you need it.
3. Expert Guidance: Our chatbot leverages the collective knowledge and data available on Amazon to provide you with expert insights and advice.
4. Easy and Fun Shopping: We aim to make your online shopping experience enjoyable, just like having a knowledgeable friend guide you through a store.
5. Provide personalized product recommendations based on customer preferences.
6. Implement a similarity search using vector embeddings for a better shopping experience.
7. Utilize the MERN (MongoDB, Express, React, Node.js) stack for development.
# Why Choose Amazon Customer Assistant Chatbot
1. Customer-Centric: We are dedicated to your satisfaction, and our chatbot is here to assist and empower you in your online shopping journey.
2. Efficiency: Save time and make informed choices with our fast and accurate responses.
3. Expertise: Benefit from the collective expertise of Amazon and the capabilities of advanced AI technology.
4. User-Friendly: Our chatbot is designed to be user-friendly and accessible, so you can shop with ease.
# Technologies Used
- Frontend: React
- Backend: Node.js, Express.js
- Database: MongoDB
- Vector Embeddings: Used for similarity search
- LLM Model: OpenAI API
- Other Technologies: Selenium (for automation and web-scrapping), AWS EC2 Instance (for hosting)

# Methodology
![image](https://github.com/chanpreet3000/amazon-hackon/assets/66767005/b866ae4c-a55e-44b9-aa01-b583faed4355)

# Installation.
1. Install the MongoDB Community server. [Link](https://www.mongodb.com/try/download/community)
2. Install Visual Studio 2022 Build Tools.
3. Clone the repository
`git clone https://github.com/chanpreet3000/amazon-hackon`
4. Open the repository using a code editor and run the following commands.
  - ```
    cd ./backend
    npm  i
    npm run start # start the backend
    cd ../
    ```
  - ```
    cd ./frontend
    npm i --legacy-peer-deps
    npm run start #start the frontend
    ```
