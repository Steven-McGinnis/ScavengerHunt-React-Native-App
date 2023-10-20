// encyptionKey.js
import { useState, useEffect } from 'react';

// Version 1.0.0
const generateEncryptionKey = (location) => {
    // Generate encryption key based on location

    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;

    const roundedLatitude = parseFloat(latitude.toFixed(4));
    const roundedLongitude = parseFloat(longitude.toFixed(4));
    const locationString =
        roundedLatitude.toString() + roundedLongitude.toString();

    let hash = 0;
    for (let i = 0; i < locationString.length; i++) {
        const char = locationString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }

    const encryptionKey = Math.abs(hash % 25) + 1;

    return encryptionKey;
};

export default generateEncryptionKey;
