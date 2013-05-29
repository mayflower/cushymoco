<?php

// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(__DIR__));

// Define path to application root
defined('APPLICATION_ROOT')
    || define('APPLICATION_ROOT', realpath(__DIR__ . '/..'));

// Define whether application is executed from cli or not
define('CLI', (PHP_SAPI == 'cli' ? true : false));


require_once 'autoloader.php';

use Setup\Abstracts\SetupAbstract as Setup;
use Setup\CliSetup;
use Setup\WebSetup;


if (Setup::onCLI()) {
    $setup = new CliSetup();
} else {
    $setup = new WebSetup();
}

$setup->run();
