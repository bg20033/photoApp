
export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  videoUrl: string;
  createdAt: string;
}

export interface Photo {
  id: string;
  url: string;
  fullUrl?: string; 
  title?: string;
  folderId: string;
  isFavorite: boolean;
  isSelected: boolean;
}

export interface PhotoFolder {
  id: string;
  name: string;
  parentId: string | null;
  coverPhoto: string;
  photoCount: number;
}

export interface ClientUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
}
