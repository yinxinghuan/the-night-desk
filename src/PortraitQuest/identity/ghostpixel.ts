import type { IdentityPack } from '../types';

const art = (name: string) => `${import.meta.env.BASE_URL}art/ghostpixel/${name}.png`;

export const ghostpixelIdentity: IdentityPack = {
  username: 'ghostpixel',
  userId: '618336286',
  sourceAvatar: '',
  avatarDescribe: 'Lovely ghost in white cloth',
  sourceStyle: 'Ghibli',
  portraits: {
    neutral: art('neutral'),
    confident: art('confident'),
    worried: art('worried'),
    defiant: art('defiant'),
    exhausted: art('exhausted'),
    arrival: art('arrival'),
    resolved: art('resolved'),
  },
  scenes: {
    intro: art('intro'),
    midpoint: art('midpoint'),
    win: art('win'),
    lose: art('lose'),
  },
};
