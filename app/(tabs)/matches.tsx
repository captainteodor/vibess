// app/(tabs)/matches.tsx
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../lib/auth/authContext';

interface Match {
  id: string;
  matchedUserId: string;
  matchedUserName?: string;
  matchedUserPhoto?: string;
  matchScore: number;
  timestamp: Date;
  mutualVotes?: {
    fromYou: number;
    fromThem: number;
  };
}

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const firestore = getFirestore();

  const fetchMatches = async () => {
    if (!user?.email) return;

    try {
      // This is a placeholder query - adjust based on your actual data structure
      // You might need to query a 'matches' collection or calculate matches from votes
      const matchesQuery = query(
        collection(firestore, 'matches'),
        where('users', 'array-contains', user.email),
        orderBy('timestamp', 'desc')
      );
      
      const snapshot = await getDocs(matchesQuery);
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as Match[];
      
      setMatches(matchesData);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // For now, show empty state instead of error
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-gray-600 mt-2">Loading matches...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#6366F1"
        />
      }
    >
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">Matches</Text>
          <Text className="text-gray-600 mt-1">People who liked you back</Text>
        </View>
        
        {matches.length === 0 ? (
          // Empty State
          <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
            <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              No matches yet
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Keep voting to find people who match with you!
            </Text>
            <TouchableOpacity 
              className="bg-indigo-600 px-6 py-3 rounded-full mt-6"
              onPress={() => {
                // Navigate to vote tab
                // You might need to use router.push('/(tabs)/vote')
              }}
            >
              <Text className="text-white font-semibold">Start Voting</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Matches List
          <View className="space-y-4">
            {matches.map((match) => (
              <TouchableOpacity 
                key={match.id} 
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
                activeOpacity={0.7}
              >
                <View className="flex-row p-4">
                  {/* Profile Image */}
                  <View className="mr-4">
                    {match.matchedUserPhoto ? (
                      <Image 
                        source={{ uri: match.matchedUserPhoto }}
                        className="w-20 h-20 rounded-full"
                      />
                    ) : (
                      <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center">
                        <Ionicons name="person" size={32} color="#9CA3AF" />
                      </View>
                    )}
                  </View>
                  
                  {/* Match Info */}
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900">
                      {match.matchedUserName || 'Anonymous User'}
                    </Text>
                    <Text className="text-gray-600 mt-1">
                      Match Score: {match.matchScore}%
                    </Text>
                    {match.mutualVotes && (
                      <View className="flex-row mt-2">
                        <Text className="text-sm text-gray-500">
                          You rated: {match.mutualVotes.fromYou}/10
                        </Text>
                        <Text className="text-sm text-gray-500 ml-4">
                          They rated: {match.mutualVotes.fromThem}/10
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Action Button */}
                  <View className="justify-center">
                    <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                  </View>
                </View>
                
                {/* Match Date */}
                <View className="bg-gray-50 px-4 py-2">
                  <Text className="text-xs text-gray-500">
                    Matched {formatDate(match.timestamp)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// Helper function to format dates
function formatDate(date: Date): string {
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return 'just now';
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'yesterday';
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}