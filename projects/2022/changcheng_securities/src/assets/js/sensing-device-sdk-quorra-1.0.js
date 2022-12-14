var SensingDevice = /** @class */ (function () {
    function SensingDevice() {
    }
    SensingDevice.getInstance = function () {
        if (this.sensingDevice == null) {
            this.sensingDevice = new SensingDevice();
        }
        return this.sensingDevice;
    };
    SensingDevice.prototype.getSubKey = function () {
        return window.android && window.android.getDeviceSubKey();
    };
    SensingDevice.prototype.getDeviceId = function () {
        return window.android && window.android.getDeviceId();
    };
    SensingDevice.prototype.getTenantId = function () {
        return window.android && window.android.getTenantId();
    };
    SensingDevice.prototype.getSecurityKey = function () {
        return window.android && window.android.getSecurityKey();
    };
    SensingDevice.prototype.getAppHomeUrl = function () {
        return window.android && window.android.getAppHomeUrl();
    };
    SensingDevice.prototype.getAppReplenishUrl = function () {
        return window.android && window.android.getAppReplenishUrl();
    };
    SensingDevice.prototype.setValueByKey = function (key, value) {
        return window.android && window.android.setValueByKey(key, value);
    };
    SensingDevice.prototype.getValueByKey = function (key) {
        return window.android && window.android.getValueByKey(key);
    };
    SensingDevice.prototype.downloadFileUrlsToLocal = function (links) {
        return window.android && window.android.downloadFileUrlsToLocal(links);
    };
    SensingDevice.prototype.getLocalFileUrl = function (url) {
        return window.android && window.android.getLocalFileUrl(url);
    };
    SensingDevice.prototype.addBehaviorRecord = function (thingId, thingName, thingCategory, action, increment, collectionTime, collectEndTime, softwareName, pageName, pageArea, previousPageName, previousPageArea, position, pSource, comments) {
        return window.android && window.android.addBehaviorRecord(thingId, thingName, thingCategory, action, increment, collectionTime, collectEndTime, softwareName, pageName, pageArea, previousPageName, previousPageArea, position, pSource, comments);;
    };
    SensingDevice.prototype.addBehaviorRecordObject = function (record) {
        return window.android && window.android.addBehaviorRecord(record.thingId, record.thingName, record.thingCategory, record.action, record.increment, record.collectionTime, record.collectEndTime, record.softwareName, record.pageName, record.pageArea, record.previousPageName, record.previousPageArea, record.position, record.pSource, record.comments);
    };
    SensingDevice.prototype.doDropCargo = function (cargoRoad) {
        return window.android && window.android.doDropCargo(cargoRoad);
    };
    SensingDevice.prototype.sendSerialCommand = function (command, isHex) {
        return window.android && window.android.sendSerialCommand(command, isHex);
    };
    SensingDevice.prototype.log = function (content) {
        return window.android && window.android.log(content);
    };
    return SensingDevice;
}());

export default SensingDevice