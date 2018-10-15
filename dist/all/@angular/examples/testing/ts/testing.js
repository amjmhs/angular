/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var db;
var MyService = /** @class */ (function () {
    function MyService() {
    }
    return MyService;
}());
var MyMockService = /** @class */ (function () {
    function MyMockService() {
    }
    return MyMockService;
}());
// #docregion describeIt
describe('some component', function () {
    it('does something', function () {
        // This is a test.
    });
});
// #enddocregion
// #docregion fdescribe
/* tslint:disable-next-line:no-jasmine-focus */
fdescribe('some component', function () {
    it('has a test', function () {
        // This test will run.
    });
});
describe('another component', function () {
    it('also has a test', function () { throw 'This test will not run.'; });
});
// #enddocregion
// #docregion xdescribe
xdescribe('some component', function () { it('has a test', function () { throw 'This test will not run.'; }); });
describe('another component', function () {
    it('also has a test', function () {
        // This test will run.
    });
});
// #enddocregion
// #docregion fit
describe('some component', function () {
    /* tslint:disable-next-line:no-jasmine-focus */
    fit('has a test', function () {
        // This test will run.
    });
    it('has another test', function () { throw 'This test will not run.'; });
});
// #enddocregion
// #docregion xit
describe('some component', function () {
    xit('has a test', function () { throw 'This test will not run.'; });
    it('has another test', function () {
        // This test will run.
    });
});
// #enddocregion
// #docregion beforeEach
describe('some component', function () {
    beforeEach(function () { db.connect(); });
    it('uses the db', function () {
        // Database is connected.
    });
});
// #enddocregion
// #docregion afterEach
describe('some component', function () {
    afterEach(function (done) { db.reset().then(function (_) { return done(); }); });
    it('uses the db', function () {
        // This test can leave the database in a dirty state.
        // The afterEach will ensure it gets reset.
    });
});
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL3Rlc3RpbmcvdHMvdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFHSCxJQUFJLEVBQU8sQ0FBQztBQUNaO0lBQUE7SUFBaUIsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQyxBQUFsQixJQUFrQjtBQUNsQjtJQUFBO0lBQTBDLENBQUM7SUFBRCxvQkFBQztBQUFELENBQUMsQUFBM0MsSUFBMkM7QUFFM0Msd0JBQXdCO0FBQ3hCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDSSxrQkFBa0I7SUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDSCxnQkFBZ0I7QUFFaEIsdUJBQXVCO0FBQ3ZCLCtDQUErQztBQUMvQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7SUFDMUIsRUFBRSxDQUFDLFlBQVksRUFBRTtRQUNJLHNCQUFzQjtJQUMxQixDQUFDLENBQUMsQ0FBQztBQUN0QixDQUFDLENBQUMsQ0FBQztBQUNILFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixFQUFFLENBQUMsaUJBQWlCLEVBQUUsY0FBUSxNQUFNLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQyxDQUFDLENBQUM7QUFDSCxnQkFBZ0I7QUFFaEIsdUJBQXVCO0FBQ3ZCLFNBQVMsQ0FDTCxnQkFBZ0IsRUFBRSxjQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBUSxNQUFNLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRixRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDNUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFO1FBQ0ksc0JBQXNCO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQWdCO0FBRWhCLGlCQUFpQjtBQUNqQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsK0NBQStDO0lBQy9DLEdBQUcsQ0FBQyxZQUFZLEVBQUU7UUFDSSxzQkFBc0I7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDckIsRUFBRSxDQUFDLGtCQUFrQixFQUFFLGNBQVEsTUFBTSx5QkFBeUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQWdCO0FBRWhCLGlCQUFpQjtBQUNqQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsR0FBRyxDQUFDLFlBQVksRUFBRSxjQUFRLE1BQU0seUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxFQUFFLENBQUMsa0JBQWtCLEVBQUU7UUFDSSxzQkFBc0I7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDNUIsQ0FBQyxDQUFDLENBQUM7QUFDSCxnQkFBZ0I7QUFFaEIsd0JBQXdCO0FBQ3hCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixVQUFVLENBQUMsY0FBUSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwQyxFQUFFLENBQUMsYUFBYSxFQUFFO1FBQ0kseUJBQXlCO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQWdCO0FBRWhCLHVCQUF1QjtBQUN2QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsU0FBUyxDQUFDLFVBQUMsSUFBYyxJQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLEVBQUUsQ0FBQyxhQUFhLEVBQUU7UUFDSSxxREFBcUQ7UUFDckQsMkNBQTJDO0lBQy9DLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBQ0gsZ0JBQWdCIn0=