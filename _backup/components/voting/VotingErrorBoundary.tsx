import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { logAnalyticsEvent } from '~/lib/analytics/analytics';

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

export default VotingErrorBoundary;
