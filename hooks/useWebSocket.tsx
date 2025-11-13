'use client';

import { useEffect, useState, useRef } from 'react';

const WS_URL = process.env.NODE_ENV === 'production'
    ? 'https://websocketapichat.onrender.com'
    : 'ws://localhost:3001';

export type MessagePayload = { 
    sender: string; 
    text?: string;
    imageUrl?: string;
};

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

export function useWebSocket(roomName: string) {
    const [messages, setMessages] = useState<MessagePayload[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
    const socketRef = useRef<WebSocket | null>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = () => {
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        setConnectionStatus((prev) => (prev === "disconnected" ? "reconnecting" : "connecting"));

        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket connected');
            setConnectionStatus("connected");
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
            setConnectionStatus("disconnected");
            
            if (!retryTimeoutRef.current) {
                retryTimeoutRef.current = setTimeout(connect, 5000); 
            }
        };

        ws.onerror = (err) => {
            console.error('WebSocket error:', err);
            ws.close(); 
        };
    };

    useEffect(() => {
        if (!roomName) return;

        connect(); 

        return () => {
            if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
            }
            if (socketRef.current) {
                socketRef.current.close();
            }
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

    return { messages, sendMessage, connectionStatus };
}