import React, { useEffect, useRef, memo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal as RNModal } from 'react-native';
import { feedbackTags } from '~/constants/votingConstants';

interface FeedbackModalProps {
  visible: boolean;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FeedbackModalComponent: React.FC<FeedbackModalProps> = ({
  visible,
  selectedTags,
  onTagSelect,
  onSubmit,
  isSubmitting,
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
                    disabled: isSubmitting,
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
};

const FeedbackModal = memo(FeedbackModalComponent, (prevProps, nextProps) => 
  prevProps.visible === nextProps.visible &&
  prevProps.isSubmitting === nextProps.isSubmitting &&
  JSON.stringify(prevProps.selectedTags) === JSON.stringify(nextProps.selectedTags)
);

FeedbackModal.displayName = 'FeedbackModal';

export default FeedbackModal;
