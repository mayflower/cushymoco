<?php

require_once getShopBasePath() . 'core/interface/VersionLayerInterface.php';

class VersionLayer460 implements VersionLayerInterface
{

    /**
     * Returns the current basket from session.
     *
     * @return oxBasket
     */
    public function getBasket()
    {
        return $this->getSession()->getBasket();
    }

    /**
     * Returns the OXID session object.
     *
     * @return oxSession
     */
    public function getSession()
    {
        return oxSession::getInstance();
    }

    /**
     * Return the OXID configuration object.
     *
     * @return oxConfig
     */
    public function getConfig()
    {
        return oxConfig::getInstance();
    }

    /**
     * Returns the OxDb
     *
     * @param boolean $bAssoc Should the mode be switched to assoc?
     * @return mixed
     */
    public function getDb($bAssoc = false)
    {
        return oxDb::getDb($bAssoc);
    }

    /**
     * Returns the OXID delivery set list.
     *
     * @return oxDeliverySetList
     */
    public function getDeliverySetList()
    {
        return oxDeliverySetList::getInstance();
    }

    /**
     * Return the OXID utilities object.
     *
     * @return oxUtils
     */
    public function getUtils()
    {
        return oxUtils::getInstance();
    }

    /**
     * Returns a request parameter.
     *
     * @param string $sName         Name of the request parameter.
     * @param mixed  $mDefaultValue Return value if $sName isn't set.
     * @param bool   $blRaw         return raw value.
     *
     * @return mixed
     */
    public function getRequestParam($sName, $mDefaultValue = null, $blRaw = false)
    {
        $mReturnValue = oxConfig::getParameter($sName, $blRaw);

        if ($mReturnValue === null) {
            $mReturnValue = $mDefaultValue;
        }

        return $mReturnValue;
    }

    /**
     * Returns the OXID languages object.
     *
     * @return oxLang
     */
    public function getLang()
    {
        return oxLang::getInstance();
    }

    /**
     * Returns the OXID server utilities object.
     *
     * @return oxUtilsServer
     */
    public function getUtilsServer()
    {
        return oxUtilsServer::getInstance();
    }

    /**
     * Returns the OXID URL utilities object.
     *
     * @return oxUtilsUrl
     */
    public function getUtilsUrl()
    {
        return oxUtilsUrl::getInstance();
    }

    /**
     * Returns the OXID view utilities object.
     *
     * @return oxUtilsView
     */
    public function getUtilsView()
    {
        return oxUtilsView::getInstance();
    }

    /**
     * Returns the OXID object utilities object.
     *
     * @return oxUtilsObject
     */
    public function getUtilsObject()
    {
        return oxUtilsObject::getInstance();
    }

    /**
     * Returns the OXID date utilities object.
     *
     * @return oxUtilsDate
     */
    public function getUtilsDate()
    {
        return oxUtilsDate::getInstance();
    }

    /**
     * Returns the OXID string utilities object.
     *
     * @return oxUtilsString
     */
    public function getUtilsString()
    {
        return oxUtilsString::getInstance();
    }

    /**
     * Returns the OXID file utilities object.
     *
     * @return oxUtilsFile
     */
    public function getUtilsFile()
    {
        return oxUtilsFile::getInstance();
    }

    /**
     * Returns the OXID picture utilities object.
     *
     * @return oxUtilsPic
     */
    public function getUtilsPic()
    {
        return oxUtilsPic::getInstance();
    }

    /**
     * Returns the OXID counting utilities object.
     *
     * @return oxUtilsCount
     */
    public function getUtilsCount()
    {
        return oxUtilsCount::getInstance();
    }

}

