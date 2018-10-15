/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export class SwCriticalError extends Error {
    constructor() {
        super(...arguments);
        this.isCritical = true;
    }
}
export function errorToString(error) {
    if (error instanceof Error) {
        return `${error.message}\n${error.stack}`;
    }
    else {
        return `${error}`;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci93b3JrZXIvc3JjL2Vycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE1BQU0sc0JBQXVCLFNBQVEsS0FBSztJQUExQzs7UUFBc0QsZUFBVSxHQUFZLElBQUksQ0FBQztJQUFDLENBQUM7Q0FBQTtBQUVuRixNQUFNLHdCQUF3QixLQUFVO0lBQ3RDLElBQUksS0FBSyxZQUFZLEtBQUssRUFBRTtRQUMxQixPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDM0M7U0FBTTtRQUNMLE9BQU8sR0FBRyxLQUFLLEVBQUUsQ0FBQztLQUNuQjtBQUNILENBQUMifQ==