export interface Room {
    id: string;
    name: string;
    adminId: string;
    isPaused: boolean;
    currentlyPlaying?: Song;
}

export interface User{
    id: string;
    name: string;
    currentRoomId: string;
}

export interface Artist {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }
  
  export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
  }
  
  export interface Image {
    height: number;
    width: number;
    url: string;
  }
  
  export interface Song {
    id: string;
    album: Album;
    artists: Artist[];
    available_markets: string[];
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
    href: string;
    name: string;
    popularity: number;
    preview_url: string;
    uri: string;
    score: number;
  }