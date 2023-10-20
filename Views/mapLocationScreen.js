import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../Styles/styles';
import useLocationTracking from '../Helper/useLocationTracking';

// Version 1.0.0
const MapLocationScreen = ({ route }) => {
    const {
        location,
        locationName,
        huntid,
        currentLatitude,
        currentLongitude,
    } = route.params;

    const [region, setRegion] = useState({
        latitude: currentLatitude,
        longitude: currentLongitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const { locationData, startTracking, stopTracking } = useLocationTracking();

    useEffect(() => {
        if (locationData) {
            setRegion({
                latitude: locationData.coords.latitude,
                longitude: locationData.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    }, [locationData]);

    return (
        <View style={styles.container}>
            <MapView
                style={{ width: '100%', height: '100%' }}
                initialRegion={region}
                onRegionChangeComplete={setRegion}>
                <Marker
                    coordinate={{
                        latitude: currentLatitude,
                        longitude: currentLongitude,
                    }}
                    title={locationName}
                    description={`Latitude: ${currentLatitude}, Longitude: ${currentLongitude}`}
                    pinColor='blue'
                />

                {locationData && (
                    <Marker
                        coordinate={{
                            latitude: locationData.coords.latitude,
                            longitude: locationData.coords.longitude,
                        }}
                        title='You'
                        description={`Latitude: ${locationData.coords.latitude}, Longitude: ${locationData.coords.longitude}`}
                        pinColor='red'
                    />
                )}
            </MapView>
        </View>
    );
};

export default MapLocationScreen;
