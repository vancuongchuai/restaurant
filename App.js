import React, { Component } from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/ConfigureStore';
import { PersistGate } from 'redux-persist/es/integration/react';
import { LogBox } from 'react-native';

const { persistor, store } = ConfigureStore();

// Tắt toàn bộ warning/error của LogBox
LogBox.ignoreAllLogs();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
