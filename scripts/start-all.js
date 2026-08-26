const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.join(__dirname, '..');

const possiblePaths = [
    path.join(__dirname, '..', '..', 'mentorship-service'),
    path.join(__dirname, '..', 'mentorship-service'),
    path.join(__dirname, '..', 'services', 'mentorship-service'),
];

const serviceDir = possiblePaths.find((p) => fs.existsSync(p));
const wrapperCommand = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const nodeProcess = spawn(process.execPath, [path.join(rootDir, 'server.js')], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: false,
});

let apiProcess = null;

if (serviceDir) {
    apiProcess = spawn(wrapperCommand, ['spring-boot:run'], {
        cwd: serviceDir,
        stdio: 'inherit',
        shell: true,
    });
} else {
    console.log('\n[Menthfy] Microsserviço de mentoria deve ser iniciado a partir do seu repositório:');
    console.log(' 👉 https://github.com/FatecLP/mentorship-service\n');
}

const shutdown = () => {
    nodeProcess.kill();
    if (apiProcess) apiProcess.kill();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

nodeProcess.on('exit', (code) => {
    if (apiProcess) apiProcess.kill();
    process.exit(code ?? 0);
});

if (apiProcess) {
    apiProcess.on('exit', (code) => {
        nodeProcess.kill();
        process.exit(code ?? 0);
    });
}