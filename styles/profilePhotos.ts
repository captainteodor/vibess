import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8, // Reduced padding
    backgroundColor: '#f7f9fc',
  },
  header: {
    textAlign: 'center',
    marginBottom: 8, // Reduced margin
    fontSize: 20, // Smaller font size
    fontWeight: 'bold',
    color: '#222b45',
  },
  photoList: {
    paddingBottom: 8, // Reduced padding
  },
  photoCard: {
    flex: 1,
    marginVertical: 8, // Reduced margin
    padding: 8, // Reduced padding
    borderRadius: 8,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedPhoto: {
    borderColor: '#3366ff',
    borderWidth: 2,
  },
  photo: {
    width: '100%',
    height: 150, // Reduced height
    borderRadius: 8,
    marginBottom: 8, // Reduced margin
  },
  photoLabel: {
    textAlign: 'center',
    fontSize: 14, // Smaller font size
    color: '#3366ff',
    marginBottom: 4, // Reduced margin
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
    paddingTop: 4, // Reduced padding
  },
  metricBarContainer: {
    height: 4, // Reduced height
    backgroundColor: '#e4e9f2',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 8, // Reduced margin
    flex: 1,
  },
  metricBar: {
    height: 4, // Reduced height
  },
  traitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Reduced margin
  },
  traitLabel: {
    width: '40%',
    fontSize: 10, // Smaller font size
    color: '#222b45',
  },
  traitValue: {
    marginLeft: 4, // Reduced margin
    fontSize: 10, // Smaller font size
    color: '#8f9bb3',
  },
  nextButton: {
    marginTop: 8, // Reduced margin
    backgroundColor: '#3366ff',
    borderRadius: 8,
    paddingVertical: 8, // Reduced padding
    alignItems: 'center',
  },
  guidelineContainer: {
    backgroundColor: '#eef1f7',
    padding: 8, // Reduced padding
    borderRadius: 8,
    marginBottom: 8, // Reduced margin
  },
  guidelineHeader: {
    fontSize: 16, // Smaller font size
    fontWeight: 'bold',
    marginBottom: 4, // Reduced margin
    color: '#222b45',
  },
  guidelineTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4, // Reduced margin
  },
  guidelineTag: {
    backgroundColor: '#E4E9F2',
    borderRadius: 16,
    paddingVertical: 4, // Reduced padding
    paddingHorizontal: 8, // Reduced padding
    margin: 2, // Reduced margin
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidelineTagText: {
    color: '#3366FF',
    fontWeight: 'bold',
    fontSize: 10, // Smaller font size
  },
  guidelineIcon: {
    width: 12, // Reduced size
    height: 12, // Reduced size
    marginLeft: 4, // Reduced margin
  },
  expandedGuidelineContainer: {
    marginTop: 8, // Reduced margin
    padding: 8, // Reduced padding
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderColor: '#3366FF',
    borderWidth: 1,
  },
  expandedGuidelineText: {
    fontSize: 10, // Smaller font size
    color: '#3366FF',
  },
});
