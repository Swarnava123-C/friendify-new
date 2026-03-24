"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  getUserMatches,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  Message,
  getUserProfile,
} from "@/lib/firestore";

interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
}

interface Chat {
  id: string;
  user: {
    name: string;
    avatar: string;
    lastSeen: string;
  };
  messages: ChatMessage[];
  isOnline: boolean;
}

const CONVERSATION_STARTERS = [
  "What's your favorite way to spend a weekend?",
  "Tell me about your most recent adventure!",
  "What's something you're really passionate about?",
  "If you could travel anywhere, where would you go?",
  "What's the best book you've read recently?",
];

export default function ChatPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === selectedChat);

  const loadMatches = useCallback(async () => {
    if (!user) return;

    try {
      const userMatches = await getUserMatches(user.id);

      // Transform Match data to Chat data with actual user names
      const transformedChats: Chat[] = await Promise.all(
        userMatches.map(async (match) => {
          // Find the other user in the match (not the current user)
          const otherUserId = match.users.find((id) => id !== user.id);
          let userName = "Match User";
          let userAvatar = "M";

          if (otherUserId) {
            try {
              const userProfile = await getUserProfile(otherUserId);
              if (userProfile) {
                userName = userProfile.name;
                userAvatar = userProfile.name[0].toUpperCase();
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
            }
          }

          return {
            id: match.id,
            user: {
              name: userName,
              avatar: userAvatar,
              lastSeen: "Online",
            },
            messages: [], // Messages will be loaded separately
            isOnline: true,
          };
        })
      );

      setChats(transformedChats);
      if (transformedChats.length > 0) {
        setSelectedChat(transformedChats[0].id);
      }
    } catch (error) {
      console.error("Error loading matches:", error);
    }
  }, [user]);

  const loadMessages = useCallback(() => {
    if (!selectedChat || !user) return;

    const unsubscribe = getMessages(selectedChat, (newMessages) => {
      setMessages(newMessages);
      // Mark messages as read
      markMessagesAsRead(selectedChat, user.id);
    });

    return unsubscribe;
  }, [selectedChat, user]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/auth");
    }
  }, [user, isLoaded, router]);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user, loadMatches]);

  useEffect(() => {
    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat, loadMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const sendMessageHandler = async () => {
    if (!messageText.trim() || !currentChat || !user) return;

    try {
      await sendMessage(selectedChat, user.id, messageText);
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendConversationStarter = async (starter: string) => {
    if (!currentChat || !user) return;

    try {
      await sendMessage(selectedChat, user.id, starter);
    } catch (error) {
      console.error("Error sending conversation starter:", error);
    }
  };

  const formatTime = (date: any) => {
    if (!date) return "";

    // Handle Firestore Timestamps
    if (date.toDate && typeof date.toDate === "function") {
      return date
        .toDate()
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Handle Date objects
    if (date instanceof Date) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Handle other cases
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden h-[calc(100vh-200px)]">
          <div className="flex h-full">
            {/* Chat List */}
            <div className="w-1/3 border-r border-white/20">
              <div className="p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white">Messages</h2>
              </div>
              <div className="overflow-y-auto">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-4 text-left hover:bg-white/10 transition-all duration-300 ${
                      selectedChat === chat.id
                        ? "bg-white/10 border-r-2 border-purple-400"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">
                          {chat.user.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white truncate">
                            {chat.user.name}
                          </h3>
                          <span className="text-xs text-white/60">
                            {formatTime(
                              chat.messages[chat.messages.length - 1]?.timestamp
                            )}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 truncate">
                          {chat.messages[chat.messages.length - 1]?.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {chat.isOnline && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                          <span className="text-xs text-white/60">
                            {chat.isOnline ? "Online" : chat.user.lastSeen}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {currentChat && (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-white/20 flex items-center gap-4 bg-white/5 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {currentChat.user.avatar}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {currentChat.user.name}
                      </h3>
                      <p className="text-sm text-white/70">
                        {currentChat.isOnline
                          ? "Online"
                          : `Last seen ${currentChat.user.lastSeen}`}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-white/5">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-6 py-3 rounded-3xl backdrop-blur-sm ${
                            message.senderId === user?.id
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                              : "bg-white/10 text-white border border-white/20"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.text}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.senderId === user?.id
                                ? "text-white/70"
                                : "text-white/60"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Conversation Starters */}
                  {messages.length === 0 && (
                    <div className="p-6 border-t border-white/20 bg-white/5 backdrop-blur-sm">
                      <h4 className="text-sm font-semibold text-white mb-4">
                        Conversation Starters
                      </h4>
                      <div className="space-y-3">
                        {CONVERSATION_STARTERS.map((starter, index) => (
                          <button
                            key={index}
                            onClick={() => sendConversationStarter(starter)}
                            className="w-full text-left p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm text-white/90 border border-white/20 hover:border-white/40"
                          >
                            {starter}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="p-6 border-t border-white/20 bg-white/5 backdrop-blur-sm">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && sendMessageHandler()
                        }
                        placeholder="Type a message..."
                        className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-white/50 transition-all duration-300"
                      />
                      <button
                        onClick={sendMessageHandler}
                        disabled={!messageText.trim()}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
