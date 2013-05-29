<?php

namespace Logger;

class Logger
{
    /** @var String */
    protected $_logFile;

    /** @var resource */
    protected $_fileHandle;

    /**
     * @param $file
     */
    public function __construct($file)
    {
        $this->_logFile = $file;
    }

    /** */
    public function __destruct()
    {
        $fh = $this->_fileHandle;

        if (is_resource($fh)) {
            echo "[Logger] Close logfile: " . $this->_logFile . "\n";
            fclose($fh);
        }
    }

    public function log($message)
    {
        $fh = $this->_fileHandle;

        // open logfile on demand
        if (!is_resource($fh)) {
            echo "[Logger] Open logfile: " . $this->_logFile . "\n";
            $fh = $this->_lOpen();
        }

        fwrite($fh, $message . PHP_EOL);
    }

    /**
     * @return resource
     */
    protected function _lOpen()
    {
        $logFile = $this->_logFile;
        $fh = fopen($logFile, 'a') or exit("Can't open logfile: " . $logFile);
        $this->_fileHandle = $fh;

        return $fh;
    }

}
