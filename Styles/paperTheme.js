import { DefaultTheme } from 'react-native-paper';

export const customTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		primary: '#00FF00', // A shade of green, but you can choose whatever shade you prefer.
		accent: '#000000', // Black
		text: '#000000', // If you want the general text to be black
	},
};
