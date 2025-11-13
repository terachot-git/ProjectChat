'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { characters } from '../data/characters';

export default function SelectionPage() {
    const [roomName, setRoomName] = useState<string>('');
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
    const router = useRouter();

    const handleJoin = () => {
        if (selectedCharacterId && roomName.trim()) {
            router.push(`/chat/${roomName}?character=${selectedCharacterId}`);
        } else {
            alert('โปรดเลือกตัวละคร และป้อนชื่อห้อง');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
            
            <h1 className="text-4xl font-bold mb-8">เลือกตัวละครของคุณ</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {characters.map((c) => (
                    <button 
                        key={c.id} 
                        onClick={() => setSelectedCharacterId(c.id)} 
                        className={`
                            flex flex-col items-center p-4 rounded-2xl transition-all duration-200
                            border-4 border-transparent
                            ${selectedCharacterId === c.id ? 'border-blue-500 scale-125' : 'hover:bg-gray-700'}
                        `}
                    >
                        <img 
                            src={c.avatar} 
                            alt={c.name} 
                            className="w-24 h-24 rounded-full mb-2 bg-gray-600"
                        />
                        <span className="text-lg font-semibold">{c.name}</span>
                    </button>
                ))}
            </div>

            <h2 className="text-2xl font-bold mt-4 mb-4">ป้อนชื่อห้อง</h2>
            <input
                type="text"
                value={roomName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomName(e.target.value)}
                className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                placeholder="เช่น: shadow-room"
            />

            <button
                onClick={handleJoin}
                className="mt-6 px-10 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold text-xl
                transition-all duration-200 hover:scale-105 disabled:opacity-50"
                disabled={!selectedCharacterId || !roomName.trim()}
            >
                เข้าร่วมแชท
            </button>
        </div>
    );
}