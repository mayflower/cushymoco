<?php

function __autoload($className) {
    $replace = array(
        '\\'    => '/',
        '_'     => '/',
    );

    include APPLICATION_PATH . '/' . str_replace(array_keys($replace), array_values($replace), $className) . '.php';
}
