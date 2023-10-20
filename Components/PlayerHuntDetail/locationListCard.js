import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { List, Paragraph, Button } from 'react-native-paper';
import { themeColors } from '../../Styles/constants';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDistance } from 'geolib';
import { Dialog, Portal } from 'react-native-paper';
import { useState } from 'react';

// Version 1.0.0
// Utility function to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    return getDistance(
        { latitude: lat1, longitude: lon1 },
        { latitude: lat2, longitude: lon2 }
    );
};

const LocationListCard = ({ locations, locationData, onPress }) => {
    const [visible, setVisible] = useState(false);
    const [dialogContent, setDialogContent] = useState('');

    const showDialog = (title, clue) => {
        setDialogContent({ title, clue });
        setVisible(true);
    };

    const hideDialog = () => setVisible(false);

    const getIconColor = (distance) => {
        if (distance === null) return 'gray';
        if (distance <= 10) return 'green';
        if (distance <= 20) return 'yellow';
        if (distance <= 30) return 'orange';
        if (distance <= 40) return 'purple';
        if (distance <= 50) return 'red';
        return 'gray';
    };

    return (
        <View style={styles.container}>
            <Portal>
                <Dialog
                    visible={visible}
                    onDismiss={hideDialog}
                    style={styles.dialog}>
                    <Dialog.Title style={styles.dialogTitle}>
                        {dialogContent.title}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph style={styles.dialogContent}>
                            {dialogContent.clue}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog}>Done</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <ScrollView>
                {locations &&
                Array.isArray(locations) &&
                locations.length > 0 ? (
                    locations.map((location) => {
                        let distance = null;

                        if (
                            locationData &&
                            locationData.coords &&
                            location &&
                            location.latitude &&
                            location.longitude
                        ) {
                            distance = calculateDistance(
                                locationData.coords.latitude,
                                locationData.coords.longitude,
                                location.latitude,
                                location.longitude
                            );
                        }

                        return (
                            <View key={location.locationid}>
                                <List.Item
                                    title={
                                        location.name ||
                                        'Location name not available'
                                    }
                                    titleStyle={{
                                        color: themeColors.listTextColor,
                                    }}
                                    description={
                                        location.completed
                                            ? location.description
                                            : location.clue ||
                                              'Clue not available'
                                    }
                                    descriptionStyle={{ color: 'gray' }}
                                    left={(props) =>
                                        location.completed ? (
                                            <Image
                                                {...props}
                                                source={require('../../assets/completionBadge.png')}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    marginLeft: 12,
                                                }}
                                            />
                                        ) : (
                                            <List.Icon
                                                {...props}
                                                icon='map-marker-radius'
                                                color={
                                                    themeColors.listItemIconColor
                                                }
                                            />
                                        )
                                    }
                                    right={(props) => {
                                        const color = getIconColor(distance);
                                        return location.completed ? null : (
                                            <Icon
                                                {...props}
                                                name='circle'
                                                color={color}
                                                size={20}
                                            />
                                        );
                                    }}
                                    onPress={() => {
                                        if (
                                            location.completed ||
                                            getIconColor(distance) === 'green'
                                        ) {
                                            onPress(location);
                                        } else {
                                            showDialog(
                                                location.name,
                                                location.clue ||
                                                    'Clue not available'
                                            );
                                        }
                                    }}
                                    style={styles.listItem}
                                />
                            </View>
                        );
                    })
                ) : (
                    <View style={{ padding: 20 }}>
                        <Paragraph style={{ color: 'gray' }}>
                            No locations available.
                        </Paragraph>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    dialog: {
        backgroundColor: '#333',
    },
    dialogTitle: {
        color: '#fff',
    },
    dialogContent: {
        color: '#ccc',
    },
    listItem: {
        backgroundColor: themeColors.listBackgroundColor,
    },
});

export default LocationListCard;
