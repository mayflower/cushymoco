<?php

namespace Setup;

use Setup\Abstracts\SetupAbstract;

class WebSetup extends SetupAbstract
{

    /**
     * @inheritdoc
     */
    public function run()
    {
        $this->_println("<pre>");

        parent::run();

        $this->_println("<pre>");
    }

    /**
     * @inheritdoc
     */
    protected function _getParameters() {
        $registeredOptions = $this->_registeredOptions;

        $parameters = array();

        foreach ($registeredOptions as $opt) {
            if (isset($_GET[$opt['longOpt']])) {
                $value = $_GET[$opt['longOpt']];
            } else if (isset($opt['shortOpt']) && isset($_GET[$opt['shortOpt']])) {
                $value = $_GET[$opt['shortOpt']];
            } else {
                $value = null;
            }

            if ($value === '') {
                if ($opt['requiredOrOptional'] === self::VALUE_REQUIRED) {
                    $value = null;
                } else if ($opt['requiredOrOptional'] === self::VALUE_REQUIRED
                    && isset($opt['defaultValue'])
                ) {
                    $value = $opt['defaultValue'];
                }
            }

            if (!is_null($value)) {
                $parameters[$opt['longOpt']] = $value;
            }

        }

        return $parameters;
    }

}
