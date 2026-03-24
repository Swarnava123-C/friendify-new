import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  photos: string[];
  lookingFor: string;
  personality: string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastSeen: Date;
}

export interface Match {
  id: string;
  users: string[];
  createdAt: Date;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  read: boolean;
}

// User Profile Functions
export const createUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", userId);
  const profile = {
    ...profileData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    isActive: true,
    lastSeen: serverTimestamp(),
  };
  await setDoc(userRef, profile);
  return profile;
};

export const updateUserProfile = async (
  userId: string,
  profileData: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...profileData,
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as UserProfile;
  }
  return null;
};

export const getPotentialMatches = async (
  currentUserId: string,
  limitCount: number = 10
) => {
  const usersRef = collection(db, "users");

  // Simplified query to avoid index requirements
  // Get all users and filter in memory instead of using complex queries
  const q = query(usersRef, limit(50)); // Get more users to filter from

  const querySnapshot = await getDocs(q);
  const allUsers = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as UserProfile)
  );

  // Filter out the current user and inactive users
  const users = allUsers
    .filter(
      (user) =>
        user.isActive !== false && // Include users where isActive is not explicitly false
        user.id !== currentUserId // Exclude the current user
    )
    .sort((a, b) => {
      // Sort by updatedAt if available, otherwise by creation order
      if (a.updatedAt && b.updatedAt) {
        // Handle both Date objects and Firestore Timestamps
        const aTime =
          a.updatedAt instanceof Date
            ? a.updatedAt.getTime()
            : (a.updatedAt as any)?.toDate
            ? (a.updatedAt as any).toDate().getTime()
            : 0;
        const bTime =
          b.updatedAt instanceof Date
            ? b.updatedAt.getTime()
            : (b.updatedAt as any)?.toDate
            ? (b.updatedAt as any).toDate().getTime()
            : 0;
        return bTime - aTime;
      }
      return 0;
    })
    .slice(0, limitCount);

  return users;
};

// Matching Functions
export const createMatch = async (
  userId1: string,
  userId2: string
): Promise<string> => {
  const matchesRef = collection(db, "matches");
  const matchData = {
    users: [userId1, userId2],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(matchesRef, matchData);
  return docRef.id;
};

export const getUserMatches = async (userId: string): Promise<Match[]> => {
  const matchesRef = collection(db, "matches");
  const q = query(matchesRef, where("users", "array-contains", userId));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Match)
  );
};

// Chat Functions
export const sendMessage = async (
  matchId: string,
  senderId: string,
  text: string
) => {
  const messagesRef = collection(db, "matches", matchId, "messages");
  const messageData = {
    text,
    senderId,
    timestamp: serverTimestamp(),
    read: false,
  };

  const docRef = await addDoc(messagesRef, messageData);

  // Update match with last message
  const matchRef = doc(db, "matches", matchId);
  await updateDoc(matchRef, {
    lastMessage: {
      text,
      senderId,
      timestamp: serverTimestamp(),
    },
  });

  return docRef.id;
};

export const getMessages = (
  matchId: string,
  callback: (messages: Message[]) => void
) => {
  const messagesRef = collection(db, "matches", matchId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (querySnapshot) => {
    const messages = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Message)
    );
    callback(messages);
  });
};

export const markMessagesAsRead = async (matchId: string, userId: string) => {
  const messagesRef = collection(db, "matches", matchId, "messages");
  const q = query(messagesRef, where("senderId", "!=", userId));

  const querySnapshot = await getDocs(q);
  const batch: Promise<void>[] = [];

  querySnapshot.docs.forEach((doc) => {
    batch.push(updateDoc(doc.ref, { read: true }));
  });

  await Promise.all(batch);
};

// Like/Pass Functions
export const likeUser = async (currentUserId: string, likedUserId: string) => {
  const userRef = doc(db, "users", currentUserId);
  await updateDoc(userRef, {
    likedUsers: arrayUnion(likedUserId),
  });

  // Check if it's a mutual like
  const likedUserRef = doc(db, "users", likedUserId);
  const likedUserSnap = await getDoc(likedUserRef);

  if (likedUserSnap.exists()) {
    const likedUserData = likedUserSnap.data();
    if (likedUserData.likedUsers?.includes(currentUserId)) {
      // It's a match!
      const matchId = await createMatch(currentUserId, likedUserId);
      return { isMatch: true, matchId };
    }
  }

  return { isMatch: false };
};

export const passUser = async (currentUserId: string, passedUserId: string) => {
  const userRef = doc(db, "users", currentUserId);
  await updateDoc(userRef, {
    passedUsers: arrayUnion(passedUserId),
  });
};
