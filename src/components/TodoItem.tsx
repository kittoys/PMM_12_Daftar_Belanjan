import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Todo} from '../types/types';

type TodoItemProps = {
  todo: Todo;
  onDelete: () => void;
  onToggleComplete: () => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.todoContent} onPress={onToggleComplete}>
        <View
          style={[
            styles.checkbox,
            {backgroundColor: todo.completed === 1 ? '#28a745' : 'white'},
          ]}
        />
        <View>
          <Text
            style={[
              styles.title,
              todo.completed === 1 && styles.completedTitle,
            ]}>
            {todo.title}
          </Text>
          {todo.description ? (
            <Text style={styles.description}>{todo.description}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Hapus</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#28a745',
    marginRight: 12,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  description: {
    color: '#6c757d',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TodoItem;
