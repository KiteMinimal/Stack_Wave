
import React, { useEffect, useState, useRef, useCallback } from 'react'; // Added useCallback
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';


const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 3.105a.75.75 0 01.814-.398l14.25 5.25a.75.75 0 010 1.388l-14.25 5.25a.75.75 0 01-.814-.398V3.105z" /></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876V5.25a1.125 1.125 0 00-1.125-1.125h-1.5c-.621 0-1.125.504-1.125 1.125v3.375c0 .621.504 1.125 1.125 1.125h1.5a1.125 1.125 0 011.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 00-1.125 1.125v3.375m1.5-4.5" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;


function RoomPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useSelector(state => state.user);

    const [copied, setCopied] = useState(false); 
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [code, setCode] = useState(''); 
    const [language, setLanguage] = useState(javascript()); 

    const socketRef = useRef(null);
    const editorRef = useRef(null); 
    const chatMessagesEndRef = useRef(null); 

    // --- Auto-scroll chat --- (Added)
    useEffect(() => {
        chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // --- Editor Code Change Handler --- (Added)
    // useCallback to prevent unnecessary re-renders of CodeMirror if passed as prop
    const onCodeChange = useCallback((value, viewUpdate) => {
        setCode(value);
        // Emit code change event ONLY if it wasn't triggered by a socket update
        // We need a way to distinguish local changes from remote changes if possible
        // Simple approach for now: always emit, backend can prevent echo back to sender
        if (socketRef.current && isConnected) {
             // console.log('Emitting codeChange:', value.substring(0,10) + '...'); // Debug log
             socketRef.current.emit('codeChange', { roomId, newCode: value });
        }
    }, [roomId, isConnected]);


    // Socket Connection useEffect
    useEffect(() => {
        if (!user || !token) {
            navigate('/login');
            return;
        }

        socketRef.current = io(SOCKET_SERVER_URL, { query: { token } });
        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log(`Socket connected: ${socket.id}`);
            setIsConnected(true);
            socket.emit('joinRoom', { roomId, user });
        });

        socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${reason}`);
            setIsConnected(false);
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            setIsConnected(false);
        });

        socket.on('roomData', ({ participantsList, currentCode }) => {
            console.log('Received initial room data:', participantsList, currentCode?.substring(0,10) + '...');
            setParticipants(participantsList || []);
            if (currentCode !== undefined && currentCode !== null) {
               setCode(currentCode); // Set initial code
            }
            // TODO: Set initial language if provided by backend
        });

        // Listen for code updates from others
        socket.on('updateCode', (newCode) => { // Added listener
            // console.log('Received updateCode:', newCode.substring(0,10) + '...'); // Debug log
             // Check if the incoming code is different from the current local code
             // This helps prevent unnecessary re-renders or cursor jumps if the update is from self
             setCode(prevCode => {
                 if (prevCode !== newCode) {
                     return newCode;
                 }
                 return prevCode;
             });
        });


        socket.on('newMessage', (message) => {
            console.log('Received newMessage:', message);
            setMessages((prev) => [...prev, message]);
        });

        socket.on('userJoined', (newUser) => {
             console.log('User joined:', newUser);
             setParticipants((prev) => [...prev, newUser]);
        });

        socket.on('userLeft', (userId) => {
            console.log('User left:', userId);
            setParticipants((prev) => prev.filter(p => p._id !== userId));
        });

        return () => {
            if (socketRef.current) {
                console.log(`Disconnecting socket: ${socketRef.current.id}`);
                socketRef.current.disconnect();
                socketRef.current = null;
                setIsConnected(false);
                setParticipants([]);
                setMessages([]);
                setCode('');
            }
        };
    }, [roomId, user, token, navigate]);

 
    const handleSendMessage = (e) => {
        e.preventDefault();
        const messageText = newMessage.trim();
        if (messageText && socketRef.current && isConnected) {
            socketRef.current.emit('sendMessage', { roomId, text: messageText });
            setNewMessage('');
        }
    };

    const handleCopyLink = () => {
        const roomUrl = window.location.href; // Gets the full current URL
        navigator.clipboard.writeText(roomUrl).then(() => {
          setCopied(true);
          // Reset copied state after a short delay
          setTimeout(() => setCopied(false), 1500);
        }).catch(err => {
          console.error('Failed to copy room link: ', err);
        });
    };


    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">

            {/* Left Pane: Code Editor Area */}
            <div className="flex-grow lg:w-3/4 bg-gray-200 dark:bg-gray-900 p-1 lg:p-2 h-1/2 lg:h-full overflow-y-auto">
                 <CodeMirror
                    ref={editorRef}
                    value={code}
                    height="100%"
                    theme={document.documentElement.classList.contains('dark') ? okaidia : 'light'}
                    extensions={[language]}
                    onChange={onCodeChange}
                    className="h-full text-sm rounded shadow-inner" 
                    // basicSetup={{ lineNumbers: true, foldGutter: true }}
                 />
            </div>

            {/* Right Pane: Sidebar (Participants + Chat) */}
            <div className="lg:w-1/4 flex flex-col bg-gray-100 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 h-1/2 lg:h-full"> 

                {/* Participants List */}
                <div className="p-3 border-b border-gray-300 dark:border-gray-700 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    {/* ... (participants list code - same as before) ... */}
                     <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">
                         Participants ({participants.length})
                         <span className={`ml-2 inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} title={isConnected ? 'Connected' : 'Disconnected'}></span>
                     </h3>

                     <button
                        onClick={handleCopyLink}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors duration-150 ${
                            copied
                            ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                        title="Copy room invite link"
                     >
                       {copied ? <CheckIcon /> : <CopyIcon />}
                       <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                     </button>

                     <ul className="space-y-1 max-h-32 overflow-y-auto text-xs">
                          {participants.map(p => (
                              <li key={p._id} className="flex items-center space-x-1.5 text-gray-700 dark:text-gray-300">
                                  <img className="w-5 h-5 rounded-full object-cover" src={p.avatarUrl || `https://ui-avatars.com/api/?name=${p.name}&size=20&background=random`} alt={p.name}/>
                                  <span>{p.name} {p._id === user?._id ? '(You)' : ''}</span>
                              </li>
                          ))}
                          {participants.length === 0 && <li className="text-gray-400 italic">Just you</li>}
                      </ul>

                </div>

                {/* Chat Area */}
                <div className="flex-grow p-3 flex flex-col overflow-hidden">
                    <div className="flex-grow overflow-y-auto mb-2 space-y-2 pr-1">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.user?._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-start gap-2 max-w-[80%] ${msg.user?._id === user?._id ? 'flex-row-reverse' : ''}`}>
                                     
                                    <img className="w-6 h-6 rounded-full object-cover mt-1 flex-shrink-0" src={msg.user?.avatar || `https://ui-avatars.com/api/?name=${msg.user?.username || '?'}&size=24&background=random`} alt={msg.user?.username} />
                                    <div className={`px-3 py-1.5 rounded-lg ${msg.user?._id === user?._id ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100'}`}>
                                          {msg.user?._id !== user?._id && <p className="text-xs font-semibold mb-0.5 opacity-80">{msg.user?.username || 'Unknown'}</p>}
                                         <p className="text-sm break-words">{msg.text}</p>
                                         <p className="text-xs opacity-60 mt-1 text-right"> {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'}) : ''} </p>
                                     </div>
                                 </div>
                            </div>
                        ))}
                         {/* Element to scroll to */}
                         <div ref={chatMessagesEndRef} />
                         {messages.length === 0 && <p className="text-center text-sm text-gray-400 italic mt-4">No messages yet.</p>}
                    </div>

                    {/* Chat Input Form (Added) */}
                    <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center space-x-2 pt-2 border-t border-gray-300 dark:border-gray-700">
                        <label htmlFor="chatInput" className="sr-only">Chat Message</label>
                        <input
                            type="text"
                            id="chatInput"
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 disabled:opacity-50"
                            disabled={!newMessage.trim() || !isConnected}
                        >
                           <SendIcon/>
                           <span className="sr-only">Send</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RoomPage;