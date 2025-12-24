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
            { label: "MEDILINK PLATFORM", status: "DEPLOYING" },
            { label: "ECOCLEAN SYSTEM", status: "PROTOTYPE" },
            { label: "MEDICAL WASTE CONVERTER", status: "TESTING" },
            { label: "MVP BUILDER BRAND", status: "SCALING" }
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
        title: "PROJECT PICO",
        version: "V.4.2",
        stats: [
            { label: 'CORE', value: 'ESP32-WROOM', status: 'active' },
            { label: 'SENSORS', value: 'ACTIVE', status: 'active' },
            { label: 'LINK', value: 'SECURE', status: 'active' }
        ],
        terminal: [
            '> SYSTEM STANDBY',
            '> AWAITING COMMAND...'
        ]
    },
    calendar: {
        title: "STRATEGIC CALENDAR",
        nextEvent: "SYSTEM CALIBRATION — 22:00",
        week: "51"
    }
};

