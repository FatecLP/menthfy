const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const serviceDir = path.join(rootDir, 'services', 'mentorship-service');
const wrapperCommand = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const nodeProcess = spawn(process.execPath, [path.join(rootDir, 'server.js')], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
});

const apiProcess = spawn(wrapperCommand, ['spring-boot:run'], {
    cwd: serviceDir,
    stdio: 'inherit',
    shell: true,
});

const shutdown = () => {
    nodeProcess.kill();
    apiProcess.kill();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

nodeProcess.on('exit', (code) => {
    apiProcess.kill();
    process.exit(code ?? 0);
});

apiProcess.on('exit', (code) => {
    nodeProcess.kill();
    process.exit(code ?? 0);
});