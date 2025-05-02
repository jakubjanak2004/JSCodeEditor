export default function internetConnection() {
    const wifiSigns = document.querySelectorAll('.wifi-sign');
    wifiSigns.forEach(wifiSign => {
        if (!navigator.onLine) {
            wifiSign.classList.add('offline');
        }
        window.addEventListener('online', () => {
            wifiSign.classList.remove('offline');
        });

        window.addEventListener('offline', () => {
            wifiSign.classList.add('offline');
        });
    });
}