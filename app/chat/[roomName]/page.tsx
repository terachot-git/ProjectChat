import { getCharacterById } from '../../../data/characters';
import ChatClient from '../../../components/ChatClient';

interface ChatRoomPageProps {
  params: Promise<{ roomName: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ChatRoomPage(props: ChatRoomPageProps) {
    
    const params = await props.params;
    const searchParams = await props.searchParams;
     const encodedRoomName = params.roomName;
    const roomName = decodeURIComponent(encodedRoomName);

    const getCharacterIdFromParams = () => {
        const char = searchParams.character;
        if (Array.isArray(char)) {
            return char[0];
        }
        return char;
    }

    const characterId = getCharacterIdFromParams();
    const character = getCharacterById(characterId);

    if (!character) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-500">เกิดข้อผิดพลาด</h1>
                    <p className="text-xl mt-2">ไม่พบตัวละครที่คุณเลือก ({characterId || 'N/A'})</p>
                    <a href="/" className="mt-4 inline-block bg-blue-500 px-4 py-2 rounded-lg">
                        กลับไปหน้าแรก
                    </a>
                </div>
            </div>
        );
    }

    return (
        <ChatClient 
            roomName={roomName} 
            character={character} 
        />
    );
}