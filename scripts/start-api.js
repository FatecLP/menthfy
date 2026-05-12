const { spawn } = require('child_process');
const path = require('path');

const serviceDir = path.join(__dirname, '..', 'services', 'mentorship-service');
const wrapperCommand = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const child = spawn(wrapperCommand, ['spring-boot:run'], {
    cwd: serviceDir,
    stdio: 'inherit',
    shell: true,
});

child.on('exit', (code) => {
    process.exit(code ?? 0);
});