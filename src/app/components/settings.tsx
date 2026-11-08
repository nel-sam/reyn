import { Stack } from "expo-router";
import { useState } from "react";
import { useDenomination } from "../_layout";
import { View, Text, Pressable } from "react-native";

export default function Settings() {
  const { denomination, setDenomination } = useDenomination();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Settings'
        }}
      />
      <View className="p-10 pt-30">
        <Text className="text-lg font-bold mb-4">Currency</Text>

        <View className="gap-3">
          <Pressable
            onPress={() => setDenomination("$1")}
            className="flex-row items-center p-4 border border-gray-300 rounded-lg active:bg-gray-100"
          >
            <View className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
              {denomination === "$1" && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </View>
            <Text className="text-base">$1 Bills</Text>
          </Pressable>

          <Pressable
            onPress={() => setDenomination("$100")}
            className="flex-row items-center p-4 border border-gray-300 rounded-lg active:bg-gray-100"
          >
            <View className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
              {denomination === "$100" && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </View>
            <Text className="text-base">$100 Bills</Text>
          </Pressable>

          <Pressable
            onPress={() => setDenomination("10€")}
            className="flex-row items-center p-4 border border-gray-300 rounded-lg active:bg-gray-100"
          >
            <View className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
              {denomination === "10€" && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </View>
            <Text className="text-base">10€ Bills</Text>
          </Pressable>

          <Pressable
            onPress={() => setDenomination("100€")}
            className="flex-row items-center p-4 border border-gray-300 rounded-lg active:bg-gray-100"
          >
            <View className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
              {denomination === "100€" && (
                <View className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              )}
            </View>
            <Text className="text-base">100€ Bills</Text>
          </Pressable>
        </View>
      </View>
    </>);
}