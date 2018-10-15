"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param {Object} perfProfile The perf profile JSON object.
 * @return {Object[]} An array of recognized events that are captured
 *     within the perf profile.
 */
function convertPerfProfileToEvents(perfProfile) {
    var inProgressEvents = new Map(); // map from event name to start time
    var finishedEvents = []; // Event[] finished events
    var addFinishedEvent = function (eventName, startTime, endTime) {
        var categorizedEventName = categorizeEvent(eventName);
        var args = undefined;
        if (categorizedEventName == 'gc') {
            // TODO: We cannot measure heap size at the moment
            args = { usedHeapSize: 0 };
        }
        if (startTime == endTime) {
            // Finished instantly
            finishedEvents.push({ ph: 'X', ts: startTime, name: categorizedEventName, args: args });
        }
        else {
            // Has duration
            finishedEvents.push({ ph: 'B', ts: startTime, name: categorizedEventName, args: args });
            finishedEvents.push({ ph: 'E', ts: endTime, name: categorizedEventName, args: args });
        }
    };
    var samples = perfProfile.threads[0].samples;
    var _loop_1 = function (i) {
        var sample = samples[i];
        var sampleTime = sample.time;
        // Add all the frames into a set so it's easier/faster to find the set
        // differences
        var sampleFrames = new Set();
        sample.frames.forEach(function (frame) {
            sampleFrames.add(frame['location']);
        });
        // If an event is in the inProgressEvents map, but not in the current sample,
        // then it must have just finished. We add this event to the finishedEvents
        // array and remove it from the inProgressEvents map.
        var previousSampleTime = (i == 0 ? /* not used */ -1 : samples[i - 1].time);
        inProgressEvents.forEach(function (startTime, eventName) {
            if (!(sampleFrames.has(eventName))) {
                addFinishedEvent(eventName, startTime, previousSampleTime);
                inProgressEvents.delete(eventName);
            }
        });
        // If an event is in the current sample, but not in the inProgressEvents map,
        // then it must have just started. We add this event to the inProgressEvents
        // map.
        sampleFrames.forEach(function (eventName) {
            if (!(inProgressEvents.has(eventName))) {
                inProgressEvents.set(eventName, sampleTime);
            }
        });
    };
    // In perf profile, firefox samples all the frames in set time intervals. Here
    // we go through all the samples and construct the start and end time for each
    // event.
    for (var i = 0; i < samples.length; ++i) {
        _loop_1(i);
    }
    // If anything is still in progress, we need to included it as a finished event
    // since recording ended.
    var lastSampleTime = samples[samples.length - 1].time;
    inProgressEvents.forEach(function (startTime, eventName) {
        addFinishedEvent(eventName, startTime, lastSampleTime);
    });
    // Remove all the unknown categories.
    return finishedEvents.filter(function (event) { return event['name'] != 'unknown'; });
}
exports.convertPerfProfileToEvents = convertPerfProfileToEvents;
// TODO: this is most likely not exhaustive.
function categorizeEvent(eventName) {
    if (eventName.indexOf('PresShell::Paint') > -1) {
        return 'render';
    }
    else if (eventName.indexOf('FirefoxDriver.prototype.executeScript') > -1) {
        return 'script';
    }
    else if (eventName.indexOf('forceGC') > -1) {
        return 'gc';
    }
    else {
        return 'unknown';
    }
}
exports.categorizeEvent = categorizeEvent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9maXJlZm94X2V4dGVuc2lvbi9saWIvcGFyc2VyX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSDs7OztHQUlHO0FBQ0gsb0NBQTJDLFdBQWdCO0lBQ3pELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFpQixvQ0FBb0M7SUFDeEYsSUFBTSxjQUFjLEdBQTJCLEVBQUUsQ0FBQyxDQUFFLDBCQUEwQjtJQUM5RSxJQUFNLGdCQUFnQixHQUFHLFVBQVMsU0FBaUIsRUFBRSxTQUFpQixFQUFFLE9BQWU7UUFDckYsSUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEQsSUFBSSxJQUFJLEdBQW1DLFNBQVMsQ0FBQztRQUNyRCxJQUFJLG9CQUFvQixJQUFJLElBQUksRUFBRTtZQUNoQyxrREFBa0Q7WUFDbEQsSUFBSSxHQUFHLEVBQUMsWUFBWSxFQUFFLENBQUMsRUFBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxTQUFTLElBQUksT0FBTyxFQUFFO1lBQ3hCLHFCQUFxQjtZQUNyQixjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztTQUN2RjthQUFNO1lBQ0wsZUFBZTtZQUNmLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQ3RGLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVB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