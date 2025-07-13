import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  archetypeListContainer: {
    flexDirection: 'column',
    padding: 10,
  },
  archetypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedArchetypeCard: {
    backgroundColor: '#d0e8ff',
    borderColor: '#1e90ff',
  },
  archetypeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  archetypeContent: {
    flex: 1,
    flexDirection: 'column',
  },
  archetypeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  archetypeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  infoButton: {
    marginLeft: 'auto',
    backgroundColor: '#ccc',
    borderRadius: 15,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    fontSize: 12,
    color: '#fff',
  },
});
