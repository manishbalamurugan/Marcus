const cors = require('cors');
const express = require('express');
const mongodb = require('mongodb');
const OpenAI = require("openai");


// Express + MongoDB Setup
const uri = "mongodb+srv://manish:Marcus24@marcus.aovmukv.mongodb.net/?retryWrites=true&w=majority";
const db = "Marcus"

const app = express();
const port = process.env.PORT || 4200;

const client = new mongodb.MongoClient(uri);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
client.connect()
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use(express.json());


const openai = new OpenAI.OpenAI({ apiKey: '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' });

app.post("/api/ask", async (req, res) => {
  const messages = req.body.messages;

  try {
    if (messages == null) {
      throw new Error("Uh oh, no messages were provided");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    console.log(response)

    const reply = response.choices[0].message;
    const usage = response.usage;

    console.log(`Create chat completion request was successful. Results:
      Replied message: 
      ${JSON.stringify(reply)}
      Token usage:
      Prompt: ${usage.prompt_tokens}
      Completion: ${usage.completion_tokens}
      Total: ${usage.total_tokens}
    `);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.log(`Thrown error: ${error.message}`);
    const reply = {
      role: "assistant",
      content: "An error has occurred.",
    };

    return res.status(500).json({
      error: { reply },
    });
  }
});



// API endpoint for user message handling
app.post('/api/store', async (req, res) => {
    try {
      const { uuid, messages } = req.body;
  
      // Get a reference to the MongoDB collection for conversations
      const conversationsCollection = client.db(db).collection("conversations");
  
      // Check if a conversation with the given UUID exists
      const existingConversation = await conversationsCollection.findOne({ uuid });
  
      if (existingConversation) {
        // If the conversation exists, update the script
        messages.forEach((message) => {
          if(message.role != 'system'){
            const text = message.role + ": " + message.content;
            script.push({i : text})
          }
        });
        // Update the conversation's script
        await conversationsCollection.updateOne({ uuid }, { $set: { script } });
      } else {
        // If the conversation doesn't exist, create a new conversation document
        const script = [];
        var i = 1;
        messages.forEach((message) => {
          if(message.role != 'system'){
            const text = message.role + ": " + message.content;
            script.push({i : text})
          }
        });
  
        await conversationsCollection.insertOne({ uuid, script });
      }
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error handling the chat:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


  exports.app = functions.https.onRequest(app);