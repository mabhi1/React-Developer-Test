interface UserStateType {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  following?: string[] | [];
  followedBy?: string[] | [];
}

interface createdDBUserType {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  following: string[] | [];
  followedBy: string[] | [];
  createdAt: number;
  updatedAt: number;
}

interface CreatedPostType {
  title: string;
  description: string;
  images: string[];
  likes: string[];
  dislikes: string[];
  comments: {
    userId: string;
    photoURL: string;
    comment: string;
    createdAt: number;
  }[];
  uploadedBy: {
    name: string;
    userId: string;
    photoURL: string;
  };
  createdAt: number;
  updatedAt: number;
}

interface PostType extends CreatedPostType {
  id: string;
}

export type { UserStateType, createdDBUserType, PostType, CreatedPostType };
