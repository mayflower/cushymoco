var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

String.prototype.repeat = function(count) {
    return new Array(parseInt(count) + 1).join(this);
};

Alloy.createController("index");