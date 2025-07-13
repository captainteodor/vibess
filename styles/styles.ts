// styles.ts
import { StyleSheet, Dimensions, Platform } from 'react-native';
import { THEME } from '~/theme';

const { width, height } = Dimensions.get('window');

// Type guard for fonts
const getFontFamily = (font: string | undefined) => {
  return font || (Platform.OS === 'ios' ? 'System' : 'Roboto');
};

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: THEME.colors.light.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.light.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xl,
    backgroundColor: THEME.colors.light.background,
  },

  // Loading and empty state text
  loadingText: {
    marginTop: THEME.spacing.md,
    fontSize: THEME.typography.sizes.md,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    color: THEME.colors.light.grey2,
  },
  emptyText: {
    fontSize: THEME.typography.sizes.md,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    color: THEME.colors.light.grey2,
    textAlign: 'center',
  },

  // Photo container and image
  photoContainer: {
    width: width,
    height: width,
    backgroundColor: THEME.colors.light.grey6,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.light.grey5,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  buttonGroup: {
    width: '100%',
    marginTop: 4,
  },

  // Voting section
  voteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  columnSeparator: {
    width: 8,
  },
  traitColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  traitLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
    color: THEME.colors.light.grey2,
  },

  // Vote buttons
  voteButton: {
    width: '100%',
    height: 44,
    marginVertical: 4,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0, // Remove rounded corners
  },
  selectedButton: {
    backgroundColor: THEME.colors.light.brand.primary,
  },
 
  buttonText: {
    fontSize: 16,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    color: THEME.colors.light.grey2,
    flex: 1,
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Submit button
  floatingSubmitButton: {
    position: 'absolute',
    bottom: THEME.spacing.xl,
    left: THEME.spacing.xl,
    right: THEME.spacing.xl,
    backgroundColor: THEME.colors.light.brand.primary,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.full,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: THEME.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitButtonText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.lg,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    fontWeight: THEME.typography.weights.semibold,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: THEME.colors.light.card,
    borderRadius: THEME.borderRadius.xl,
    padding: THEME.spacing.xl,
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes['2xl'],
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    fontWeight: THEME.typography.weights.bold,
    marginBottom: THEME.spacing.lg,
    textAlign: 'center',
    color: THEME.colors.light.grey2,
  },

  // Tags section
  tagScrollContainer: {
    maxHeight: height * 0.5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: THEME.spacing.xs,
  },
  tagButton: {
    backgroundColor: THEME.colors.light.grey6,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.full,
    margin: THEME.spacing.xs,
    borderWidth: 1,
    borderColor: THEME.colors.light.grey5,
  },
  selectedTagButton: {
    backgroundColor: THEME.colors.light.brand.primary,
    borderColor: THEME.colors.light.brand.primaryDark,
  },
  tagText: {
    fontSize: THEME.typography.sizes.sm,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    color: THEME.colors.light.grey2,
  },
  selectedTagText: {
    color: THEME.colors.white,
    fontWeight: THEME.typography.weights.semibold,
  },

  // Submit feedback button
  submitFeedbackButton: {
    backgroundColor: THEME.colors.light.brand.primary,
    padding: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.full,
    marginTop: THEME.spacing.lg,
    alignItems: 'center',
  },
  submitFeedbackText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.sizes.lg,
    fontFamily: getFontFamily(THEME.typography.fonts?.primary),
    fontWeight: THEME.typography.weights.semibold,
  },

  // Psychological feedback indicators
  confidenceIndicator: {
    backgroundColor: THEME.colors.light.psychology.confidence,
  },
  authenticityIndicator: {
    backgroundColor: THEME.colors.light.psychology.authenticity,
  },
  growthIndicator: {
    backgroundColor: THEME.colors.light.psychology.growth,
  },
  // Add to your styles
  voteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    width: '100%',
  },
  dotIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
});

export default styles;