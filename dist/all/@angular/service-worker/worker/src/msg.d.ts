/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export interface MsgAny {
    action: string;
}
export interface MsgCheckForUpdates {
    action: 'CHECK_FOR_UPDATES';
    statusNonce: number;
}
export declare function isMsgCheckForUpdates(msg: MsgAny): msg is MsgCheckForUpdates;
export interface MsgActivateUpdate {
    action: 'ACTIVATE_UPDATE';
    statusNonce: number;
}
export declare function isMsgActivateUpdate(msg: MsgAny): msg is MsgActivateUpdate;
export interface MsgCheckVersion {
    action: 'CHECK_VERSION';
    nonce: number;
}
export declare function isMsgCheckVersion(msg: MsgAny): msg is MsgCheckVersion;
