import {View, Text, TextInput} from 'react-native'
import {CustomInputProps} from "@/type";
import {useState, useCallback} from "react";
import cn from "clsx";

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default"
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    return (
        <View className="w-full">
            <Text className="label">{label}</Text>

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                placeholderTextColor="#9DA3AF"
                returnKeyType="next"
                blurOnSubmit={false}
                className={cn('input', isFocused ? 'border-primary shadow-md shadow-primary/20 bg-white' : 'border-gray-300')}
            />
        </View>
    )
}
export default CustomInput
