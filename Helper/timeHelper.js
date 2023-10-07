const timeHelper = () => {
    const convertUTCToLocal = (utcTimeInput) => {
        let hours, minutes;

        if (utcTimeInput instanceof Date) {
            // Check if it's a Date object
            hours = utcTimeInput.getUTCHours();
            minutes = utcTimeInput.getUTCMinutes();
        } else if (typeof utcTimeInput === 'string') {
            // Check if it's a string
            [hours, minutes] = utcTimeInput.split(':').map(Number);
        } else {
            console.error('Unknown type for utcTimeInput:', utcTimeInput);
            return null;
        }

        const now = new Date();
        const utcDate = new Date(
            Date.UTC(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                hours,
                minutes,
                0
            )
        );
        const localDate = new Date(utcDate);

        let localHours = localDate.getHours();
        const ampm = localHours >= 12 ? 'PM' : 'AM';
        localHours = localHours % 12;
        localHours = localHours || 12;

        return `${localHours}:${localDate
            .getMinutes()
            .toString()
            .padStart(2, '0')} ${ampm}`;
    };
};
export default timeHelper;
