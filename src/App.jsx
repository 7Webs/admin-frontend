import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './theme/theme';

import { AllProviders } from './utils/contexts/AllContext';
import { routes } from './utils/routes';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AllProviders>
        <Routes>
          {routes.public.map((route) => (
            <Route key={route.path} {...route} />
          ))}
          {routes.protected.map((route) => (
            <Route key={route.path || 'protected'} {...route}>
              {route.children?.map((childRoute) => (
                <Route key={childRoute.path} {...childRoute} />
              ))}
            </Route>
          ))}
        </Routes>
      </AllProviders>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
      />
    </ThemeProvider >
  );
}

export default App;
