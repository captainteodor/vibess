// /components/NewTestModal.tsx
import React, { useState } from 'react';
import { Modal, Card, Text, Button, Input } from '@ui-kitten/components';
import { View } from 'react-native';
import { styles } from '../styles/NewTestModalStyles'; // Assuming styles for this modal component


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
    onSubmit(selectedPhoto); // Pass the selected photo back to the dashboard
    onClose(); // Close modal after submission
  };

  return (
    <Modal visible={visible} backdropStyle={styles.backdrop} onBackdropPress={onClose}>
      <Card disabled={true}>
        <Text>Upload Photo for New Test</Text>
        <Input
          placeholder="Select Photo"
          value={selectedPhoto || ''}
          onChangeText={setSelectedPhoto}
        />
        <View style={styles.buttonGroup}>
          <Button onPress={handleSubmit}>Submit</Button>
          <Button onPress={onClose}>Cancel</Button>
        </View>
      </Card>
    </Modal>
  );
};

export default NewTestModal;
