'use client';

import { useEffect, useState, useRef } from 'react';

const WS_URL = process.env.NODE_ENV === 'production'
    ? 'wss://your-backend-name.onrender.com'
    : 'ws://localhost:3001';

interface Message { 
    sender: string; 
    text: string; 
};

export function useWebSocket(roomName: string) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!roomName) return;

        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            const joinMessage = {
                type: 'join',
                room: roomName
            };
            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const msg: Message = JSON.parse(event.data);
                setMessages((prev) => [...prev, msg]);
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
        };

        return () => {
            ws.close();
        };

    }, [roomName]);

    const sendMessage = (payload: Message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const fullMessage = {
                type: 'chat',
                payload: payload
            };
            socketRef.current.send(JSON.stringify(fullMessage));
        }
    };

    return { messages, sendMessage, isConnected };
}