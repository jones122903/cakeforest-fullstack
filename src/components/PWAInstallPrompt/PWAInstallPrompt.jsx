import { useEffect, useState } from 'react';
import './PWAInstallPrompt.css';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install prompt
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        console.log(`User response to the install prompt: ${outcome}`);

        // Clear the deferredPrompt for next time
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
    };

    if (!showPrompt) {
        return null;
    }

    return (
        <div className="pwa-install-prompt">
            {/* <div className="pwa-install-content">
                <div className="pwa-install-icon">
                    <img src="/pwa-192x192.png" alt="Cake Forest" />
                </div>
                <div className="pwa-install-text">
                    <h3>Install Cake Forest</h3>
                    <p>Install our app for a better experience and offline access!</p>
                </div>
                <div className="pwa-install-actions">
                    <button onClick={handleInstallClick} className="pwa-install-btn">
                        Install
                    </button>
                    <button onClick={handleDismiss} className="pwa-dismiss-btn">
                        Not Now
                    </button>
                </div>
            </div> */}
        </div>
    );
};

export default PWAInstallPrompt;
