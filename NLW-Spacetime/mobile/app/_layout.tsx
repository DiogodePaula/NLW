import { styled } from "nativewind";
import { ImageBackground } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import blurBg from "../src/assets/bg-blur.png";
import Stripes from "../src/assets/stripes.svg";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

const StyledStripes = styled(Stripes); // para poder permitir estilização com tailwind

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<null | boolean>(null);

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsUserAuthenticated(!!token);
    });
  }, []);

  if (!hasLoadedFonts) return <SplashScreen />; // deixa a tela carregando ate as fonts serem carregadas

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />
      {/*Stack animação de slide na troca de paginas */}
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          // animation: "fade",
        }}
      >
        {/* redirect vai redirecionar para proxima rota caso isUserAuthenticated seja true */}
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  );
}
