// /components/Dashboard.tsx
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // General styling
  body: {
    color: 'white',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Modal backdrop
  },
  modalContent: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  photoCard: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  photoImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    paddingHorizontal: 10,
  },
  metricBarContainer: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    height: 10,
    overflow: 'hidden',
    marginVertical: 5,
  },
  metricBar: {
    backgroundColor: '#6200ee',
    height: '100%',
  },
  centeredTopSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  creditsDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  customButton: {
    borderRadius: 20, // Fully rounded corners
    backgroundColor: 'white', // White background
    color: 'black', // Black text color
    paddingHorizontal: 12, // Left and right padding
    height: 40, // Adjust height
    minHeight: 40,
    fontSize: 14, // Smaller font size
    borderWidth: 1, // Thin black border
    borderColor: 'black',
  },
  customButtonHover: {
    backgroundColor: '#f5f5f5', // Light gray background on hover
  },
  customButtonDisabled: {
    opacity: 0.6, // Reduced opacity when disabled
  },

  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Space between the button and the credits
  },
  newTestButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 100,
  },

  // Header for Dashboard
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  karmaDisplay: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  filterDropdown: {
    marginBottom: 20,
  },

  // Photo Card Stylin
  photoCardHover: {
    transform: [{ scale: 1.05 }], // Slightly enlarge on hover
  },


  // Main container
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },

  // Title styling
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Photo title
  photoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  // Vote text
  voteText: {
    fontSize: 14,
    color: 'white',
  },

  // Metrics View
  metricView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  metricLabel: {
    fontSize: 14,
    color: 'white',
    marginRight: 15,
    width: 100,
  },
  // Neon subtitle effect
  neonSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    opacity: 0.5,
    textShadowColor: 'rgba(0, 255, 255, 0.7)',
    textShadowRadius: 5,
    fontFamily: 'Arial',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 20,
  },

  // Photo Status Text
  photoStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
  },
  photoHeader: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },

  // Modal container
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingBottom: 20,
  },
  absolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

});
