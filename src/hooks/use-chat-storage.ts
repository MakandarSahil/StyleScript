"use client";

import { useState, useEffect, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  image?: string;
  apiResponse?: any;
  type: "text" | "analysis" | "recommendation" | "system" | "error";
}

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
  type: "analysis" | "consultation" | "general";
  messages: Message[];
  lastUpdated: Date;
  createdAt: Date;
  metadata?: {
    skinTone?: string;
    skinUndertone?: string;
    colorSeason?: string;
    hasImageAnalysis?: boolean;
  };
  hasContent: boolean; // Track if chat has meaningful content
}

export interface SidebarState {
  selectedChatId: string | null;
  isCollapsed: boolean;
  lastActiveTimestamp: Date;
}

export interface AppState {
  chats: ChatSession[];
  sidebarState: SidebarState;
  lastSaved: Date;
}

const STORAGE_KEY = "stylescript-app-state";
const BACKUP_KEY = "stylescript-backup";
const MAX_CHATS = 50;
const MAX_STORAGE_SIZE = 10 * 1024 * 1024; // 10MB
const AUTO_SAVE_INTERVAL = 5000; // Auto-save every 5 seconds
const BACKUP_INTERVAL = 300000; // Backup every 5 minutes

export function useChatStorage() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Check if a chat has meaningful content (not just system messages)
  const hasContent = useCallback((messages: Message[]): boolean => {
    return messages.some(
      (msg) =>
        msg.role === "user" ||
        (msg.role === "assistant" && msg.type !== "system")
    );
  }, []);

  // Filter out empty chats before saving
  const getContentfulChats = useCallback(
    (allChats: ChatSession[]): ChatSession[] => {
      return allChats.filter((chat) => hasContent(chat.messages));
    },
    [hasContent]
  );

  // Save app state to localStorage
  const saveAppState = useCallback(
    async (
      chatsToSave: ChatSession[],
      selectedChatId: string | null,
      isCollapsed: boolean
    ) => {
      if (!autoSaveEnabled) return;

      setIsSaving(true);

      try {
        // Filter out empty chats
        const contentfulChats = getContentfulChats(chatsToSave);

        const appState: AppState = {
          chats: contentfulChats,
          sidebarState: {
            selectedChatId,
            isCollapsed,
            lastActiveTimestamp: new Date(),
          },
          lastSaved: new Date(),
        };

        const serializedState = JSON.stringify(appState);

        // Check storage size
        if (serializedState.length > MAX_STORAGE_SIZE) {
          setStorageWarning(
            "Storage limit approaching. Some older chats may be removed."
          );

          // Remove oldest chats if over limit
          if (serializedState.length > MAX_STORAGE_SIZE * 1.2) {
            const sortedChats = [...contentfulChats].sort(
              (a, b) => a.lastUpdated.getTime() - b.lastUpdated.getTime()
            );
            let trimmedChats = [...sortedChats];
            let serializedSize = serializedState.length;

            while (
              serializedSize > MAX_STORAGE_SIZE * 0.8 &&
              trimmedChats.length > 1
            ) {
              trimmedChats = trimmedChats.slice(1);
              const trimmedState = { ...appState, chats: trimmedChats };
              serializedSize = JSON.stringify(trimmedState).length;
            }

            appState.chats = trimmedChats;
          }
        } else {
          setStorageWarning(null);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        setLastSaved(new Date());

        // Create backup periodically
        const lastBackup = localStorage.getItem(`${BACKUP_KEY}-timestamp`);
        const now = Date.now();

        if (
          !lastBackup ||
          now - Number.parseInt(lastBackup) > BACKUP_INTERVAL
        ) {
          localStorage.setItem(BACKUP_KEY, JSON.stringify(appState));
          localStorage.setItem(`${BACKUP_KEY}-timestamp`, now.toString());
        }
      } catch (error) {
        console.error("Error saving app state:", error);
        setStorageWarning("Error saving data. Some changes may be lost.");
      } finally {
        setIsSaving(false);
      }
    },
    [autoSaveEnabled, getContentfulChats]
  );

  // Load app state from localStorage
  const loadAppState = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const savedState = localStorage.getItem(STORAGE_KEY);

      if (savedState) {
        const appState: AppState = JSON.parse(savedState);

        // Parse dates back to Date objects
        const parsedChats = appState.chats.map((chat) => ({
          ...chat,
          lastUpdated: new Date(chat.lastUpdated),
          createdAt: new Date(chat.createdAt || chat.lastUpdated),
          hasContent: hasContent(chat.messages),
          messages: chat.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));

        // Filter out any chats that don't have content
        const contentfulChats = getContentfulChats(parsedChats);

        setChats(contentfulChats);
        setCurrentChatId(appState.sidebarState.selectedChatId);
        setSidebarCollapsed(appState.sidebarState.isCollapsed || false);
        setLastSaved(new Date(appState.lastSaved));

        // Validate that the selected chat still exists
        if (
          appState.sidebarState.selectedChatId &&
          !contentfulChats.find(
            (chat) => chat.id === appState.sidebarState.selectedChatId
          )
        ) {
          setCurrentChatId(
            contentfulChats.length > 0 ? contentfulChats[0].id : null
          );
        }
      } else {
        // No saved state, start fresh
        setChats([]);
        setCurrentChatId(null);
        setSidebarCollapsed(false);
      }
    } catch (error) {
      console.error("Error loading app state:", error);

      // Try to recover from backup
      try {
        const backupState = localStorage.getItem(BACKUP_KEY);
        if (backupState) {
          const appState: AppState = JSON.parse(backupState);
          const parsedChats = appState.chats.map((chat) => ({
            ...chat,
            lastUpdated: new Date(chat.lastUpdated),
            createdAt: new Date(chat.createdAt || chat.lastUpdated),
            hasContent: hasContent(chat.messages),
            messages: chat.messages.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));

          setChats(getContentfulChats(parsedChats));
          setCurrentChatId(appState.sidebarState.selectedChatId);
          setStorageWarning("Recovered from backup due to data corruption.");
        }
      } catch (backupError) {
        console.error("Backup recovery failed:", backupError);
        setStorageWarning("Data recovery failed. Starting fresh.");
        setChats([]);
        setCurrentChatId(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [hasContent, getContentfulChats]);

  // Auto-save effect
  useEffect(() => {
    if (!isLoading && autoSaveEnabled) {
      const timeoutId = setTimeout(() => {
        saveAppState(chats, currentChatId, sidebarCollapsed);
      }, AUTO_SAVE_INTERVAL);

      return () => clearTimeout(timeoutId);
    }
  }, [
    chats,
    currentChatId,
    sidebarCollapsed,
    isLoading,
    autoSaveEnabled,
    saveAppState,
  ]);

  // Load state on mount
  useEffect(() => {
    loadAppState();
  }, [loadAppState]);

  // Save state when page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSaveEnabled) {
        // Use synchronous localStorage for beforeunload
        try {
          const contentfulChats = getContentfulChats(chats);
          const appState: AppState = {
            chats: contentfulChats,
            sidebarState: {
              selectedChatId: currentChatId,
              isCollapsed: sidebarCollapsed,
              lastActiveTimestamp: new Date(),
            },
            lastSaved: new Date(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        } catch (error) {
          console.error("Error saving on unload:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [
    chats,
    currentChatId,
    sidebarCollapsed,
    autoSaveEnabled,
    getContentfulChats,
  ]);

  const createNewChat = useCallback((): string => {
    const newChatId = `chat_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const now = new Date();

    const newChat: ChatSession = {
      id: newChatId,
      title: "New Style Consultation",
      timestamp: "Just now",
      preview: "",
      type: "general",
      messages: [
        {
          id: "welcome",
          role: "system",
          content:
            "Welcome to StyleScript! I'm your AI style consultant powered by advanced computer vision and Gemini AI. Upload a photo of yourself to get started with personalized style recommendations, or ask me any fashion-related questions!",
          timestamp: now,
          type: "system",
        },
      ],
      lastUpdated: now,
      createdAt: now,
      metadata: {},
      hasContent: false,
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChatId);
    return newChatId;
  }, []);

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChatId === chatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        setCurrentChatId(
          remainingChats.length > 0 ? remainingChats[0].id : null
        );
      }
    },
    [currentChatId, chats]
  );

  const updateChatMessages = useCallback(
    (chatId: string, messages: Message[], metadata?: any) => {
      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            const lastMessage = messages[messages.length - 1];
            const lastUserMessage = [...messages]
              .reverse()
              .find((msg) => msg.role === "user");
            const chatHasContent = hasContent(messages);

            const updatedChat = {
              ...chat,
              messages,
              lastUpdated: new Date(),
              hasContent: chatHasContent,
              preview:
                lastUserMessage?.content.slice(0, 50) +
                  (lastUserMessage?.content.length > 50 ? "..." : "") || "",
            };

            // Update title based on first user message if it's still default
            if (
              chat.title === "New Style Consultation" &&
              messages.length > 1
            ) {
              const firstUserMessage = messages.find(
                (msg) => msg.role === "user"
              );
              if (firstUserMessage) {
                updatedChat.title =
                  firstUserMessage.content.slice(0, 30) +
                  (firstUserMessage.content.length > 30 ? "..." : "");
              }
            }

            // Determine chat type based on messages
            const hasImage = messages.some((msg) => msg.image);
            const hasAnalysis = messages.some(
              (msg) => msg.type === "analysis" || msg.type === "recommendation"
            );

            if (hasImage && hasAnalysis) {
              updatedChat.type = "analysis";
            } else if (hasAnalysis) {
              updatedChat.type = "consultation";
            }

            // Update metadata if provided
            if (metadata) {
              updatedChat.metadata = {
                ...chat.metadata,
                ...metadata,
                hasImageAnalysis: hasImage && hasAnalysis,
              };
            }

            return updatedChat;
          }
          return chat;
        })
      );
    },
    [hasContent]
  );

  const getCurrentChat = useCallback((): ChatSession | null => {
    return chats.find((chat) => chat.id === currentChatId) || null;
  }, [chats, currentChatId]);

  const switchToChat = useCallback((chatId: string) => {
    setCurrentChatId(chatId);
  }, []);

  const clearAllChats = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    localStorage.removeItem(`${BACKUP_KEY}-timestamp`);
    setChats([]);
    setCurrentChatId(null);
    setLastSaved(null);
  }, []);

  const exportChats = useCallback(() => {
    try {
      const contentfulChats = getContentfulChats(chats);
      const exportData = {
        chats: contentfulChats,
        exportDate: new Date().toISOString(),
        version: "1.0",
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
      )}`;

      const exportFileDefaultName = `stylescript-chats-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      return true;
    } catch (error) {
      console.error("Error exporting chats:", error);
      return false;
    }
  }, [chats, getContentfulChats]);

  const importChats = useCallback(
    (jsonData: string): boolean => {
      try {
        const importedData = JSON.parse(jsonData);
        let importedChats = [];

        // Handle different import formats
        if (importedData.chats && Array.isArray(importedData.chats)) {
          importedChats = importedData.chats;
        } else if (Array.isArray(importedData)) {
          importedChats = importedData;
        } else {
          throw new Error("Invalid chat data format");
        }

        const processedChats = importedChats.map((chat: any) => ({
          ...chat,
          lastUpdated: new Date(chat.lastUpdated),
          createdAt: new Date(chat.createdAt || chat.lastUpdated),
          hasContent: hasContent(chat.messages || []),
          messages: (chat.messages || []).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));

        // Only import chats with content
        const contentfulImportedChats = getContentfulChats(processedChats);

        setChats((prev) => [...contentfulImportedChats, ...prev]);
        return true;
      } catch (error) {
        console.error("Error importing chats:", error);
        return false;
      }
    },
    [hasContent, getContentfulChats]
  );

  const toggleAutoSave = useCallback(() => {
    setAutoSaveEnabled((prev) => !prev);
  }, []);

  const manualSave = useCallback(() => {
    saveAppState(chats, currentChatId, sidebarCollapsed);
  }, [saveAppState, chats, currentChatId, sidebarCollapsed]);

  return {
    chats: getContentfulChats(chats), // Always return only chats with content
    currentChatId,
    currentChat: getCurrentChat(),
    sidebarCollapsed,
    setSidebarCollapsed,
    createNewChat,
    deleteChat,
    updateChatMessages,
    switchToChat,
    clearAllChats,
    exportChats,
    importChats,
    storageWarning,
    isLoading,
    isSaving,
    lastSaved,
    autoSaveEnabled,
    toggleAutoSave,
    manualSave,
  };
}
