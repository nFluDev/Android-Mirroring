const { app } = require('electron');
const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const userDataPath = app.getPath('userData');
const logFile = path.join(userDataPath, 'error.log');

// userData dizini yoksa oluştur
if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
}

function logError(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

let scrcpyProcess = null;
let isQuitting = false;

const scrcpyBinPath = path.join(process.resourcesPath, 'scrcpy-bin');
const scrcpyPath = path.join(scrcpyBinPath, 'scrcpy');
const adbPath = path.join(scrcpyBinPath, 'adb');

// cleanup ve quit
const cleanupAndQuit = () => {
    logError(`scrcpyBinPath: ${scrcpyBinPath} \nadbPath: ${adbPath} \nscrcpyPath: ${scrcpyPath}`);
    if (isQuitting) return;
    isQuitting = true;

    if (scrcpyProcess) scrcpyProcess.kill();

    exec(`ls -l "${scrcpyPath}" "${adbPath}"`, (err, stdout) => {
        if (stdout) logError(`File permissions:\n${stdout}`);
    });

    exec(`otool -L "${scrcpyPath}"`, (err, stdout, stderr) => {
        if (err) logError(`otool error: ${err.message}`);
        if (stdout) logError(`otool output:\n${stdout}`);
        if (stderr) logError(`otool stderr:\n${stderr}`);
    });

    exec(`"${adbPath}" kill-server`, (error) => {
        if (error) logError(`ADB kill-server error: ${error.message}`);
        exec(`"${adbPath}" start-server`, (error) => {
            if (error) logError(`ADB start-server error: ${error.message}`);
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

process.on('SIGINT', () => cleanupAndQuit());
app.on('window-all-closed', () => cleanupAndQuit());

app.whenReady().then(() => {
    process.env.PATH = `${scrcpyBinPath}:${process.env.PATH}`;

    if (process.platform === 'darwin') {
        app.dock.hide();
    }

    const adbCheck = spawn(adbPath, ['devices']);

    adbCheck.stdout.on('data', (data) => {
        logError(`adb stdout: ${data.toString()}`);
    });

    adbCheck.stderr.on('data', (data) => {
        logError(`adb stderr: ${data.toString()}`);
    });

    adbCheck.on('error', (err) => {
        logError(`adb spawn error: ${err.message}`);
        cleanupAndQuit();
    });

    adbCheck.on('close', (code) => {
        logError(`adb exited with code ${code}`);
        if (code !== 0) {
            cleanupAndQuit();
            return;
        }

        const scrcpyArgs = ['-S', '--stay-awake', '--max-size', '0', '--bit-rate', '16M'];

        scrcpyProcess = spawn(scrcpyPath, scrcpyArgs, {
            cwd: scrcpyBinPath,
            env: process.env
        });

        scrcpyProcess.stdout.on('data', (data) => {
            logError(`scrcpy stdout: ${data.toString()}`);
        });

        scrcpyProcess.stderr.on('data', (data) => {
            logError(`scrcpy stderr: ${data.toString()}`);
        });

        scrcpyProcess.on('error', (err) => {
            logError(`scrcpy spawn error: ${err.message}`);
            cleanupAndQuit();
        });

        scrcpyProcess.on('close', (code) => {
            logError(`scrcpy exited with code ${code}`);
            cleanupAndQuit();
        });
    });
});
