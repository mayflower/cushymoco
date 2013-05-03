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
    protected function _getParam($longOpt, $shortOpt = null, $defaultValue = null, $requiredOrOptional = null) {
        $value = null;

        if (isset($_GET[$longOpt])) {
            $value = $_GET[$longOpt];
        } else if (isset($_GET[$shortOpt])) {
            $value = $_GET[$shortOpt];
        }

        if (empty($value)) {
            if ($requiredOrOptional == self::PARAMETER_REQUIRED) {
                $value = null;
            } else if ($requiredOrOptional == self::PARAMETER_REQUIRED && isset($defaultValue)) {
                $value = $defaultValue;
            }
        }

        return $value;
    }

}
