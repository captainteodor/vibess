import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseFirestore } from '../../config/firebase';
import { useAuth } from '../../lib/auth/authContext';

type PhotoModel = {
  id: string;
  imageURL: string;
};

type ProfilePhotoSelectionModalProps = {
  onClose: () => void;
  onSubmit: (photos: { id: string; description: string }[]) => void;
  maxSelections?: number;
};

const ProfilePhotoSelectionModal: React.FC<ProfilePhotoSelectionModalProps> = ({
  onClose,
  onSubmit,
  maxSelections = 5,
}) => {
  const [photos, setPhotos] = useState<PhotoModel[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<{ id: string; description: string }[]>([]);
  const { user } = useAuth();
  const firestore = getFirebaseFirestore();

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user?.email) return;
      try {
        const photosRef = collection(firestore, 'photos');
        const q = query(photosRef, where('owner', '==', user.email));
        const querySnapshot = await getDocs(q);
        const fetchedPhotos = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageURL: doc.data().imageURL,
        }));
        setPhotos(fetchedPhotos);
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [user?.email]);

  const handleSelectPhoto = (photo: PhotoModel) => {
    setSelectedPhotos((prevSelected) => {
      const alreadySelected = prevSelected.find((item) => item.id === photo.id);

      if (alreadySelected) {
        // Deselect the photo if it’s already selected
        return prevSelected.filter((item) => item.id !== photo.id);
      } else {
        if (prevSelected.length >= maxSelections) {
          Alert.alert('Selection Limit', `You can select up to ${maxSelections} photos.`);
          return prevSelected;
        }
        // Select the photo with an empty description initially
        return [...prevSelected, { id: photo.id, description: '' }];
      }
    });
  };

  const handleDescriptionChange = (photoId: string, description: string) => {
    setSelectedPhotos((prevSelected) =>
      prevSelected.map((item) =>
        item.id === photoId ? { ...item, description } : item
      )
    );
  };

  const handleSubmit = () => {
    if (selectedPhotos.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one photo.');
      return;
    }
    onSubmit(selectedPhotos);
  };

  const renderPhotoItem = ({ item }: { item: PhotoModel }) => {
    const isSelected = selectedPhotos.some((photo) => photo.id === item.id);

    return (
      <TouchableOpacity onPress={() => handleSelectPhoto(item)} style={styles.photoItem}>
        <Image source={{ uri: item.imageURL }} style={styles.photo} />
        {isSelected && <View style={styles.selectedOverlay} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Profile Photos</Text>
      <Text style={styles.subtitle}>You can select up to {maxSelections} photos.</Text>

      <FlatList
        data={photos}
        renderItem={renderPhotoItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.photoGrid}
      />

      <View style={styles.descriptionContainer}>
        {selectedPhotos.map((photo) => (
          <View key={photo.id} style={styles.descriptionInputContainer}>
            <Text style={styles.descriptionLabel}>Photo {selectedPhotos.indexOf(photo) + 1}:</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe this photo..."
              value={photo.description}
              onChangeText={(text) => handleDescriptionChange(photo.id, text)}
            />
          </View>
        ))}
      </View>

      <View style={styles.buttonsContainer}>
        <Button title="Submit Photos" onPress={handleSubmit} />
        <Button title="Cancel" onPress={onClose} color="#888" />
      </View>
    </View>
  );
};

export default ProfilePhotoSelectionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  photoGrid: {
    alignItems: 'center',
  },
  photoItem: {
    margin: 5,
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 150, 255, 0.5)',
    borderRadius: 8,
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  descriptionLabel: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  descriptionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
