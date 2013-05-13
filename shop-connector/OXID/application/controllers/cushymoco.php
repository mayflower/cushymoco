<?php
/**
 *  View for Ajax access
 */
class cushymoco extends oxUBase
{
    /**
     * Version of this view.
     *
     * @const string
     */
    const VERSION = '0.4.0';

    /**
     * @var string Template Script
     */
    protected $_sThisTemplate = 'page/cushymoco/cushymoco.tpl';

    /**
     * @var mixed Data that is returned via JSON
     */
    protected $_sAjaxResponse;

    /**
     * @var VersionLayerInterface
     */
    protected $_oVersionLayer;

    /**
     * Instance cache for country to display name resolves.
     *
     * @var array
     */
    protected $_aCountryIdCache = array();

    /**
     * Instance cache for state to display name resolves.
     *
     * @var array
     */
    protected $_aStateIdCache = array();

    /**
     * Custom exception handler.
     *
     * @param Exception $oException Uncaught exception.
     *
     * @return void
     */
    public function exceptionHandler($oException)
    {
        $oLang    = $this->_oVersionLayer->getLang();
        $sMessage = $this->_encodeOutput(
            $this->_errorMessage(
                $oLang->translateString($oException->getMessage())
            )
        );

        exit($sMessage);
    }

    /**
     * Initializes all required components.
     *
     * @return null|void
     */
    public function init()
    {
        parent::init();

        set_exception_handler(array($this, 'exceptionHandler'));

        try {
            $this->_initVersionLayer();
        } catch (Exception $e) {
            $sMessage = json_encode(
                $this->_errorMessage(
                    $e->getMessage()
                ),
                JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
            );
            if ($this->_hasRegistry('getUtils')) {
                $oUtils = oxRegistry::getUtils();
            } else {
                $oUtils = oxUtils::getInstance();
            }

            $oUtils->showMessageAndExit($sMessage);
        }
    }

    /**
     * Render template
     *
     * @return string The template name
     */
    public function render()
    {
        $sTemplate                         = parent::render();
        $this->_aViewData['sAjaxResponse'] = $this->_encodeOutput($this->_sAjaxResponse);

        return $sTemplate;
    }

    /**
     * Encodes the output.
     *
     * @param mixed $mOutput Output to encode.
     *
     * @return string
     */
    private function _encodeOutput($mOutput)
    {
        return json_encode(
            $mOutput,
            JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        );
    }

    /**
     * Loads the layer class for the different OXID eShop versions.
     *
     * @return void
     */
    private function _initVersionLayer()
    {
        list($sLayerClassFile, $sLayerClass) = $this->_loadLayerConfig();

        if ($sLayerClassFile === null || $sLayerClass === null) {
            list($sLayerClassFile, $sLayerClass) = $this->_loadVersionLayer();
        }

        include_once getShopBasePath() . 'core/' . $sLayerClassFile;
        $this->_oVersionLayer = new $sLayerClass();
    }

    /**
     * Loads the version layer configuration from the database.
     *
     * @return array
     */
    private function _loadLayerConfig()
    {
        if ($this->_hasRegistry('getConfig')) {
            $oConfig = oxRegistry::getConfig();
        } else {
            $oConfig = $this->getConfig();
        }

        $sLayerClassFile = $oConfig->getShopConfVar('sLayerClassFile', null, 'mayflower:cushymoco');
        $sLayerClass     = $oConfig->getShopConfVar('sLayerClass', null, 'mayflower:cushymoco');

        return array($sLayerClassFile, $sLayerClass);
    }

    /**
     * Saves the given version layer file- and class name to the shop config.
     *
     * @param $sLayerClassFile
     * @param $sLayerClass
     */
    private function _saveLayerConfig($sLayerClassFile, $sLayerClass)
    {
        if ($this->_hasRegistry('getConfig')) {
            $oConfig = oxRegistry::getConfig();
        } else {
            $oConfig = $this->getConfig();
        }

        $oConfig->saveShopConfVar('str', 'sLayerClassFile', $sLayerClassFile, null, 'cushymoco');
        $oConfig->saveShopConfVar('str', 'sLayerClass', $sLayerClass, null, 'cushymoco');
    }

    /**
     * Determines, whether we have the oxRegistry Class or not.
     *
     * @param string $sMethod Name of the method to check whether it exists or not.
     *
     * @return bool
     */
    private function _hasRegistry($sMethod = null)
    {
        $blRegistryExists = class_exists('oxRegistry');
        if (!$blRegistryExists || $sMethod === null) {
            return $blRegistryExists;
        }

        $blMethodExists = method_exists('oxRegistry', $sMethod);

        return $blRegistryExists && $blMethodExists;
    }

    /**
     * Loads a version layer. Throws an exception if there isn't a suitable layer.
     *
     * @throws Exception
     *
     * @return array
     */
    private function _loadVersionLayer()
    {
        /**
         * @var DirectoryIterator $oEntry
         */

        $sShopVersion         = $this->getShopVersion();
        $sMaxVersionLayerFile = 'VersionLayer' . str_replace('.', '', $sShopVersion) . '.php';
        $sLayerClassPattern   = 'VersionLayer'
            . str_replace('.', '', substr($sShopVersion, 0, strrpos($sShopVersion, '.')))
            . '*.php';
        $aLayerClasses        = array();
        $oDI                  = new DirectoryIterator(getShopBasePath() . 'core');
        foreach ($oDI as $oEntry) {
            if (
                $oEntry->isDir() ||
                $oEntry->isDot() ||
                !$oEntry->isReadable() ||
                !fnmatch($sLayerClassPattern, $oEntry->getFilename())
            ) {
                continue;
            }

            $aLayerClasses[] = $oEntry->getFilename();
        }

        if (count($aLayerClasses) == 0) {
            throw new Exception("Can't find any shop version layer.");
        }

        natsort($aLayerClasses);

        do {
            $sLayerClassFile = array_pop($aLayerClasses);
            if ($sLayerClassFile === null) {
                throw new Exception("Can't find suitable version layer class for your shop.");
            }
        } while (strnatcmp($sMaxVersionLayerFile, $sLayerClassFile) < 0);

        $sLayerClass = basename($sLayerClassFile, '.php');

        $this->_saveLayerConfig($sLayerClassFile, $sLayerClass);

        return array($sLayerClassFile, $sLayerClass);
    }

    /**
     * Put together an message
     *
     * @param mixed $error   error data
     * @param mixed $result  result data
     *
     * @return array
     */
    protected function _generateMessage($error = null, $result = null)
    {
        return array(
            'error'  => $error,
            'result' => $result,
        );
    }

    /**
     * Put an error message
     *
     * @param $error
     *
     * @return array
     */
    protected function _errorMessage($error)
    {
        return $this->_generateMessage($error);
    }

    /**
     * Put an success message
     *
     * @param $result
     *
     * @return array
     */
    protected function _successMessage($result)
    {
        return $this->_generateMessage(null, $result);
    }

    /**
     * Get session id
     *
     * @return null|string
     */
    protected function _getSessionId()
    {
        $sSessionId = $this->_oVersionLayer->getRequestParam('sid');
        $oSession   = $this->_oVersionLayer->getSession();
        if (empty($sSessionId)) {
            $oSession->setForceNewSession();
            $oSession->start();
            $sSessionId = $oSession->getId();
        } else {
            $oSession->setId($sSessionId);
        }

        return $sSessionId;
    }

    /**
     * load an article object
     *
     * @param string $key             Parameter that contains the OXID of the product.
     * @param bool   $blReturnVariant If the product is a variant, return it or its parent product.
     *
     * @return bool|oxarticle
     */
    protected function _getArticleById($key = 'anid', $blReturnVariant = false)
    {
        /**
         * @var oxArticle $oArticle
         */
        $sArticleId = $this->_oVersionLayer->getRequestParam($key);
        if (empty($sArticleId)) {
            $this->_sAjaxResponse = $this->_errorMessage("article id not provided");
        } else {
            $oArticle = oxNew('oxarticle');

            if ($oArticle->load($sArticleId)) {
                if (!$blReturnVariant && $oArticle->isMdVariant()) {
                    return $oArticle->getParentArticle();
                }

                return $oArticle;
            }

            $this->_sAjaxResponse = $this->_errorMessage("article could not be loaded");
        }

        return false;
    }

    /**
     * Returns the "oxcmp_user" component.
     *
     * @return oxCmp_User
     */
    protected function _getUserCmp()
    {
        $aCmps = $this->getComponents();

        return $aCmps['oxcmp_user'];
    }

    /**
     * Log in user
     *
     * Parameter: lgn_usr username
     * Parameter: lgn_pwd password
     *
     * Return: sessionId
     */
    public function login()
    {
        /**
         * @var oxUser $oUser
         */
        $sUserName = $this->_oVersionLayer->getRequestParam('lgn_usr');
        $sUserPwd  = $this->_oVersionLayer->getRequestParam('lgn_pwd');
        $sCookie   = $this->_oVersionLayer->getRequestParam('lgn_cook');
        if (!empty($sUserName) && !empty($sUserPwd)) {
            try {
                $oUser = oxNew('oxUser');
                $oUser->login($sUserName, $sUserPwd, $sCookie);
                $aLogin = array(
                    'username'   => $oUser->oxuser__oxfname->value . ' ' . $oUser->oxuser__oxlname->value,
                    'customerNo' => $oUser->oxuser__oxcustnr->value,
                    'email'      => $oUser->oxuser__oxusername->value,
                    'userId'     => $oUser->getId(),
                    'sessionId'  => $this->_getSessionId(),
                );

                $this->_sAjaxResponse = $this->_successMessage($aLogin);
            } catch (Exception $e) {
                $this->exceptionHandler($e);
            }
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("User " . $sUserName . " can not be logged in");
        }
    }

    /**
     * Get content page
     *
     * Return array
     */
    public function getContent()
    {
        $sContentId = $this->_oVersionLayer->getRequestParam('cnid');
        $iLangId    = $this->_oVersionLayer->getRequestParam('lid');
        $sShopId    = $this->_oVersionLayer->getRequestParam('shp');

        if (empty($sContentId)) {
            $aResult = $this->getMobileContentList($iLangId, $sShopId);
        } else {
            // Oxid chooses shop on it's own
            $aResult = $this->getMobileContent($sContentId, $iLangId);
        }

        $this->_sAjaxResponse = $this->_successMessage($aResult);
    }

    /**
     * Get a content snippet
     *
     * @param string  $sContent oxloadid for the snippet
     * @param integer $iLangId  Language Id
     *
     * @return array
     */
    protected function getMobileContent($sContentId, $iLangId = null)
    {
        $oContent = oxNew('oxcontent');
        $oContent->setLanguage($iLangId);
        $oContent->loadByIdent($sContentId);
        $aResult = array(
            'title'   => $oContent->oxcontents__oxtitle->value,
            'content' => $oContent->oxcontents__oxcontent->value,
            'cnid'    => $oContent->oxcontents__oxloadid->value,
        );

        return $aResult;
    }

    /**
     * Get all Contents for the mobile app
     *
     * @param integer $iLangId Language Id
     * @param string  $sShopId Shop Id (for EE multishops)
     *
     * @return array
     */
    protected function getMobileContentList($iLangId = null, $sShopId = null)
    {
        if (empty($sShopId)) {
            $sEdition = $this->getShopEdition();
	    if ($sEdition == "EE") {
                $sShopId = 1; // default to first shop
            } else {
                $sShopId = "oxbaseshop"; // CE and PE use this as shopid
            }
        }
        $sViewName = getViewName('oxcontents', $iLangId, $sShopId);
        $sSelect   = "SELECT oxloadid AS contentId, oxtitle AS title FROM `$sViewName` " .
                     "WHERE oxloadid IN ('oxagb','oximpressum') AND OXSHOPID = '$sShopId' " .
                     "UNION SELECT oxloadid, oxtitle FROM `$sViewName` " .
                     "WHERE oxloadid LIKE 'mfCushymoco%' AND NOT oxloadid = 'mfCushymocoStart' ".
                     "AND OXSHOPID = '$sShopId'";
        $oDb       = $this->_oVersionLayer->getDb(true);
        $aContents = $oDb->getAll($sSelect);

        return $aContents;
    }

    /**
     * Log out user
     *
     * Return: sessionId
     */
    public function logout()
    {
        $sSessionId = $this->_getSessionId();
        $oCmpUsr    = $this->_getUserCmp();

        if ($sSessionId != '') {
            $oSession = $this->_oVersionLayer->getSession();
            if ($sSessionId != '' && $sSessionId == $oSession->getId()) {
                $oCmpUsr->logout();
                $oSession->destroy();

                $aLogout = array(
                    'sessionId' => $sSessionId,
                    'logout'    => true,
                );

                $this->_sAjaxResponse = $this->_successMessage($aLogout);
            } else {
                $this->_sAjaxResponse = $this->_errorMessage("User cannot be logged out");
            }
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("Session id missing");
        }
    }

    /**
     * Provides data on the currently logged on user
     */
    public function getUserData()
    {
        /**
         * @var oxUser $oUser
         */
        $oUser = $this->_oVersionLayer->getSession()->getUser();

        if (is_object($oUser) && $oUser->isLoaded() && isset($oUser->oxuser__oxcustnr->value)) {
            $aResult = array(
                'username'  => $oUser->oxuser__oxusername->value,
                'firstname' => $oUser->oxuser__oxfname->value,
                'lastname'  => $oUser->oxuser__oxlname->value,
                'company'   => $oUser->oxuser__oxcompany->value,
            );

            $this->_sAjaxResponse = $this->_successMessage($aResult);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("user not logged on");
        }
    }

    /**
     * Returns detailed information about the logged-in user.
     */
    public function getAccountData()
    {
        /**
         * @var oxAddress $oUserAddress
         */
        $oUser = $this->_oVersionLayer->getSession()->getUser();

        if (is_object($oUser) && $oUser->isLoaded() && isset($oUser->oxuser__oxcustnr->value)) {
            $aResult = array(
                'user'     => array(
                    'username'     => $oUser->oxuser__oxusername->value,
                    'firstname'    => $oUser->oxuser__oxfname->value,
                    'lastname'     => $oUser->oxuser__oxlname->value,
                    'customerNo'   => $oUser->oxuser__oxcustnr->value,
                    'company'      => $oUser->oxuser__oxcompany->value,
                    'phone'        => $oUser->oxuser__oxfon->value,
                    'fax'          => $oUser->oxuser__oxfax->value,
                    'privatePhone' => $oUser->oxuser__oxprivfon->value,
                    'mobile'       => $oUser->oxuser__oxmobfon->value,
                ),
                'billing'  => array(
                    'street'     => $oUser->oxuser__oxstreet->value,
                    'streetNo'   => $oUser->oxuser__oxstreetnr->value,
                    'additional' => $oUser->oxuser__oxaddinfo->value,
                    'city'       => $oUser->oxuser__oxcity->value,
                    'zip'        => $oUser->oxuser__oxzip->value,
                    'state'      => $this->_stateIdToStateName(
                        $oUser->oxuser__oxstateid->value,
                        $oUser->oxuser__oxcountryid->value
                    ),
                    'country'    => $this->_countryIdToCountryName($oUser->oxuser__oxcountryid->value),
                ),
                'shipping' => array(),
            );

            foreach ($oUser->getUserAddresses() as $oUserAddress) {
                $aResult['shipping'][] = array(
                    'firstName'  => $oUserAddress->oxaddress__oxfname->value,
                    'lastName'   => $oUserAddress->oxaddress__oxlname->value,
                    'company'    => $oUserAddress->oxaddress__oxcompany->value,
                    'street'     => $oUserAddress->oxaddress__oxstreet->value,
                    'streetNo'   => $oUserAddress->oxaddress__oxstreetnr->value,
                    'additional' => $oUserAddress->oxaddress__oxaddinfo->value,
                    'city'       => $oUserAddress->oxaddress__oxcity->value,
                    'zip'        => $oUserAddress->oxaddress__oxzip->value,
                    'country'    => $this->_countryIdToCountryName($oUserAddress->oxaddress__oxcountryid->value),
                    'state'      => $this->_stateIdToStateName(
                        $oUserAddress->oxaddress__oxcountryid->value,
                        $oUserAddress->oxaddress__oxstateid->value
                    ),
                    'phone'      => $oUserAddress->oxaddress__oxfon->value,
                    'fax'        => $oUserAddress->oxaddress__oxfax->value,
                );
            }

            $this->_sAjaxResponse = $this->_successMessage($aResult);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("user not logged on");
        }
    }

    /**
     * Returns the display name of a country.
     *
     * @param string $sCountyId OXID of the country.
     *
     * @return string
     */
    protected function _countryIdToCountryName($sCountyId)
    {
        /**
         * @var oxCountry $oCountry
         */
        if (isset($this->_aCountryIdCache[$sCountyId])) {
            return $this->_aCountryIdCache[$sCountyId];
        }

        $oCountry = oxNew('oxCountry');
        $oCountry->load($sCountyId);
        $sCountryName                       = $oCountry->oxcountry__oxtitle->value;
        $this->_aCountryIdCache[$sCountyId] = $sCountryName;

        return $sCountryName;
    }

    /**
     * Returns the display name of a state.
     *
     * @param string $sCountyId OXID of the country.
     * @param string $sStateId  OXID of the state.
     *
     * @return string
     */
    protected function _stateIdToStateName($sCountyId, $sStateId)
    {
        if (isset($this->_aStateIdCache[$sCountyId][$sStateId])) {
            return $this->_aStateIdCache[$sCountyId][$sStateId];
        }

        // At this point, we can't use the OXID object "oxState".
        // There is a bug in the table structure of "oxstates", which doesn't allow to store multiple state
        // abbreviations for different countries. Further they aren't loadable with "OXCOUNTRYID" and "OXSTATEID".
        $sViewName  = getViewName('oxstates');
        $sSelect    = "SELECT `OXTITLE` FROM `$sViewName` WHERE `OXID` = ? AND `OXCOUNTRYID` = ?";
        $oDb        = oxDb::getDb();
        $sStateName = $oDb->getOne($sSelect, array($sStateId, $sCountyId));
        if (null === $sStateName || !$sStateName) {
            $sStateName = '';
        }

        $this->_aStateIdCache[$sCountyId][$sStateId] = $sStateName;

        return $sStateName;
    }

    /**
     * Transforms a product object into an array.
     *
     * @param oxArticle $oArticle Instance of the product object.
     * @param bool      $blShort  Return only short information (used in category view).
     *
     * @return array
     */
    protected function _articleToArray($oArticle, $blShort = false)
    {
        $oConfig       = $this->_oVersionLayer->getConfig();
        $oShopCurrency = $oConfig->getActShopCurrencyObject();

        $blHasVariants = $this->_hasVariants($oArticle);

        $iVariantGroupCount = 0;
        if ($blHasVariants) {
            $aVariantSelections = $oArticle->getVariantSelections();
            $iVariantGroupCount = count($aVariantSelections['selections']);
        }

        $aProduct = array(
            'productId'      => $oArticle->oxarticles__oxid->value,
            'title'          => html_entity_decode($oArticle->oxarticles__oxtitle->rawValue),
            'shortDesc'      => html_entity_decode($oArticle->oxarticles__oxshortdesc->rawValue),
            'price'          => $oArticle->getFPrice(),
            'currency'       => $oShopCurrency->sign,
            'formattedPrice' => $oArticle->getFPrice() . " " . $oShopCurrency->sign,
            'icon'           => $oArticle->getIconUrl(),
        );

        if (!$blShort) {
            $aProduct['longDesc']          = $oArticle->getLongDesc();
            $aProduct['link']              = $oArticle->getLink();
            $aProduct['hasVariants']       = $blHasVariants;
            $aProduct['variantGroupCount'] = $iVariantGroupCount;
        }

        return $aProduct;
    }

    /**
     * Determines whether a product has variants or not.
     *
     * @param oxArticle $oProduct Instance of the product object.
     *
     * @return bool
     */
    protected function _hasVariants($oProduct)
    {
        return empty($oProduct->oxarticles__oxparentid->value) &&
            !empty($oProduct->oxarticles__oxvarcount->value) &&
            ($oProduct->oxarticles__oxvarcount->value > 0);
    }

    /**
     * Returns the variant groups of the current product.
     *
     * Parameter: "anid" OXID of the product.
     */
    public function getArticleVariantGroups()
    {
        /**
         * @var oxVariantSelectList $oVariantSelectList
         */
        $oProduct = $this->_getArticleById();

        $aCharacteristics   = array();
        $aVariantSelections = $oProduct->getVariantSelections();
        foreach ($aVariantSelections['selections'] as $iIndex => $oVariantSelectList) {
            $aCharacteristics[] = array(
                'groupId' => $iIndex,
                'title'   => $oVariantSelectList->getLabel(),
            );
        }

        $this->_sAjaxResponse = $this->_successMessage($aCharacteristics);
    }

    /**
     * Provides data on the article
     *
     * Parameter: anid
     */
    public function getArticle()
    {
        $oArticle = $this->_getArticleById();
        if (!empty($oArticle)) {
            $aProductResponse     = $this->_articleToArray($oArticle);
            $this->_sAjaxResponse = $this->_successMessage($aProductResponse);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage('article not found');
        }
    }

    /**
     * Returns the variants of a product.
     *
     * Parameter: anid Products OXID.
     * Parameter: selectedVariant[] Array containing selected variant IDs.
     */
    public function getArticleVariants()
    {
        /**
         * @var oxSelection         $oVariantSelectionItem
         * @var oxVariantSelectList $oVariantSelectionList
         */
        $oArticle          = $this->_getArticleById();
        $aSelectedVariants = $this->_oVersionLayer->getRequestParam('selectedVariant', array());
        $aVariants         = $oArticle->getVariantSelections($aSelectedVariants, $oArticle->getId());
        $aRealVariants     = array();
        foreach ($aVariants['selections'] as $iKey => $sVariantId) {
            $oVariantSelectionList = $aVariants['selections'][$iKey];
            $aVariantSelectionList = $oVariantSelectionList->getSelections();

            foreach ($aVariantSelectionList as $oVariantSelectionItem) {
                if (!$oVariantSelectionItem->isDisabled()) {
                    $aRealVariants[] = array(
                        'groupId'   => $iKey,
                        'variantId' => $oVariantSelectionItem->getValue(),
                        'title'     => $oVariantSelectionItem->getName(),
                    );
                }
            }
        }

        $this->_sAjaxResponse = $this->_successMessage($aRealVariants);
    }

    /**
     * Returns the OXID of a specific product variant.
     *
     * Parameter: anid Products OXID.
     * Parameter: selectedVariant[] Array containing selected variant IDs.
     */
    public function getVariantProductId()
    {
        $oArticle           = $this->_getArticleById();
        $aSelectedVariants  = $this->_oVersionLayer->getRequestParam('selectedVariant', array());
        $aVariants          = $oArticle->getVariantSelections($aSelectedVariants, $oArticle->getId());
        $sSelectedProductId = '';
        foreach ($aVariants['rawselections'] as $sOXID => $aVariants) {
            $blSelected = true;
            foreach ($aVariants as $iKey => $aVariant) {
                if ($aVariant['disabled']) {
                    $blSelected = false;
                    break;
                }
                $blSelected = ($aVariant['hash'] == $aSelectedVariants[$iKey]);
            }

            if ($blSelected) {
                $sSelectedProductId = $sOXID;
                break;
            }
        }

        $this->_sAjaxResponse = $this->_successMessage($sSelectedProductId);
    }

    /**
     * Provides a list of articles
     *
     * Parameter: cnid category id
     * Parameter: pgNr Page number
     * Parameter: _artperpage
     */
    public function getArticleList()
    {
        $oArtList = oxNew('oxarticlelist');
        $perpage  = $this->_oVersionLayer->getConfig()->getConfigParam('iNrofCatArticles');
        $page     = $this->getActPage();
        $oArtList->setSqlLimit($perpage * $page, $perpage);
        //$oArtList->setCustomSorting( $this->getSortingSql( $oCategory->getId() ) );
        $aSessionFilter = null; //$this->_oVersionLayer->getSession()->getVariable( 'session_attrfilter' );

        $sActCat = $this->_oVersionLayer->getRequestParam('cnid');
        // $iACount = $oArtList->loadCategoryArticles($sActCat, $aSessionFilter);
        $oArtList->loadCategoryArticles($sActCat, $aSessionFilter);

//        $res           = new stdClass();
//        $res->count    = $iACount;
//        $res->articles = array();
        $aProducts = array();
        foreach ($oArtList as $oArticle) {
            $aProducts[] = $this->_articleToArray($oArticle, true);
        }
        $this->_sAjaxResponse = $this->_successMessage($aProducts);
    }

    public function getCategoryList()
    {
        /**
         * @var oxCategoryList $oCatTree
         * @var oxCategory     $oCategory
         */
        $oCatTree = oxNew("oxCategoryList");
        $oCatTree->buildList(true);

        $sActCat = $this->_oVersionLayer->getRequestParam('cnid');
        if (empty($sActCat)) {
            $sActCat = null;
        }

        $aCatList = array();
        foreach ($oCatTree as $oCategory) {
            $oParentCategory = $oCategory->getParentCategory();
            if (
                $oCategory->getIsVisible() && (
                    $sActCat === $oParentCategory || (
                        null !== $oParentCategory && $sActCat == $oParentCategory->getId()
                    )
                )
            ) {
                $aCatList[] = array(
                    'categoryId' => $oCategory->getId(),
                    'title'      => preg_replace(
                        '/^[- ]+/',
                        '',
                        html_entity_decode($oCategory->oxcategories__oxtitle->rawValue)
                    ),
                    'icon'       => $oCategory->getIconUrl(),
                    'hasChild'   => $oCategory->getHasSubCats(),
                );
            }
        }
        $this->_sAjaxResponse = $this->_successMessage($aCatList);
    }

    /**
     * Suche nach Produkten
     *
     * Parameter: searchparam Search string
     * Parameter: pgNr Page number
     * Parameter: _artperpage Page size
     */
    public function searchProducts()
    {
        $searchParam        = $this->_oVersionLayer->getRequestParam('searchparam');
        $searchCnid         = $this->_oVersionLayer->getRequestParam('searchcnid');
        $searchVendor       = $this->_oVersionLayer->getRequestParam('searchvendor');
        $searchManufacturer = $this->_oVersionLayer->getRequestParam('searchmanufacturer');

        $oSearchHandler = oxNew('oxsearch');
        $oSearchList    = $oSearchHandler->getSearchArticles(
            $searchParam,
            $searchCnid,
            $searchVendor,
            $searchManufacturer,
            $this->getSortingSql('oxsearch')
        );

        $count  = $oSearchHandler->getSearchArticleCount(
            $searchParam,
            $searchCnid,
            $searchVendor,
            $searchManufacturer
        );
        $result = array();
        foreach ($oSearchList as $key => $oArticle) {
            $result[$key] = array(
                'id'    => $oArticle->oxarticles__oxid->value,
                'title' => $oArticle->oxarticles__oxtitle->value,
                'short' => $oArticle->oxarticles__oxshortdesc->value,
                'price' => $oArticle->oxarticles__oxprice->value,
                //       'link'  => $oArticle->getLink(),
            );
        }

        $this->_sAjaxResponse = $this->_successMessage(array('count' => $count, 'articles' => $result));
    }

    public function getArticleMedia()
    {
        /**
         * @var oxarticle $oArticle
         */
        $oArticle = $this->_getArticleById();
        $aMedia   = $oArticle->getMediaUrls();
        $response = array();
        foreach ($aMedia as $medium) {
            $response[] = array(
                'id'     => $medium->oxmediaurls__oxid->value,
                'url'    => $medium->oxmediaurls__oxurl->value,
                'desc'   => $medium->oxmediaurls__oxdesc->value,
                'upload' => $medium->oxmediaurls__oxisuploaded->value,
            );
        }
        $this->_sAjaxResponse = $this->_successMessage($response);
    }

    /**
     * Provides a list of article images
     *
     * Parameter: anid article id
     *
     * Returns: array of pictures and icons
     */
    public function getArticleImages()
    {
        $oArticle  = $this->_getArticleById();
        $aGallery  = $oArticle->getPictureGallery();
        $aPictures = array();

        foreach ($aGallery['Pics'] as $iKey => $sPictureUrl) {
            $aPictures[] = array(
                'productId' => $oArticle->getId(),
                'pictureId' => $iKey,
                'icon'      => $aGallery['Icons'][$iKey],
                'image'     => $sPictureUrl,
                'bigImage'  => $aGallery['ZoomPic'] ? $aGallery['ZoomPics'][$iKey]['file'] : '',
            );
        }

        $this->_sAjaxResponse = $this->_successMessage($aPictures);
    }

    public function getArticleDocuments()
    {
        $this->_sAjaxResponse = $this->_errorMessage('NOT_IMPLEMENTED');
    }

    public function getArticleVideos()
    {
        $this->_sAjaxResponse = $this->_errorMessage('NOT_IMPLEMENTED');
    }

    /**
     * Get the basket
     *
     * Returns: all articles in basket and the basket summery
     */
    public function getBasket()
    {
        /**
         * @var oxBasketItem $oBasketItem
         */
        $this->_getSessionId();
        $oBasket = $this->_oVersionLayer->getBasket();
        $this->_oVersionLayer->getConfig()->getActShopCurrencyObject()->sign;

        $oBasket->calculateBasket(true);
        $response = array(
            'articles'      => array(),
            'totalBrutto'   => $oBasket->getFProductsPrice(),
            'totalDelivery' => $oBasket->getFDeliveryCosts(),
            'total'         => $oBasket->getFPrice(),
            'currency'      => $this->_oVersionLayer->getConfig()->getActShopCurrencyObject()->sign,
        );
        foreach ($oBasket->getContents() as $key => $oBasketItem) {
            $aProduct               = $this->_articleToArray($oBasketItem->getArticle());
            $aProduct['cartItemId'] = $key;
            $aProduct['amount']     = $oBasketItem->getAmount();
            $aProduct['total']      = $oBasketItem->getFTotalPrice();
            $response['articles'][] = $aProduct;
        }

        $this->_sAjaxResponse = $this->_successMessage($response);
    }

    /**
     * Delete a item from basket
     *
     * Parameter: anid article id
     *
     * Returns: true
     */
    public function deleteFromBasket()
    {
        $this->_getSessionId();
        $oBasket  = $this->_oVersionLayer->getBasket();
        $oArticle = $this->_getArticleById();

        if ($oArticle) {
            $sItemKey = $oBasket->getItemKey($oArticle->oxarticles__oxid->value);
            if ($sItemKey) {
                $oBasket->removeItem($sItemKey);
            }
            $this->_sAjaxResponse = $this->_successMessage(true);
        }
    }

    /**
     * Update an basket item
     *
     * Parameter: anid article id
     * Parameter: qty quantity
     *
     * Returns: true
     */
    public function updateBasket()
    {
        /**
         * @var oxBasketItem $oBasketItem
         */
        $this->_getSessionId();
        $oBasket   = $this->_oVersionLayer->getBasket();
        $oArticle  = $this->_getArticleById();
        $iQuantity = max($this->_oVersionLayer->getRequestParam('qty'), 1);

        if ($oArticle) {
            $this->_sAjaxResponse = $this->_errorMessage('Basket item not found');
            foreach ($oBasket->getContents() as $oBasketItem) {
                if ($oBasketItem->getArticle()->oxarticles__oxid->value == $oArticle->oxarticles__oxid->value) {
                    $oBasketItem->setAmount($iQuantity);

                    $this->_sAjaxResponse = $this->_successMessage(true);
                    break;
                }
            }
        }
    }

    /**
     * Add an article to basket
     *
     * Parameter: anid article id
     * Parameter: qty quantity
     *
     * Returns: true
     */
    public function addToBasket()
    {
        $this->_getSessionId();
        $oBasket   = $this->_oVersionLayer->getBasket();
        $oArticle  = $this->_getArticleById('anid', true);
        $iQuantity = max($this->_oVersionLayer->getRequestParam('qty'), 1);

        try {
            if ($oArticle) {
                $oBasket->addToBasket($oArticle->oxarticles__oxid->value, $iQuantity);
                $oBasket->calculateBasket(true);
                $this->_sAjaxResponse = $this->_successMessage($oBasket->getProductsCount());
            }
        } catch (Exception $e) {
            $oLang                = $this->_oVersionLayer->getLang();
            $this->_sAjaxResponse = $this->_errorMessage($oLang->translateString($e->getMessage()));
        }
    }

    /**
     * Invoice Address
     *
     * Returns: Array with formdata
     */
    public function getInvoiceAddress()
    {
        $oUser   = $this->getUser();
        $address = array();
        if (!empty($oUser)) {
            $address = $this->_oVersionLayer->getRequestParam('invadr');
            if (empty($address)) {
                $address = array(
                    'oxuser_oxfname'     => $oUser->oxuser__oxfname->value,
                    'oxuser_oxlname'     => $oUser->oxuser__oxlname->value,
                    'oxuser_oxcompany'   => $oUser->oxuser__oxcompany->value,
                    'oxuser_oxstreet'    => $oUser->oxuser__oxstreet->value,
                    'oxuser_oxstreetnr'  => $oUser->oxuser__oxstreetnr->value,
                    'oxuser_oxzip'       => $oUser->oxuser__oxzip->value,
                    'oxuser_oxcity'      => $oUser->oxuser__oxcity->value,
                    'oxuser_oxcountry'   => $oUser->oxuser__oxcountry->value,
                    'oxuser_oxcountryid' => $oUser->oxuser__oxcountryid->value,
                    'oxuser_oxustid'     => $oUser->oxuser__oxustid->value,
                    'oxuser_oxaddinfo'   => $oUser->oxuser__oxaddinfo->value,

                );
            }
        }
        if (!empty($address)) {
            $this->_sAjaxResponse = $this->_successMessage($address);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("No address available");
        }
    }

    /**
     * Get Delivery Address from database
     *
     * Returns: Array of Arrays (Addressid => Address)
     */
    public function getDeliveryAddresses()
    {
        /**
         * @var oxlist    $addresses
         * @var oxAddress $address
         */
        $oUser     = $this->getUser();
        $addresses = $oUser->getUserAddresses();
        $res       = array();
        foreach ($addresses as $address) {
            $res[$address->getId()] = array(
                'oxuser_oxfname'     => $address->oxaddress__oxfname->value,
                'oxuser_oxlname'     => $address->oxaddress__oxlname->value,
                'oxuser_oxcompany'   => $address->oxaddress__oxcompany->value,
                'oxuser_oxstreet'    => $address->oxaddress__oxstreet->value,
                'oxuser_oxstreetnr'  => $address->oxaddress__oxstreetnr->value,
                'oxuser_oxzip'       => $address->oxaddress__oxzip->value,
                'oxuser_oxcity'      => $address->oxaddress__oxcity->value,
                'oxuser_oxcountry'   => $address->oxaddress__oxcountry->value,
                'oxuser_oxcountryid' => $address->oxaddress__oxcountryid->value,
                'oxuser_oxustid'     => $address->oxaddress__oxustid->value,
                'oxuser_oxaddinfo'   => $address->oxaddress__oxaddinfo->value,
            );
        }
        if (!empty($res)) {
            $this->_sAjaxResponse = $this->_successMessage($res);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("No address available");
        }
    }

    /**
     * Fetches All possible Delivery Sets and all payments that match the given shipping set
     * Needs to be called every time the user changes the chosen shipping set.
     *
     * Parameter: sShipSet Id of chosen shipping set
     * Returns: Array of deliveries, payments, and derived shipping set.
     */
    public function getShippingPayment()
    {
        $sActShipSet = $this->_oVersionLayer->getRequestParam('sShipSet');
        if (!$sActShipSet) {
            $sActShipSet = $this->_oVersionLayer->getSession()->getVariable('sShipSet');
        }

        $oBasket = $this->_oVersionLayer->getBasket();
        $oBasket->setShipping(null);
        $oBasket->onUpdate();
        $this->_oVersionLayer->getSession()->setVariable('sShipSet', $sActShipSet);

        // load sets, active set, and active set payment list
        list($aAllSets, $sActShipSet, $aPaymentList) = $this->_oVersionLayer->getDeliverySetList()
            ->getDeliverySetData($sActShipSet, $this->getUser(), $oBasket);

        $result = array(
            'deliveries' => array(),
            'payments'   => array(),
            'actship'    => $sActShipSet,
        );

        foreach ($aAllSets as $set) {
            $result['deliveries'][] = array(
                'id'    => $set->oxdeliveryset__oxid->value,
                'title' => $set->oxdeliveryset__oxtitle->value,
                'pos'   => $set->oxdeliveryset__oxpos->value,
            );
        }

        foreach ($aPaymentList as $pay) {
            $result['payments'][] = array(
                'id'    => $pay->oxpayments__oxid->value,
                'title' => $pay->oxpayments__oxdesc->value,
                'pos'   => $pay->oxpayments__oxsort->value,
            );
        }

        $this->_sAjaxResponse = $this->_successMessage($result);
    }

    /**
     * Execute an order
     *
     * Parameter: sShipSet Shipping set id
     * Parameter: payment  Payment id
     *
     */
    public function executeOrder()
    {
        // Try GET parameter
        $shipping = $this->_oVersionLayer->getRequestParam('sShipSet');
        if (!$shipping) {
            // ... fetch from session
            $shipping = $this->_oVersionLayer->getSession()->getVariable('sShipSet');
        }
        if (!$shipping) {
            $this->_sAjaxResponse = $this->_errorMessage("No shipping id given");

            return;
        }
        $payment = $this->_oVersionLayer->getRequestParam('payment');
        if (!$payment) {
            $payment = $this->_oVersionLayer->getSession()->getVariable('payment');
        }

        if (!$payment) {
            $this->_sAjaxResponse = $this->_errorMessage("No payment type given");

            return;
        }

        // Check if user is logged in
        if (!$oUser = $this->getUser()) {
            $this->_sAjaxResponse = $this->_errorMessage("User not logged on");

            return;
        }

        // Load user basket
        $oBasket = $this->_oVersionLayer->getBasket();

        // Set payment & shipping
        $oBasket->setPayment($payment);
        $oBasket->setShipping($shipping);

        if ($oBasket->getProductsCount()) {

            try {
                $oOrder = oxNew('oxorder');

                // finalizing ordering process (validating, storing order into DB, executing payment, setting status...)
                $iSuccess = $oOrder->finalizeOrder($oBasket, $oUser);

                $oBasket->setOrderId($oOrder->getId());

                // performing special actions after user finishes order (assignment to special user groups)
                $oUser->onOrderExecute($oBasket, $iSuccess);
            } catch (Exception $oEx) {
                $this->_sAjaxResponse = $this->_errorMessage(
                    array('message' => "error executing order", 'data' => $oEx)
                );

                return;
            }
        }

        $this->_sAjaxResponse = $this->_successMessage("done order");

        return;
    }

    /**
     * Get content by ident
     *
     * @param string $sLoadId OXLOADID of the CMS page.
     *
     * @return string
     */
    protected function _getContentByIdent($sLoadId)
    {
        $oContent = $this->_getContentObject($sLoadId);

        return $oContent->oxcontents__oxcontent->rawValue;
    }

    /**
     * Returns the oxContent object of a CMS page.
     *
     * @param string $sLoadId OXLOADID of the CMS page.
     *
     * @return oxContent
     */
    protected function _getContentObject($sLoadId)
    {
        /**
         * @var oxContent $oContent
         */
        $oContent     = oxNew('oxcontent');
        $blLoadResult = $oContent->loadByIdent($sLoadId);

        // A bad hack to avoid writing an OXID module, because OXID does not set the property "_isLoaded"!
        $oReflection = new ReflectionClass($oContent);
        $oProperty   = $oReflection->getProperty('_isLoaded');
        $oProperty->setAccessible(true);
        $oProperty->setValue($oContent, $blLoadResult);
        $oProperty->setAccessible(false);

        return $oContent;
    }

    /**
     * Get the terms and conditions
     *
     * Returns: string
     */
    public function getTermsAndConditions()
    {
        $sContent             = $this->_getContentByIdent('oxagb');
        $this->_sAjaxResponse = $this->_successMessage($sContent);
    }

    /**
     * Returns the CMS page for the home screen.
     *
     * Return: string
     */
    public function getStartPage()
    {
        $oContent = $this->_getContentObject('mfCushymocoStart');
        if (!$oContent->isLoaded()) {
            $this->_sAjaxResponse = $this->_errorMessage(
                $this->_oVersionLayer->getLang()->translateString('CUSHYMOCO_CMS_STARTPAGE_DOES_NOT_EXISTS')
            );

            return;
        }

        $sParsedContent = $this->_oVersionLayer->getUtilsView()->parseThroughSmarty(
            $oContent->oxcontents__oxcontent->value,
            $oContent->getId()
        );

        $oConfig   = $this->_oVersionLayer->getConfig();
        $oShop     = $oConfig->getActiveShop();
        $sShopName = $oShop->oxshops__oxname->value;

        $oUser = $this->getUser();

        $this->_sAjaxResponse = $this->_successMessage(
            array(
                'title'       => $sShopName,
                'pageContent' => $sParsedContent,
                'loggedIn'    => isset($oUser->oxuser__oxcustnr->value),
            )
        );
    }

    /**
     * Get the imprint
     *
     * Returns: string
     */
    public function getImprint()
    {
        $sContent             = $this->_getContentByIdent('oximpressum');
        $this->_sAjaxResponse = $this->_successMessage($sContent);
    }

    /**
     * Get list of countries
     */
    public function getCountryList()
    {
        $oCountryList = oxNew('oxcountrylist');
        $oCountryList->loadActiveCountries();
        $res = array();
        foreach ($oCountryList as $country) {
            $res[] = array(
                'id'    => $country->oxcountry__oxid->value,
                'title' => $country->oxcountry__oxtitle->value,
                'iso2'  => $country->oxcountry__oxisoalpha2->value,
                'iso3'  => $country->oxcountry__oxisoalpha3->value,
            );
        }
        if (!empty($res)) {
            $this->_sAjaxResponse = $this->_successMessage($res);
        } else {
            $this->_sAjaxResponse = $this->_errorMessage("no countries found");
        }
    }

    /**
     * Sets the language to use.
     */
    public function setLanguage()
    {
        $sLang = $this->_oVersionLayer->getRequestParam('device_language');
        $oLang = $this->_oVersionLayer->getLang();
        foreach ($oLang->getLanguageArray() as $oLanguage) {
            if (strtolower($oLanguage->oxid) == strtolower($sLang) && $oLang->getBaseLanguage() != $oLanguage->id) {
                $oLang->setBaseLanguage($oLanguage->id);
                $this->_oVersionLayer->getUtilsServer()->setOxCookie('language', $oLang->getBaseLanguage());
            }
        }
        $this->_sAjaxResponse = $this->_successMessage(true);
    }

    /**
     * Returns the version of the API
     */
    public function getVersion()
    {
        $this->_sAjaxResponse = $this->_successMessage(self::VERSION);
    }
}
