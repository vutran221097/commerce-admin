import { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFaceSmile, faPaperPlane, faUser } from '@fortawesome/free-solid-svg-icons';
import Picker from "emoji-picker-react";
import { io } from "socket.io-client";

import Layout from "../../components/Layout/Layout"
import './Chat.css'
import Axios from '../../api/Axios';
import { toastNoti } from '../../utils/utils'
import SERVER from '../../config.server'

const Chat = () => {
    const socket = useRef();
    const scrollRef = useRef();

    const [rooms, setRooms] = useState([])
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [sendTo, setSendTo] = useState("")
    const [roomId, setRoomId] = useState("")
    const [isActive, setIsActive] = useState(true)
    const [roomIdChange, setRoomIdChange] = useState("")

    const getRooms = async () => {
        try {
            const res = await Axios.get('/session/get-room')
            if (res.status === 200) {
                setRooms(res.data)
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getRooms()
    }, [])

    useEffect(() => {
        if (!rooms.length || rooms.filter(item => item.roomId === roomIdChange).length) return;
        getRooms()
        toastNoti('You have new message!', 'success')
        // eslint-disable-next-line
    }, [roomIdChange])

    useEffect(() => {
        socket.current = io(SERVER);
        socket.current.emit("add-user", 'counselor');
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg });
            });
            socket.current.on("room-id", (id) => {
                setRoomIdChange(id)
            });
        }
    }, []);


    const handleEmojiClick = (event) => {
        let msg = message;
        msg += event.emoji;
        setMessage(msg);
        setShowEmojiPicker(false);
    };

    const handleEmojiPickerhideShow = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const getMsg = async () => {
        const res = await Axios.post('/session/getmsg', {
            roomId: roomId,
            from: 'counselor',
            to: sendTo,
        });
        setMessages(res.data);
    }


    useEffect(() => {
        if (!sendTo) return;
        getMsg()
        // eslint-disable-next-line
    }, [sendTo]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
        if (arrivalMessage?.message === '/end') {
            setIsActive(false)
            toastNoti('User has ended chat!', 'error')
            setSendTo('')
            getRooms()
        }
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMsg = async (msg) => {
        socket.current.emit("send-msg", {
            roomId: roomId,
            from: 'counselor',
            to: sendTo,
            msg,
        });
        await Axios.post('/session/addmsg', {
            roomId: roomId,
            from: 'counselor',
            to: sendTo,
            message: msg,
        });

        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
        setMessage("")
    };

    const onKeyPressed = (e) => {
        if (e.key === "Enter") {
            handleSendMsg(message)
        }
    }

    const handleChatChange = (e) => {
        setMessage(e.target.value);
    };

    const ChatComponent = (
        <div className="card mt-4 me-2 p-4 chat-container">
            <div className="row">
                <div className="col-3 chat-room custom-border">
                    <div></div>
                    <h4>Contact</h4>
                    <hr />
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Search contact..."
                            aria-label="search"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    <div className='chat-contact'>
                        {rooms.map((item, index) => {
                            return (
                                <div key={index} className={`chat-send-to ${item.isActive ? 'active' : 'deactive'} mb-3`} onClick={() => { setSendTo(item.users[0]); setRoomId(item.roomId); setIsActive(item.isActive) }}>
                                    <p><FontAwesomeIcon icon={faUser} />&nbsp; {item.users[0]}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="col-9 chat-box d-flex flex-column justify-content-between">
                    {!sendTo ? (<div>
                        <h1 className='text-center mt-5'>Welcome</h1>
                        <p className='text-center mt-3'><FontAwesomeIcon icon={faArrowLeft} color='green' /> Green is active chat</p>
                        <p className='text-center'><FontAwesomeIcon icon={faArrowLeft} color='grey' /> Grey is de-active chat</p>
                    </div>) : (
                        <>
                            <div>
                                <h4>Messages {sendTo ? `to ${sendTo}` : ""}</h4>
                                <hr />
                            </div>
                            <div className='chat-content'>
                                {messages.map((message) => {
                                    return (
                                        <div ref={scrollRef} key={uuidv4()}>
                                            <div
                                                className={`message ${message.fromSelf ? "user-chat" : "admin-chat"
                                                    }`}
                                            >
                                                <div className="content ">
                                                    <p>{!message.fromSelf && <FontAwesomeIcon icon={faUser} />} {message.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='chat-action'>
                                {!isActive ? (<p className='text-center'>User has ended this chat!</p>) : (
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <div className='col-11 d-flex chat-input align-items-center'>
                                            <FontAwesomeIcon icon={faUser} />
                                            <input type="text" placeholder="Enter Message!" onKeyDown={onKeyPressed} onChange={handleChatChange} value={message || ""} />
                                        </div>
                                        <div className='col-1 d-flex gap-2 chat-actions'>
                                            <FontAwesomeIcon icon={faFaceSmile} className="chat-icon" onClick={handleEmojiPickerhideShow} />
                                            {showEmojiPicker &&
                                                <div className="emoji-container">
                                                    <Picker className="emoji-container" onEmojiClick={handleEmojiClick} width={300} height={400} />
                                                </div>}
                                            <FontAwesomeIcon icon={faPaperPlane} className="send-action live-chat-icon" onClick={() => handleSendMsg(message)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <Layout children={ChatComponent} />
        </div>
    )
}

export default Chat