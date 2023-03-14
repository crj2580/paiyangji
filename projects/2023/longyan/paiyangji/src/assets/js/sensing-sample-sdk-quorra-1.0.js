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
        if (window.android != null && typeof (window.android) != "undefined") {
            var subkey = window.android.getDeviceSubKey();
            return subkey;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getDeviceId = function () {
        if (window.android != null && typeof (window.android) != "undefined") {
            var deviceId = window.android.getDeviceId();
            return deviceId;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getTenantId = function () {
        if (window.android != null && typeof (window.android) != "undefined") {
            var tenantId = window.android.getTenantId();
            return tenantId;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getSecurityKey = function () {
        if (window.android != null && typeof (window.android) != "undefined") {
            var securityKey = window.android.getSecurityKey();
            return securityKey;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getAppHomeUrl = function () {
        if (window.android != null && typeof (window.android) != "undefined") {
            var appHomeUrl = window.android.getAppHomeUrl();
            return appHomeUrl;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getAppReplenishUrl = function () {
        if (window.android != null && typeof (window.android) != "undefined") {
            var appReplenishUrl = window.android.getAppReplenishUrl();
            return appReplenishUrl;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.setValueByKey = function (key, value) {
        if (window.android != null && typeof (window.android) != "undefined") {
            var success = window.android.setValueByKey(key, value);
            return success;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getValueByKey = function (key) {
        if (window.android != null && typeof (window.android) != "undefined") {
            var value = window.android.getValueByKey(key);
            return value;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.downloadFileUrlsToLocal = function (links) {
        if (window.android != null && typeof (window.android) != "undefined") {
            window.android.downloadFileUrlsToLocal(links);
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.getLocalFileUrl = function (url) {
        if (window.android != null && typeof (window.android) != "undefined") {
            return window.android.getLocalFileUrl(url);
        }
        else {
            // alert(typeof (window.android));
        }
    };

        SensingDevice.prototype.navigateTo = function (pageName) {
            if (window.android != null && typeof (window.android) != "undefined") {
                return window.android.navigateTo(pageName);
            }
            else {
                // alert(typeof (window.android));
            }
        };

    SensingDevice.prototype.addBehaviorRecord = function (thingId, thingName, thingCategory, action, increment, collectionTime, collectEndTime, softwareName, pageName, pageArea, previousPageName, previousPageArea, position, pSource, comments) {
        if (window.android != null && typeof (window.android) != "undefined") {
            var success = window.android.addBehaviorRecord(thingId, thingName, thingCategory, action, increment, collectionTime, collectEndTime, softwareName, pageName, pageArea, previousPageName, previousPageArea, position, pSource, comments);
            return success;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.addBehaviorRecordObject = function (record) {
        if (window.android != null && typeof (window.android) != "undefined") {
            var success = window.android.addBehaviorRecord(record.thingId, record.thingName, record.thingCategory, record.action, record.increment, record.collectionTime, record.collectEndTime, record.softwareName, record.pageName, record.pageArea, record.previousPageName, record.previousPageArea, record.position, record.pSource, record.comments);
            return success;
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.doDropCargo = function (cargoRoad) {
        // alert(cargoRoad);
        if (window.android != null && typeof (window.android) != "undefined") {
            return window.android.doDropCargo(cargoRoad);
        }
        else {
            // alert(typeof (window.android));
        }
    };
    SensingDevice.prototype.sendSerialCommand = function (command, isHex) {
        if (window.android != null && typeof (window.android) != "undefined") {
            return window.android.sendSerialCommand(command, isHex);
        }
        else {
            // alert(typeof (window.android));
        }
    };
    return SensingDevice;
}());

export default SensingDevice