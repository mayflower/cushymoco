<?php

namespace Setup\Abstracts;

use Logger\Logger;
use Logger\Exception\LogAlreadyExistsException;

abstract class SetupAbstract
{

    const VALUE_OPTIONAL = 1;
    const VALUE_REQUIRED = 2;

    const USE_LINKS = true;

    const SETUP_NAME = 'Shop-Connector Setup';

    /** @var array */
    protected $_params;

    /** @var array */
    protected $_registeredOptions = array();

    /** @var Logger */
    protected $_logger;

    /** @var String */
    protected $_installPath;

    /**
     * Gets all registered parameters and returns them as associative array.
     *
     * @return array
     */
    abstract protected function _getParameters();

    /**
     * Run setup process.
     */
    public function run()
    {
        $this->_registerOption('help',      'h');
        $this->_registerOption('shop',      's', null, self::VALUE_REQUIRED);
        $this->_registerOption('version',   'v', null, self::VALUE_REQUIRED);
        $this->_registerOption('path',      'p', null, self::VALUE_REQUIRED);
        $this->_registerOption('use-links', 'l');
        $this->_registerOption('force',     'f');
        $this->_registerOption('uninstall', 'u');

        $this->_params = $this->_getParameters();

        $params = $this->_params;

        // help
        if (isset($params['help'])) {
            $this->_printHelp();
            exit;
        }

        if (!empty($params)) {
            // this might be removed
            $this->_printUsedParams();

            // shop installation / uninstallation
            if (isset($params['uninstall'])) {
                $this->_uninstall();
            } else if (isset($params['shop'])) {
                $shop = $params['shop'];

                $installerMethod = "_install_$shop";

                if (method_exists($this, $installerMethod)) {
                    // install method for shop exists: run it!
                    $this->$installerMethod();
                } else {
                    // no install method found: inform user
                    $this->_printerr("The installer for shop '$shop' was not found");
                    exit(1);
                }
            } else {
                // no shop given: inform user
                $this->_printerr("You need to specify a shop");
            }
        } else {
            // no parameters: display help
            $this->_printHelp();
        }
    }

    /**
     * Determine if setup is run from CLI.
     *
     * @return bool
     */
    public static function onCLI()
    {
        return (PHP_SAPI == 'cli');
    }

    /**
     * @param string $longOpt
     * @param string $shortOpt             = null
     * @param string $defaultValue         = null
     * @param bool   $requiredOrOptional   = null
     */
    protected function _registerOption($longOpt, $shortOpt = null, $defaultValue = null, $requiredOrOptional = null) {
        $this->_registeredOptions[$longOpt] = array(
            'longOpt'               => $longOpt,
            'shortOpt'              => $shortOpt,
            'defaultValue'          => $defaultValue,
            'requiredOrOptional'    => $requiredOrOptional
        );
    }

    /**
     * Prints used params.
     */
    protected function _printUsedParams()
    {
        $params = $this->_params;

        $usedParams = print_r($params, true);
        $usedParams = substr($usedParams, '8', '-3');

        $this->_printInfo('Used parameters:');
        $this->_println();
        $this->_println($usedParams);
        $this->_println();
        $this->_println('--------------------------------------------------------------------------------');
        $this->_println();
    }

    /**
     * Print a message (without newline).
     *
     * @param string   $msg          = ''
     * @param resource $outputStream = null
     */
    protected function _print($msg = '', $outputStream = null)
    {
        if (isset($outputStream)) {
            fwrite($outputStream, $msg);
        } else {
            echo $msg;
        }
    }

    /**
     * Print a line.
     *
     * @param string   $msg          = ''
     * @param resource $outputStream = null
     */
    protected function _println($msg = '', $outputStream = null)
    {
        $newLine = "\n";

        $msg = $msg . $newLine;
        $this->_print($msg, $outputStream);
    }

    /**
     * @param string   $msg
     * @param resource $outputStream
     */
    protected function _printInfo($msg, $outputStream = null) {
        $msg = '[' . self::SETUP_NAME . '] ' . $msg;
        $this->_println($msg, $outputStream);
    }

    /**
     * Print an error message.
     *
     * @param $msg
     */
    protected function _printerr($msg)
    {
        $outputStream = STDERR;

        if (!self::onCLI()) {
            $outputStream = null;
        }

        $this->_printInfo('Error: ' . $msg, $outputStream);
    }

    /**
     * Prints an help page.
     */
    protected function _printHelp() {
        $this->_print(''.
                self::SETUP_NAME . "\n" .
                'Copyright (c) 2013+ Mayflower GmbH' . "\n" .
                '' . "\n" .
                'Usage: ' . "\n" .
                '  on cli: php setup.php [OPTIONS]' . "\n" .
                '  on web: setup.php?[OPTION_1]&[OPTION_2]&[OPTION_n]' . "\n" .
                '' . "\n" .
                'Example:' . "\n" .
                '  on cli: php setup.php --shop=<shop> [--version=<version>] --path=<path> [--use-links]' . "\n" .
                '  on web: setup.php?shop=<shop>[&version=<version>]&path=<path>[&use-links]' . "\n" .
                '' . "\n" .
                '' . "\n" .
                'Short and long options can be used from cli AND web while' . "\n" .
                'long options dominate short ones.' . "\n" .
                '' . "\n" .
                '' . "\n" .
                'OPTIONS:' . "\n" .
                '    -h, --help        Display this help.' . "\n" .
                '    -s, --shop=       The shop for which the connector should be installed.' . "\n" .
                '                      Available shops along with version are listed below.' . "\n" .
                '    -v, --version=    The version of the shop for which the shop-connector should' . "\n" .
                '                      be installed. Available shops along with version are listed below.' . "\n" .
                '    -p, --path=       The path to the existing shop installation.' . "\n" .
                '    -l, --use-links   Create links instead of copying files.' . "\n" .
                '    -f, --force       Force installation, uninstall old installation if necessary.' . "\n" .
                '    -u, --uninstall   Uninstall shop connector for specified shop.' . "\n" .
                '' . "\n" .
                '' . "\n" .
                'SHOPS AND VERSIONS:' . "\n" .
                '    oxid:   OXID eShop' . "\n" .
                '                Versions: 4.6' . "\n" .
                '                          4.7' . "\n" .
                '' . "\n"
        );
    }

    /**
     *
     */
    protected function _getInstallPath()
    {
        if (!isset($this->_installPath)) {
            if (!isset($this->_params['path'])) {
                // shop path not set: inform user
                $this->_printerr('You have to specify an installation path');
                exit(1);
            } else if (!is_dir($this->_params['path'])) {
                // shop path not a directory: inform user
                $this->_printerr('You have specified an invalid installation path');
                exit(1);
            }

            // Validate path to only use '/'
            $this->_installPath = rtrim(
                preg_replace(
                    '/\/+|\\\\+/',
                    '/',
                    $this->_params['path']
                ),
                '/'
            );
        }

        return $this->_installPath;
    }

    /**
     * @return string
     * @throws \Exception
     */
    protected function _getLogFile()
    {
        $path = $this->_getInstallPath();

        return $path . '/.cushymoco_install_log.log';
    }

    /**
     * @return Logger
     */
    protected function _getLogger()
    {
        if (!($this->_logger instanceof Logger)) {
            $logFile = $this->_getLogFile();
            $this->_logger = new Logger($logFile);
        }

        return $this->_logger;
    }

    /**
     * @param $dir
     *
     * @return bool
     */
    protected function _dirEmpty($dir)
    {
        $directory = scandir($dir);

        // Remove '.' and '..' from directory array
        $directory = array_diff(
            array('.', '..'),
            $directory
        );

        return (count($directory) == 0);
    }

    /**
     * Rollback
     *
     * @param string $startMsg
     * @param string $endMsg
     */
    protected function _rollback($startMsg = "Rolling back...", $endMsg = "Rollback done.")
    {
        $this->_printInfo($startMsg);

        $installedItems = file($this->_getLogFile(), FILE_IGNORE_NEW_LINES + FILE_SKIP_EMPTY_LINES);
        // Reverse array to remove files before folders
        $installedItems = array_reverse($installedItems);



        foreach ($installedItems as $item) {
            if (is_file($item)) {
                $this->_printInfo("    Removing file: " . $item);
                unlink($item);
            } else if (is_dir($item) && $this->_dirEmpty($item)) {
                $this->_printInfo("    Removing directory: " . $item);
                rmdir($item);
            } else {
                $this->_printInfo("    Skipping '$item': File or directory not found.");
            }
        }

        unlink($this->_getLogFile());

        $this->_printInfo($endMsg);
    }

    /**
     * Copy files recursive.
     *
     * If $useLinks is set to true, symlinks will be created instead of being
     * files copied.
     *
     * @param      $src
     * @param      $dst
     * @param bool $useLinks = false
     */
    protected function _copyRecursive($src, $dst, $useLinks = false) {
        $dir = opendir($src);
        $logger = $this->_getLogger();

        if (!file_exists($dst)) {
            $this->_printInfo('    Createing dir: ' . $dst);
            mkdir($dst);
            $logger->log($dst);
        }

        while(false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->_copyRecursive($src . '/' . $file, $dst . '/' . $file, $useLinks);
                } else {
                    $srcTrimmed = str_replace(APPLICATION_ROOT . '/', '', $src);

                    if ($useLinks === self::USE_LINKS) {
                        $this->_printInfo("    Creating link: ${srcTrimmed}/${file} -> ${dst}/${file}");
                        $logger->log("${dst}/${file}");
                        symlink($src . '/' . $file, $dst . '/' . $file);
                    } else {
                        $this->_printInfo("    Copying file: ${srcTrimmed}/${file} -> ${dst}/${file}");
                        $logger->log("${dst}/${file}");
                        copy($src . '/' . $file, $dst . '/' . $file);
                    }
                }
            }
        }

        closedir($dir);
    }

    /**
     * Installer
     *
     * @param $src
     * @param $dst
     * @param $useLinks
     */
    protected function _install($src, $dst, $useLinks)
    {
        $force = isset($this->_params['force']);

        try {
            // Try getting logger. If logfile is found, an exception will be thrown and the installation should be canceled.
            $this->_getLogger();
        } catch (LogAlreadyExistsException $e) {
            if ($force) {
                // Uninstall old installation and continue installation
                $this->_rollback("Rolling back old installation...");
            } else {
                $this->_printerr("Previous installation detected. Use option '-f' to force installation.");
                exit(1);
            }
        }

        $this->_printInfo('Installing shop connector: ' . $this->_params['shop'] . ' v' . $this->_params['version']);
        $this->_copyRecursive($src, $dst, $useLinks);
        $this->_printInfo('Installation done.');
    }

    /**
     * Uninstaller
     */
    protected function _uninstall()
    {
        // Validate install path
        $this->_getInstallPath();

        $this->_rollback(
            'Uninstalling shop connector...',
            'Uninstall complete.'
        );
    }

    /**
     * Installer for OXID shop
     */
    protected function _install_oxid()
    {
        $params = $this->_params;

        $shop = $params['shop'];

        if (isset($params['version'])) {
            $version = $params['version'];
            $versionUnderscored = str_replace('.', '_', $version);

            $setupMethod = "__install_${shop}_version_${versionUnderscored}";

            if (method_exists($this, $setupMethod)) {
                // install method for shop version exists: run it!
                $this->$setupMethod();
            } else {
                // no install method found: inform user
                $this->_printerr("The installer for shop '$shop' with version '$version' was not found");
                exit(1);
            }
        } else {
            // no version: inform user
            $this->_printerr("You have to specify a version for shop 'oxid'");
        }
    }

    /**
     * Installer for OXID 4.6
     */
    protected function __install_oxid_version_4_6()
    {
        $params = $this->_params;

        $connectorPath = realpath(APPLICATION_ROOT . '/OXID');
        $shopPath      = $this->_getInstallPath();

        $useLinks = (isset($params['use-links'])
            ? self::USE_LINKS
            : null
        );

        $pathMapping = array(
            'core'                     => 'core',
            'application/views'        => 'out',
            'application/controllers'   => 'views',
        );

        foreach ($pathMapping as $original => $new) {
            $this->_install($connectorPath . '/' . $original, $shopPath . '/' . $new, $useLinks);
        }
    }

    /**
     * Installer for OXID shop 4.7
     */
    protected function __install_oxid_version_4_7()
    {
        $params = $this->_params;

        $connectorPath = realpath(APPLICATION_ROOT . '/OXID');
        $shopPath      = $this->_getInstallPath();

        $useLinks = (isset($params['use-links'])
            ? self::USE_LINKS
            : null
        );

        $this->_install($connectorPath, $shopPath, $useLinks);
    }

}
