var IntervalPoller = function(intervalTime, pollingCallback) {
    this._interval = null;
    this._intervalTime = intervalTime;
    this._pollingCallback = pollingCallback;
};
IntervalPoller.prototype.getIntervalTime = function() {
    return this._intervalTime;
};
IntervalPoller.prototype.setIntervalTime = function(value) {
    if (!isNaN(value)) {
        this._intervalTime = value;
        if (null !== this._interval) {
            this.stop();
            this.start();
        }
    }
};
IntervalPoller.prototype.start = function(runAfterStart) {
    if (null === this._interval) {
        var _that = this;
        this._interval = setInterval(function() {
            _that._pollingCallback.call(_that);
        }, this._intervalTime);

        if (runAfterStart) {
            _that._pollingCallback.call(_that);
        }
    }
};
IntervalPoller.prototype.stop = function() {
    if (null !== this._interval) {
        clearInterval(this._interval);
        this._interval = null;
    }
};
exports.IntervalPoller = IntervalPoller;
