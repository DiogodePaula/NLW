import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";

import { api } from "../src/lib/api";
import NlwLogo from "../src/assets/nlw-spacetime-logo.svg";

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets(); //retorna o valor de padding para o conteudo ficar na parte segura da tela
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  async function openIMagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
    }

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri);
    // }
  }

  async function handleCreateMemory() {
    // await SecureStore.deleteItemAsync("token");
    // return;
    const token = await SecureStore.getItemAsync("token");

    let coverUrl = "";

    if (preview) {
      const uploadFormData = new FormData(); // para enviar um multipart/form data

      uploadFormData.append("file", {
        name: "image/jpg",
        type: "image/jpeg",
      } as any);

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      coverUrl = uploadResponse.data.fileUrl;
    }
    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/memories");
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NlwLogo />

        {/* asChild vai fazer o TouchableOpacity se comportar como Link */}
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
            trackColor={{ false: "#767577", true: "#372560" }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memoria publica
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openIMagePicker}
          className="h-32 items-center justify-center rounded-lg border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou video de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiencia que voce quer lembrar para sempre"
        />
        <TouchableOpacity
          onPress={handleCreateMemory}
          activeOpacity={0.7}
          className="items-center rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
