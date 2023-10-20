import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

// Version 1.0.0
const Compass = () => {
    const [heading, setHeading] = useState(0);
    const [direction, setDirection] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }

            Location.watchHeadingAsync((newHeading) => {
                setHeading(newHeading.trueHeading);
                setDirection(getDirection(newHeading.trueHeading));
            });
        })();
    }, []);

    const getDirection = (heading) => {
        const directions = [
            'N',
            'NNE',
            'NE',
            'ENE',
            'E',
            'ESE',
            'SE',
            'SSE',
            'S',
            'SSW',
            'SW',
            'WSW',
            'W',
            'WNW',
            'NW',
            'NNW',
        ];
        const index = Math.round(heading / 22.5);
        return directions[index % 16];
    };

    return (
        <View style={styles.card}>
            <View style={styles.compassContainer}>
                <View style={styles.compassPointer}>
                    <Text style={styles.directionText}>{direction}</Text>
                </View>

                <Text style={styles.headingText}>{heading.toFixed(0)}°</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E97451',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5, // for Android
        shadowColor: '#000', // for iOS
        shadowOffset: { width: 0, height: 2 }, // for iOS
        shadowOpacity: 0.3, // for iOS
        shadowRadius: 5, // for iOS
    },
    compassContainer: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    compassPointer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    },
    headingText: {
        position: 'absolute',
        bottom: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Compass;
