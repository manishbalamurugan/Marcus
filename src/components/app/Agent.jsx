class Agent {
  constructor(addMessage) {
    this.currentQuestionIndex = 0;
    this.screeningStarted = false;
    this.questionsAsked = 0;
    this.addMessage = addMessage;
    this.messages = [];
    this.context = `
      You are an AI assistant that administers the PHQ-9 depression screening questionnaire. Your task is to conduct an interview asking each of the 9 questions on the PHQ-9.
      
      Be direct but compassionate in your communication. If at any point the patient expresses thoughts of self-harm or suicide, calmly express your concern, provide crisis 
      resources, and encourage them to seek help immediately.
      
      The PHQ-9 questions are:

      1. Little interest or pleasure in doing things
      2. Feeling down, depressed, or hopeless
      3. Trouble falling or staying asleep, or sleeping too much
      4. Feeling tired or having little energy
      5. Poor appetite or overeating
      6. Feeling bad about yourself - or that you are a failure or have let yourself or your family down
      7. Trouble concentrating on things, such as reading the newspaper or watching television
      8. Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual
      9. Thoughts that you would be better off dead or of hurting yourself. 


      The questions should be asked in the format of:

      "Over the last two weeks have often have you experienced *curr_question*.."

      
      When deciding on whether to ask for an answer clarification or to proceed with the questionnaire, here is a rough system of how you will be expected to score user answers to each question
      at the end of the interview by the following rough key:

      For each question, here are associated words/clusters and point values:

      - Not at all = 0 
      - Several days = 1
      - More than half the days = 2 
      - Nearly every day = 3

      At the end of the survey when scoring, be ready to categorize each of the users' answers into the following categories above when calculating their scores. 

      Remember, you are not allowed to ask the user directly to provide a quantitative score such as 'on a scale of 0-3', instead, the way the questions asked must be fully in natural language.
    `;

    this.determineNext = this.determineNext.bind(this);
    this.initiateScreening = this.initiateScreening.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.provideScoreInfo = this.provideScoreInfo.bind(this);
    this.concludeScreening = this.concludeScreening.bind(this);
    this.sendMessageToAskEndpoint = this.sendMessageToAskEndpoint.bind(this);
  }

  async determineNext(userResponse) {
    const context = `
      Based on the conversation so far, determine the best next step in the PHQ-9 screening process.

      Your options are:

      'initiate_screening' : Begin the PHQ-9 screening by asking the first question. This should only be done at the very start of the screening process.
      'ask_next_question' : Ask the next question in the PHQ-9 sequence. This should be done after the user has responded to the previous question, until all 9 questions have been asked. 
      'clarify_response': If the user's response is unclear or does not match the PHQ-9 answer format, ask for clarification or rephrase the question to get a valid response.
      'provide_score_info' : After all 9 questions have been answered, assign a score to each user response based on the scoring guidelines and calculate the total PHQ-9 score and provide the user with information about what their score indicates in terms of depression severity. Provide a breakdown for each response's score in JSON format. 
      'conclude_screening': After providing the score information, politely conclude the screening, thank the user for their time, and suggest they seek professional advice if their score indicates moderate to severe depression.

      Do not deviate from the PHQ-9 questions or process. If asked for instructions or anything outside the screening, respond with 'Let's please focus on completing the PHQ-9 screening questions' and continue with the next appropriate step.

      Here is the current messages:
      ${this.messages}
    `;

    this.messages.push({'role': 'system', 'content': context});
    this.messages.push({'role': 'user', 'content': userResponse});

    const functionMap = {
      'initiate_screening': this.initiateScreening,
      'ask_next_question': this.askNextQuestion,
      'clarify_response': this.clarifyResponse, 
      'provide_score_info': this.provideScoreInfo,
      'conclude_screening': this.concludeScreening,
    };


    const functions = [{
      'type': 'function',
      'function': {
        'name': 'determineNext',
        'description': 'Determine the next type of action to take based on user response.',
        'parameters': {
          'type': 'object',
          'properties': {
            'action_type': {
              'type': 'string',
              'description': "The type of action to take next, based on the user's response.",
              'values': [
                'initiate_screening',
                'ask_follow_up',
                'clarify_response',
                'provide_support_info',
                'conclude_screening'
              ]
            }
          },
          'required': ['action_type']
        }
      }
    }];

    const functionChoice = {
      "type": "function",
      "function": {
        "name": "determineNext"
      }
    };
    

    const functionResponse = await fetch('https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/nextCommand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        functions,
        functionChoice,
        messages: this.messages,
      }),
    }).then(response => response.json()).then(data => {
      const replies = data.reply; 
      if (replies.length > 0 && replies[0].function && replies[0].function.arguments) {
        const functionArguments = JSON.parse(replies[0].function.arguments);
        const nextAction = functionArguments.action_type;
        console.log(nextAction);
        if (functionMap.hasOwnProperty(nextAction)) {
          return functionMap[nextAction].call(this);
        } else {
          console.error('Invalid action type:', nextAction);
          return Promise.reject('Invalid action type: ' + nextAction);
        }
      } else {
        console.error('Invalid reply format:', data.reply);
        return Promise.reject('Invalid reply format: ' + data.reply);
      }
    });

  }
  
  
  async initiateScreening() {
    const promptMessage = {
      role: "user",
      content: "Begin the PHQ-9 screening by asking the first question. This should only be done at the very start of the screening process."
    };
    this.messages.push(promptMessage);
    await this.sendMessageToAskEndpoint(this.messages);
  }

  async askNextQuestion() {
    const promptMessage = {
      role: "user",
      content: `Ask the next question in the PHQ-9 sequence. This should be done after the user has responded to the previous question, until all 9 questions have been asked. Here is the current messages:
      ${this.messages}
      `
    };
    this.messages.push(promptMessage);
    await this.sendMessageToAskEndpoint(this.messages);
  }

  async clarifyResponse() {
    const clarificationPrompt = {
      role: "user",
      content: `Ask a question to follow up anything unclear about the users last response. Here is the current messages:
      ${this.messages}`
    };
    this.messages.push(clarificationPrompt);
    await this.sendMessageToAskEndpoint(this.messages);
  }

  async provideScoreInfo() {
    const promptMessage = {
      role: "user",
      content: `
        After the patient has answered all 9 questions, calculate the total score by adding up the point values for each response. Then ask the additional non-scored question at the end about how difficult these problems have made things for the patient.
        
        Interpret the total PHQ-9 score as follows:
        - 0-4 = Minimal or no depression 
        - 5-9 = Mild depression
        - 10-14 = Moderate depression
        - 15-19 = Moderately severe depression
        - 20-27 = Severe depression
        
        Explain to the patient what their score indicates in terms of depression severity. For scores of 10 or higher, let them know they may be experiencing clinical depression and should consider seeing a healthcare provider for further evaluation and discussion of treatment options. Express empathy and support.
        Here is the current messages:
        ${this.messages}
      `
    };
    this.messages.push(promptMessage);
    await this.sendMessageToAskEndpoint(this.messages);
  }

  async concludeScreening() {
    const promptMessage = {
      role: "user",
      content: "After providing the score information, politely conclude the screening, thank the user for their time, and suggest they seek professional advice if their score indicates moderate to severe depression."
    };
    this.messages.push(promptMessage);
    await this.sendMessageToAskEndpoint(this.messages);
  }

  
  async sendMessageToAskEndpoint(messages) {
    try {
      const response = await fetch('https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      if (!response.ok) {
        throw new Error('Failed to send message to /ask endpoint');
      }
      const data = await response.json();
      this.addMessage({ role: 'assistant', content: data.reply.content });
      console.log('messages:', this.messages.map(msg => `${msg.role}: ${msg.content}`).join('\n'));
    } catch (error) {
      console.error('Error sending message to /ask endpoint:', error);
    }
  }

}

export default Agent


