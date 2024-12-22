import SQLite from 'react-native-sqlite-storage';
import {Todo} from '../types/types';

const db = SQLite.openDatabase(
  {
    name: 'todoapp.db',
    location: 'default',
  },
  () => {
    console.log('Database opened successfully');
  },
  error => {
    console.error('Error opening database: ', error);
  },
);

export const initDatabase = () => {
  db.transaction(
    tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, completed INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
        [],
        () => {
          console.log('Table created successfully');
        },
        (tx, error) => {
          console.error('Error creating table: ', error);
        },
      );
    },
    error => {
      console.error('Transaction error: ', error);
    },
    () => {
      console.log('Transaction successful');
    },
  );
};

export const addTodo = (title: string, description: string) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO todos (title, description) VALUES (?, ?)',
        [title, description],
        (_, {insertId}) => resolve(insertId as number),
        (_, error) => reject(error),
      );
    });
  });
};

export const getTodos = () => {
  return new Promise<Todo[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM todos ORDER BY created_at DESC',
        [],
        (_, {rows}) => resolve(rows.raw()),
        (_, error) => reject(error),
      );
    });
  });
};

export const updateTodoStatus = (id: number, completed: boolean) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [completed ? 1 : 0, id],
        () => resolve(),
        (_, error) => reject(error),
      );
    });
  });
};

export const deleteTodo = (id: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM todos WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => reject(error),
      );
    });
  });
};
