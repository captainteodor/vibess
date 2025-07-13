import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  header: {
    textAlign: 'center',
    marginBottom: 16,
  },
  valuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  valueTag: {
    margin: 8,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#e4e9f2',
  },
  selectedValueTag: {
    backgroundColor: '#3366ff',
  },
  sliderLabel: {
    marginTop: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 8,
  },
  nextButton: {
    marginTop: 32,
  },
});
