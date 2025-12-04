import { createTheme, alpha } from '@mui/material/styles';

// PowerFlow Studio Inspired Palette
const PRIMARY_MAIN = '#3B82F6'; // Vibrant Blue
const SECONDARY_MAIN = '#8B5CF6'; // Violet/Purple accent
const BACKGROUND_DEFAULT = '#0B0F19'; // Deep Space Black/Blue
const BACKGROUND_PAPER = '#111827'; // Slightly lighter for cards

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    primary: {
      main: PRIMARY_MAIN,
      light: '#60A5FA',
      dark: '#2563EB',
      contrastText: '#ffffff',
    },
    secondary: {
      main: SECONDARY_MAIN,
      light: '#A78BFA',
      dark: '#7C3AED',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Tajawal", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BACKGROUND_DEFAULT,
          scrollbarColor: '#374151 #111827',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#374151',
            minHeight: 24,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: alpha(BACKGROUND_PAPER, 0.8), // Glass-like base
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)',
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${PRIMARY_MAIN} 0%, ${SECONDARY_MAIN} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${PRIMARY_MAIN} 20%, ${SECONDARY_MAIN} 120%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${alpha(PRIMARY_MAIN, 0.3)}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        head: {
          fontWeight: 600,
          color: alpha('#fff', 0.7),
          backgroundColor: alpha(BACKGROUND_PAPER, 0.5),
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(BACKGROUND_DEFAULT, 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: BACKGROUND_DEFAULT,
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
});