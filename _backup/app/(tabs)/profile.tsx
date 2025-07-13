import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Image,
  RefreshControl,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal
} from 'react-native';
import { useAuth } from '~/lib/auth/authContext';
import { ProfileService } from '~/lib/services/ProfileService';
import { PhotoService } from '~/lib/services/PhotoService';
import { getFirebaseFirestore } from '~/config/firebase';
import { ProfileModel } from '~/lib/models/ProfileModel';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  // Fetch profiles from Firebase
  const fetchProfiles = async () => {
    if (user?.email) {
      setLoading(true);
      try {
        const firestore = getFirebaseFirestore();
        const profileService = new ProfileService(firestore);
        const photoService = new PhotoService(firestore);
        const fetchedProfiles = await profileService.getProfiles();

        // Fetch photo URLs based on document IDs
        const updatedProfiles = await Promise.all(
          fetchedProfiles.map(async (profile) => {
            if (profile.profilePhotos?.primaryPhotoId) {
              const primaryPhotoDoc = await photoService.getPhotoById(profile.profilePhotos.primaryPhotoId);
              profile.profilePhotos.primaryPhotoURL = primaryPhotoDoc?.imageURL;
            }

            if (profile.profilePhotos?.candidPhotoIds) {
              profile.profilePhotos.candidPhotoURLs = await Promise.all(
                profile.profilePhotos.candidPhotoIds.map(async (photoId) => {
                  const photoDoc = await photoService.getPhotoById(photoId);
                  return photoDoc?.imageURL || null;
                })
              ).then((urls) => urls.filter((url) => url !== null)); // Filter out any null values
            }

            return profile;
          })
        );

        setProfiles(updatedProfiles);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const showModal = (message: string, action?: () => void) => {
    setModalMessage(message);
    setModalAction(() => action || undefined);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleStartStopReview = async (profileId: string, currentStatus: string) => {
    try {
      const firestore = getFirebaseFirestore();
      const profileService = new ProfileService(firestore);
      const activeReview = profiles.find((profile) => profile.status === 'Active');

      if (currentStatus === 'Inactive') {
        if (activeReview) {
          showModal('You already have an active review. Would you like to stop it and start this one?', async () => {
            await profileService.updateProfileStatus(activeReview.id, 'Inactive');
            await profileService.updateProfileStatus(profileId, 'Active');
            updateProfileStatusState(profileId, activeReview.id);
          });
        } else {
          await profileService.updateProfileStatus(profileId, 'Active');
          updateProfileStatusState(profileId);
        }
      } else {
        await profileService.updateProfileStatus(profileId, 'Inactive');
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === profileId ? { ...profile, status: 'Inactive' } : profile
          )
        );
      }
    } catch (error) {
      console.error('Error updating profile status:', error);
    }
  };

  const updateProfileStatusState = (profileId: string, inactiveProfileId?: string) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) =>
        profile.id === inactiveProfileId ? { ...profile, status: 'Inactive' } :
        profile.id === profileId ? { ...profile, status: 'Active' } : profile
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfiles().then(() => setRefreshing(false));
  };

  // Loading State
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="mt-4 text-gray-600">Loading profiles...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4">
        <Text className="text-3xl font-bold text-gray-900 mb-6">
          Profile Reviews
        </Text>

        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-lg mb-8"
          onPress={() => router.push('/(chatbot)/main')}
        >
          <Text className="text-white font-semibold text-center text-lg">
            New Profile
          </Text>
        </TouchableOpacity>

        {/* Profile Cards */}
        {profiles.map((profile) => (
          <View key={profile.id} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
            <View className="p-6">
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                {profile.userId ?? 'No User ID'}
              </Text>
              
              {/* Photo Collage */}
              <View className="flex-row flex-wrap gap-2 mb-4">
                {profile.profilePhotos?.primaryPhotoURL && (
                  <Image
                    source={{ uri: profile.profilePhotos.primaryPhotoURL }}
                    className="w-24 h-24 rounded-lg"
                  />
                )}
                {profile.profilePhotos?.candidPhotoURLs?.map((photoUrl, index) =>
                  photoUrl ? (
                    <Image 
                      key={index} 
                      source={{ uri: photoUrl }} 
                      className="w-24 h-24 rounded-lg"
                    />
                  ) : null
                )}
              </View>

              <View className="space-y-4">
                <Text className="text-gray-700">
                  Status: {profile.status ?? 'Inactive'}
                </Text>
                <Text className="text-gray-700">
                  Votes: {profile.voteCount?.totalVotes ?? 0}
                </Text>

                {/* Metrics */}
                <View className="space-y-3">
                  {/* Confidence Metric */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700">
                      Confidence: {profile.voteCount?.totalVotes
                        ? ((profile.sumTraits?.confident ?? 0) / profile.voteCount.totalVotes * 10 / 5).toFixed(1)
                        : '-'}
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full mt-1">
                      <View 
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ 
                          width: `${((profile.sumTraits?.confident ?? 0) / (profile.voteCount?.totalVotes ?? 1)) * 20}%` 
                        }}
                      />
                    </View>
                  </View>

                  {/* Nice Personality Metric */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700">
                      Nice Personality: {profile.voteCount?.totalVotes
                        ? ((profile.sumTraits?.nicePersonality ?? 0) / profile.voteCount.totalVotes * 10 / 5).toFixed(1)
                        : '-'}
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full mt-1">
                      <View 
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ 
                          width: `${((profile.sumTraits?.nicePersonality ?? 0) / (profile.voteCount?.totalVotes ?? 1)) * 20}%` 
                        }}
                      />
                    </View>
                  </View>

                  {/* Attractive Metric */}
                  <View>
                    <Text className="text-sm font-medium text-gray-700">
                      Attractive: {profile.voteCount?.totalVotes
                        ? ((profile.sumTraits?.attractive ?? 0) / profile.voteCount.totalVotes * 10 / 5).toFixed(1)
                        : '-'}
                    </Text>
                    <View className="h-2 bg-gray-200 rounded-full mt-1">
                      <View 
                        className="h-2 bg-indigo-600 rounded-full"
                        style={{ 
                          width: `${((profile.sumTraits?.attractive ?? 0) / (profile.voteCount?.totalVotes ?? 1)) * 20}%` 
                        }}
                      />
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  className={`mt-4 py-3 rounded-lg ${
                    profile.status === 'Active' ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  onPress={() => handleStartStopReview(profile.id, profile.status ?? 'Inactive')}
                >
                  <Text className="text-white font-semibold text-center">
                    {profile.status === 'Active' ? 'Stop Review' : 'Start Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Alert Modal */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
        >
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View className="bg-white rounded-lg p-6 w-full max-w-sm">
              <Text className="text-lg mb-4 text-gray-900">{modalMessage}</Text>
              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  className="px-4 py-2 rounded-lg bg-gray-200"
                  onPress={closeModal}
                >
                  <Text className="text-gray-700 font-medium">Close</Text>
                </TouchableOpacity>
                {modalAction && (
                  <TouchableOpacity
                    className="px-4 py-2 rounded-lg bg-indigo-600"
                    onPress={() => {
                      modalAction();
                      closeModal();
                    }}
                  >
                    <Text className="text-white font-medium">Proceed</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
