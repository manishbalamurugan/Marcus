import { Transition } from 'react-transition-group';
import { useState, useEffect } from 'react';

export default function Onboarding(props) {
  const uuid = props.uuid;
  const qualt_id = uuid;
  const conversation_id = uuid;
  const stage = props.stage;
  const setStage = props.setStage;
  const company = props.company;
  const [showSubheading, setShowSubheading] = useState(false);
  const [showInputs, setShowInputs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setShowSubheading(true);
    }, 1750);
    setTimeout(() => {
      setShowInputs(true);
    }, 2000);
  }, []);

  const duration = 300;
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  };
  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 0 },
    exited: { opacity: 0 },
  };

  async function startInterview(e) {
    e.preventDefault();
    try {
      // const response = await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, uuid, uuid }),
      // });
      const response = await fetch("https://us-central1-marcus-chat-ae955.cloudfunctions.net/app/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, qualt_id, conversation_id, uuid }),
      });
    } catch (error) {
      alert(error.message);
    }
    setStage(2);
  }

  
  function checkInput() {
    return email.length > 0 && name.length > 0;
  }

  function handleCheck() {
    setTermsAgreed(!termsAgreed);
  }



  return (
    <>
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">
        <div className="w-[50%] lg:w-[40%] h-[70%] bg-white shadow-xl rounded-lg p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Welcome!</h1>
          <p className="text-gray-600 mb-6 text-center">Please enter your details to join the meeting.</p>
          <Transition in={showSubheading}>
            {(state) => (
              <div
                style={{ ...defaultStyle, ...transitionStyles[state] }}
                className="text-center mb-6"
              >
                <p className="text-xl text-gray-700">
                  You have been invited to meet with <span className="font-bold">Marcus</span>.
                </p>
              </div>
            )}
          </Transition>
          <Transition in={showInputs}>
            {(state) => (
              <div
                style={{ ...defaultStyle, ...transitionStyles[state] }}
                className="mb-6"
              >
                <input
                  id="name"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 text-gray-700 mb-4"
                  type="text"
                  placeholder="Your Name"
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  id="email"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 text-gray-700 mb-4"
                  type="email"
                  placeholder="Your Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {checkInput() && (
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      onChange={handleCheck}
                      id="termsAgreement"
                      className="rounded border-gray-300 text-blue-600 mr-2"
                    />
                    <label htmlFor="termsAgreement" className="text-gray-700">
                      I agree to the terms and conditions
                    </label>
                  </div>
                )}
              </div>
            )}
          </Transition>
          <div className={`${termsAgreed ? '' : 'hidden'} text-center`}>
            <button
              className="bg-blue-600 text-white py-3 px-6 rounded-md font-semibold text-lg"
              onClick={startInterview}
              disabled={!checkInput() || !termsAgreed}
            >
              Join the Meeting
            </button>
          </div>
        </div>
      </div>
    </>
  );
}