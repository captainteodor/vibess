// styles/appearancePhysical.ts
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
  sectionLabel: {
    marginTop: 24,
    marginBottom: 8,
  },
  selectInput: {
    marginBottom: 16,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  activityTag: {
    margin: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    backgroundColor: '#e4e9f2',
  },
  selectedActivityTag: {
    backgroundColor: '#3366ff',
  },
  nextButton: {
    marginTop: 24,
  },
});
