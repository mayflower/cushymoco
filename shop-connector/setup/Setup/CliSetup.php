<?php

namespace Setup;

use Setup\Abstracts\SetupAbstract;


class CliSetup extends SetupAbstract
{

    /**
     * @inheritdoc
     */
    protected function _getParam($longOpt, $shortOpt = null, $defaultValue = null, $requiredOrOptional = null) {
        if ($requiredOrOptional === self::PARAMETER_REQUIRED)
            $modifier = ':';
        else if ($requiredOrOptional === self::PARAMETER_OPTIONAL) {
            $modifier = '::';
        } else {
            $modifier = '';
        }

        $longOpt .= $modifier;
        $shortOpt .= $modifier;

        $options = getopt($shortOpt, array($longOpt));

        if (count($options)) {
            // get first value of array
            $value = reset($options);

            if (isset($defaultValue) && $value === false) {
                $value = $defaultValue;
            }
        } else {
            $value = null;
        }

        return $value;
    }

}
