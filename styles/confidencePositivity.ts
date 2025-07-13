import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',  // Soft background color
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',  // Darker text color for emphasis
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',  // Mid-tone for section labels
  },
  sliderContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: '500',
    color: '#444',  // Slightly darker text for slider value
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  traitTag: {
    padding: 10,
    margin: 5,
    borderRadius: 25,
    backgroundColor: '#ddd',  // Default background for unselected traits
    borderWidth: 1,
    borderColor: '#ccc',  // Border color for unselected traits
  },
  selectedTraitTag: {
    backgroundColor: '#007bff',  // Highlight for selected traits
    borderColor: '#0056b3',
    color: '#fff',  // Text color for selected traits
  },
  nextButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#007bff',  // Primary button color
  },
});
