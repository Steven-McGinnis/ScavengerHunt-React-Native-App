// useLocationTracking.js
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

// Version 1.0.0
const useLocationTracking = () => {
    const [locationData, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [subscription, setSubscription] = useState(null);

    const startTracking = async () => {
        const result = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 3,
            },
            (newLocation) => {
                setLocation(newLocation);
            }
        );
        setSubscription(result);
    };

    const stopTracking = async () => {
        if (!subscription) {
            return;
        }
        await subscription.remove();
        setSubscription(null);
    };

    const getLocationOnce = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        const newLocation = await Location.getCurrentPositionAsync({});
        setLocation(newLocation);
    };

    useEffect(() => {
        (async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            startTracking();
        })();
        return () => {
            stopTracking();
        };
    }, []);

    return {
        locationData,
        subscription,
        startTracking,
        stopTracking,
        getLocationOnce,
    };
};

export default useLocationTracking;
