import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Book_Review({ book_id, reviews, fetchBook }: any) {
  const [selectedStars, setSelectedStars] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Helper to render stars
  const renderStars = (count: number, highlight: boolean = false) => {
    return (
      <View style={styles.starsRow}>
        {[...Array(5)].map((_, i) => (
          <Text
            key={i}
            style={[
              styles.starIcon,
              i < count
                ? highlight
                  ? styles.starHighlight
                  : styles.starFilled
                : styles.starEmpty,
            ]}
          >
            ★
          </Text>
        ))}
      </View>
    );
  };

  // TODO: handle submit review
  const handleSubmit = async () => {
    const accessToken = await SecureStore.getItemAsync("token");
    const res = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/books/${book_id}/review`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          stars: selectedStars,
          review: reviewText,
        }),
      }
    );
    const data = await res.json();
    if (data?.success) {
      alert("Review submitted successfully!");
      fetchBook();
      setReviewText("");
      setSelectedStars(0);
      // Optionally, refresh reviews list here
    } else {
      alert(data?.message || "Failed to submit review.");
    }
  };

  return (
    <View style={styles.container}>
      {reviews && reviews.length > 0 ? (
        reviews.map((review: any) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.name}>
                {review.FirstName} {review.LastName}
              </Text>
              {renderStars(review.stars, true)}
            </View>
            <Text style={styles.text}>{review.review}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviews}>No reviews yet.</Text>
      )}

      {/* Review Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Write a Review</Text>
        <Text style={styles.formLabel}>Select Stars:</Text>
        <View style={styles.starsRow}>
          {[...Array(5)].map((_, i) => (
            <TouchableOpacity key={i} onPress={() => setSelectedStars(i + 1)}>
              <Text
                style={[
                  styles.starIcon,
                  i < selectedStars ? styles.starHighlight : styles.starEmpty,
                ]}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Write your review..."
          value={reviewText}
          onChangeText={setReviewText}
          multiline
        />
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  reviewCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    fontSize: 24,
    marginHorizontal: 1,
  },
  starFilled: {
    color: "#FFD700",
    opacity: 0.7,
  },
  starHighlight: {
    color: "#FFD700",
    fontWeight: "bold",
    textShadowColor: "#FFA500",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  starEmpty: {
    color: "#ccc",
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  noReviews: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  formTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#333",
  },
  formLabel: {
    fontSize: 15,
    marginBottom: 4,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    marginBottom: 12,
    minHeight: 40,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  submitButton: {
    backgroundColor: "#1976D2",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
