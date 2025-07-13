import React, { useState, useEffect } from "react";
import { ScrollView, Text, View, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore"; // Firestore imports
import { useAuth } from '../../lib/auth/authContext'; // Your auth context
import { getFirebaseFirestore } from "../../config/firebase"; // Firebase config
import { useRouter } from "expo-router"; // Router for navigation

const AboutScreen: React.FC = () => {
  const { user } = useAuth(); // Fetch authenticated user details
  const router = useRouter();
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const firestore = getFirebaseFirestore(); // Firestore instance

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const userDocRef = doc(firestore, "users", user.email); // Query Firestore using the authenticated user's email
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError("No user data found");
          }
        } catch (e) {
          setError("Failed to fetch user data");
        } finally {
          setLoading(false);
        }
      } else {
        setError("No authenticated user found");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.email]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About</Text>
      {userData ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.label}>Name: </Text>
          <Text style={styles.value}>{userData.name || "N/A"}</Text>

          <Text style={styles.label}>Email: </Text>
          <Text style={styles.value}>{userData.email || "N/A"}</Text>

          {/* Add more fields as necessary */}
        </View>
      ) : (
        <Text style={styles.noDataText}>No user information available.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={() => router.push("/(chatbot)/chat")}>
        <Text style={styles.buttonText}>Go to Chatbot</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default AboutScreen;
