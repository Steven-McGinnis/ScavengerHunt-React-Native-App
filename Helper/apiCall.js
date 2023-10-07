import { BASE_API_URL } from '@env';

const apiCall = async ({
    endpointSuffix,
    data = {},
    onSuccessMessageId = null,
    onFailureMessageId = null,
    intl,
    debug = false,
}) => {
    let formData = new FormData();
    for (let key in data) {
        formData.append(key, data[key]);
    }

    try {
        if (debug) {
            console.log('API call to ' + BASE_API_URL + endpointSuffix);
            console.log('FormData', formData);
        }
        const response = await fetch(BASE_API_URL + endpointSuffix, {
            method: 'POST',
            body: formData,
        });

        const responseData = await response.json();

        if (debug) {
            console.log('Json', responseData);
        }

        if (responseData.status === 'okay') {
            console.log('API call successful!', responseData);
            const successMessage = onSuccessMessageId
                ? intl.formatMessage({
                      id: onSuccessMessageId,
                      defaultMessage: 'Operation successful!',
                  })
                : null;
            return {
                success: true,
                data: responseData,
                message: successMessage,
            };
        } else if (responseData.status === 'error') {
            if (debug) {
                console.log('Response', responseData.error);
            }
            const errorMessage = responseData.error[0];
            return {
                success: false,
                error: errorMessage,
                message: errorMessage,
            };
        }
    } catch (error) {
        console.error('Network or other error:', error);
        const failureMessage = intl.formatMessage({
            id: onFailureMessageId || 'networkError',
            defaultMessage: 'Network or other error',
        });
        return {
            success: false,
            error: error.message,
            message: failureMessage,
        };
    }
};

export default apiCall;
