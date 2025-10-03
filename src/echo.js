import Echo from "laravel-echo";

const key = import.meta.env.VITE_REVERB_APP_KEY;

let echoPromise;

if (!key) {
    console.warn("VITE_REVERB_APP_KEY is not set. Reverb will not be initialized.");
    echoPromise = Promise.resolve(null);
} else {
    echoPromise = import('pusher-js').then(Pusher => {
        console.log('Pusher-js loaded successfully');
        window.Pusher = Pusher.default || Pusher;
        const echo = new Echo({
            broadcaster: "reverb",
            key: key,
            wsHost: import.meta.env.VITE_REVERB_HOST ?? "127.0.0.1",
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
            forceTLS: false,
            enabledTransports: ["ws", "wss"],
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        });

        console.log('Echo instance created');
        console.log('Echo connector:', echo.connector);

        // Connection status logs

        window.Echo = echo;
        return echo;
    }).catch(err => {
        console.error('Failed to load pusher-js or initialize Echo', err);
        return null;
    });
}

export default echoPromise;
