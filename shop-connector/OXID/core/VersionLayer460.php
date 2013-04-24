<?php

require_once getShopBasePath() . 'core/interface/VersionLayerInterface.php';

class VersionLayer470 implements VersionLayerInterface
{
    /**
     * Returns the current basket from session.
     *
     * @return oxBasket
     */
    public function getBasket()
    {
//        return $this->getSession()->getBasket();
    }

    /**
     * Returns the OXID session object.
     *
     * @return oxSession
     */
    public function getSession()
    {
//        return oxRegistry::getSession();
    }

    /**
     * Return the OXID configuration object.
     *
     * @return oxConfig
     */
    public function getConfig()
    {
//        return oxRegistry::getConfig();
    }

    /**
     * Returns the OxDb
     *
     * @param boolean $bAssoc Should the mode be switched to assoc?
     * @return mixed
     */
    public function getDb($bAssoc = false)
    {
        if ($bAssoc) {
            $oDb = oxDb::getDb(oxDb::FETCH_MODE_ASSOC);
        } else {
            $oDb = oxDb::getDb(oxDb::FETCH_MODE_NUM);
        }
//        return $oDb;
    }

    /**
     * Returns the OXID delivery set list.
     *
     * @return oxDeliverySetList
     */
    public function getDeliverySetList()
    {
//        return oxRegistry::get('oxDeliverySetList');
    }

    /**
     * Return the OXID utilities object.
     *
     * @return oxUtils
     */
    public function getUtils()
    {
//        return oxRegistry::getUtils();
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
        $oConfig      = $this->getConfig();
        $mReturnValue = $oConfig->getRequestParameter($sName, $blRaw);

        if ($mReturnValue === null) {
            $mReturnValue = $mDefaultValue;
        }

//        return $mReturnValue;
    }

    /**
     * Returns the OXID languages object.
     *
     * @return oxLang
     */
    public function getLang()
    {
//        return oxRegistry::getLang();
    }

    /**
     * Returns the OXID server utilities object.
     *
     * @return oxUtilsServer
     */
    public function getUtilsServer()
    {
//        return oxRegistry::get('oxUtilsServer');
    }

    /**
     * Returns the OXID URL utilities object.
     *
     * @return oxUtilsUrl
     */
    public function getUtilsUrl()
    {
//        return oxRegistry::get('oxUtilsUrl');
    }

    /**
     * Returns the OXID view utilities object.
     *
     * @return oxUtilsView
     */
    public function getUtilsView()
    {
//        return oxRegistry::get('oxUtilsView');
    }

    /**
     * Returns the OXID object utilities object.
     *
     * @return oxUtilsObject
     */
    public function getUtilsObject()
    {
//        return oxRegistry::get('oxUtilsObject');
    }

    /**
     * Returns the OXID date utilities object.
     *
     * @return oxUtilsDate
     */
    public function getUtilsDate()
    {
//        return oxRegistry::get('oxUtilsDate');
    }

    /**
     * Returns the OXID string utilities object.
     *
     * @return oxUtilsString
     */
    public function getUtilsString()
    {
//        return oxRegistry::get('oxUtilsString');
    }

    /**
     * Returns the OXID file utilities object.
     *
     * @return oxUtilsFile
     */
    public function getUtilsFile()
    {
//        return oxRegistry::get('oxUtilsFile');
    }

    /**
     * Returns the OXID picture utilities object.
     *
     * @return oxUtilsPic
     */
    public function getUtilsPic()
    {
//        return oxRegistry::get('oxUtilsPic');
    }

    /**
     * Returns the OXID counting utilities object.
     *
     * @return oxUtilsCount
     */
    public function getUtilsCount()
    {
//        return oxRegistry::get('oxUtilsCount');
    }
}
