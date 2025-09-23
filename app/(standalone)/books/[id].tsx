import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Books() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View>
      <Text>Book ID: {id}</Text>
    </View>
  );
}