import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, IconButton } from 'react-native-paper';

// Version 1.0.0
const HuntDetailCard = ({ title, huntid, completed }) => {
    return (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.leftContent}>
                    <Text style={styles.titleStyle}>{title}</Text>
                    <IconButton
                        icon='magnify'
                        color='#000'
                        size={20}
                    />
                </View>
                <View style={styles.rightContent}>
                    <Text style={styles.smallText}>Completion</Text>
                    <Text style={styles.percentageText}>{completed}%</Text>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fed47d',
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    titleStyle: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 10,
        flexWrap: 'wrap',
        flex: 1,
    },
    rightContent: {
        alignItems: 'center',
    },
    smallText: {
        fontSize: 12,
        color: '#000',
    },
    percentageText: {
        fontSize: 20,
        color: '#000',
    },
});

export default HuntDetailCard;
