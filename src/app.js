const { app } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');

let scrcpyProcess = null;
let isQuitting = false;

const scrcpyBinPath = path.join(process.resourcesPath, 'scrcpy-bin');
const platformToolsPath = path.join(process.resourcesPath, 'platform-tools');

const scrcpyPath = path.join(scrcpyBinPath, 'scrcpy');
const adbPath = path.join(platformToolsPath, 'adb');

const cleanupAndQuit = () => {
    if (isQuitting) return;
    isQuitting = true;

    if (scrcpyProcess) {
        scrcpyProcess.kill();
    }

    exec(`"${adbPath}" kill-server`, (error) => {
        if (error) {
            console.error(`ADB kill-server hatası: ${error.message}`);
        }
        exec(`"${adbPath}" start-server`, (error) => {
            if (error) {
                console.error(`ADB start-server hatası: ${error.message}`);
            }
            app.quit();
        });
    });
};

app.on('before-quit', (event) => {
    if (!isQuitting) {
        event.preventDefault();
        cleanupAndQuit();
    }
});

process.on('SIGINT', () => {
    cleanupAndQuit();
});

app.on('window-all-closed', () => {
        cleanupAndQuit();
});

app.whenReady().then(() => {
    process.env.PATH = `${scrcpyBinPath}:${process.env.PATH}`;

    const adbCheck = spawn(adbPath, ['devices']);
    adbCheck.on('close', (code) => {
        if (code !== 0) {
            cleanupAndQuit();
            return;
        }
        
        const scrcpyArgs = [
            '-S',
            '--stay-awake',
        ];

        scrcpyProcess = spawn(scrcpyPath, scrcpyArgs, {
            cwd: scrcpyBinPath
        });
        scrcpyProcess.on('error', (err) => {
            cleanupAndQuit();
        });
        scrcpyProcess.on('close', (code) => {
            cleanupAndQuit();
        });
    });
});