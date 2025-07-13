// styles/suggestionsSelector.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  suggestionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  suggestionTag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    alignItems: 'center',
  },
  suggestionTagSelected: {
    backgroundColor: '#007bff', // Selected suggestion background color
  },
  suggestionText: {
    fontSize: 14,
    color: '#333',
  },
  suggestionTextSelected: {
    color: '#fff', // Selected suggestion text color
  },
});

export default styles;
