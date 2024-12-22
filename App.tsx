import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  TextInput,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  addTodo,
  deleteTodo,
  getTodos,
  initDatabase,
  updateTodoStatus,
} from './src/databases/Sqlite';
import { Todo } from './src/types/types';
import TodoItem from './src/components/TodoItem';

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const result = await getTodos();
      setTodos(result);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul Belanja tidak boleh kosong');
      return;
    }

    try {
      await addTodo(title, description);
      loadTodos();
      setTitle('');
      setDescription('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding todo:', error);
      Alert.alert('Error', 'Gagal menambahkan tugas');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleToggleComplete = async (id: number, currentStatus: number) => {
    try {
      await updateTodoStatus(id, currentStatus === 0);
      loadTodos();
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.pexels.com/photos/14840129/pexels-photo-14840129.jpeg?auto=compress&cs=tinysrgb&w=600',
      }}
      style={styles.background}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Daftar Belanja ({todos.length})</Text>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Tidak ada Daftar Belanja</Text>
            <Text style={styles.emptySubtext}>
              Tambahkan Daftar Belanja baru dengan menekan tombol di bawah
            </Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TodoItem
                todo={item}
                onDelete={() => handleDeleteTodo(item.id)}
                onToggleComplete={() =>
                  handleToggleComplete(item.id, item.completed)
                }
              />
            )}
          />
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Tambah Daftar Belanja</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tambah Daftar Belanja</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>❌</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Judul</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={text => setTitle(text)}
            />
            <Text style={styles.inputLabel}>Deskripsi</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={text => setDescription(text)}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleAddTodo}>
              <Text style={styles.saveButtonText}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#46a858',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputLabel: {
    marginBottom: 8,
    color: '#6c757d',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
