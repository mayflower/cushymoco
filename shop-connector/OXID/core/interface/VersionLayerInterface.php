<?php

interface VersionLayerInterface
{
    /**
     * @return oxBasket
     */
    public function getBasket();

    /**
     * @return oxSession
     */
    public function getSession();

    /**
     * @return oxConfig
     */
    public function getConfig();

    /**
     * @return oxUtils
     */
    public function getUtils();

    /**
     * @return oxLang
     */
    public function getLang();

    /**
     * @return oxUtilsServer
     */
    public function getUtilsServer();

    /**
     * @return oxUtilsUrl
     */
    public function getUtilsUrl();

    /**
     * @return oxUtilsView
     */
    public function getUtilsView();

    /**
     * @return oxUtilsObject
     */
    public function getUtilsObject();

    /**
     * @return oxUtilsDate
     */
    public function getUtilsDate();

    /**
     * @return oxUtilsString
     */
    public function getUtilsString();

    /**
     * @return oxUtilsFile
     */
    public function getUtilsFile();

    /**
     * @return oxUtilsPic
     */
    public function getUtilsPic();

    /**
     * @return oxUtilsCount
     */
    public function getUtilsCount();

    /**
     * @param      $sName
     * @param null $mDefaultValue
     * @param bool $blRaw
     *
     * @return mixed
     */
    public function getRequestParam($sName, $mDefaultValue = null, $blRaw = false);

    /**
     * @return oxDeliverySetList
     */
    public function getDeliverySetList();
}
