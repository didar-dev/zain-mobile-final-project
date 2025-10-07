import { useBooks } from "@/store/books";
import { useCategories } from "@/store/categories";
import { userefresh } from "@/store/refresh";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useStore } from "../store/auth";

SplashScreen.preventAutoHideAsync(); /// prevent auto hide of splash screen
export default function RootLayout() {
  const { setIsLoggedIn, setProfile }: any = useStore();
  const { setCategories }: any = useCategories();
  const { setRecentBooksLoading, setRecentBooks }: any = useBooks();
  const { HP_refresher }: any = userefresh();
  const checkauth = async () => {
    SplashScreen.hideAsync();
    try {
      const token = await SecureStore.getItemAsync("token");
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data?.success) {
        if (data?.data?.id) {
          setIsLoggedIn(true);
          setProfile(data?.data);
          SplashScreen.hideAsync();
        }
        SplashScreen.hideAsync();
      }
      SplashScreen.hideAsync();
    } catch (error) {
      console.log(error);
      SplashScreen.hideAsync();
    } finally {
      SplashScreen.hideAsync();
    }
  };
  const FetchGategories = async () => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {}
  };
  const FetchRecentBooks = async () => {
    setRecentBooksLoading(true);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/books/recent`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data?.success) {
        setRecentBooks(data?.data);
        setRecentBooksLoading(false);
      }
    } catch (error) {
      console.log(error);
      setRecentBooksLoading(false);
    } finally {
      setRecentBooksLoading(false);
    }
  };
  useEffect(() => {
    checkauth();
    FetchGategories();
  }, []);
  useEffect(() => {
    FetchRecentBooks();
  }, [HP_refresher]);
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerBackButtonMenuEnabled: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)/login"
        options={{ headerShown: true, headerTitle: "Login" }}
      />
      <Stack.Screen
        name="(auth)/register"
        options={{ headerShown: true, headerTitle: "Register" }}
      />
      <Stack.Screen
        name="(standalone)/CreateBook"
        options={{ headerTitle: "Create Book" }}
      />
      <Stack.Screen
        name="(standalone)/books/edit/index"
        options={{ headerTitle: "Edit Book" }}
      />
    </Stack>
  );
}
