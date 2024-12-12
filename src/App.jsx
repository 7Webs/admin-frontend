import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Theme
import theme from './theme/theme';

import { AllProviders } from './utils/contexts/AllContext';
import { routes } from './utils/routes';

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

    </ThemeProvider>
  );
}

export default App;
