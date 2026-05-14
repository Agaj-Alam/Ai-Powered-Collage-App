import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { sendMessageToAI } from "@/src/services/chatApi";
import imagePath from "@/src/constraints/imagePath";

const ChatModal = ({ visible, onClose }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageToAI(input);

      const aiMessage = {
        id: Date.now() + 1,
        text: response.reply,
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 2,
        text: "Something went wrong.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/40">
        <View className="h-[80%] bg-white rounded-t-3xl p-4">

          {/* Header */}
          <View className="flex-row items-center mb-4">
            <Image
              source={imagePath.chatbot_image}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View>
              <Text className="text-lg font-bold">Subharti AI</Text>
              <Text className="text-xs text-green-500">Online</Text>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            renderItem={({ item }) => (
              <View
                className={`flex-row mb-3 ${
                  item.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {item.sender === "ai" && (
                  <Image
                    source={imagePath.chatbot_image}
                    className="w-8 h-8 rounded-full mr-2 mt-1"
                  />
                )}

                <View
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    item.sender === "user"
                      ? "bg-blue-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={
                      item.sender === "user"
                        ? "text-white"
                        : "text-black"
                    }
                  >
                    {item.text}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Loading / Typing Indicator */}
          {isLoading && (
            <View className="flex-row items-center mb-3">
              <Image
                source={imagePath.chatbot_image}
                className="w-8 h-8 rounded-full mr-2"
              />
              <View className="bg-gray-100 px-4 py-2 rounded-2xl">
                <ActivityIndicator size="small" color="#6B7280" />
              </View>
            </View>
          )}

          {/* Input */}
          <View className="flex-row items-center border-t border-gray-200 pt-3">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask something..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-3"
            />

            <TouchableOpacity
              onPress={handleSend}
              className="ml-3 bg-blue-500 px-4 py-3 rounded-full"
            >
              <Text className="text-white font-semibold">
                Send
              </Text>
            </TouchableOpacity>
          </View>

          {/* Close */}
          <TouchableOpacity onPress={onClose}>
            <Text className="text-center text-gray-400 mt-3">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChatModal;
