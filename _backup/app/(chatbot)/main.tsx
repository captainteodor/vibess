import React, { useState, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { chatbotMachine } from '../../lib/services/chatbotMachine';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { fetchAnswerFromAPI, resetFlowState, storeFlowState } from '../../lib/services/chatbotService';
import { styles } from '../../styles/chatBot';
import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';
import SuggestionSelector, { Suggestion } from './SuggestionsSelector';
import ProfilePhotoSelectionModal from './ProfilePhotoSelectionModal'; // New component for photo selection

type ApiResponse = {
  response: string;
  suggestions: string[];
  flowState?: string;
};

type ChatHistoryEntry = {
  role: 'user' | 'model';
  text: string;
  suggestions?: Suggestion[];
  photos?: { id: string; description: string }[];
};

const ChatbotScreen: React.FC = () => {
  const [state, send] = useMachine(chatbotMachine);
  const [conversationId, setConversationId] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [availableSuggestions, setAvailableSuggestions] = useState<Suggestion[]>([]);
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState<boolean>(false);
  const [selectedPhotos, setSelectedPhotos] = useState<{ id: string; description: string }[]>([]);

  useEffect(() => {
    clearConversationData().then(() => initializeConversation());
  }, []);

  const clearConversationData = async () => {
    await SecureStore.deleteItemAsync('conversationId');
    await SecureStore.deleteItemAsync('flowState');
    setChatHistory([]);
    setAvailableSuggestions([]);
    setSelectedSuggestions([]);
    setInput('');
    setSelectedPhotos([]);
  };

  const initializeConversation = async () => {
    if (isInitializing) return;
    setIsInitializing(true);

    const existingConversationId = await SecureStore.getItemAsync('conversationId');
    const existingFlowState = await SecureStore.getItemAsync('flowState');

    if (!existingConversationId || !existingFlowState) {
      const newConversationId = uuid.v4() as string;
      await SecureStore.setItemAsync('conversationId', newConversationId);
      setConversationId(newConversationId);
      await resetFlowState(newConversationId);
      await triggerWelcomePrompt(newConversationId);
    } else {
      setConversationId(existingConversationId);
      if (existingFlowState === 'awaiting_welcome') {
        await triggerWelcomePrompt(existingConversationId);
      }
    }
    setIsInitializing(false);
  };

  const triggerWelcomePrompt = async (currentConversationId: string) => {
    try {
      const response = await fetchAnswerFromAPI(currentConversationId, '', 'awaiting_welcome');

      const formattedSuggestions: Suggestion[] = response.suggestions.map((s) => ({ name: s }));

      updateChatHistory({
        role: 'model',
        text: response.response,
        suggestions: formattedSuggestions,
      });
      send({ type: 'NEXT' });
      setAvailableSuggestions(formattedSuggestions);
      if (response.flowState) {
        await storeFlowState(response.flowState);
      }
    } catch (err) {
      send({ type: 'ERROR', error: 'Failed to load welcome prompt' });
    }
  };

  const handleSendMessage = async () => {
    let messageContent = input.trim();

    if (selectedSuggestions.length > 0) {
      messageContent = selectedSuggestions.join(', ');
      setSelectedSuggestions([]);
      setInput('');
    }

    if (!messageContent) return;

    updateChatHistory({ role: 'user', text: messageContent });
    setInput('');

    try {
      const response = (await fetchAnswerFromAPI(conversationId, messageContent, state.value as string)) as ApiResponse;
      await processResponse(response);
    } catch (err) {
      send({ type: 'ERROR', error: 'Failed to send message' });
    }
  };

  const toggleSuggestionSelection = (suggestionName: string) => {
    setSelectedSuggestions((prevSelected) => {
      const updatedSelection = prevSelected.includes(suggestionName)
        ? prevSelected.filter((name) => name !== suggestionName)
        : [...prevSelected, suggestionName];
      
      setInput(updatedSelection.join(', ')); // Update the input display
      return updatedSelection;
    });
  };
  

  const handleOpenPhotoModal = () => {
    setIsPhotoModalVisible(true);
  };

  const handlePhotoSubmit = (photos: { id: string; description: string }[]) => {
    setSelectedPhotos(photos);
    setIsPhotoModalVisible(false);

    updateChatHistory({
      role: 'user',
      text: 'Selected profile photos',
      photos: photos,
    });

    send({ type: 'NEXT' });
  };

  const processResponse = async (response: ApiResponse) => {
    if (response && response.response) {
      const formattedSuggestions: Suggestion[] = response.suggestions.map((s) => ({ name: s }));
  
      const chatEntry: ChatHistoryEntry = {
        role: 'model',
        text: response.response,
        suggestions: formattedSuggestions,
      };
      updateChatHistory(chatEntry);
      setAvailableSuggestions(formattedSuggestions);
  
      if (response.flowState) {
        await storeFlowState(response.flowState);
      }
  
      if (response.flowState === 'awaiting_photos') {
        // Enter photo selection mode directly after archetypes are completed
        send({ type: 'NEXT' }); // Move the state machine to handle photo selection
      } else if (response.flowState === 'error') {
        send({ type: 'ERROR', error: 'Unexpected error in profile setup flow.' });
      } else {
        send({ type: 'NEXT' });
      }
    } else {
      send({ type: 'ERROR', error: 'Invalid response format from API' });
    }
  };
  
  
  

  const updateChatHistory = (entry: ChatHistoryEntry) => {
    setChatHistory((prev) => [...prev, entry]);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.chatWrapper}>

        <ScrollView style={styles.chatHistory}>
          {chatHistory.map((entry, index) => (
            <View key={index}>
              <View style={entry.role === 'user' ? styles.userBubble : styles.modelBubble}>
                <Text style={styles.text}>{entry.text}</Text>
              </View>
              {entry.suggestions && entry.suggestions.length > 0 && (
                <View style={styles.suggestionsContainerInline}>
                  {entry.suggestions.map((suggestion, i) => (
                    <TouchableOpacity
                    key={i}
                    style={[
                      styles.suggestionTag,
                      selectedSuggestions.includes(suggestion.name) && styles.suggestionTagSelected,
                    ]}
                    onPress={() => toggleSuggestionSelection(suggestion.name)} // Corrected usage here
                  >
                    <Text
                      style={[
                        styles.suggestionTagText,
                        selectedSuggestions.includes(suggestion.name) && styles.suggestionTagTextSelected,
                      ]}
                    >
                      {suggestion.name}
                    </Text>
                  </TouchableOpacity>
                  
                  ))}
                </View>
              )}
              {entry.photos && entry.photos.length > 0 && (
                <View style={styles.selectedPhotosContainer}>
                  {entry.photos.map((photo) => (
                    <Text key={photo.id} style={styles.photoDescription}>
                      {photo.description}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>

        {state.matches('awaiting_photos') && (
          <Button title="Select Profile Pictures" onPress={handleOpenPhotoModal} />
        )}

        <Modal visible={isPhotoModalVisible} animationType="slide">
          <ProfilePhotoSelectionModal
            onClose={() => setIsPhotoModalVisible(false)}
            onSubmit={handlePhotoSubmit}
          />
        </Modal>

        {state.context.error && (
          <View style={styles.errorWrapper}>
            <Text style={styles.errorText}>{state.context.error}</Text>
            <Button title="Retry" onPress={() => send({ type: 'RETRY' })} />
          </View>
        )}

        <Button title="Reset Conversation" onPress={clearConversationData} />

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message or select suggestions..."
            multiline
            editable={!state.matches('sending_message')}
          />
          {state.matches('sending_message') ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Button title="Send" onPress={handleSendMessage} />
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatbotScreen;
