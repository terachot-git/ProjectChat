'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { characters , Character} from '@/data/characters';

interface ChatClientProps {
  roomName: string;
  character: Character;
}

export default function ChatClient({ roomName, character }: ChatClientProps) {
    
    const { messages, sendMessage, isConnected } = useWebSocket(roomName);
    
    const [input, setInput] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const handleSend = () => {
        if (input.trim()) {
            const msgPayload = { 
                sender: character.id,
                text: input 
            };
            sendMessage(msgPayload);
            setInput('');
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getSenderInfo = (senderId: string) => {
        const sender = characters.find(c => c.id === senderId);
        if (sender) {
            return { avatar: sender.avatar, color: sender.color, name: sender.name };
        }
        return { 
            avatar: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=Unknown', 
            color: 'bg-gray-500', 
            name: senderId 
        };
    };

    return (
            <div className='p-5  min-h-screen flex'>
            <div className="chat-wrapper">
            
                    <div className="chat-header p-5 flex items-center relative">
                       <img src="/Chat-Icon-Small.webp"
                            alt="Chat Icon"
                            className="mr-2 w-[1.125em] h-[1.125em] brightness-[.335]"
                        />
                        <h1 className="text-xl font-bold bottom-0.5 relative">{roomName}</h1>

                       
                    </div>
        
                <div className="chat-messages">
                    {messages.map((msg, i) => {
                        const senderInfo = getSenderInfo(msg.sender);
                        const isMe = msg.sender === character.id;

                        return (
                            <div key={i} className={`flex px-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start max-w-xs md:max-w-md`}>
                                    <img 
                                        src={senderInfo.avatar} 
                                        alt={senderInfo.name} 
                                        className="w-14 h-14 rounded-full mx-3 bottom-1 relative bg-gray-400"
                                    />
                                    <div className="flex flex-col">
                                        
                                        <div className={`chat-message-bubble break-all z-50 ${
                                            isMe 
                                            ? 'bubble-me' 
                                            : 'bubble-other'
                                        }`}>

                                            
                                            {!isMe && (
                                                <div 
                                                    style={{
                                                        backgroundImage: "url('/chat_message_arrow_left.webp')",
                                                        backgroundSize: 'contain',
                                                        backgroundRepeat: 'no-repeat',
                                                        position: 'absolute',
                                                        width: '0.75em',
                                                        height: '0.75em',
                                                        top: '0.125em',
                                                        left: '-0.4375em'
                                                    }}
                                                ></div>
                                            )}
                                            
                                            {isMe && (
                                                <div 
                                                    style={{
                                                        backgroundImage: "url('/chat_message_arrow_right.webp')", 
                                                        backgroundSize: 'contain',
                                                        backgroundRepeat: 'no-repeat',
                                                        position: 'absolute',
                                                        width: '0.75em',
                                                        height: '0.75em',
                                                        top: '0.125em',
                                                        right: '-0.4375em',
                                                        zIndex:'20'
                                                    }}
                                                ></div>
                                            )}
                                            

                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

            
                    <div className="chat-input-container p-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                            className="chat-input"
                            placeholder="พิมพ์ข้อความ..."
                            disabled={!isConnected}
                        />
                        <button
                            onClick={handleSend}
                            className="chat-button"
                            disabled={!isConnected}
                        >
                            Send
                        </button>
                    </div>
            
            </div>
             <div className="flex items-center absolute right-4 top-1/2 -translate-y-1/2">
                            <span className={`text-sm mr-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                                {isConnected ? 'Connected' : 'Connecting...'}
                            </span>
                            <img src={character.avatar} alt={character.name} className="w-10 h-10 rounded-full bg-gray-600" />
                        </div>
        </div>
    );
}