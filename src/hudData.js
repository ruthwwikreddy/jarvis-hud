export const hudData = {
    projectName: "J.A.R.V.I.S",

    // OpenAI API Configuration
    openai: {
        apiKey: "YOUR_OPENAI_API_KEY"
    },

    // Spotify Configuration
    spotify: {
        token: "YOUR_SPOTIFY_TOKEN"
    },

    // 2FA Authenticator Accounts
    authenticator: {
        accounts: [
            {
                name: "ruthwwikreddy",
                issuer: "Instagram",
                secret: "GBD6FKVFGTP2M7YSUSKCJQ24JNIJ2JOL"
            },
            {
                name: "rreddy.pvt",
                issuer: "Instagram",
                secret: ""
            },
            {
                name: "Main",
                issuer: "Google",
                secret: "e5f5 hqek twzb cffe lkwq fxwk dmgr 5vyx"
            },
            {
                name: "School",
                issuer: "Google",
                secret: "dpfq bf7k ub73 kwjb szqs 5wrb ygh4 gakx"
            },
            {
                name: "Github",
                issuer: "Github",
                secret: "4JHZBK4WUNRA75EM"
            },



            // Add more accounts here:
            // { name: "GitHub", issuer: "GitHub", secret: "YOUR_SECRET_KEY_HERE" },
        ]
    },

    identity: {
        id: "RUTHWIK",
        system: "MK-II",
        mode: "MONITOR"
    },
    objectives: {
        title: "ACTIVE MISSIONS",
        progress: 86,
        colors: {
            DEPLOYING: "#ffffffff",
            PROTOTYPE: "#ffffffff",
            DEV: "#ffffffff",
            TESTING: "#ffffffff",
            SCALING: "#ffffffff"
        },
        list: [
            { label: "MEDILINK", status: "DEPLOYING" },
            { label: "ECOCLEAN", status: "PROTOTYPE" },
            { label: "MEDIWASTE", status: "TESTING" },
            { label: "IDEABOARD", status: "SCALING" }
        ]
    },

    alerts: {
        title: "ALERTS",
        list: [
            { id: 1, type: 'warning', message: 'LOW STORAGE' },
            { id: 2, type: 'info', message: 'UPDATE AVAILABLE' }
        ]
    },
    pico: {
        title: "MEDILINK",
        version: "V.1.0",
        stats: [
            { label: 'CORE', value: 'HEALTHCARE OS', status: 'active' },
            { label: 'MODULES', value: 'PATIENT | HOSPITAL', status: 'active' },
            { label: 'SECURITY', value: 'HIPAA-READY', status: 'active' }
        ],
        terminal: [
            '> MEDILINK SYSTEM ONLINE',
            '> CONNECTING HEALTHCARE NODES...',
            '> AWAITING AUTHORIZATION'
        ]
    },
    calendar: {
        title: "STRATEGIC CALENDAR",
        nextEvent: "SYSTEM CALIBRATION — 22:00",
        week: "51"
    }
};

