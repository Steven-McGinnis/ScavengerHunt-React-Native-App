import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { styles } from '../../Styles/styles';
import { themeColors } from '../../Styles/constants';
import { useIntl } from 'react-intl';

const AbandonHuntCard = ({ onPress }) => {
    const intl = useIntl();
    return (
        <View>
            <Card
                style={{
                    backgroundColor: themeColors.conditionCardBackgroundColor,
                }}>
                <Card.Title
                    titleStyle={{ color: '#000', fontSize: 20 }}
                    title={intl.formatMessage({
                        id: 'abandonHuntCard.pressToAbandon',
                        defaultMessage: 'Press to Abandon Hunt',
                    })}
                />
                <Card.Content
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Button
                        mode={themeColors.buttonMode}
                        icon={'cancel'}
                        onPress={onPress}
                        style={styles.button}
                        buttonColor={themeColors.buttonColor}>
                        {intl.formatMessage({
                            id: 'abandonHuntCard.abandonHunt',
                            defaultMessage: 'Abandon Hunt',
                        })}
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

export default AbandonHuntCard;
