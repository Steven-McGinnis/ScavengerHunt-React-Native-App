import { BASE_API_URL } from '@env';

const apiCall = async ({
	endpointSuffix,
	data = {},
	onSuccessMessageId,
	onFailureMessageId,
	intl,
}) => {
	let formData = new FormData();
	for (let key in data) {
		formData.append(key, data[key]);
	}

	try {
		const response = await fetch(BASE_API_URL + endpointSuffix, {
			method: 'POST',
			body: formData,
		});

		const responseData = await response.json();

		if (responseData.status === 'okay') {
			// console.log('API call successful!', responseData);
			const successMessage = onSuccessMessageId
				? intl.formatMessage({
						id: onSuccessMessageId,
						defaultMessage: 'Operation successful!',
				  })
				: null;
			return { success: true, data: responseData, message: successMessage };
		} else if (responseData.status === 'error') {
			const errorMessage = responseData.error[0];
			return { success: false, error: errorMessage, message: errorMessage };
		}
	} catch (error) {
		// console.error('Network or other error:', error);
		const failureMessage = intl.formatMessage({
			id: onFailureMessageId || 'networkError',
			defaultMessage: 'Network or other error',
		});
		return { success: false, error: error.message, message: failureMessage };
	}
};

export default apiCall;
