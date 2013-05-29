<?php

namespace Logger;

use Logger\Exception\LogAlreadyExistsException;

class Logger
{
    /** @var String */
    protected $_logFile;

    /** @var resource */
    protected $_fileHandle;

    /**
     * @param $logFile
     *
     * @throws Exception\LogAlreadyExistsException
     */
    public function __construct($logFile)
    {
        if (file_exists($logFile)) {
            throw new LogAlreadyExistsException("Log '$logFile' already exists");
        }

        $this->_logFile = $logFile;
    }

    /** */
    public function __destruct()
    {
        $fh = $this->_fileHandle;

        if (is_resource($fh)) {
            fclose($fh);
        }
    }

    /**
     * @param $message
     */
    public function log($message)
    {
        $fh = $this->_fileHandle;

        // open logfile on demand
        if (!is_resource($fh)) {
            $fh = $this->_lOpen();
        }

        fwrite($fh, $message . PHP_EOL);
    }

    /**
     * @return resource
     * @throws Exception\LogAlreadyExistsException
     */
    protected function _lOpen()
    {
        $logFile = $this->_logFile;

        $fh = fopen($logFile, 'a') or exit("Can't open logfile: " . $logFile);
        $this->_fileHandle = $fh;

        return $fh;
    }

}
