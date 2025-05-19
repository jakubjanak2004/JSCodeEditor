// function to handle internet connection
export default function internetConnection() {
    const wifiSigns = document.querySelectorAll('.wifi-sign');
    wifiSigns.forEach(wifiSign => {
        // start by being off-line at start if no connection to the internet
        if (!navigator.onLine) {
            wifiSign.classList.add('offline');
        }

        // state changed to online
        window.addEventListener('online', () => {
            wifiSign.classList.remove('offline');
        });

        // state changed to offline
        window.addEventListener('offline', () => {
            wifiSign.classList.add('offline');
        });
    });
}