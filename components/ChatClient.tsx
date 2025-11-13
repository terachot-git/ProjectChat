'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { characters , Character} from '@/data/characters';
import Image from 'next/image';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://websocketapichat.onrender.com'
    : 'http://localhost:3001';

interface ChatClientProps {
  roomName: string;
  character: Character;
}

export default function ChatClient({ roomName, character }: ChatClientProps) {
    
    const { messages, sendMessage, isConnected } = useWebSocket(roomName);
    
    const [input, setInput] = useState<string>('');
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }

        const file = event.target.files[0];

        if (file.size > 1024 * 1024 * 5) {
            alert('Image size must not exceed 5MB.');
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const result = await response.json();
            const imageUrl = result.imageUrl;

            const msgPayload = {
                sender: character.id,
                imageUrl: imageUrl
            };
            sendMessage(msgPayload);

        } catch (error) {
            console.error('Error uploading image:', error);
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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
            <div className='h-screen flex items-center justify-center '>
            <div className="chat-wrapper">
            
                    <div className="chat-header  flex items-center relative p-5">
                       <Image src="/Chat-Icon-Small.webp"
                            alt="Chat Icon"
                            width={24}
                            height={24}
                            style={{
                                width: '1.125em',
                                height: '1.125em',
                                filter: 'brightness(0.335)'
                            }}
                            className="mr-2"
                        />
                        <h1 className="text-xl font-bold bottom-0.5 relative">{roomName}</h1>
                    </div>
        
                <div className="chat-messages">
                    {messages.map((msg, i) => {
                        const senderInfo = getSenderInfo(msg.sender);
                        const isMe = msg.sender === character.id;
                        
                        const fullImageUrl = msg.imageUrl 
                            ? (msg.imageUrl.startsWith('/') ? `${API_URL}${msg.imageUrl}` : msg.imageUrl) 
                            : null;

                        return (
                            <div key={i} className={`flex px-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex ${isMe ? 'flex-row-reverse' : 'flex-row'} items-start max-w-xs md:max-w-md`}>
                                    <Image 
                                        src={senderInfo.avatar} 
                                        alt={senderInfo.name} 
                                        width={56}
                                        height={56}
                                        className="w-14 h-14 rounded-full mx-3 bottom-1.5 relative bg-gray-400"
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
                                            

                                            {msg.text ? (
                                                <span>{msg.text}</span>
                                            ) : msg.imageUrl ? (
                                                <Image 
                                                    src={fullImageUrl!}
                                                    alt="uploaded content"
                                                    width={220}
                                                    height={220}
                                                    className="rounded-lg max-w-[220px] h-auto cursor-pointer"
                                                    unoptimized={true}
                                                    onClick={() => setSelectedImage(fullImageUrl)}
                                                />
                                            ) : null}
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
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            className="hidden"
                            id="image-upload"
                            disabled={isUploading}
                        />
                        <label 
                            htmlFor="image-upload"
                            className={`p-3 cursor-pointer rounded-full hover:bg-gray-700 ${isUploading ? 'opacity-50' : ''}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                <circle cx="9" cy="9" r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                        </label>
                        
                        <input
                            type="text"
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                            className="chat-input w-full"
                            placeholder="พิมพ์ข้อความ..."
                            disabled={!isConnected || isUploading}
                            
                        />
                        <button
                            onClick={handleSend}
                            className="chat-button"
                            disabled={!isConnected || isUploading}
                        >
                            Send
                        </button>
                    </div>
            
            </div>
            
            
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div 
                        className="relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage}
                            alt="Enlarged view"
                            width={1000}
                            height={1000}
                            unoptimized={true}
                            className="rounded-lg object-contain"
                            style={{ width: 'auto', height: 'auto', maxWidth: '90vw', maxHeight: '90vh' }}
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-4 -right-4 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}