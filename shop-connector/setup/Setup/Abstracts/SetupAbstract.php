<?php

namespace Setup\Abstracts;

abstract class SetupAbstract
{

    const PARAMETER_OPTIONAL = 1;
    const PARAMETER_REQUIRED = 2;

    const USE_LINKS = true;

    const SETUP_NAME = 'Shop-Connector Setup';

    /** @var array */
    protected $_params;

    /**
     * Get parameters from cli or web (or what else...)
     *
     * @param      $longOpt
     * @param null $shortOpt
     * @param bool $defaultValue
     * @param null $requiredOrOptional
     *
     * @return mixed
     */
    abstract protected function _getParam($longOpt, $shortOpt = null, $defaultValue = null, $requiredOrOptional = null);

    /**
     * Run setup process.
     */
    public function run()
    {
        $params = $this->_params = $this->_getParameters();

        // this might be removed
        $this->_printParams();

        // help
        if (isset($params['help'])) {
            $this->_printHelp();
            exit;
        }

        if (!empty($params)) {
            // shop installation
            if (isset($params['shop'])) {
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
     * @return array
     */
    protected function _getParameters()
    {
        $parameters = array(
            'help'      => $this->_getParam('help',      'h'),
            'shop'      => $this->_getParam('shop',      's', null, self::PARAMETER_REQUIRED),
            'version'   => $this->_getParam('version',   'v', null, self::PARAMETER_REQUIRED),
            'path'      => $this->_getParam('path',      'p', null, self::PARAMETER_REQUIRED),
            'use-links' => $this->_getParam('use-links', 'l'),
        );

        foreach ($parameters as $key => $param) {
            if (is_null($param)) {
                unset($parameters[$key]);
            }
        }

        return $parameters;
    }

    /** */
    protected function _printParams()
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
     * Print a line.
     *
     * @param               $msg     = ''
     * @param resource $outputStream = null
     */
    protected function _println($msg = '', $outputStream = null)
    {
        $newLine = "\n";

        if (isset($outputStream)) {
            fwrite($outputStream, $msg . $newLine);
        } else {
            echo $msg . $newLine;
        }
    }

    /**
     * @param      $msg
     * @param null $outputStream
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
        $this->_println('HELP');
        $this->_println('HELP');
        $this->_println('HELP');
    }

    /**
     * @param      $src
     * @param      $dst
     * @param bool $useLinks = false
     */
    protected function _copyRecursive($src, $dst, $useLinks = false) {
        $dir = opendir($src);

        @mkdir($dst);

        while(false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->_copyRecursive($src . '/' . $file, $dst . '/' . $file, $useLinks);
                } else {
                    $srcTrimmed = str_replace(APPLICATION_ROOT . '/', '', $src);

                    if ($useLinks === self::USE_LINKS) {
                        $this->_printInfo("Creating link: ${srcTrimmed}/${file} -> ${dst}/${file}");
                        symlink($src . '/' . $file, $dst . '/' . $file);
                    } else {
                        $this->_printInfo("Copying file: ${srcTrimmed}/${file} -> ${dst}/${file}");
                        copy($src . '/' . $file, $dst . '/' . $file);
                    }
                }
            }
        }

        closedir($dir);
    }

    /**
     * Installer for OXID shop
     */
    protected function _install_oxid()
    {
        $params = $this->_params;

        $shop = $params['shop'];

        if (!isset($params['path'])) {
            // shop path not set: inform user
            $this->_printerr('You have to specify an installation path');
            exit(1);
        } else if (!is_dir($params['path'])) {
            // shop path not a directory: inform user
            $this->_printerr('You have specified an invalid installation path');
            exit(1);
        }

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
        $shopPath      = $params['path'];

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
            $this->_copyRecursive($connectorPath . '/' . $original, $shopPath . '/' . $new, $useLinks);
        }
    }

    /**
     * Installer for OXID shop 4.7
     */
    protected function __install_oxid_version_4_7()
    {
        $params = $this->_params;

        $connectorPath = realpath(APPLICATION_ROOT . '/OXID');
        $shopPath      = $params['path'];

        $useLinks = (isset($params['use-links'])
            ? self::USE_LINKS
            : null
        );

        $this->_copyRecursive($connectorPath, $shopPath, $useLinks);
    }

}
