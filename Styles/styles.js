import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#444654',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        paddingTop: 10,
        paddingBottom: 10,
    },
    navigation: {
        position: 'absolute', // Added this line
        bottom: 0, // Added this line
        width: '100%',
    },
    splash: {
        flex: 1,
        backgroundColor: '#444654',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    card: {
        height: '100%',
    },
    spacer: {
        height: 30,
    },
    spacer2: {
        height: 20,
    },
    spacer3: {
        height: 5,
    },
    input: {
        marginBottom: 10,
    },
    mainContainer: {
        flex: 1, // Take up the full height
        flexDirection: 'column', // Stack children vertically
    },
});
