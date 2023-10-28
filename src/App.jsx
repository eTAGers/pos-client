import React from "react";
import { useRoutes } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import routes from "./routes";
import {
  createStore, applyMiddleware
} from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { ConfirmProvider } from "material-ui-confirm";
import GlobalStyles from "./components/views/common/GlobalStyle";
import rootReducer from './components/Redux';

const store = createStore(rootReducer, applyMiddleware(thunk));

function App() {
  const routing = useRoutes(routes);
  return (
    <SnackbarProvider>
      <ConfirmProvider
        defaultOptions={{
          confirmationText: "Yes",
          cancellationText: "No",
          title: "Are you sure ?",
        }}>
        <GlobalStyles />
        <Provider store={store}>
        {routing}
        </Provider>
      </ConfirmProvider>
    </SnackbarProvider>
  );
}

export default App;
