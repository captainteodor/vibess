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
  label: {
    marginBottom: 8,
    marginTop: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  selectedTag: {
    backgroundColor: '#3366FF',
  },
  unselectedTag: {
    backgroundColor: '#E4E9F2',
  },
  selectedTagText: {
    color: '#FFF',
  },
  unselectedTagText: {
    color: '#222B45',
  },
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 16,
  },
});
