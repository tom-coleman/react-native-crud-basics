import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";

import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
    const router = useRouter()

    const [loaded, error] = useFonts({
        Inter_500Medium,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("ToDoApp");
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
                
                if (storageTodos && storageTodos.length > 0) {
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id);
                    setTodo(myTodo)
                }
                
            } catch (e) {
                console.error(e)
            }
        }

        fetchData()
    }, [])

    if (!loaded && !error) {
        return null; // or a loading indicator
    }

    const styles = createStyles(theme, colorScheme)

    const handleSave = async () => {
        try {
            const savedTodo = { ...todo, title: todo.title }

            const jsonValue = await AsyncStorage.getItem("ToDoApp")
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            // Add the new todo to the list, or save first todo 
            if (storageTodos && storageTodos.length > 0) {
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id)
                const allTodos = [...otherTodos, savedTodo]
                await AsyncStorage.setItem('ToDoApp', JSON.stringify(allTodos))
            } else {
                // Sets first item if stored Todos don't exist yet
                await AsyncStorage.setItem('ToDoApp', JSON.stringify([savedTodo]))
            }
            
            router.push('/')
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    maxLength={30}
                    placeholder="Edit todo"
                    placeholderTextColor='gray'
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo(prev => ({ ...prev, title: text }) )}
                />
                <Pressable onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")} style={{ marginLeft: 10 }}>
                    <Ionicons 
                    name={colorScheme === "dark" ? "sunny" : "moon"} 
                    size={36} 
                    color={colorScheme === "dark" ? "white" : "black"} 
                    style={{width: 36}}
                    />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable 
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable 
                    style={[styles.saveButton, {backgroundColor: 'red'}]}
                    onPress={() => router.push('/')}
                >
                    <Text style={[styles.saveButtonText, {color: 'white'}]}>Cancel</Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark' } />
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.background
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            gap: 6,
            width: '100%',
            maxWidth: 1024,
            marginHorizontal: 'auto',
            pointerEvents: 'auto'
        },
        input: {
            flex: 1,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            fontSize: 18,
            fontFamily: 'Inter_500Medium',
            minWidth: 0,
            color: theme.text
        },
        saveButton: {
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10,
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme ===  'dark' ? 'black' : 'white'
        }
    })
}