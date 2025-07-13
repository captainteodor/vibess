import React, { useState } from "react";
import { View, TextInput, ScrollView, Button, Text, StyleSheet } from "react-native";

// Define the message type
type Message = {
  type: "user" | "bot";
  text: string;
};

export default function Chat() {
  const [input, setInput] = useState<string>(""); // Input as a string
  const [messages, setMessages] = useState<Message[]>([]); // Messages state as an array of Message type

  const sendMessage = () => {
    if (!input.trim()) return;

    // User sends a message
    setMessages((prev) => [...prev, { type: "user", text: input }]);

    // Simulate chatbot response for now
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text: "Chatbot response goes here." }]);
    }, 1000);

    setInput(""); // Clear the input field after sending
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chat}>
        {messages.map((message, index) => (
          <Text
            key={index}
            style={message.type === "user" ? styles.userMessage : styles.botMessage}
          >
            {message.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Type your message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  chat: { flex: 1, marginBottom: 20 },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#ccf", padding: 10, borderRadius: 5 },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#f5f5f5", padding: 10, borderRadius: 5 },
  input: { borderColor: "#ccc", borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
});
