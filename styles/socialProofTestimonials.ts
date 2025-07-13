import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionLabel: {
    marginVertical: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 16,
    minHeight: 100,
  },
  nextButton: {
    marginTop: 30,
  },
});
