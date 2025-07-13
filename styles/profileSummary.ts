// /styles/profileSummary.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  profileCard: {
    marginBottom: 20,
  },
  cardContent: {
    padding: 16,
  },
  collageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  collageImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  archetypeCard: {
    marginBottom: 16,
    padding: 16,
  },
  goalCard: {
    marginBottom: 16,
    padding: 16,
  },
  newProfileButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '80%',
  },
});
