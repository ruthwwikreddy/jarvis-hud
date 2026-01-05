const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

contextBridge.exposeInMainWorld('electronAPI', {
    getSystemMetrics: () => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const ramUsage = Math.round((usedMem / totalMem) * 100);

        // Load average as a proxy for CPU if single cpu usage is hard
        const load = os.loadavg();
        const cpuUsage = Math.round((load[0] / os.cpus().length) * 100);

        return {
            cpu: Math.min(cpuUsage, 100),
            ram: ramUsage,
            uptime: os.uptime(),
            platform: os.platform(),
            arch: os.arch()
        };
    }
});
