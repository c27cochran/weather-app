import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './index.css';
import Weather from './components/Weather';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: 'rgba(18,76,124,0.42)',
    },
    secondary: {
      main: 'rgba(160, 23, 23, 0.87)',
    },
    link: {
      main: '#fff',
    },
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '"Jost"',
      '"Roboto"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 16,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
      <Weather />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
