<?php

interface VersionLayerInterface
{
    /**
     * Returns the current basket from session.
     *
     * @return oxBasket
     */
    public function getBasket();

    /**
     * Returns the OXID session object.
     *
     * @return oxSession
     */
    public function getSession();

    /**
     * Return the OXID configuration object.
     *
     * @return oxConfig
     */
    public function getConfig();

    /**
     * Return the OXID utilities object.
     *
     * @return oxUtils
     */
    public function getUtils();

    /**
     * Returns the OXID languages object.
     *
     * @return oxLang
     */
    public function getLang();

    /**
     * Returns the OXID server utilities object.
     *
     * @return oxUtilsServer
     */
    public function getUtilsServer();

    /**
     * Returns the OXID URL utilities object.
     *
     * @return oxUtilsUrl
     */
    public function getUtilsUrl();

    /**
     * Returns the OXID view utilities object.
     *
     * @return oxUtilsView
     */
    public function getUtilsView();

    /**
     * Returns the OXID object utilities object.
     *
     * @return oxUtilsObject
     */
    public function getUtilsObject();

    /**
     * Returns the OXID date utilities object.
     *
     * @return oxUtilsDate
     */
    public function getUtilsDate();

    /**
     * Returns the OXID string utilities object.
     *
     * @return oxUtilsString
     */
    public function getUtilsString();

    /**
     * Returns the OXID file utilities object.
     *
     * @return oxUtilsFile
     */
    public function getUtilsFile();

    /**
     * Returns the OXID picture utilities object.
     *
     * @return oxUtilsPic
     */
    public function getUtilsPic();

    /**
     * Returns the OXID counting utilities object.
     *
     * @return oxUtilsCount
     */
    public function getUtilsCount();

    /**
     * Returns the OxDb
     *
     * @param boolean $bAssoc Should the mode be switched to assoc?
     * @return mixed
     */
    public function getDb($bAssoc = false);

    /**
     * Returns a request parameter.
     *
     * @param string $sName         Name of the request parameter.
     * @param mixed  $mDefaultValue Return value if $sName isn't set.
     * @param bool   $blRaw         return raw value.
     *
     * @return mixed
     */
    public function getRequestParam($sName, $mDefaultValue = null, $blRaw = false);

    /**
     * Returns the OXID delivery set list.
     *
     * @return oxDeliverySetList
     */
    public function getDeliverySetList();
}
