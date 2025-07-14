import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity } from 'react-native';

interface NewTestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (photo: string) => void;
}

const NewTestModal: React.FC<NewTestModalProps> = ({ visible, onClose, onSubmit }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selectedPhoto) {
      alert('Please upload a photo');
      return;
    }
    onSubmit(selectedPhoto);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-6 w-11/12">
          <Text className="text-xl font-bold mb-4">Upload Photo for New Test</Text>
          <TextInput
            className="border border-gray-300 p-2 rounded-md mb-4"
            placeholder="Enter Photo URL"
            value={selectedPhoto || ''}
            onChangeText={setSelectedPhoto}
          />
          <View className="flex-row justify-end space-x-4">
            <TouchableOpacity
              className="bg-gray-300 py-2 px-4 rounded-lg"
              onPress={onClose}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-blue-500 py-2 px-4 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="text-white">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NewTestModal;
