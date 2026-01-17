"use client";
import React, { useEffect } from "react";
import { useChatStore } from "../../chat/store/chat-store";
import { useGetChatById } from "../../chat/hooks/chat";

const ActiveChatLoader = ({ chatId }) => {
  const { setActiveChatId, setMessages, addChat, chats } = useChatStore();

  const { data } = useGetChatById(chatId);

  useEffect(() => {
    if (!chatId) return;

    setActiveChatId(chatId);
  }, [chatId, setActiveChatId]);

  useEffect(() => {
    if (!data || !data.success || !data.data) return;

    const chat = data.data;

    setMessages(chat.messages || []);

    if (!chats?.some((c) => c.id === chat.id)) {
      addChat(chat);
    }
  }, [data, setMessages, addChat, chats]);

  return null;
};

export default ActiveChatLoader;
