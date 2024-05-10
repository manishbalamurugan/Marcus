# Marcus Chatbot 

Marcus is a specialized chat application designed to administer the PHQ-9 depression screening questionnaire. It leverages the power of React for the frontend and Express along with Socket.io for the backend, ensuring real-time, bi-directional communication between clients and the server.

## Project Overview

Marcus is built to facilitate the PHQ-9 depression screening through a conversational interface. The application uses React to manage the user interface and state, while the backend is powered by Express and Socket.io to handle incoming connections and message broadcasting efficiently.

## Getting Started

To get Marcus up and running on your local machine, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install all the necessary dependencies.
4. To start the application in development mode, run `npm start`.

This will launch the Marcus application in your browser, allowing you to interact with the chat interface designed for the PHQ-9 screening.

## Installing Node

Ensure you have the correct version of Node.js and npm installed by following these steps for your operating system:

### Installing Node.js and npm using nvm (Node Version Manager)

#### For macOS:
1. Open your terminal.
2. Install nvm by running the following script:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   ```
3. Restart your terminal.
4. Install Node.js by running:
   ```bash
   nvm install node
   ```
5. Verify the installation of Node.js and npm:
   ```bash
   node -v
   npm -v
   ```

#### For Windows:
1. Download nvm for Windows from the [nvm-windows releases page](https://github.com/coreybutler/nvm-windows/releases).
2. Extract the zip file and run the `nvm-setup.exe` file to start the installer.
3. Open Command Prompt as Administrator and install Node.js using nvm:
   ```cmd
   nvm install latest
   nvm use latest
   ```
4. Verify the installation:
   ```cmd
   node -v
   npm -v
   ```

## Key Features

- **Real-Time Communication**: Utilizes Socket.io for seamless, real-time communication between the client and server.
- **React Frontend**: Employs modern React features such as hooks and functional components for a responsive user interface.
- **Express Backend**: Manages server-side logic, client connections, and routes for handling chat interactions.

## Key Components

- **React Components**: `src/components/Chat.jsx` manages the UI and state of the chat application.
- **Server Setup**: `api/server.js` configures Express and Socket.io to handle incoming connections and route messages.

## Server Endpoints and Flow

- **`/api/ask` Endpoint**: This endpoint processes user messages and determines the next step in the PHQ-9 screening based on the user's response. It uses the `Agent` class to manage the conversation flow and scoring logic.
- **Agent Control Flow**: The `AgentController` class in `src/components/app/AgentController.jsx` orchestrates the screening process, asking questions, processing responses, and providing scoring information.

## User Interface Workflow and Technical Details

The user interface (UI) of our application is designed to be intuitive and user-friendly, ensuring a seamless experience for users as they navigate through the PHQ-9 depression screening process. Below is a technical breakdown of the UI components and the files involved:

### Chat Interface
- **Files Involved**:
  - `Chat.jsx`: This is the main React component that handles the chat interface. It manages state related to user messages, system responses, and the overall flow of the conversation.
  - `styles/Chat.css`: Contains the CSS styles for the chat interface, ensuring the visual aspects are appealing and functional.
- **Initial Greeting**: Upon entering the chat interface, users are greeted by an automated message that introduces the purpose of the screening and invites them to start the questionnaire.
- **Question Presentation**: Each PHQ-9 question is presented one at a time. The questions are structured in a conversational format to make the interaction feel more engaging and less clinical.
- **Response Handling**: Users respond by typing their answers into the chat interface. The system intelligently recognizes the user's input based on predefined valid answer choices (Not at all, Several days, More than half the days, Nearly every day).
- **Clarification Requests**: If a user's response is unclear or does not match the expected answer choices, the system will politely request clarification, ensuring that each response is accurately captured and categorized.
- **Progression**: After a valid response is recorded, the system automatically presents the next question. This continues until all nine questions have been answered.

### Real-Time Feedback
- **Loading Indicators**: While the system processes responses or fetches the next question, users see a visual indicator that something is happening in the background, enhancing the interactive feel of the chat.
- **Error Handling**: Any issues during the interaction, such as network errors or unexpected input formats, are gracefully handled with user-friendly error messages prompting appropriate action.

### Accessibility Features
- **Keyboard Navigation**: The UI supports full keyboard navigation for accessibility, allowing users to interact without relying on a mouse.
- **Contrast and Fonts**: High contrast and readable fonts are used to ensure that users with visual impairments can read the text easily.

### Responsive Design
- **Mobile Compatibility**: The UI is fully responsive, making it accessible on both desktop and mobile devices. This ensures that users can complete the screening from any device, at any time.

### Technical Architecture
- **State Management**: The state of the chat, including messages and user responses, is managed using React's useState hook within `Chat.jsx`.
- **API Integration**: The chat interface communicates with the backend via the `/api/ask` endpoint, handling POST requests that send user responses and receive the next steps or questions.
- **Component Styling**: The styling of the chat interface is handled through modular CSS files associated with each component, allowing for easier maintenance and scalability.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in the interactive watch mode.

## Deployment

Refer to the React documentation on deployment for detailed instructions on deploying the application to a live system.

