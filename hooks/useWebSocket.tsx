'use client';

import { useEffect, useState, useRef } from 'react';

const WS_URL = process.env.NODE_ENV === 'production'
   ? 'wss://websocketapichat.onrender.com'
    : 'ws://localhost:3001';

export type MessagePayload = { 
    sender: string; 
    text?: string;
    imageUrl?: string;
};

export function useWebSocket(roomName: string) {
    const [messages, setMessages] = useState<MessagePayload[]>([]);
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

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
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

    const sendMessage = (payload: MessagePayload) => {
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