import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCategories } from "../../store/categories";

interface FormData {
  name: string;
  description: string;
  category_id: number | null;
  image: string | null;
}

export default function CreateBook() {
  //// get categories from the zustand store
  const { categories }: any = useCategories();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      category_id: null,
      image: null,
    },
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission required",
        "Permission to access camera roll is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
      if (hasSubmitted) {
        clearErrors("image");
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setHasSubmitted(true);

    // Check for validation errors
    if (
      !data.name ||
      !data.description ||
      !selectedCategory ||
      !selectedImage
    ) {
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("token");

      const formData = new FormData();
      formData.append("Name", data?.name);
      formData.append("Description", data?.description);
      formData.append("category_id", selectedCategory?.toString() || "");

      if (selectedImage) {
        formData.append("Image", {
          uri: selectedImage,
          type: "image/jpeg",
          name: "image.jpg",
        } as any);
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/books/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data_response = await response.json();

      if (data_response?.success) {
        Alert.alert("Success", "Book created successfully!");
        // Reset form
        setSelectedImage(null);
        setSelectedCategory(null);
        setHasSubmitted(false);
        setValue("name", "");
        setValue("description", "");
        setValue("category_id", null);
        setValue("image", null);
      } else {
        Alert.alert("Error", "Failed to create book");
      }
    } catch (error) {
      console.error("Error creating book:", error);
      Alert.alert("Error", "An error occurred while creating the book");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Name Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name *</Text>
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters long",
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                if (hasSubmitted) {
                  clearErrors("name");
                }
              }}
              placeholder="Enter book name"
            />
          )}
        />
        {errors.name && (
          <Text style={styles.errorText}>{errors.name.message}</Text>
        )}
      </View>

      {/* Description Field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Description *</Text>
        <Controller
          control={control}
          name="description"
          rules={{ required: "Description is required" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={value}
              onChangeText={(text) => {
                onChange(text);
                if (hasSubmitted) {
                  clearErrors("description");
                }
              }}
              placeholder="Enter book description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          )}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description.message}</Text>
        )}
      </View>

      {/* Category Selection */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Category *</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories?.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.selectedCategoryChip,
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                setValue("category_id", category.id);
                if (hasSubmitted) {
                  clearErrors("category_id");
                }
              }}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.id &&
                    styles.selectedCategoryChipText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {hasSubmitted && !selectedCategory && (
          <Text style={styles.errorText}>Please select a category</Text>
        )}
      </View>

      {/* Image Upload */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Image *</Text>
        <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={styles.selectedImage}
            />
          ) : (
            <Text style={styles.uploadButtonText}>Select Image</Text>
          )}
        </TouchableOpacity>
        {hasSubmitted && !selectedImage && (
          <Text style={styles.errorText}>Please select an image</Text>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.submitButtonText}>Create Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryChip: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCategoryChip: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  categoryChipText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryChipText: {
    color: "#fff",
  },
  imageUploadButton: {
    borderWidth: 2,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    minHeight: 120,
  },
  uploadButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
  },
  selectedImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    objectFit: "contain",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 14,
    marginTop: 4,
  },
});
