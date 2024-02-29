const express = require("express");
const router = express.Router();
const openai = require("../config/openai");
const { client } = require("../config/db");
const stream = require('stream');

const database = "Marcus";

router.post("/register", async (req, res) => {
  try {
    const { name, email, qualt_id, conversation_id, uuid } = req.body;
    const users = client.db("Marcus").collection("users");
    await users.insertOne({ name, email, qualt_id, conversation_id, uuid });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    res.status(500).json({ error: { message: "An error has occurred." } });
  }
});

router.get("/user/:uuid", async (req, res) => {
  try {
    const { uuid } = req.params;
    const usersCollection = client.db("Marcus").collection("users");
    const userDocument = await usersCollection.findOne({ uuid });
    if (!userDocument) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send({ user: userDocument });
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.post("/ask", async (req, res) => {
  const messages = req.body.messages;
  try {
    if (messages == null) {
      throw new Error("Uh oh, no messages were provided");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    console.log(response);

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

router.post("/store", async (req, res) => {
    try {
        const { uuid, messages } = req.body;
    
        // Get a reference to the MongoDB collection for conversations
        const conversationsCollection = client.db(database).collection("conversations");
    
        // Check if a conversation with the given UUID exists
        const existingConversation = await conversationsCollection.findOne({ uuid });
    
        // Prepare the new script entries
        const newScriptEntries = [];
        messages.forEach((message) => {
          if(message.role != 'system'){
            const text = message.role + ": " + message.content;
            newScriptEntries.push({i : text});
          }
        });
    
        console.log(newScriptEntries)
    
        if (existingConversation) {
          // If the conversation exists, update the script
          await conversationsCollection.updateOne({ uuid }, { $push: { script: { $each: newScriptEntries } } });
        } else {
          // If the conversation doesn't exist, create a new conversation document
          await conversationsCollection.insertOne({ uuid, script: newScriptEntries });
        }
        res.status(200).json({ success: true });
        console.log("here");
      } catch (error) {
        console.error('Error handling the chat:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
      }
});


router.post("/tts", async (req, res) => {

  const text = req.body.text;

  try {
    if (!text) {
      throw new Error("No text provided"); 
    }

    const audioStream = new stream.PassThrough(); 
    
    const buffer = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text
    });
    
    const audio = Uint8Array.from(buffer); 

    audioStream.end(audio);


    res.set('Content-Type', 'audio/mp3');
    res.set('Content-Length', buffer.length);  

    audioStream.pipe(res);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error synthesizing audio" });
  }

});

module.exports = router;
