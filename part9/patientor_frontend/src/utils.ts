export const getFavoriteIconColor = (rating: Number): string => {
    switch (rating) {
        case 0:
            return "green";
        case 1:
            return "yellow";
        case 2:
            return "orange";
        case 3:
            return "red";
        default:
            throw new Error(`Unhandled health check rating: ${rating}`);
    }
};