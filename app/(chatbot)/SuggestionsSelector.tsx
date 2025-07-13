import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/suggestionsSelector';

export type Suggestion = {
  name: string;
  description?: string;
};

type SuggestionsSelectorProps = {
  suggestions: Suggestion[];
  selectedSuggestions: string[];
  setSelectedSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
};

const SuggestionsSelector: React.FC<SuggestionsSelectorProps> = ({
  suggestions,
  selectedSuggestions,
  setSelectedSuggestions,
  input,
  setInput,
}) => {
  const handleSelect = (suggestionName: string) => {
    setSelectedSuggestions((prevSelected) => {
      const updatedSelection = prevSelected.includes(suggestionName)
        ? prevSelected.filter((name) => name !== suggestionName)
        : [...prevSelected, suggestionName];

      setInput(updatedSelection.join(', '));
      return updatedSelection;
    });
  };

  return (
    <View style={styles.suggestionsList}> {/* Updated to match the correct style key */}
      {suggestions.map((suggestion) => (
        <TouchableOpacity
          key={suggestion.name}
          style={[
            styles.suggestionTag,
            selectedSuggestions.includes(suggestion.name) && styles.suggestionTagSelected,
          ]}
          onPress={() => handleSelect(suggestion.name)}
        >
          <Text
            style={[
              styles.suggestionText,
              selectedSuggestions.includes(suggestion.name) && styles.suggestionTextSelected,
            ]}
          >
            {suggestion.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SuggestionsSelector;
