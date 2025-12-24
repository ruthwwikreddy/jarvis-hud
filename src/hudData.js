export const hudData = {
    projectName: "J.A.R.V.I.S",
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

