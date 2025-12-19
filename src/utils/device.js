// Generate or get existing device ID
const DEVICE_ID_KEY = 'locallink_device_id';

export const getDeviceId = () => {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);

    if (!deviceId) {
        // Generate a unique device ID
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }

    return deviceId;
};

export const isMyPost = (post) => {
    const myDeviceId = getDeviceId();
    return post.device_id === myDeviceId;
};
