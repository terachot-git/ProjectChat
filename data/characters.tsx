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
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle31_cmbebj.webp'
    },
    {
        id: 'ellen',
        name: 'Ellen',
        color: 'bg-pink-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763023051/IconMessageRoleCircle14_i76zbh.webp'
    },
    {
        id: 'belle',
        name: 'Belle',
        color: 'bg-orange-400',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle32_g3m3oj.webp'
    },
    {
        id: 'miyabi',
        name: 'Miyabi',
        color: 'bg-blue-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022883/IconMessageRoleCircle07_qf2fxg.webp'
    },
    {
        id: 'alice',
        name: 'Alice',
        color: 'bg-purple-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle100024_fgq6gi.webp'
    },
    {
        id: 'nicole',
        name: 'Nicole',
        color: 'bg-yellow-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle06_gxhri0.webp'
    },
    {
        id: 'anby',
        name: 'Anby',
        color: 'bg-teal-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle01_z4rifi.webp'
    },
    {
        id: 'lucy',
        name: 'Lucy',
        color: 'bg-red-500',
        avatar: 'https://res.cloudinary.com/ddy7n2rnc/image/upload/v1763022882/IconMessageRoleCircle100002_uemerx.webp'
    }
];

export const getCharacterById = (id: string | undefined | null): Character | undefined => {
    if (!id) return undefined;
    return characters.find(c => c.id === id);
}