<?php
require_once getShopBasePath() . 'core/interface/VersionLayerInterface.php';
class VersionLayer470 implements VersionLayerInterface
{
    /**
     * @return oxbasket
     */
    public function getBasket()
    {
        return $this->getSession()->getBasket();
    }

    /**
     * @return OxSession
     */
    public function getSession()
    {
        return oxRegistry::getSession();
    }

    /**
     * @return OxConfig
     */
    public function getConfig()
    {
        return oxRegistry::getConfig();
    }

    /**
     * @return oxDeliverySetList
     */
    public function getDeliverySetList()
    {
        return oxRegistry::get('oxDeliverySetList');
    }

    /**
     * @return oxUtils
     */
    public function getUtils()
    {
        return oxRegistry::getUtils();
    }

    /**
     * @param      $sName
     * @param null $mDefaultValue
     * @param bool $blRaw
     *
     * @return mixed
     */
    public function getRequestParam($sName, $mDefaultValue = null, $blRaw = false)
    {
        $oConfig = $this->getConfig();
        $mReturnValue = $oConfig->getRequestParameter($sName, $blRaw);

        if ($mReturnValue === null) {
            $mReturnValue = $mDefaultValue;
        }

        return $mReturnValue;
    }

    /**
     * @return oxLang
     */
    public function getLang()
    {
        return oxRegistry::getLang();
    }

    /**
     * @return oxUtilsServer
     */
    public function getUtilsServer()
    {
        return oxRegistry::get('oxUtilsServer');
    }

    /**
     * @return oxUtilsUrl
     */
    public function getUtilsUrl()
    {
        return oxRegistry::get('oxUtilsUrl');
    }

    /**
     * @return oxUtilsView
     */
    public function getUtilsView()
    {
        return oxRegistry::get('oxUtilsView');
    }

    /**
     * @return oxUtilsObject
     */
    public function getUtilsObject()
    {
        return oxRegistry::get('oxUtilsObject');
    }

    /**
     * @return oxUtilsDate
     */
    public function getUtilsDate()
    {
        return oxRegistry::get('oxUtilsDate');
    }

    /**
     * @return oxUtilsString
     */
    public function getUtilsString()
    {
        return oxRegistry::get('oxUtilsString');
    }

    /**
     * @return oxUtilsFile
     */
    public function getUtilsFile()
    {
        return oxRegistry::get('oxUtilsFile');
    }

    /**
     * @return oxUtilsPic
     */
    public function getUtilsPic()
    {
        return oxRegistry::get('oxUtilsPic');
    }

    /**
     * @return oxUtilsCount
     */
    public function getUtilsCount()
    {
        return oxRegistry::get('oxUtilsCount');
    }
}
