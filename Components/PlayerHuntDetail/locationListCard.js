import React from 'react';
import {
    View,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Card, List } from 'react-native-paper';
import { themeColors } from '../../Styles/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LocationListCard = ({ locations, locationData, onPress, giveHint }) => {
    let distance = 4;
    const isNearby = (location) => {
        if (!locationData.coords) {
            return false;
        }

        const { longitude, latitude } = locationData.coords;

        if (
            longitude == null ||
            latitude == null ||
            location.longitude == null ||
            location.latitude == null
        ) {
            return false;
        }

        return (
            longitude.toFixed(distance) ===
                location.longitude.toFixed(distance) &&
            latitude.toFixed(distance) === location.latitude.toFixed(distance)
        );
    };

    return (
        <ScrollView style={styles.container}>
            {locations &&
                Array.isArray(locations) &&
                locations.length > 0 &&
                locations.map((location) => (
                    <View key={location.locationid}>
                        <List.Item
                            title={location.name}
                            titleStyle={{ color: themeColors.listTextColor }}
                            description={
                                location.completed ? location.clue : ''
                            }
                            descriptionStyle={{ color: 'gray' }}
                            left={(props) => (
                                <List.Icon
                                    {...props}
                                    icon='map-marker-radius'
                                    color={themeColors.listItemIconColor}
                                />
                            )}
                            right={(props) => (
                                <Icon
                                    {...props}
                                    name='circle'
                                    color={
                                        location.completed === false
                                            ? 'red'
                                            : 'green'
                                    }
                                    size={20}
                                />
                            )}
                            onPress={() =>
                                location.completed ? null : giveHint(location)
                            }
                            style={styles.listItem}
                        />

                        {isNearby(location) && !location.completed && (
                            <TouchableOpacity
                                onPress={() => onPress(location)}
                                style={styles.cardTouchable}>
                                <Image
                                    source={require('../../assets/checkIn.png')}
                                    style={styles.cardImage}
                                    resizeMode='cover'
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    listItem: {
        backgroundColor: themeColors.listBackgroundColor,
    },
    cardTouchable: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardImage: {
        width: '100%',
        height: 200,
    },
});

export default LocationListCard;
