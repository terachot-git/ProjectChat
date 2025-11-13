export interface Character {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

export const characters: Character[] = [
    {
        id: 'wise',
        name: 'Wise',
        color: 'bg-green-600',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Wise'
    },
    {
        id: 'ellen',
        name: 'Ellen',
        color: 'bg-pink-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Ellen'
    },
    {
        id: 'belle',
        name: 'Belle',
        color: 'bg-orange-400',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Belle'
    },
    {
        id: 'max',
        name: 'Max',
        color: 'bg-blue-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Max'
    },
    {
        id: 'luna',
        name: 'Luna',
        color: 'bg-purple-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Luna'
    },
    {
        id: 'leo',
        name: 'Leo',
        color: 'bg-yellow-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Leo'
    },
    {
        id: 'finn',
        name: 'Finn',
        color: 'bg-teal-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Finn'
    },
    {
        id: 'zara',
        name: 'Zara',
        color: 'bg-red-500',
        avatar: 'https://api.dicebear.com/8.x/pixel-art/png?seed=Zara'
    }
];

export const getCharacterById = (id: string | undefined | null): Character | undefined => {
    if (!id) return undefined;
    return characters.find(c => c.id === id);
}