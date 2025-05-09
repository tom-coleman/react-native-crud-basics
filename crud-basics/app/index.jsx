import { Text, View, TextInput, Pressable, StyleSheet, Appearance, FlatList } from "react-native";
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { data } from "@/data/todos";

export default function Index() {
  // Set the color scheme based on the device settings
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const styles = createStyles(theme, colorScheme);

  // State to manage the todos
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id))
  const [text, setText] = useState("")
  
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

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text 
        style={[styles.todoText, item.completed && styles.completedText]} 
        onPress={() => toggleTodo(item.id)}>
          {item.title}
      </Text>
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
          placeholder="Add a new todo"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1, padding: 10 }}

      />
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
      minWidth: 0,
    },
    addButton: {
      backgroundColor: colorScheme === "dark" ? Colors.light.background : Colors.dark.background,
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    addButtonText: {
      color: colorScheme === "dark" ? Colors.light.text : Colors.dark.text,
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
      flex: 1,
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "gray",
    },
  })
}