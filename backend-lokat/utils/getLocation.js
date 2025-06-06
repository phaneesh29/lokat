import axios from "axios"
export const getLocationFromCords = async (lat, lon, userid = 11) => {
    const url = `https://nominatim.openstreetmap.org/reverse`
    try {
        const result = await axios.get(url, {
            params: {
                lat, lon, format: "json"
            },
            headers: {
                'User-Agent': `Lokat ${userid}`,
            }
        })
        return result.data.display_name
    } catch (error) {
        console.error('Failed to get location:', error.message);
        return null;
    }

}