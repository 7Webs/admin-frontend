import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3D5A80',
      light: '#98C1D9',
      dark: '#2B4057',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#98C1D9',
      light: '#E0FBFC',
      dark: '#7BA7BF',
      contrastText: '#000000',
    },
    background: {
      default: '#F5F8FA',
      paper: '#FFFFFF',
      light: '#E0FBFC',
    },
    text: {
      primary: '#2B4057',
      secondary: '#5C7A99',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#3D5A80',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#3D5A80',
          '&:hover': {
            backgroundColor: '#2B4057',
          },
        },
        containedSecondary: {
          backgroundColor: '#98C1D9',
          '&:hover': {
            backgroundColor: '#7BA7BF',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
  },
});

export default theme;
