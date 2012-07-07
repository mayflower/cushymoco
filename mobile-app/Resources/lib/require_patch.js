/*
 * Monkey patch for require:
 * - only load a module once per context (performance/efficiency++)
 */
exports.monkeypatch = function(object) {
	var scriptRegistry = {},
		old_require = object.require;
	object.require = function(moduleName, blPlatform) {
		if(blPlatform) {
			moduleName = moduleName + '.' + Ti.Platform.osname;
		}
		if (!scriptRegistry[moduleName]) {
            scriptRegistry[moduleName] = old_require(moduleName);
            var moduleParts = moduleName.split('/');
            if (moduleParts.length > 1) {
                var modulePart = moduleParts.pop();
                scriptRegistry[modulePart] = scriptRegistry[moduleName];

                Ti.API.info(scriptRegistry[moduleName]);
            }
		}
		return scriptRegistry[moduleName];
	};
};