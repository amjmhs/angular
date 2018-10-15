/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export class IdleScheduler {
    constructor(adapter, threshold, debug) {
        this.adapter = adapter;
        this.threshold = threshold;
        this.debug = debug;
        this.queue = [];
        this.scheduled = null;
        this.empty = Promise.resolve();
        this.emptyResolve = null;
        this.lastTrigger = null;
        this.lastRun = null;
    }
    async trigger() {
        this.lastTrigger = this.adapter.time;
        if (this.queue.length === 0) {
            return;
        }
        if (this.scheduled !== null) {
            this.scheduled.cancel = true;
        }
        const scheduled = {
            cancel: false,
        };
        this.scheduled = scheduled;
        await this.adapter.timeout(this.threshold);
        if (scheduled.cancel) {
            return;
        }
        this.scheduled = null;
        await this.execute();
    }
    async execute() {
        this.lastRun = this.adapter.time;
        while (this.queue.length > 0) {
            const queue = this.queue;
            this.queue = [];
            await queue.reduce(async (previous, task) => {
                await previous;
                try {
                    await task.run();
                }
                catch (err) {
                    this.debug.log(err, `while running idle task ${task.desc}`);
                }
            }, Promise.resolve());
        }
        if (this.emptyResolve !== null) {
            this.emptyResolve();
            this.emptyResolve = null;
        }
        this.empty = Promise.resolve();
    }
    schedule(desc, run) {
        this.queue.push({ desc, run });
        if (this.emptyResolve === null) {
            this.empty = new Promise(resolve => { this.emptyResolve = resolve; });
        }
    }
    get size() { return this.queue.length; }
    get taskDescriptions() { return this.queue.map(task => task.desc); }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL3dvcmtlci9zcmMvaWRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFjSCxNQUFNO0lBUUosWUFBb0IsT0FBZ0IsRUFBVSxTQUFpQixFQUFVLEtBQWtCO1FBQXZFLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBYTtRQVBuRixVQUFLLEdBQWUsRUFBRSxDQUFDO1FBQ3ZCLGNBQVMsR0FBc0IsSUFBSSxDQUFDO1FBQzVDLFVBQUssR0FBa0IsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2pDLGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUMzQyxnQkFBVyxHQUFnQixJQUFJLENBQUM7UUFDaEMsWUFBTyxHQUFnQixJQUFJLENBQUM7SUFFa0UsQ0FBQztJQUUvRixLQUFLLENBQUMsT0FBTztRQUNYLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7UUFDckMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTztTQUNSO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDOUI7UUFFRCxNQUFNLFNBQVMsR0FBRztZQUNoQixNQUFNLEVBQUUsS0FBSztTQUNkLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUUzQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUzQyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDcEIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFFdEIsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPO1FBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztRQUNqQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUM1QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBRWhCLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUN6QyxNQUFNLFFBQVEsQ0FBQztnQkFDZixJQUFJO29CQUNGLE1BQU0sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNsQjtnQkFBQyxPQUFPLEdBQUcsRUFBRTtvQkFDWixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsMkJBQTJCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RDtZQUNILENBQUMsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztTQUN2QjtRQUVELElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDOUIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFZLEVBQUUsR0FBd0I7UUFDN0MsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxFQUFFO1lBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELElBQUksSUFBSSxLQUFhLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBRWhELElBQUksZ0JBQWdCLEtBQWUsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDL0UifQ==