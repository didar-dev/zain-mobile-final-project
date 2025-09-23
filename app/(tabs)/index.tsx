import { useBooks } from "@/store/books";
import { useCategories } from "@/store/categories";
import { Image } from "expo-image";
import { router } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Index() {
  const { categories }: any = useCategories();
  const { recent_books }: any = useBooks();

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

      <FlatList
        data={recent_books}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          paddingVertical: 10,
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              router.push(`./(standalone)/books/${item?.id}`);
            }}
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              width: 150,
              position: "relative",
              height: 240,
            }}
          >
            <Text
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "rgba(255, 0, 0, 1)",
                zIndex: 10,
                color: "white",
                paddingHorizontal: 5,
                borderRadius: 5,
                fontSize: 16,
              }}
            >
              {item?.category_name}
            </Text>

            <Image
              source={item.Image}
              style={{ width: 130, height: 150, borderRadius: 10 }}
            />

            <Text
              style={{
                marginTop: 10,
                fontSize: 16,
                fontWeight: "bold",
                color: "#333",
              }}
              numberOfLines={2}
            >
              {item.Name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#9e9e9eff",
                position: "absolute",
                bottom: 10,
                left: 10,
              }}
              numberOfLines={1}
            >
              {item.FirstName} {item.LastName}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
