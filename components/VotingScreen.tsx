// 1. Imports
import React, { useCallback, useEffect, useReducer, memo, useState, useMemo, useRef } from 'react';
import {
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Modal as RNModal,
} from 'react-native';
import LinearGradient from 'expo-linear-gradient';
import { 
  doc, 
  getDoc, 
  runTransaction, 
  collection, 
  getDocs, 
  DocumentSnapshot,
  writeBatch 
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

// Local imports
import { PhotoService } from '~/lib/services/PhotoService';
import { PhotoModel } from '~/lib/models/PhotoModel';
import { useAuth } from '~/lib/auth/authContext';
import { getFirebaseFirestore, initializeFirebaseAnalytics } from '~/config/firebase';
import { logAnalyticsEvent } from '../lib/analytics/analytics';
import { 
  TRAITS, 
  RATINGS, 
  VOTING_CONSTANTS, 
  PHOTO_CONSTANTS,
  feedbackTags, 
  Trait
} from '~/constants/votingConstants';
import { VotingCriteria } from '~/types/index';

// 2. Types & Interfaces
export type VoteValue = 1 | 2 | 3 | 4;
export type LoadingState = 'idle' | 'loading' | 'error' | 'success';

interface ImageWithLoaderProps {
  uri: string;
}

interface PhotoCardProps {
  uri: string;
}

interface TraitIconProps {
    trait: Trait; // Use the Trait type from votingConstants.ts
  }
  
  

interface TraitColumnProps {
    criteria: VotingCriteria;
    currentVotes: number;
    handleVoteSelection: (criteria: VotingCriteria, value: VoteValue) => void;
    disabled?: boolean;
    traitLabel: string;
}interface PhotoError extends Error {
  code?: string;
  details?: string;
}

interface VotingState {
  photos: PhotoModel[];
  loadingState: LoadingState;
  currentIndex: number;
  buttonVisible: boolean;
  feedbackModalVisible: boolean;
  selectedTags: string[];
  currentVotes: Record<VotingCriteria, VoteValue | 0>;
  lastVisible: DocumentSnapshot | null;
  refreshing: boolean;
  isSubmitting: boolean;
}

interface FeedbackModalProps {
  visible: boolean;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// 3. Action Types
type VotingAction =
  | { type: 'SET_PHOTOS'; payload: PhotoModel[] }
  | { type: 'SET_LOADING_STATE'; payload: LoadingState }
  | { type: 'SET_CURRENT_INDEX'; payload: number }
  | { type: 'SET_VOTE'; payload: { criteria: VotingCriteria; value: VoteValue } }
  | { type: 'RESET_VOTES' }
  | { type: 'TOGGLE_FEEDBACK_MODAL' }
  | { type: 'SET_SELECTED_TAGS'; payload: string[] }
  | { type: 'SET_LAST_VISIBLE'; payload: DocumentSnapshot | null }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean };

// 4. Constants
const initialState: VotingState = {
  photos: [],
  loadingState: 'idle',
  currentIndex: 0,
  buttonVisible: false,
  feedbackModalVisible: false,
  selectedTags: [],
  currentVotes: {
    [VotingCriteria.CONFIDENT]: 0,
    [VotingCriteria.NICE_PERSONALITY]: 0,
    [VotingCriteria.ATTRACTIVE]: 0,
  },
  lastVisible: null,
  refreshing: false,
  isSubmitting: false,
};

// 5. Analytics Setup
let analytics: any = null;
initializeFirebaseAnalytics().then(instance => analytics = instance);

// 6. Analytics Helper
const trackVoting = (photoId: string, votes: Record<VotingCriteria, VoteValue | 0>) => {
    logAnalyticsEvent('photo_vote', {
      photoId,
      votes,
      timestamp: Date.now(),
    });
  };
  
  // 7. Reducer
  const votingReducer = (state: VotingState, action: VotingAction): VotingState => {
    switch (action.type) {
      case 'SET_PHOTOS':
        return { ...state, photos: action.payload };
      
      case 'SET_LOADING_STATE':
        return { ...state, loadingState: action.payload };
      
      case 'SET_CURRENT_INDEX':
        return { ...state, currentIndex: action.payload };
      
      case 'SET_VOTE':
        const newVotes = {
          ...state.currentVotes,
          [action.payload.criteria]: action.payload.value,
        };
        const allVotesCast = Object.values(newVotes).every(
          (vote) => vote >= VOTING_CONSTANTS.MIN_VOTE_VALUE
        );
        return {
          ...state,
          currentVotes: newVotes,
          buttonVisible: allVotesCast,
        };
      
      case 'RESET_VOTES':
        return {
          ...state,
          currentVotes: initialState.currentVotes,
          buttonVisible: false,
          selectedTags: [],
          feedbackModalVisible: false,
        };
      
      case 'TOGGLE_FEEDBACK_MODAL':
        return { ...state, feedbackModalVisible: !state.feedbackModalVisible };
      
      case 'SET_SELECTED_TAGS':
        return { ...state, selectedTags: action.payload };
      
      case 'SET_LAST_VISIBLE':
        return { ...state, lastVisible: action.payload };
      
      case 'SET_REFRESHING':
        return { ...state, refreshing: action.payload };
      
      case 'SET_SUBMITTING':
        return { ...state, isSubmitting: action.payload };
      
      default:
        return state;
    }
  };
  
  // 8. Custom Hooks
  const usePhotoPreloader = () => {
    const preloadPhotos = useCallback(async (photos: PhotoModel[]) => {
      const preloadPromises = photos.map(photo => 
        Image.prefetch(photo.imageURL)
          .then(() => console.log(`Preloaded: ${photo.id}`))
          .catch(error => console.error(`Failed to preload ${photo.id}:`, error))
      );
      
      try {
        await Promise.all(preloadPromises);
      } catch (error) {
        console.error('Error preloading photos:', error);
      }
    }, []);
  
    return { preloadPhotos };
  };
  
  const usePhotoVoting = () => {
    const [state, dispatch] = useReducer(votingReducer, initialState);
    const { user } = useAuth();
    const firestore = getFirebaseFirestore();
    const { preloadPhotos } = usePhotoPreloader();
    const photoCache = useRef<Map<string, PhotoModel>>(new Map());
  
    // Effect to load more photos when approaching the end
    useEffect(() => {
      if (state.photos.length - state.currentIndex <= PHOTO_CONSTANTS.PREFETCH_THRESHOLD) {
        loadPhotos(false);
      }
    }, [state.currentIndex]);
  
    // Cleanup effect
    useEffect(() => {
      return () => {
        photoCache.current.clear();
      };
    }, []);
  
    // Helper function to fetch user votes
    const fetchUserVotes = async (email: string): Promise<string[]> => {
      if (!email) return [];
      try {
        const votesCollection = collection(firestore, `users/${email}/votes`);
        const votesSnapshot = await getDocs(votesCollection);
        return votesSnapshot.docs.map((doc) => doc.data().photoId as string);
      } catch (error) {
        console.error('Error fetching user votes:', error);
        return [];
      }
    };
  
    // Main photo loading function
    const loadPhotos = useCallback(async (reset: boolean = false) => {
      if (state.loadingState === 'loading') return;
  
      try {
        dispatch({ type: 'SET_LOADING_STATE', payload: 'loading' });
        const photoService = new PhotoService(firestore);
  
        const votedPhotoIds = await fetchUserVotes(user?.email || '');
        let { photos: fetchedPhotos, lastVisible: newLastVisible } = 
          await photoService.getActivePhotos(
            reset ? null : state.lastVisible,
            PHOTO_CONSTANTS.BATCH_SIZE
          );
  
        const filteredPhotos = fetchedPhotos.filter(
          (photo: PhotoModel) => !votedPhotoIds.includes(photo.id) && !photoCache.current.has(photo.id)
        );
  
        if (filteredPhotos.length > 0) {
          // Cache management
          filteredPhotos.forEach(photo => {
            photoCache.current.set(photo.id, photo);
          });
  
          // Maintain cache size
          if (photoCache.current.size > PHOTO_CONSTANTS.CACHE_SIZE) {
            const entriesToDelete = [...photoCache.current.entries()]
              .slice(0, photoCache.current.size - PHOTO_CONSTANTS.CACHE_SIZE);
            entriesToDelete.forEach(([key]) => photoCache.current.delete(key));
          }

          // Preload images
        await Promise.all(
            filteredPhotos.map(photo => Image.prefetch(photo.imageURL))
          );
  
          dispatch({ 
            type: 'SET_PHOTOS', 
            payload: reset ? filteredPhotos : [...state.photos, ...filteredPhotos] 
          });
          dispatch({ type: 'SET_LAST_VISIBLE', payload: newLastVisible });
          
          if (reset) {
            dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 });
          }
  
          return filteredPhotos;
        } else if (state.photos.length === 0) {
          Alert.alert('No More Photos', 'No more active photos available for voting.');
        }
        
        dispatch({ type: 'SET_LOADING_STATE', payload: 'success' });
        return [];
      } catch (error) {
        console.error('Error loading photos:', error);
        dispatch({ type: 'SET_LOADING_STATE', payload: 'error' });
        return [];
      } finally {
        dispatch({ type: 'SET_REFRESHING', payload: false });
      }
    }, [user?.email, state.lastVisible, state.photos, state.loadingState]);
  
    // Vote selection handler
    const handleVoteSelection = useCallback((criteria: VotingCriteria, value: VoteValue) => {
      if (state.isSubmitting) return;
      
      dispatch({
        type: 'SET_VOTE',
        payload: { criteria, value },
      });
    }, [state.isSubmitting]);
  
    // Submit vote handler
    const handleSubmitVote = useCallback(async () => {
      if (state.isSubmitting || !state.buttonVisible) return;
    
      try {
        dispatch({ type: 'SET_SUBMITTING', payload: true });
        
        const currentPhoto = state.photos[state.currentIndex];
        if (!currentPhoto?.id) {
          throw new Error('Invalid photo data');
        }
    
        trackVoting(currentPhoto.id, state.currentVotes);
        dispatch({ type: 'TOGGLE_FEEDBACK_MODAL' });
      } catch (error) {
        console.error('Error submitting vote:', error);
        Alert.alert('Error', 'Failed to submit vote. Please try again.');
      } finally {
        dispatch({ type: 'SET_SUBMITTING', payload: false });
      }
    }, [
      state.buttonVisible,
      state.isSubmitting,
      state.photos,
      state.currentIndex,
      state.currentVotes
    ]);
  
    // Tag selection handler
    const handleTagSelection = useCallback((tag: string) => {
      if (state.isSubmitting) return;
  
      dispatch({
        type: 'SET_SELECTED_TAGS',
        payload: state.selectedTags.includes(tag)
          ? state.selectedTags.filter((t) => t !== tag)
          : [...state.selectedTags, tag],
      });
    }, [state.selectedTags, state.isSubmitting]);
  
    // Firebase vote submission
    const submitVoteToFirestore = async (photoId: string) => {
      try {
        const voterEmail = user?.email;
        if (!voterEmail) throw new Error('User not authenticated');
    
        const batch = writeBatch(firestore);
        const photoRef = doc(firestore, 'photos', photoId);
        const voterRef = doc(firestore, 'users', voterEmail);
        const voteRef = doc(collection(firestore, `users/${voterEmail}/votes`));
    
        // Get all required data in parallel
        const [photoDoc, voterDoc] = await Promise.all([
          getDoc(photoRef),
          getDoc(voterRef),
        ]);
    
        if (!photoDoc.exists()) {
          throw new Error('Photo does not exist');
        }
    
        const photoData = photoDoc.data();
        const photoOwnerEmail = photoData?.userEmail;
    
        if (!photoOwnerEmail) {
          throw new Error('Photo owner email is missing');
        }
    
        // Update all documents in a single batch
        batch.update(voterRef, {
          credits: (voterDoc.data()?.credits || 0) + VOTING_CONSTANTS.CREDIT_INCREMENT
        });
    
        batch.update(photoRef, {
          totalVotes: photoData.totalVotes + 1,
        });
    
        batch.set(voteRef, {
          photoId,
          votes: state.currentVotes,
          feedback: state.selectedTags,
          timestamp: new Date(),
        });
    
        await batch.commit();
        return true;
      } catch (error) {
        console.error('Error in submitVoteToFirestore:', error);
        throw error;
      }
    };
  
    // Feedback submission handler
    const handleSubmitFeedback = async () => {
      try {
        dispatch({ type: 'SET_SUBMITTING', payload: true });
        const currentPhoto = state.photos[state.currentIndex];
        
        await submitVoteToFirestore(currentPhoto.id);
        photoCache.current.delete(currentPhoto.id);

        dispatch({ type: 'RESET_VOTES' });
      
      if (state.currentIndex < state.photos.length - 1) {
        dispatch({ type: 'SET_CURRENT_INDEX', payload: state.currentIndex + 1 });
      } else {
        const newPhotos = await loadPhotos();
        if (!newPhotos || newPhotos.length === 0) {
          dispatch({ type: 'SET_CURRENT_INDEX', payload: 0 });
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  return {
    state,
    loadPhotos,
    handleVoteSelection,
    handleSubmitVote,
    handleTagSelection,
    handleSubmitFeedback,
  };
};

// 9. Component Definitions
const ImageWithLoaderComponent: React.FC<ImageWithLoaderProps> = ({ uri }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const loadImage = async () => {
            if (!uri) return;

            try {
                await Image.prefetch(uri);
                if (isMounted.current) {
                    setLoading(false);
                }
            } catch (err) {
               
        console.error('Image load error:', err);
        if (isMounted.current) {
          setError(true);
          setLoading(false);
        }
      }
    };

   

    loadImage();
  }, [uri]);

 const ImageWithLoader = memo(ImageWithLoaderComponent)
ImageWithLoader.displayName = 'ImageWithLoader'

  return (
    <View className="relative w-full h-full">
      {loading && (
        <View className="absolute inset-0 flex items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      )}
      <Image
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
        onLoadStart={() => setLoading(true)}
        onLoad={() => isMounted.current && setLoading(false)}
        onError={() => {
          if (isMounted.current) {
            setError(true);
            setLoading(false);
          }
        }}
        accessible={true}
        accessibilityLabel="Photo to be rated"
      />
      {error && (
        <View className="absolute inset-0 bg-gray-200 items-center justify-center">
          <Text className="text-gray-600">Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const ImageWithLoader = memo(ImageWithLoaderComponent);
ImageWithLoader.displayName = 'ImageWithLoader';

const PhotoCardComponent: React.FC<PhotoCardProps> = ({ uri }) => {
  return (
    <View className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-6">
      <View className="absolute inset-0 bg-black/40 z-10" />
      <ImageWithLoader uri={uri} />
      <View className="absolute bottom-4 left-4 right-4 z-20">
        <Text className="text-2xl font-bold mb-1 text-white">
          Rate the Photo:
        </Text>
        <Text className="text-sm text-white/90">
          Share your honest impression!
        </Text>
      </View>
    </View>
  );
};

const PhotoCard = memo(PhotoCardComponent);
PhotoCard.displayName = 'PhotoCard';

const PhotoSkeleton = () => (
  <View className="animate-pulse">
    <View className="bg-gray-200 w-full h-80 rounded-lg" />
    <View className="mt-4 space-y-4">
      <View className="h-4 bg-gray-200 rounded w-3/4" />
      <View className="h-4 bg-gray-200 rounded w-1/2" />
    </View>
  </View>
);

const TraitIconComponent: React.FC<TraitIconProps> = ({ trait }) => {
    if (!trait) {
        console.error('TraitIcon received invalid trait:', trait);
        return null;
    }

    return (
        <View className="flex flex-col items-center gap-2">
            <LinearGradient
                colors={trait.gradientColors}
                className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <Text className="text-2xl">{trait.emoji}</Text>
            </LinearGradient>
            <Text className="text-sm font-medium text-gray-700 text-center">
                {trait.label}
            </Text>
        </View>
    );
};

const TraitIcon = React.memo(TraitIconComponent);
TraitIcon.displayName = 'TraitIcon';

const TraitColumnComponent: React.FC<TraitColumnProps> = ({
    criteria,
    currentVotes,
    handleVoteSelection,
    disabled = false,
    traitLabel, // Correctly destructured
}) => {
    const buttonGradients: Record<number, string[]> = {
        4: ['#2ECC71', '#27AE60'],
        3: ['#82E0AA', '#52BE80'],
        2: ['#F4D03F', '#F1C40F'],
        1: ['#FF7043', '#F4511E'],
    };

    return (
        <View className="flex-1">
            {RATINGS.map((rating, index) => {
                const isSelected = currentVotes === rating.value;
                const gradientColors = buttonGradients[rating.value];

                return (
                    <TouchableOpacity
                        key={rating.label}
                        onPress={() => handleVoteSelection(criteria, rating.value as VoteValue)}
                        disabled={disabled}
                        className={`
                            h-14
                            ${isSelected ? 'scale-[1.02]' : ''}
                            ${disabled ? 'opacity-50' : ''}
                            ${index === 0 ? 'rounded-t-xl' : ''}
                            ${index === RATINGS.length - 1 ? 'rounded-b-xl' : ''}
                        `}
                    >
                        <LinearGradient
                            colors={gradientColors}
                            style={{
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                borderRadius: index === 0 ? 12 : index === RATINGS.length - 1 ? 12 : 0,
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text className={`
                                text-center text-sm font-bold text-white
                                ${isSelected ? 'opacity-100' : 'opacity-90'}
                            `}>
                                {rating.label}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const TraitColumn = memo(TraitColumnComponent);
TraitColumn.displayName = 'TraitColumn';
      
  const FeedbackModal: React.FC<FeedbackModalProps> = memo(({
    visible,
    selectedTags,
    onTagSelect,
    onSubmit,
    isSubmitting
  }) => {
    const modalRef = useRef<ScrollView>(null);
  
    useEffect(() => {
      if (visible && modalRef.current) {
        modalRef.current.scrollTo({ y: 0, animated: false });
      }
    }, [visible]);
  
    return (
      <RNModal
        visible={visible}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center">
          <View className="w-[90%] bg-white rounded-lg p-6 shadow-lg max-h-[80%]">
            <Text 
              className="text-lg font-bold mb-4 text-gray-800"
              accessible={true}
              accessibilityRole="header"
            >
              Select Feedback Tags
            </Text>
            <ScrollView 
            ref={modalRef}
            className="max-h-48"
            showsVerticalScrollIndicator={true}
          >
            <View className="flex flex-wrap gap-2">
              {feedbackTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  className={`px-3 py-2 rounded-full border ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 border-indigo-600'
                      : 'bg-gray-200'
                  } ${isSubmitting ? 'opacity-50' : ''}`}
                  onPress={() => onTagSelect(tag)}
                  disabled={isSubmitting}
                  accessible={true}
                  accessibilityLabel={`${tag} feedback tag`}
                  accessibilityState={{ 
                    selected: selectedTags.includes(tag),
                    disabled: isSubmitting
                  }}
                >
                  <Text
                    className={`text-sm ${
                      selectedTags.includes(tag) ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <TouchableOpacity
            className={`mt-4 py-3 rounded-lg ${
              isSubmitting ? 'bg-gray-400' : 'bg-indigo-600'
            }`}
            onPress={onSubmit}
            disabled={isSubmitting}
            accessible={true}
            accessibilityLabel="Submit feedback"
            accessibilityHint="Submits your feedback and completes the voting process"
          >
            <Text className="text-center text-white font-semibold">
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
}, (prevProps, nextProps) => 
  prevProps.visible === nextProps.visible &&
  prevProps.isSubmitting === nextProps.isSubmitting &&
  JSON.stringify(prevProps.selectedTags) === JSON.stringify(nextProps.selectedTags)
);

FeedbackModal.displayName = 'FeedbackModal';

// Error Boundary Component
class VotingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Voting Error:', error);
    logAnalyticsEvent('voting_error', {
      error: error.message,
      errorInfo: errorInfo.componentStack,
      timestamp: Date.now(),
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg text-red-600 mb-4">Something went wrong</Text>
          <TouchableOpacity
            className="bg-indigo-600 px-4 py-2 rounded-lg"
            onPress={() => this.setState({ hasError: false })}
            accessible={true}
            accessibilityLabel="Try again button"
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

// Main VotingScreen Component
const VotingScreen: React.FC = () => {
    const {
      state,
      loadPhotos,
      handleVoteSelection,
      handleSubmitVote,
      handleTagSelection,
      handleSubmitFeedback,
    } = usePhotoVoting();
  
    useEffect(() => {
      loadPhotos();
    }, [loadPhotos]);
  
    if (state.loadingState === 'loading' && state.photos.length === 0) {
      return <PhotoSkeleton />;
    }
  
    if (state.loadingState === 'error') {
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg text-red-600 mb-4">Failed to load photos</Text>
          <TouchableOpacity
            className="bg-indigo-600 px-4 py-2 rounded-lg"
            onPress={() => loadPhotos(true)}
          >
            <Text className="text-white">Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    console.log('TRAITS:', TRAITS);
    return (
      <VotingErrorBoundary>
        <View className="flex-1 bg-gray-100">
          <ScrollView className="flex-1">
            {/* Photo Card */}
            <PhotoCard 
              uri={state.photos[state.currentIndex]?.imageURL || 'https://via.placeholder.com/600x800'} 
            />
  
            {/* Trait Icons */}
            <View className="flex-row justify-around mb-6 px-4">
                {TRAITS.map((trait, index) => {
                    console.log(`Rendering TraitIcon for index ${index}:`, trait);
                    return <TraitIcon key={trait.id} trait={trait} />;
                })}
            </View>

  
            {/* Rating Grid */}
            <View className="px-4">
              <View className="flex-row space-x-2 overflow-hidden rounded-3xl shadow-lg">
              {TRAITS.map((trait) => (
                <TraitColumn
                    key={trait.id}
                    criteria={trait.id}
                    currentVotes={state.currentVotes[trait.id]}
                    handleVoteSelection={handleVoteSelection}
                    disabled={state.isSubmitting}
                    traitLabel={trait.label}  // Add this line
                />
))}
              </View>
            </View>
  
            {/* Submit Button */}
            {state.buttonVisible && (
              <TouchableOpacity
                className="mx-4 mt-6 mb-8 py-4 rounded-2xl bg-indigo-600 shadow-lg"
                onPress={handleSubmitVote}
                disabled={state.isSubmitting}
              >
                <Text className="text-center text-white text-lg font-semibold">
                  {state.isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
  
          {/* Feedback Modal */}
          <FeedbackModal
            visible={state.feedbackModalVisible}
            selectedTags={state.selectedTags}
            onTagSelect={handleTagSelection}
            onSubmit={handleSubmitFeedback}
            isSubmitting={state.isSubmitting}
          />
        </View>
      </VotingErrorBoundary>
    );
  };
  
// Export
export default VotingScreen;
