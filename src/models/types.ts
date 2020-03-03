export interface RoomType {
    id: string;
    name: string;
    adminId: string;
    isPaused: boolean;
    currentlyPlaying?: SongType;
}

export interface UserType{
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
  
  export interface SongType {
    id: string;
    score: number;
    isRec: boolean;
    voters: string[];
    data: {
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
    }
  }