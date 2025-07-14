import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getFirebaseFirestore } from '~/config/firebase';
import { useAuth } from '~/lib/auth/authContext';
import { PhotoModel } from '~/lib/models/PhotoModel';
import { PhotoService } from '~/lib/services/PhotoService';
import NewTestModal from '../../components/NewTestModal';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [filter, setFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalAction, setModalAction] = useState<(() => void) | null>(null);
  const [newTestModalVisible, setNewTestModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchUserCredits();
    fetchUserPhotos();
  }, []);

  const fetchUserCredits = async () => {
    if (user?.email) {
      try {
        const firestore = getFirebaseFirestore();
        const userCredits = await new PhotoService(firestore).getUserCredits(user.email);
        setCredits(userCredits?.credits ?? 0);
      } catch (error) {
        console.error('Error fetching user credits:', error);
      }
    }
  };

  const fetchUserPhotos = async () => {
    if (user?.email) {
      setLoading(true);
      try {
        const firestore = getFirebaseFirestore();
        const fetchedPhotos = await new PhotoService(firestore).getPhotosByUser(user.email);
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
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

  const handleStartStopTest = async (photoId: string, currentStatus: string) => {
    try {
      const firestore = getFirebaseFirestore();
      const activeTest = photos.find((photo) => photo.status === 'Active');

      if (currentStatus === 'Inactive') {
        if (activeTest) {
          showModal('You already have an active test. Would you like to stop it and start this one?', async () => {
            await new PhotoService(firestore).updatePhotoStatus(activeTest.id, 'Inactive');

            if (credits < 10) {
              showModal('You need at least 10 credits to start a test. Vote on other photos to earn more credits.');
            } else if (credits < 40) {
              showModal('A standard test takes around 40 votes to be accurate. You can proceed, but it may take longer to complete.', async () => {
                await new PhotoService(firestore).updatePhotoStatus(photoId, 'Active');
                updatePhotoStatusState(photoId, activeTest.id);
              });
            } else {
              await new PhotoService(firestore).updatePhotoStatus(photoId, 'Active');
              updatePhotoStatusState(photoId, activeTest.id);
            }
          });
        } else {
          if (credits < 10) {
            showModal('You need at least 10 credits to start a test. Vote on other photos to earn more credits.');
          } else if (credits < 40) {
            showModal('A standard test takes around 40 votes to be accurate. You can proceed, but it may take longer to complete.', async () => {
              await new PhotoService(firestore).updatePhotoStatus(photoId, 'Active');
              updatePhotoStatusState(photoId);
            });
          } else {
            await new PhotoService(firestore).updatePhotoStatus(photoId, 'Active');
            updatePhotoStatusState(photoId);
          }
        }
      } else {
        await new PhotoService(firestore).updatePhotoStatus(photoId, 'Inactive');
        setPhotos((prevPhotos) =>
          prevPhotos.map((photo) =>
            photo.id === photoId ? { ...photo, status: 'Inactive' } : photo
          )
        );
      }
    } catch (error) {
      console.error('Error updating photo status:', error);
    }
  };

  const updatePhotoStatusState = (photoId: string, inactivePhotoId?: string) => {
    setPhotos((prevPhotos) =>
      prevPhotos.map((photo) =>
        photo.id === inactivePhotoId ? { ...photo, status: 'Inactive' } :
        photo.id === photoId ? { ...photo, status: 'Active' } : photo
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserPhotos().then(() => setRefreshing(false));
    fetchUserCredits().then(() => setRefreshing(false));
  };

  const handleNewTestSubmit = (photo: string) => {
    if (!photo) {
      Alert.alert('Please upload a photo');
      return;
    }
    console.log('Uploading photo:', photo);
    setNewTestModalVisible(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-600 mt-2">Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Dashboard</Text>

        {/* Credits Display */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-700">
            Credits: {credits}
          </Text>
        </View>

        {/* New Test Button */}
        <TouchableOpacity 
          className="bg-indigo-600 p-4 rounded-lg mb-4"
          onPress={() => setNewTestModalVisible(true)}
        >
          <Text className="text-white font-semibold text-center">New Test</Text>
        </TouchableOpacity>

        {/* Filter Button */}
        <TouchableOpacity 
          className="bg-gray-100 p-4 rounded-lg mb-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-gray-700 text-center">Filter: {filter}</Text>
        </TouchableOpacity>

        {/* Photo Grid */}
        {photos.map((photo) => (
          <View key={photo.id} className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
            <Image 
              source={{ uri: photo.imageURL }} 
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-xl font-semibold text-gray-900">{photo.photoName}</Text>
              <Text className="text-gray-600">Status: {photo.status}</Text>
              <Text className="text-gray-600">Votes: {photo.voteCount.totalVotes}</Text>

              {/* Metrics */}
              <View className="mt-4 space-y-3">
                {/* Nice Personality Metric */}
                <View>
                  <Text className="text-sm font-medium text-gray-700">
                    Nice Personality: {photo.voteCount.totalVotes ? 
                      ((photo.sumTraits.nicePersonality / photo.voteCount.totalVotes) * 10 / 5).toFixed(1) 
                      : '-'}
                  </Text>
                  <View className="h-2 bg-gray-200 rounded-full mt-1">
                    <View 
                      className="h-2 bg-indigo-600 rounded-full"
                      style={{ width: `${(photo.sumTraits.nicePersonality / photo.voteCount.totalVotes) * 20}%` }}
                    />
                  </View>
                </View>

                {/* Similar metrics for Confident and Attractive */}
                {/* ... */}

                <TouchableOpacity
                  className={`mt-4 p-3 rounded-lg ${
                    photo.status === 'Active' 
                      ? 'bg-red-600' 
                      : 'bg-green-600'
                  }`}
                  onPress={() => handleStartStopTest(photo.id, photo.status)}
                >
                  <Text className="text-white font-semibold text-center">
                    {photo.status === 'Active' ? 'Stop Test' : 'Start Test'}
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
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white rounded-lg p-6 w-[90%] max-w-sm">
              <Text className="text-lg mb-4">{modalMessage}</Text>
              <View className="flex-row justify-end space-x-2">
                <TouchableOpacity 
                  className="px-4 py-2 rounded-lg bg-gray-200"
                  onPress={closeModal}
                >
                  <Text>Close</Text>
                </TouchableOpacity>
                {modalAction && (
                  <TouchableOpacity 
                    className="px-4 py-2 rounded-lg bg-indigo-600"
                    onPress={() => { modalAction?.(); closeModal(); }}
                  >
                    <Text className="text-white">Proceed</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* New Test Modal */}
        <NewTestModal
          visible={newTestModalVisible}
          onClose={() => setNewTestModalVisible(false)}
          onSubmit={handleNewTestSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default Dashboard;
