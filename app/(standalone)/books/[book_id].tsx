import Book_Review from "@/components/Book_Review";
import { useStore } from "@/store/auth";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Books() {
  const { profile }: any = useStore();
  const [book, setBook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { book_id } = useLocalSearchParams<{ book_id: string }>();

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
  }, [book_id]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ff0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Stack.Screen
        options={{
          title: book?.Name || "Book Details",
          headerRight: () => (
            <View style={{}}>
              {profile?.id === book?.created_by && (
                <Text
                  style={{ color: "red", fontWeight: "bold", marginRight: 10 }}
                >
                  Creater
                </Text>
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
      <Text style={{ fontSize: 24, fontWeight: "bold", margin: 10 }}>
        {book?.Descreption}
      </Text>
      <Book_Review
        book_id={book.id}
        reviews={book?.reviews}
        fetchBook={fetchBook}
      />
    </ScrollView>
  );
}
