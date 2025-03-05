import { useState, useEffect } from "react";

export function FeedbackBanner() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const dismissed = localStorage.getItem("feedbackMar5");
        if (dismissed) {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("feedbackMar5", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="bg-green-100 mb-8 shadow-md rounded-lg p-5 flex justify-between items-center">
            <p className="text-s leading-normal">
                👀 What features would you love to see in RSS Lookup?{" "}
                <a
                    className="underline hover:opacity-75"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdjrosEtak0xuRk8tVP4LTS9LOe3rND_IhX1kHtudmc2wCjdg/viewform?usp=dialog"
                >
                    Help us decide!
                </a>
            </p>
            <button
                onClick={handleDismiss}
                className="ml-4 text-gray-500 hover:text-gray-700 text-sm"
            >
                ✕
            </button>
        </div>
    );
}
