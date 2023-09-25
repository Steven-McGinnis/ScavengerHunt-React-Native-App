import React, { Component } from "react";
import { View, Text } from "react-native";
import { styles } from "../Styles/styles";
import { FormattedMessage } from "react-intl"; // Import the FormattedMessage component

class InitializeScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          <FormattedMessage
            id='initializeScreen.welcome'
            defaultMessage='Welcome to the App!'
          />
        </Text>
      </View>
    );
  }
}

export default InitializeScreen;
