exports.cliVersion = '>=3.X';

var SPLASH = [
    '',
    '__/\\\\\\\\\\\\\\\\\\\\\\______/\\\\\\_____/\\\\\\\\\\\\\\\\\\__________________         ',
    ' _\\/////\\\\\\///___/\\\\\\\\\\\\\\___/\\\\\\///////\\\\\\________________        ',
    '  _____\\/\\\\\\_____\\/////\\\\\\__\\/\\\\\\_____\\/\\\\\\________________       ',
    '   _____\\/\\\\\\_________\\/\\\\\\__\\///\\\\\\\\\\\\\\\\\\/____/\\\\/\\\\\\\\\\\\___      ',
    '    _____\\/\\\\\\_________\\/\\\\\\___/\\\\\\///////\\\\\\__\\/\\\\\\////\\\\\\__     ',
    '     _____\\/\\\\\\_________\\/\\\\\\__/\\\\\\______\\//\\\\\\_\\/\\\\\\__\\//\\\\\\_    ',
    '      _____\\/\\\\\\_________\\/\\\\\\_\\//\\\\\\______/\\\\\\__\\/\\\\\\___\\/\\\\\\_   ',
    '       __/\\\\\\\\\\\\\\\\\\\\\\_____\\/\\\\\\__\\///\\\\\\\\\\\\\\\\\\/___\\/\\\\\\___\\/\\\\\\_  ',
    '        _\\///////////______\\///_____\\/////////_____\\///____\\///___',
    '         ________________________________________Locale_Compiler__',
    ''
];

exports.init = function(logger, config, cli, appc) {
    var path = require('path'),
        afs = appc.fs,
        i18n = appc.i18n(__dirname),
        __ = i18n.__,
        __n = i18n.__n,
        exec = require('child_process').exec,
        spawn = require('child_process').spawn;
    
    cli.addHook('build.pre.compile', {
        priority: 2000,
        post: function(build, finished) {
            var sdkPath = cli.sdk.path,
                appDir = cli.argv['project-dir'],
                i18nPath = path.join(appDir, 'i18n'),
                localeCompiler = path.join(sdkPath, 'common', 'localecompiler.py');
                
            SPLASH.map(function(line) {
                logger.info(line);
            });
                
            if (!afs.exists(path.join(i18nPath))) {
                logger.info(__("I18n path doesn't exists. Skipping..."));
                finished();
                return;
            }

            if (!afs.exists(localeCompiler)) {
                logger.error(__("Can't find locale compiler!"));
                finished();
                process.exit(1);
                return;
            }

            logger.info(__('localecompiler.py found at %s', localeCompiler));
            
            var locCompilerCmd = 'python "' + [localeCompiler, appDir, build.deviceFamily, build.deployType].join('" "') + '"';
            
            exec(locCompilerCmd, function(err, stdout, err) {
                if (err) {
                    stderr.split('\n').map(function(line) {
                        logger.error(line);
                    });
                    process.exit(1);
                }
                
                stdout.split('\n').map(function(line) {
                    logger.trace(line);
                });

                finished();
            });
        }
    });
};
