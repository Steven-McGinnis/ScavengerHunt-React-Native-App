import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../../Styles/styles';
import { themeColors } from '../../Styles/constants';
import { Card } from 'react-native-paper';

const HuntDetailCard = ({ title, huntid, completed }) => {
    return (
        <>
            <Card style={{ backgroundColor: '#fed47d', marginBottom: 10 }}>
                <Card.Title
                    titleStyle={{ color: '#000' }}
                    title={title}
                />
                <Card.Content>
                    <Text style={styles.huntid}>Hunt ID: {huntid}</Text>
                    <Text style={styles.completed}>
                        Percentage Completed: {completed}%
                    </Text>
                </Card.Content>
            </Card>
        </>
    );
};

export default HuntDetailCard;
