import { View, Pressable, Text } from "react-native";

interface AppButtonProps {
  text: string;
  onPress: () => void;
}

export default function AppButton(props: AppButtonProps) {
  return (<View className={'absolute bottom-10 w-full flex flex-row justify-center'}>
    <Pressable className={'w-40 h-10 bg-blue-500 flex flex-row justify-center items-center rounded-2xl'} onPress={props.onPress}>
      <Text className={'text-white text-center'}>{props.text}</Text>
    </Pressable>
  </View>);
}