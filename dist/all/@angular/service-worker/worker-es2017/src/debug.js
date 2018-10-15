/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const DEBUG_LOG_BUFFER_SIZE = 100;
export class DebugHandler {
    constructor(driver, adapter) {
        this.driver = driver;
        this.adapter = adapter;
        // There are two debug log message arrays. debugLogA records new debugging messages.
        // Once it reaches DEBUG_LOG_BUFFER_SIZE, the array is moved to debugLogB and a new
        // array is assigned to debugLogA. This ensures that insertion to the debug log is
        // always O(1) no matter the number of logged messages, and that the total number
        // of messages in the log never exceeds 2 * DEBUG_LOG_BUFFER_SIZE.
        this.debugLogA = [];
        this.debugLogB = [];
    }
    async handleFetch(req) {
        const [state, versions, idle] = await Promise.all([
            this.driver.debugState(),
            this.driver.debugVersions(),
            this.driver.debugIdleState(),
        ]);
        const msgState = `NGSW Debug Info:

Driver state: ${state.state} (${state.why})
Latest manifest hash: ${state.latestHash || 'none'}
Last update check: ${this.since(state.lastUpdateCheck)}`;
        const msgVersions = versions
            .map(version => `=== Version ${version.hash} ===

Clients: ${version.clients.join(', ')}`)
            .join('\n\n');
        const msgIdle = `=== Idle Task Queue ===
Last update tick: ${this.since(idle.lastTrigger)}
Last update run: ${this.since(idle.lastRun)}
Task queue:
${idle.queue.map(v => ' * ' + v).join('\n')}

Debug log:
${this.formatDebugLog(this.debugLogB)}
${this.formatDebugLog(this.debugLogA)}
`;
        return this.adapter.newResponse(`${msgState}

${msgVersions}

${msgIdle}`, { headers: this.adapter.newHeaders({ 'Content-Type': 'text/plain' }) });
    }
    since(time) {
        if (time === null) {
            return 'never';
        }
        let age = this.adapter.time - time;
        const days = Math.floor(age / 86400000);
        age = age % 86400000;
        const hours = Math.floor(age / 3600000);
        age = age % 3600000;
        const minutes = Math.floor(age / 60000);
        age = age % 60000;
        const seconds = Math.floor(age / 1000);
        const millis = age % 1000;
        return '' + (days > 0 ? `${days}d` : '') + (hours > 0 ? `${hours}h` : '') +
            (minutes > 0 ? `${minutes}m` : '') + (seconds > 0 ? `${seconds}s` : '') +
            (millis > 0 ? `${millis}u` : '');
    }
    log(value, context = '') {
        // Rotate the buffers if debugLogA has grown too large.
        if (this.debugLogA.length === DEBUG_LOG_BUFFER_SIZE) {
            this.debugLogB = this.debugLogA;
            this.debugLogA = [];
        }
        // Convert errors to string for logging.
        if (typeof value !== 'string') {
            value = this.errorToString(value);
        }
        // Log the message.
        this.debugLogA.push({ value, time: this.adapter.time, context });
    }
    errorToString(err) { return `${err.name}(${err.message}, ${err.stack})`; }
    formatDebugLog(log) {
        return log.map(entry => `[${this.since(entry.time)}] ${entry.value} ${entry.context}`)
            .join('\n');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2RlYnVnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUtILE1BQU0scUJBQXFCLEdBQUcsR0FBRyxDQUFDO0FBUWxDLE1BQU07SUFTSixZQUFxQixNQUFrQixFQUFXLE9BQWdCO1FBQTdDLFdBQU0sR0FBTixNQUFNLENBQVk7UUFBVyxZQUFPLEdBQVAsT0FBTyxDQUFTO1FBUmxFLG9GQUFvRjtRQUNwRixtRkFBbUY7UUFDbkYsa0ZBQWtGO1FBQ2xGLGlGQUFpRjtRQUNqRixrRUFBa0U7UUFDMUQsY0FBUyxHQUFtQixFQUFFLENBQUM7UUFDL0IsY0FBUyxHQUFtQixFQUFFLENBQUM7SUFFOEIsQ0FBQztJQUV0RSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQVk7UUFDNUIsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFO1NBQzdCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHOztnQkFFTCxLQUFLLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxHQUFHO3dCQUNqQixLQUFLLENBQUMsVUFBVSxJQUFJLE1BQU07cUJBQzdCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7UUFFckQsTUFBTSxXQUFXLEdBQUcsUUFBUTthQUNILEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGVBQWUsT0FBTyxDQUFDLElBQUk7O1dBRTVELE9BQU8sQ0FBQyxPQUFPLENB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