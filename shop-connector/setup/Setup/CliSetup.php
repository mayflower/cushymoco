<?php

namespace Setup;

use Setup\Abstracts\SetupAbstract;


class CliSetup extends SetupAbstract
{

    /**
     * @inheritdoc
     */
    protected function _getParameters()
    {
        $registeredOptions = $this->_registeredOptions;

        $parameters = array();

        $longOpts = array();
        $shortOpts = '';

        // make longOpts and shortOpts
        foreach ($registeredOptions as $opt) {
            if ($opt['requiredOrOptional'] === self::VALUE_REQUIRED) {
                $modifier = ':';
            } else if ($opt['requiredOrOptional'] === self::VALUE_OPTIONAL) {
                $modifier = '::';
            } else {
                $modifier = null;
            }

            $longOpt = $opt['longOpt'];
            $longOpt .= $modifier;

            // add longOpt to longOpts array
            $longOpts[] = $longOpt;

            if (isset($opt['shortOpt'])) {
                $shortOpt = $opt['shortOpt'];
                $shortOpt .= $modifier;

                // add shortOpt to shortOpts array
                $shortOpts .= $shortOpt;
            }
        }

        $optionValues = getopt($shortOpts, $longOpts);

        // get value of longOpt or shortOpt and put it in $parameters array
        foreach ($registeredOptions as $opt) {
            if (isset($optionValues[$opt['longOpt']])) {
                $parameters[$opt['longOpt']] = $optionValues[$opt['longOpt']];
            } else if (isset($opt['shortOpt']) && isset($optionValues[$opt['shortOpt']])) {
                $parameters[$opt['longOpt']] = $optionValues[$opt['shortOpt']];
            }
        }

        // get the default values
        foreach ($parameters as $option => $value) {
            if ($value === false
                && isset($registeredOptions[$option]['requiredOrOptional'])
                && $registeredOptions[$option]['requiredOrOptional'] === self::VALUE_OPTIONAL
                && isset($registeredOptions[$option]['defaultValue'])
            ) {
                $parameters[$option] = $registeredOptions[$option]['defaultValue'];
            }
        }

        return $parameters;
    }

}
