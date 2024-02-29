import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Onboarding from '../components/Onboarding';
import Chat from "../components/Chat";
import InvalidID from '../components/InvalidID';
import { v4 as uuidv4 } from "uuid";

const uuid = uuidv4();

export default function Interview(props) {
    // stage 1 
    // stage
    const socket = props.socket
    const chatID = useParams()["chatID"];
    const [stage, setStage] = useState(0);
    const [linkValid, setLinkValid] = useState(false)


    useEffect(() => {
        //validateId()
    }, [chatID])

    // function validateId() {
    //     let validate_uuid = isUUID(chatID)
    //     if (validate_uuid) {
    //         var query = {
    //             'collection': 'links',
    //             'linkID': chatID
    //         }
    //         socket.emit('get-mongo', query)
    //         socket.on('response', (data) => {
    //             data = JSON.stringify(data)
    //             var parsed = JSON.parse(data)
    //             if (parsed['type'] == 'get-links') {
    //                 let linkData = parsed['data']   
    //                 let companyQuery = {
    //                     'collection' : 'companies',
    //                     'companyID' : linkData[0]['companyID']
    //                 }
    //                 socket.emit('get-mongo', companyQuery)
    //                 setLinkValid(linkData.length > 0)
    //             }
    //             if (parsed['type'] == 'get-company'){
    //                 setCompany(parsed['data'][0])
    //             }
    //         })

    //         let updateLinkStatusQuery = {
    //                     "collection" : "links",
    //                     "query": {"linkID":chatID},
    //                     "update": {"status":"opened"}
    //                 }
    //         socket.emit('update-mongo', updateLinkStatusQuery)
    //     }
    // }

    function isUUID(str) {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(str);
    }

    return (
            <>
                <Header />
                <div className="h-screen backdrop-blur-xl bg-gradient-to-t from-[#070E25] to-black overflow-auto">
                    <div className="flex h-full w-full items-center justify-center">
                        {
                            stage != 2 ?
                                <Onboarding stage={stage} setStage={setStage} company="You" socket={socket} uuid={uuid}/>
                                :
                                <div className="h-screen w-screen">
                                    <Chat socket={socket} uuid={uuid} />
                                </div>
                        }
                        <Footer />
                    </div>
                    
                </div>
            </>
    )
}