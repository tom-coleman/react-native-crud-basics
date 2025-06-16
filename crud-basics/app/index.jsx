import { Text, View, TextInput, Pressable, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";

import { data } from "@/data/todos";

export default function Index() {
  // State to manage the todos
  const [todos, setTodos] = useState([])
  const [text, setText] = useState("")
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)
  const router = useRouter()

  const [loaded, error] = useFonts({
    Inter_500Medium,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("ToDoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : [];

        // If there are todos in storage, set them to the state
        if (storageTodos && storageTodos.length > 0) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id));
        } else {
          // If no todos in storage, set the initial data
          setTodos(data.sort((a, b) => b.id - a.id));
        }
      } catch (e) {
        console.error("Failed to load todos from storage", e);
      }
    }

    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("ToDoApp", jsonValue);
      } catch (e) {
        console.error("Failed to save todos to storage", e);
      }
    }

    // Store the todos whenever they change
    storeData();
  }, [todos])

  // Check if the fonts are loaded
  if (!loaded && !error) {
    return null
  }
  // Create styles based on the theme and color scheme
  const styles = createStyles(theme, colorScheme)
  
  // Function to add a new todo
  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{ id: newId, title: text, completed: false }, ...todos]);
      setText("");
    }
  }

  // If the id matches, it will toggle the completed property
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo));
  }

  // Keeps all the todos that don't match the id
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  // Redirects to the todo details page when a todo is pressed
  const handlePress = (id) => {
    router.push(`/todos/${id}`);
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Pressable 
        onPress={() => handlePress(item.id)}
        onLongPress={() => toggleTodo(item.id)}
      >
        <Text style={[styles.todoText, item.completed && styles.completedText]} >
            {item.title}
        </Text>
      </Pressable>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialIcons name="delete" size={24} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          maxLength={30}
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
        <Pressable onPress={() => setColorScheme(colorScheme === "dark" ? "light" : "dark")} style={{ marginLeft: 10 }}>
            <Ionicons 
              name={colorScheme === "dark" ? "sunny" : "moon"} 
              size={36} 
              color={colorScheme === "dark" ? "white" : "black"} 
              style={{width: 36}}
            />
        </Pressable>
      </View>
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1, padding: 10 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode={"on-drag"}
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} translucent={false} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: theme.background,
      borderRadius: 5,
      marginBottom: 10,
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
      pointerEvents: 'auto'
    },
    input: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.background,
      borderRadius: 5,
      color: theme.text,
      borderColor: "gray",
      borderWidth: 1,
      marginRight: 10,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
    },
    addButton: {
      backgroundColor: theme.button,
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    addButtonText: {
      color: colorScheme === "dark" ? 'black' : 'white',
      fontWeight: "bold",
      fontSize: 18,
      flex: 1,
      textAlign: "center",
      justifyContent: "center",
    },
    todoItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      backgroundColor: theme.background,
      borderRadius: 5,
      marginBottom: 10,
      borderColor: "gray",
      borderWidth: 1,
      gap: 4,
      pointerEvents: 'auto',
      width: "100%",
      maxWidth: 1024,
      marginHorizontal: "auto",
    },
    todoText: {
      color: theme.text,
      fontSize: 16,
      fontFamily: "Inter_500Medium",
      flex: 1,
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  })
}