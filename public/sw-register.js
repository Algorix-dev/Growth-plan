// Service Worker Registration — run in browser after hydration
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/sw.js")
            .then((reg) => console.log("[EP·OS] SW registered:", reg.scope))
            .catch((err) => console.warn("[EP·OS] SW registration failed:", err));
    });
}
