import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  goalCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGoalCard: {
    backgroundColor: '#d1e7dd',
    borderColor: '#0f5132',
    borderWidth: 2,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#212529',
  },
  goalDescription: {
    fontSize: 16,
    color: '#6c757d',
  },
  nextButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#0d6efd',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#adb5bd',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
});