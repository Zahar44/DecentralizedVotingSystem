const util = require('util');
const exec = util.promisify(require('child_process').exec);

class CmdTask {
    command;
    progressMessage;
    doneMessage;
    chainedTask;

    constructor(command, progressMessage, doneMessage, chainedTask = undefined) {
        this.command = command;
        this.progressMessage = progressMessage;
        this.doneMessage = doneMessage;
        this.chainedTask = chainedTask;
    }
}

class CmdTaskScheduler {
    #processes = [];
    #animationSpeed;
    #animationChar;
    #animationCharMaxAmount;

    constructor(animationSpeed = 100, animationChar = '.', animationCharMaxAmount = 3) {
        this.#animationSpeed = animationSpeed;
        this.#animationChar = animationChar;
        this.#animationCharMaxAmount = animationCharMaxAmount;
    }

    addTask(task) {
        const process = { task, animationStr: '' };
        this.#processes.push(process);
        return process;
    }

    async start() {
        let promises = [];

        for (const process of this.#processes) {
            promises.push(this.#startProcess(process));
        }

        const interval = setInterval(() => this.#log(), this.#animationSpeed);

        try {
            await Promise.all(promises);
            this.#log();
        } finally {
            clearInterval(interval);
        }
    }

    async #startProcess(process) {
        process.logMethod = () => this.#logProgress(process);
        process.logMethod();
        await exec(process.task.command);
        process.logMethod = () => this.#logDone(process);

        if (process.task.chainedTask) {
            const chainedProcess = this.addTask(process.task.chainedTask);
            await this.#startProcess(chainedProcess);
        }
    }

    #log() {
        this.#clearLines();
        for (const process of this.#processes) {
            if (process.logMethod)
                process.logMethod();
        }
    }

    #logProgress(process) {
        if (process.incrementAnimationChar) {
            process.animationStr += this.#animationChar;
            process.incrementAnimationChar = process.animationStr.length < this.#animationCharMaxAmount;
        } else {
            process.animationStr = process.animationStr.slice(0, -1);
            process.incrementAnimationChar = process.animationStr.length === 0;
        }

        const message = process.task.progressMessage + process.animationStr;
        console.log(message);
    }

    #logDone(process) {
        const message = process.task.doneMessage;
        console.log(`\x1b[32m${message}\x1b[0m`);
    }

    #clearLines() {
        let count = this.#processes.length;
        while (count-- > 0) {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine(0);
        }
    }
}

module.exports = { CmdTask, CmdTaskScheduler };