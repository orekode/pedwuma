import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useQuery } from "react-query";
import { Btn, EmptyBox, ChatBtn, ImageCircle, RecipientTab, NotificationTab, ChatContainer, MessageTab } from "components";

import { sendMessage } from "../../functions/creates/Chats";
import { recipientListener, useMessages, messageListener } from "../../functions/reads/Chats";
import { notificationListener, getServicesFromProfiles } from "../../functions/reads/Notifications";
import { Skeleton } from "@mui/material";
import { safeGet, readableDate } from "../../functions/utils/Fixers";
import { getAuth } from "firebase/auth";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { toggleChat, setChatFocus, setRecipient } from "../../config/general";
import { getThumbnail } from "functions/utils/Files";
import { where } from "firebase/firestore";




export default function () {

    const user = getAuth().currentUser;

    const role = useSelector((state) => state.general);

    const dispatch = useDispatch();


    // sendMessage("xI4vzNRDTZXQGGbwduTh4Sas9nU2", "Second Message to test recipient code", "text");

    return (
        <div className="z-50 relative">
            <div className={`fixed ${role.chat ? "top-0" : "top-[400vh]"} left-0 backdrop-blur-sm h-full w-full z-50`}>

                <section className="z-20 chat h-[90vh] w-[550px] max-[550px]:w-screen mx-auto  rounded-xl shadow border overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-95 bg-blue-50">

                    {(role.loggedIn) &&
                        <>
                            <ChatContainer active={role.chatFocus == "notification" || role.chatFocus == "chat"} extraClass="h-full w-full overflow-y-hidden">

                                <div className="chat-nav border-b w-full h-[70px] flex items-center justify-between px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <span className="orb font-bold">Chat</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ChatBtn icon="chat" onClick={() => dispatch(setChatFocus("chat"))} />
                                        <ChatBtn icon="bell" onClick={() => dispatch(setChatFocus("notification"))} />
                                        <ChatBtn icon="x-lg" onClick={() => dispatch(toggleChat())} extraClass="bg-red-500 text-white text-xl h-[40px] w-[40px]" />
                                    </div>
                                </div>

                                <div className="chat-box relative  h-[500px] overlow-hidden">

                                    <Recipients
                                        personClick={
                                            (target) => {
                                                dispatch(setRecipient(target));
                                                dispatch(setChatFocus("single-chat"));
                                            }
                                        }

                                        active={role.chatFocus == "chat"}
                                    />

                                    <Nots active={role.chatFocus == "notification"}/>

                                </div>
                            </ChatContainer>

                            <ChatArea setFocus={(focus) => dispatch(setChatFocus(focus))} chatTarget={role?.recipient} active={role.chatFocus == "single-chat"} extraClass="h-full w-full overflow-y-hidden" />

                        </>
                    }

                    {(user == null || !role.loggedIn) &&
                        <div className="" onClick={() => dispatch(toggleChat())}>
                            <EmptyBox load={true} title="Pedwuma Chat" text="Please log in or sign up to start using pedwuma today" link={["Log In", "/login"]} />
                        </div>
                    }
                </section>

                <div onClick={() => dispatch(toggleChat())} className="absolute h-full w-full z-10"></div>
            </div>

            <ChatBtn onClick={() => dispatch(toggleChat())} extraClass="fixed bottom-5 right-5 h-[60px] w-[60px] text-2xl text-white z-50" color="bg-blue-600 hover:bg-blue-700 active:bg-[#111]" icon="chat" />


        </div>
    );
}

let notId = null;

function Nots({ personClick = () => { }, ...props }) {

    const role = useSelector((state) => state.general);

    const [ recipients, setRecipients ] = useState([]);
    const [ whereList,  setWhereList  ] = useState([]);

    const { data } = useQuery(["user_id"], () => {
        return getAuth()?.currentUser?.uid;
    });

    const whereListData = useQuery(["wherelist", data], async () => {

        const result = await getServicesFromProfiles(data);

        let whereList = result.map( service => where("Receiver ID", "==", service) );
        setWhereList(whereList);
        
        return whereList;
    })

    const audioRef = useRef();

    const playChatSound = () => {
        try {

            audioRef?.current?.play();
    
            // When the sound ends, reset it to allow replay
            audioRef?.current?.addEventListener('ended', () => {
                audioRef.current.currentTime = 0;
            });

        }
        catch (error) {
            console.log(error);
            return true;
        }
    };


    const handleMessageGet = (recipients) => {
        let newId = safeGet(recipients, [`${recipients.length - 1}`, "id"]);


        if (newId !== notId) {

            if (notId !== null) playChatSound();

            notId = newId;
        }

        setRecipients(recipients);
    }

    useEffect(() => {
        return notificationListener(handleMessageGet, data ? data : "", role.role, whereList);
    }, [data, whereList]);

    return (
        <ChatContainer addClass="pb-[75px]" {...props}>
            {(!recipients) && Array.from({ length: 20 }, (item, index) =>
                <div key={index} className="p-0.5 h-[80px] grid">
                    <Skeleton height={80} fullWidth />
                </div>
            )}

            {recipients && recipients?.map((item, index) => {
               console.log(item, "item here");
               return <NotificationTab key={index} item={item} extraClass=" my-0.5 " />
            }
            )}

            <audio ref={audioRef} src="/images/message.mp3" className="h-0 w-0 overflow-hidden p-0 m-0 opacity-0"></audio>

            <EmptyBox load={recipients && recipients?.length <= 0} title="No Notifications Yet" text="" />
        </ChatContainer>
    );
}

let recipId = null;

function Recipients({ personClick = () => { }, ...props }) {

    const [recipients, setRecipients] = useState([]);

    const { data } = useQuery(["user_id"], () => {
        return getAuth()?.currentUser?.uid;
    });

    const audioRef = useRef();

    const playChatSound = () => {
        try {

            audioRef?.current?.play();
    
            // When the sound ends, reset it to allow replay
            audioRef?.current?.addEventListener('ended', () => {
                audioRef.current.currentTime = 0;
            });

        }
        catch (error) {
            console.log(error);
            return true;
        }
    };


    const handleMessageGet = (recipients) => {
        let newId = safeGet(recipients, [`${recipients.length - 1}`, "id"]);


        if (newId !== recipId) {

            if (recipId !== null) playChatSound();

            recipId = newId;
        }

        setRecipients(recipients);
    }

    useEffect(() => {
        return recipientListener(handleMessageGet, data ? data : "");
    }, [data]);

    return (
        <ChatContainer addClass="pb-[75px]" {...props}>
            {(!recipients) && Array.from({ length: 20 }, (item, index) =>
                <div key={index} className="p-0.5 h-[80px] grid">
                    <Skeleton height={80} fullWidth />
                </div>
            )}

            {recipients && recipients?.map((item, index) =>
                <RecipientTab key={index} user={item} extraClass=" my-0.5 " onClick={() => { personClick(item); }} />
            )}

            <audio ref={audioRef} src="/images/message.mp3" className="h-0 w-0 overflow-hidden p-0 m-0 opacity-0"></audio>

            <EmptyBox load={recipients && recipients?.length <= 0} title="Pedwuma Chat" text="Visit our various pages, engage with requesters or service workers and start a chat today" />
        </ChatContainer>
    );
}

let oldId = null;


function ChatArea({ chatTarget = null, setFocus, ...props }) {

    const { data } = useQuery(["user_id"], () => {
        return getAuth().currentUser.uid;
    });



    const userId = getAuth()?.currentUser?.uid;

    const senderId = safeGet(chatTarget, "Sender ID", "");
    const receiverId = safeGet(chatTarget, "Receiver ID", "");

    const recipient = receiverId == data ? senderId : receiverId;


    const audioRef = useRef();
    const imageRef = useRef();
    const fileRef  = useRef();

    const playChatSound = () => {
        try {

            audioRef?.current?.play();
    
            // When the sound ends, reset it to allow replay
            audioRef?.current?.addEventListener('ended', () => {
                audioRef.current.currentTime = 0;
            });

        }
        catch (error) {
            console.log(error);
            return true;
        }
    };

    const [messages, setMessages] = useState([]);

    const [message, setMessage] = useState({
        text: "",
        oldId: null,
        preview: null,
    });

    const handleText = (text) => {
        setMessage({ ...message, type: "text", message: text, text });
    }

    const handleMessageGet = (messages) => {
        let newId = safeGet(messages, [`${messages.length - 1}`, "id"]);


        if (newId !== oldId) {

            if (oldId !== null) playChatSound();

            oldId = newId;
        }

        setMessages(messages);
    }

    useEffect(() => messageListener(handleMessageGet, recipient, data), [data, chatTarget]);

    const handleSend = () => {
        if (message.message.length <= 0) return false;
        sendMessage(recipient, message.message, message.type);
        setMessages([...messages, {
            "id": "noidhere",
            "Message Type": message.type,
            Message: message.message,
        }]);
        setMessage({ ...message, text: "", message: "", preview: null });
    }


    const handleUpload = (e, type) => {
        
        let url = getThumbnail(e.target.files[0])
        setMessage({ ...message, message: e.target.files[0], type: type, preview: url });
    }


    if (getAuth()?.currentUser == null) {
        return (
            <EmptyBox load={true} title="Pedwuma Chat" text="Please log in or sign up to start using pedwuma today" link={["Log In", "/login"]} />
        );
    }


    return (
        <ChatContainer {...props}>
            <div className="chat-nav border-b w-full h-[70px] flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2">
                    <ChatBtn icon="chevron-left" onClick={() => setFocus("chat")} />
                </div>
                <div className="flex items-center gap-3">
                    <span className="orb font-semibold">Pedwuma Chat</span>
                    <ImageCircle image={"/images/logo.png"} extraClass=" h-[40px] w-[40px]" />
                </div>
            </div>

            {chatTarget &&
                <div className="chat-box relative overlow-hidden" style={{ height: "calc(90vh - 70px)" }}>

                    <div className="h-[12%] absolute top-0 left-0 shadow"></div>

                    <div className="p-1.5 py-4 h-[65%] overflow-auto flex" style={{ "overflowAnchor": "auto !important", "flexDirection": "column-reverse" }}>
                        <div className=" h-max flex flex-col justify-end">

                            {messages && messages.map((item, index) =>
                                <MessageTab key={index} message={item} />
                            )}

                        </div>

                        <EmptyBox load={!messages || messages.length <= 0} classname="min-h-[30vh]" title="New Chat" text="Start this chat by sending a message" />

                    </div>

                    <div className="h-[35%] bg-white shadow border rounded-md p-2 relative">
                        {message?.preview &&
                            <div className="preview-box absolute -top-[133%] left-0 h-[200%] w-full bg-white shadow z-20 flex items-center justify-center">
                                <img src={message.preview} className="h-[70%] w-[70%] object-contain rounded-md overflow-hidden bg-white shadow-md" />
                                <ChatBtn onClick={() => setMessage({...message, preview: null, message: "", type: ""})} icon="x-lg" extraClass="h-[30px] w-[30px] scale-95 top-1 right-1 absolute" color="bg-red-400 text-white" />

                            </div>
                        }
                        <audio ref={audioRef} src="/images/message.mp3" className="h-0 w-0 overflow-hidden p-0 m-0 opacity-0"></audio>

                        <input onChange={(e) => handleUpload(e, "image")} className="absolute top-[400vh] h-0 w-0 overflow-hidden p-0 m-0 opacity-0" ref={imageRef} type="file" name="image" accept="image/*" />
                        <input onChange={(e) => handleUpload(e, "image")} className="absolute top-[400vh] h-0 w-0 overflow-hidden p-0 m-0 opacity-0" ref={fileRef} type="file" name="image" />

                        <div className="h-[30%] flex gap-2 px-2 py-1">
                            <ChatBtn onClick={() => imageRef.current.click()} icon="image" extraClass="h-[30px] w-[30px] scale-95" />
                            <ChatBtn onClick={() => fileRef.current.click()} icon="paperclip" extraClass="h-[30px] w-[30px] scale-95" />
                        </div>
                        <textarea value={message?.text} onChange={(e) => handleText(e.target.value)} name="chat" placeholder="Type your message here..." className="bg-gray-200 p-3 text-sm w-full h-[40%] resize-none mb-1 rounded-md outline-none border-2 border-white hover:border-blue-600"></textarea>
                        <Btn.SmallBtn onClick={handleSend} fullWidth>Send Message</Btn.SmallBtn>
                    </div>

                </div>
            }

            {!chatTarget &&
                <EmptyBox load={true} title="Pedwuma Chat" classname="min-h-[50vh]" text="Visit our various pages, engage with requesters or service workers and start a chat today" />
            }

        </ChatContainer>
    );
}