import Book_Review from "@/components/Book_Review";
import { useStore } from "@/store/auth";
import { useBooks } from "@/store/books";
import { userefresh } from "@/store/refresh";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
export default function Books() {
  const { setEditBook }: any = useBooks();
  const { HP_Trigger, HP_refresher }: any = userefresh();
  const { profile }: any = useStore();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { book_id } = useLocalSearchParams<{ book_id: string }>();
  const router = useRouter();

  const fetchBook = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/books/${book_id}`
      );
      const data = await response.json();
      if (data?.success) {
        setBook(data?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching book:", error);
    }
  };

  useEffect(() => {
    fetchBook();
  }, [book_id, HP_refresher]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff0000ff" />
      </View>
    );
  }

  const DeleteHandler = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/books/${book_id}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data?.success) {
        HP_Trigger();
        router.back();
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen
        options={{
          title: book?.Name || "Book Details",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 15,
              }}
            >
              {profile?.id === book?.created_by && (
                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    setEditBook(book);
                    router.push(`/books/edit`);
                  }}
                >
                  <Feather name="edit" size={24} color="black" />
                </Pressable>
              )}
              {profile?.id === book?.created_by && (
                <Pressable
                  hitSlop={10}
                  onPress={() => {
                    Alert.alert(
                      "Delete Book",
                      "Are you sure you want to delete this book?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: DeleteHandler,
                        },
                      ]
                    );
                  }}
                >
                  <Feather name="trash" size={24} color="red" />
                </Pressable>
              )}
            </View>
          ),
        }}
      />
      <Image
        source={book?.Image}
        style={{ width: "100%", height: 400 }}
        contentFit="contain"
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", margin: 10 }}>
        {book?.Name}
      </Text>
      <Text
        style={{ fontSize: 24, fontWeight: "bold", margin: 10, color: "#555" }}
      >
        {book?.Description}
      </Text>
      {profile?.id ? (
        <Book_Review
          book_id={book.id}
          reviews={book?.reviews}
          fetchBook={fetchBook}
        />
      ) : (
        <View>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 20,
            }}
          >
            Please login to see reviews and add your own review.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
