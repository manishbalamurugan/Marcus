import { Transition } from 'react-transition-group';
import { useState, useEffect } from 'react'

export default function Onboarding(props) {
    const stage = props.stage
    const setStage = props.setStage
    const company = props.company
    const [showSubheading, setShowSubheading] = useState(false);
    const [showInputs, setShowInputs] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [termsAgreed, setTermsAgreed] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")


    useEffect(() => {
        setTimeout(() => {
            setShowSubheading(true);
        }, 1750);


        setTimeout(() => {
            setShowInputs(true);
        }, 2000);

    })

    const duration = 300;
    const defaultStyle = {
        transition: `opacity ${duration}ms ease-in-out`,
        opacity: 0,
    }
    const transitionStyles = {
        entering: { opacity: 0 },
        entered: { opacity: 1 },
        exiting: { opacity: 0 },
        exited: { opacity: 0 },
    };

     function startInterview() {
        var profileUpdate = {
            "customerInfo.name": name,
            "customerInfo.email" : email,
            "status": "started"   
        }
        var chatData = {
            'linkID': props.linkID
        }

        var updateQuery = {
            'collection' : 'links',
            'query': chatData,
            'update': profileUpdate
        }
        props.socket.emit('update-mongo', updateQuery)
        props.socket.emit('start-interview', chatData)
        setStage(2)
    }

    function checkInput() {
        return email.length > 0 && name.length > 0
    }

    function handleCheck(){
        setTermsAgreed(!termsAgreed)
    }


    return (<>
        <div className="h-full w-full m-10 mt-[5rem]">
            <div className="animate-fadeIn animate-bounce text-gray-200 transition-colors hover:text-gray-900 text-center">
                <p className="text-4xl font-bold text-opacity-70">We value your feedback.</p>
            </div>
            <Transition in={showSubheading}>
                {state => (
                    <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                    }} className="text-center">
                        <p className="text-5xl text-sky-500 font-bold text-opacity-70 pt-6"><span className="text-sky-400 font-extrabold">{company}</span> have been invited to participate in this chat</p>
                    </div>
                )}
            </Transition>
            <Transition in={showInputs}>
                {state => (
                    <div className="grid grid-cols-1 items-center">
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyles[state]
                        }} className="mx-auto text-center mt-14 py-10 bg-slate-900 w-[40%] p-4 gap-y-2 rounded-lg grid grid-cols-1 items-center">
                            <div className="mx-14 flex items-center gap-x-5">
                                <p className="text-sky-200 font-bold text-lg text-left">Name</p>
                                <input id="name" className="rounded-md mt-1 bg-gray-100 bg-opacity-10 p-2 text-gray-400 font-medium w-[100%]" type="text" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="mx-14 flex items-center gap-x-6 mt-5">
                                <p className="text-sky-200 font-bold text-lg text-left ">Email</p>
                                <input id="email" className="rounded-md mt-1 bg-gray-100 bg-opacity-10 p-2 text-gray-400 font-medium w-[100%]" type="email" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            {
                                checkInput() ?
                                <div className="mx-auto flex items-center gap-x-3 mt-8">
                                    <input className="bg-red-400 accent-blue-700 bg-opacity-10 " type="checkbox" onChange={handleCheck}/>
                                    <p className="text-sky-100 text-sm font-semibold text-left">I agree to the <span onClick={() => window.location='/terms'}>terms</span></p>
                                </div>
                                :
                                <></>
                            }

                        </div>
                    </div>
                )}
            </Transition>
            
                <div className={`${termsAgreed ? '' : 'hidden'} w-full text-center mt-10`}>
                    <button className="text-white p-2 mt-5 rounded-md font-bold" onClick={startInterview}>Continue →</button>
                </div>
        </div>
    </>)
}