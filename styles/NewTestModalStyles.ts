import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Add these missing styles:
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Style for backdrop
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16, // Add some space between the input and the buttons
  },
});
