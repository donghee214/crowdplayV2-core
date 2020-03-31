export interface RoomType {
    id: string;
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
  
  export interface SpotifySongType {
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
  }

  export interface SongType{
    voters: string[];
    score: number;
    trackId: string;
    song: SpotifySongType;
  }

  export interface Playlist{
    collaborative: boolean
    description: string
    href: string
    id: string
    images: Image[]
    name: string
    primary_color: string
    snapshot_id: string
    tracks: {
      href: string
      total: number
    }
    type: string
    uri: string
  }