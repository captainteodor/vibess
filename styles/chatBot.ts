import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 4,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  chatWrapper: {
    flex: 1,
  },
  chatHistory: {
    flex: 1,
    marginBottom: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#e1f5fe',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  modelBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff9c4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  // New styles for error handling
  errorWrapper: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
  },
  errorText: {
    color: '#cc0000',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  mutedWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  mutedText: {
    fontSize: 14,
    color: '#888',
  },
  suggestionsContainerInline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  suggestionTag: {
    backgroundColor: '#1e90ff', // A vibrant blue color
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    shadowColor: '#000', // Adding a shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow effect
  },
  suggestionTagText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // **Add these missing styles**
  suggestionTagSelected: {
    backgroundColor: '#ff6347', // Tomato color for selected suggestion
  },
  suggestionTagTextSelected: {
    color: '#ffffff', // Keep text white for contrast
  },
  chatHistoryContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  messageContainer: {
    marginBottom: 12,
    width: '100%',
  },
  // New styles for the archetype selection preview area
  selectionPreview: {
    backgroundColor: '#f0f8ff', // Light blue background for clarity
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  previewText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedPhotosContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  photoDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});
