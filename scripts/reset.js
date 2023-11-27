const { CmdTask, CmdTaskScheduler } = require('./utils');

async function start() {
    const scheduler = new CmdTaskScheduler();

    const deployContracts = new CmdTask(
        'cd "smartcontracts" && npm run local:deploy',
        'Deploying contracts',
        'Contracts deployed!'
    );
    const resetLocalNetwork = new CmdTask(
        'cd "smartcontracts" && npm run local:reset',
        'Resetting local network',
        'Local network reset!',
        deployContracts
    );

    const pushBPDatabase = new CmdTask(
        'cd "server" && npm run bp:db:push',
        'Pushing changes to block polling database',
        'Changes pushed to block polling database!'
    );
    const resetBPDatabase = new CmdTask(
        'cd "server" && npm run bp:db:reset',
        'Resetting block polling database',
        'Database block polling reset!',
        pushBPDatabase
    );

    const pushBCDatabase = new CmdTask(
        'cd "server" && npm run bc:db:push',
        'Pushing changes to block consumer database',
        'Changes pushed to block consumer database!'
    );
    const resetBCDatabase = new CmdTask(
        'cd "server" && npm run bc:db:reset',
        'Resetting block consumer database',
        'Database block consumer reset!',
        pushBCDatabase
    );

    const pushMetadataDatabase = new CmdTask(
        'cd "server" && npm run metadata:db:push',
        'Pushing changes to metadata database',
        'Changes pushed to metadata database!'
    );
    const resetMetadataDatabase = new CmdTask(
        'cd "server" && npm run metadata:db:reset',
        'Resetting metadata database',
        'Database metadata reset!',
        pushMetadataDatabase
    );

    scheduler.addTask(resetLocalNetwork);
    scheduler.addTask(resetBPDatabase);
    scheduler.addTask(resetBCDatabase);
    scheduler.addTask(resetMetadataDatabase);

    await scheduler.start();
}

start();
