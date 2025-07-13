import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  profileCard: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 3,
  },
  cardContent: {
    padding: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  metricBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 5,
  },
  metricBar: {
    height: 10,
    backgroundColor: '#6200ea',
    borderRadius: 5,
  },
  newProfileButton: {
    marginVertical: 20,
    backgroundColor: '#6200ea',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  photosContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  collageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  collageImage: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 5,
  },
});
