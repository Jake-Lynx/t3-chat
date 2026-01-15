"use client";
import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIModels } from "../../ai-agent/hook/ai-agent";
import { ModelSelector } from "./model-selector";
import { Spinner } from "@/components/ui/spinner";
import { useCreateChat } from "../hooks/chat";
import { toast } from "sonner";

const ChatMessageForm = ({ initialMessage, onMessageChange }) => {
  const { data: models, isPending, error } = useAIModels();

  const [selectedModel, setSelectedModel] = useState(null);
  const [message, setMessage] = useState("");

  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  // Initialiser le modèle sélectionné une fois les données chargées
  useEffect(() => {
    if (models?.models?.[0]?.id && !selectedModel) {
      setSelectedModel(models.models[0].id);
    }
  }, [models, selectedModel]);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!selectedModel) {
        toast.error("Please select a model");
        return;
      }

      await mutateAsync({ content: message, model: selectedModel });
      toast.success("Message sent successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main Input Container */}
        <div className="relative rounded-2xl border border-border shadow-sm transition-all">
          {/* Textarea */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="min-h-15 max-h-50 resize-none border-0 bg-transparent px-4 py-3 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          {/* Toolbar */}
          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t">
            {/* Left side tools */}
            <div className="flex items-center gap-1">
              {isPending ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={models?.models}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                  className="ml-1"
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!message.trim() || isChatPending || !selectedModel}
              size="sm"
              variant={message.trim() ? "default" : "ghost"}
              className="h-8 w-8 p-0 rounded-full"
            >
              {isChatPending ? (
                <Spinner />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatMessageForm;
