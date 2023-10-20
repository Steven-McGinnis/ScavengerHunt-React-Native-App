import React, { useState } from 'react';
import { FAB } from 'react-native-paper';

// Version 1.0.0
// Assuming themeColors is imported or defined elsewhere
import { themeColors } from '../Styles/constants';

const CustomFABGroup = ({ actions }) => {
    const [open, setOpen] = useState(false);

    const fabStyles = {
        backgroundColor: themeColors.fabBackGroundColor,
    };

    const iconColor = themeColors.fabColor;

    return (
        <FAB.Group
            open={open}
            icon={open ? 'close' : 'plus'}
            actions={actions}
            onStateChange={({ open }) => setOpen(open)}
            fabStyle={fabStyles}
            color={iconColor}
        />
    );
};

export default CustomFABGroup;
