import { DefaultTheme } from 'react-native-paper';

export const customTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'green', // A shade of green, but you can choose whatever shade you prefer.
        accent: 'green', // Black
        text: 'green', // If you want the general text to be black
    },
};
