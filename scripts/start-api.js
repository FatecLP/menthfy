const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const possiblePaths = [
    path.join(__dirname, '..', '..', 'mentorship-service'),
    path.join(__dirname, '..', 'mentorship-service'),
    path.join(__dirname, '..', 'services', 'mentorship-service'),
];

const serviceDir = possiblePaths.find((p) => fs.existsSync(p));

if (!serviceDir) {
    console.log('\n[Menthfy] O microsserviço de mentoria Java reside no repositório separado:');
    console.log(' 👉 https://github.com/FatecLP/mentorship-service\n');
    console.log('Para executá-lo, clone o repositório e rode `./mvnw spring-boot:run` na porta 8080.\n');
    process.exit(0);
}

const wrapperCommand = process.platform === 'win32' ? 'mvnw.cmd' : './mvnw';

const child = spawn(wrapperCommand, ['spring-boot:run'], {
    cwd: serviceDir,
    stdio: 'inherit',
    shell: true,
});

child.on('exit', (code) => {
    process.exit(code ?? 0);
});