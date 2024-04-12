class AgentController {
    constructor(agent) {
      this.agent = agent;
      this.currentQuestionIndex = 0;
      this.screeningStarted = false;
      this.questionsAsked = 0;
    }
  
    initiateScreening() {
      this.screeningStarted = true;
      this.currentQuestionIndex = 0;
      this.questionsAsked = 0;
      this.askNextQuestion();
    }
  
    askNextQuestion() {
      if (this.questionsAsked >= 9) {
        this.provideScoreInfo();
        return;
      }
  
      const question = this.agent.questions[this.currentQuestionIndex];
      this.agent.addMessage({ role: 'assistant', content: question });
      this.currentQuestionIndex++;
      this.questionsAsked++;
    }
  
    provideScoreInfo() {
      const scoreMessage = "Based on your responses, here's your score...";
      this.agent.addMessage({ role: 'assistant', content: scoreMessage });
      this.concludeScreening();
    }
  
    concludeScreening() {
      const conclusionMessage = "Thank you for completing the PHQ-9 screening.";
      this.agent.addMessage({ role: 'assistant', content: conclusionMessage });
      this.screeningStarted = false;
      this.currentQuestionIndex = 0;
      this.questionsAsked = 0;
    }
  
    async processUserResponse(userResponse) {
      if (!this.screeningStarted) {
        if (userResponse.trim().toLowerCase() === 'start') {
          this.initiateScreening();
        } else {
          this.agent.addMessage({ role: 'assistant', content: "Please type 'Start' to begin the PHQ-9 screening." });
        }
      } else {
        // Determine the next step based on the user's response
        const nextStep = await this.agent.determineNext(userResponse);
        if (nextStep === 'ask_next_question') {
          this.askNextQuestion();
        } else if (nextStep === 'clarify_response') {
          this.agent.clarifyResponse();
        } else {
          this.agent.addMessage({ role: 'assistant', content: "I'm not sure how to proceed. Let's try the last question again." });
          this.currentQuestionIndex--;
          this.askNextQuestion();
        }
      }
    }
  }
  
  export default AgentController;