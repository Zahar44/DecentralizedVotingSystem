const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { logProcessed, stopLastProcessedMessage } = require('./utils');

async function start() {
    logProcessed('Deploying contracts');
    let error = await stdExec('cd "smartcontracts" && npm run local:deploy');

    if (error) {
        console.error(stderr);
        return;
    }

    stopLastProcessedMessage('Contracts deployed!');

    logProcessed('Resetting block polling database');
    error = await stdExec('cd "server" && npm run bp:db:reset');

    if (error) {
        console.error(stderr);
        return;
    }

    stopLastProcessedMessage('Database block polling seeded!');

    logProcessed('Resetting block consumer database');
    error = await stdExec('cd "server" && npm run bc:db:reset');

    if (error) {
        console.error(stderr);
        return;
    }

    stopLastProcessedMessage('Database block consumer seeded!');
}

async function stdExec(command) {
    let { stdout, stderr } = await exec(command);

    if (stderr) {
        return stderr;
    }
}

start();
