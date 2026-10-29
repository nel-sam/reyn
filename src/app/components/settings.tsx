import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function Settings() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Settings'
        }}
      />
      <View className={'w-full h-full flex justify-center items-center'}>
        <Text>
          Settings Page
        </Text>
      </View>
    </>);
}