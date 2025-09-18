import { useCategories } from "@/store/categories";
import { FlatList, Text, View } from "react-native";

export default function Index() {
  const { categories }: any = useCategories();

  return (
    <View
      style={{
        gap: 10,
        paddingHorizontal: 20,
        paddingTop: 10,
        flexDirection: "column",
      }}
    >
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 10,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
