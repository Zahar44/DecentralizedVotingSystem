let timer;

function logProcessed(message) {
    let processStr = '';
    let incrProcessStr = true;
    let processStrMaxLength = 3;

    console.log(message + processStr);
    timer = setInterval(() => {
        clearLine();
        console.log(message + processStr);

        if (incrProcessStr) {
            if (processStr.length >= processStrMaxLength - 1) {
                incrProcessStr = false;
            }

            processStr += '.';
            return;
        }

        if (processStr.length === 1) {
            incrProcessStr = true;
        }

        processStr = processStr.slice(0, -1);
    }, 100);
}

function clearLine() {
    process.stdout.moveCursor(0, -1);
    process.stdout.clearLine(0);
}

function stopLastProcessedMessage(message) {
    clearInterval(timer);
    clearLine();
    logGreen(message);
}

function logGreen(message) {
    console.log(`\x1b[32m${message}\x1b[0m`);
}


module.exports = {
    logProcessed,
    clearLine,
    stopLastProcessedMessage,
    logGreen,
};