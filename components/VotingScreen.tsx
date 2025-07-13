// 1. Imports
import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import {
  ScrollView,
  Image,
  Alert,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs, 
  DocumentSnapshot,
  writeBatch 
} from 'firebase/firestore';

// Local imports
import { PhotoService } from '~/lib/services/PhotoService';
import { PhotoModel } from '~/lib/models/PhotoModel';
import { useAuth } from '~/lib/auth/authContext';
import { getFirebaseFirestore } from '~/config/firebase';
import { logAnalyticsEvent } from '~/lib/analytics/analytics';
import { 
  TRAITS, 
  VOTING_CONSTANTS, 
  PHOTO_CONSTANTS
} from '~/constants/votingConstants';
import { VotingCriteria } from '~/types/index';

// Component imports
import PhotoCard from './voting/PhotoCard';
import PhotoSkeleton from './voting/PhotoSkeleton';
import TraitIcon from './voting/TraitIcon';
import TraitColumn from './voting/TraitColumn';
import FeedbackModal from './voting/FeedbackModal';
import VotingErrorBoundary from './voting/VotingErrorBoundary';

// 2. Types & Interfaces
export type VoteValue = 1 | 2 | 3 | 4;
export type LoadingState = 'idle' | 'loading' | 'error' | 'success';

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
  
// 8. Custom Hook
const usePhotoVoting = () => {
    const [state, dispatch] = useReducer(votingReducer, initialState);
    const { user } = useAuth();
    const firestore = getFirebaseFirestore();
    const photoCache = useRef<Map<string, PhotoModel>>(new Map());
  
    useEffect(() => {
      if (state.photos.length - state.currentIndex <= PHOTO_CONSTANTS.PREFETCH_THRESHOLD) {
        loadPhotos(false);
      }
    }, [state.currentIndex]);
  
    useEffect(() => {
      return () => {
        photoCache.current.clear();
      };
    }, []);
  
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
          filteredPhotos.forEach(photo => {
            photoCache.current.set(photo.id, photo);
          });
  
          if (photoCache.current.size > PHOTO_CONSTANTS.CACHE_SIZE) {
            const entriesToDelete = [...photoCache.current.entries()]
              .slice(0, photoCache.current.size - PHOTO_CONSTANTS.CACHE_SIZE);
            entriesToDelete.forEach(([key]) => photoCache.current.delete(key));
          }

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
  
    const handleVoteSelection = useCallback((criteria: VotingCriteria, value: VoteValue) => {
      if (state.isSubmitting) return;
      
      dispatch({
        type: 'SET_VOTE',
        payload: { criteria, value },
      });
    }, [state.isSubmitting]);
  
    const handleSubmitVote = useCallback(async () => {
      if (state.isSubmitting || !state.buttonVisible) return;
    
      try {
        dispatch({ type: 'SET_SUBMITTING', payload: true });
        
        const currentPhoto = state.photos[state.currentIndex];
        if (!currentPhoto?.id) {
          throw new Error('Invalid photo data');
        }
    
        logAnalyticsEvent('photo_vote', {
            photoId: currentPhoto.id,
            votes: state.currentVotes,
            timestamp: Date.now(),
        });
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
  
    const handleTagSelection = useCallback((tag: string) => {
      if (state.isSubmitting) return;
  
      dispatch({
        type: 'SET_SELECTED_TAGS',
        payload: state.selectedTags.includes(tag)
          ? state.selectedTags.filter((t) => t !== tag)
          : [...state.selectedTags, tag],
      });
    }, [state.selectedTags, state.isSubmitting]);
  
    const submitVoteToFirestore = async (photoId: string) => {
      try {
        const voterEmail = user?.email;
        if (!voterEmail) throw new Error('User not authenticated');
    
        const batch = writeBatch(firestore);
        const photoRef = doc(firestore, 'photos', photoId);
        const voterRef = doc(firestore, 'users', voterEmail);
        const voteRef = doc(collection(firestore, `users/${voterEmail}/votes`));
    
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
    
    return (
      <VotingErrorBoundary>
        <View className="flex-1 bg-gray-100">
          <ScrollView className="flex-1">
            <PhotoCard 
              uri={state.photos[state.currentIndex]?.imageURL || 'https://via.placeholder.com/600x800'} 
            />
  
            <View className="flex-row justify-around mb-6 px-4">
                {TRAITS.map((trait) => (
                    <TraitIcon key={trait.id} trait={trait} />
                ))}
            </View>
  
            <View className="px-4">
              <View className="flex-row space-x-2 overflow-hidden rounded-3xl shadow-lg">
              {TRAITS.map((trait) => (
                <TraitColumn
                    key={trait.id}
                    criteria={trait.id}
                    currentVotes={state.currentVotes[trait.id]}
                    handleVoteSelection={handleVoteSelection}
                    disabled={state.isSubmitting}
                />
              ))}
              </View>
            </View>
  
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
  
export default VotingScreen;
