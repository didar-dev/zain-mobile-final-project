import { useStore } from "@/store/auth";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { Link, router, Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function _layout() {
  const { profile }: any = useStore();
  const LogOutHandler = async () => {
    await SecureStore.deleteItemAsync("token");
    router.replace("/login");
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarLabel: "Home",
          headerLeft() {
            return (
              <View
                style={{
                  flexDirection: "column",
                  gap: 2,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                  }}
                >
                  Welcome
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {profile?.id ? profile?.FirstName : "Guest"}
                </Text>
              </View>
            );
          },
          headerRight() {
            return (
              <View
                style={{
                  gap: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Pressable
                  onPress={() => router.push("/(standalone)/CreateBook")}
                >
                  <Feather name="plus" size={24} color="black" />
                </Pressable>
                {profile?.id ? (
                  <Pressable
                    style={{
                      backgroundColor: "black",
                      padding: 5,
                      borderRadius: 5,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={LogOutHandler}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      Log Out
                    </Text>
                  </Pressable>
                ) : (
                  <Link
                    href="/(auth)/login"
                    style={{
                      backgroundColor: "black",
                      padding: 10,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                    }}
                  >
                    Login
                  </Link>
                )}
              </View>
            );
          },
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Your Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="person-outline"
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
