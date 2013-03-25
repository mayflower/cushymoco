<?php
/**
 *  View for Ajax access
 */
class cushymoco extends oxUBase
{
    const VERSION = '0.3.1';

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
     * Initializes all required components.
     *
     * @return null|void
     */
    public function init()
    {
        parent::init();

        restore_error_handler();
        restore_exception_handler();

        try {
            $this->_initVersionLayer();
        } catch (Exception $e) {
            $sMessage = json_encode(
                $this->errorMessage(
                    $e->getMessage()
                ),
                JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
            );
            if ($this->_hasRegistry()) {
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
        $this->_aViewData['sAjaxResponse'] = json_encode(
            $this->_sAjaxResponse,
            JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
        );

        return $sTemplate;
    }

    /**
     * Loads the layer class for the different OXID eShop versions.
     *
     * @return void
     */
    private function _initVersionLayer()
    {
        if ($this->_hasRegistry()) {
            $oConfig = oxRegistry::getConfig();
        } else {
            $oConfig = $this->getConfig();
        }

        $sLayerClassFile = $oConfig->getShopConfVar('sLayerClassFile', null, 'mayflower:cushymoco');
        $sLayerClass     = $oConfig->getShopConfVar('sLayerClass', null, 'mayflower:cushymoco');

        if ($sLayerClassFile === null || $sLayerClass === null) {
            list($sLayerClassFile, $sLayerClass) = $this->loadVersionLayer();
        }

        include_once getShopBasePath() . 'core/' . $sLayerClassFile;
        $this->_oVersionLayer = new $sLayerClass();
    }

    /**
     * Saves the given version layer file- and class name to the shop config.
     *
     * @param $sLayerClassFile
     * @param $sLayerClass
     */
    private function _saveLayerConfig($sLayerClassFile, $sLayerClass)
    {
        if ($this->_hasRegistry()) {
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
     * @return bool
     */
    private function _hasRegistry()
    {
        return class_exists('oxRegistry') && method_exists('oxRegistry', 'getConfig');
    }

    /**
     * Loads a version layer. Throws an exception if there isn't a suitable layer.
     *
     * @throws Exception
     *
     * @return array
     */
    public function loadVersionLayer()
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
                throw new Exception("Can't find suitable version layer class for your shop version.");
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
    protected function generateMessage($error = null, $result = null)
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
    protected function errorMessage($error)
    {
        return $this->generateMessage($error);
    }

    /**
     * Put an success message
     *
     * @param $result
     *
     * @return array
     */
    protected function successMessage($result)
    {
        return $this->generateMessage(null, $result);
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
     * @param string $key Parameter that contains the id of the article
     *
     * @return bool|object
     */
    protected function _getArticleById($key = 'anid')
    {
        /**
         * @var oxArticle $oArticle
         */
        $sArticleId = $this->_oVersionLayer->getRequestParam($key);
        if (empty($sArticleId)) {
            $this->_sAjaxResponse = $this->errorMessage("article id not provided");
        } else {
            $oArticle = oxNew('oxarticle');

            if ($oArticle->load($sArticleId)) {
                return $oArticle;
            }

            $this->_sAjaxResponse = $this->errorMessage("article could not be loaded");
        }

        return false;
    }

    /**
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
        $sUserName = $this->_oVersionLayer->getRequestParam('lgn_usr');
        $sUserPwd  = $this->_oVersionLayer->getRequestParam('lgn_pwd');
        if (!empty($sUserName) && !empty($sUserPwd)) {
            $oCmpUsr = $this->_getUserCmp();
            try {
                $oCmpUsr->login_noredirect();
                $oSession   = $this->_oVersionLayer->getSession();
                $sSessionId = $this->_getSessionId();
                $oUser      = $oSession->getUser();
                if ($oUser !== null) {
                    $oLogin               = new stdClass();
                    $oLogin->username     = $sUserName;
                    $oLogin->sessionId    = $sSessionId;
                    $this->_sAjaxResponse = $this->successMessage($oLogin);
                } else {
                    $this->_sAjaxResponse = $this->errorMessage("User " . $sUserName . " does not exist");
                }
            } catch (oxUserException $e) {
                $this->_sAjaxResponse = $this->errorMessage("User " . $sUserName . " does not exist");
            }
        } else {
            $this->_sAjaxResponse = $this->errorMessage("User " . $sUserName . " can not be logged in");
        }
    }

    /*
     * Get content page
     *
     * @return array
     */
    public function getContent()
    {
        /**
         * @todo language select is not working proper, maybe because of session language
         */

        $sContentId = $this->_oVersionLayer->getRequestParam('cnid');
        $iLangId    = $this->_oVersionLayer->getRequestParam('lid');

        $oContent = oxNew('oxcontent');
        $oContent->loadByIdent($sContentId);

        $aResult = array();

        if ($oContent->oxcontents__oxactive->value != 1) {
            $this->_sAjaxResponse = $this->errorMessage('EMPTY');

            return;
        }

        if ($iLangId) {
            $sContentByLang = 'oxcontents__oxcontent_' . $iLangId;
            $sTitleByLang   = 'oxcontents__oxtitle_' . $iLangId;
        } else {
            $sContentByLang = 'oxcontents__oxcontent';
            $sTitleByLang   = 'oxcontents__oxtitle';
        }

        $aResult['title']     = $oContent->$sTitleByLang->value;
        $aResult['content']   = htmlspecialchars($oContent->$sContentByLang->value);
        $this->_sAjaxResponse = $this->successMessage($aResult);
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

                $oLogout            = new stdClass();
                $oLogout->sessionId = $sSessionId;
                $oLogout->logout    = true;

                $this->_sAjaxResponse = $this->successMessage($oLogout);
            } else {
                $this->_sAjaxResponse = $this->errorMessage("User cannot be logged out");
            }
        } else {
            $this->_sAjaxResponse = $this->errorMessage("Session id missing");
        }
    }

    /**
     * Provides data on the currently logged on user
     *
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

            $this->_sAjaxResponse = $this->successMessage($aResult);
        } else {
            $this->_sAjaxResponse = $this->errorMessage("user not logged on");
        }
    }

    protected function articleToArray($oArticle)
    {
        /**
         * @var oxArticle $oArticle
         */
        $res = array(
            'id'       => $oArticle->oxarticles__oxid->value,
            'title'    => html_entity_decode($oArticle->oxarticles__oxtitle->rawValue),
            'short'    => html_entity_decode($oArticle->oxarticles__oxshortdesc->rawValue),
            'data'     => array($oArticle->getLongDesc()),
            'price'    => $oArticle->getFPrice(),
            'link'     => $oArticle->getLink(),
            'icon'     => $oArticle->getIconUrl(),
            'currency' => '€',
        );

        return $res;
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
            $res                  = $this->articleToArray($oArticle);
            $this->_sAjaxResponse = $this->successMessage($res);
        } else {
            $this->_sAjaxResponse = $this->errorMessage('article not found');
        }
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
        $iACount = $oArtList->loadCategoryArticles($sActCat, $aSessionFilter);

        $res           = new stdClass();
        $res->count    = $iACount;
        $res->articles = array();
        foreach ($oArtList as $oArticle) {
            $res->articles[] = $this->articleToArray($oArticle);
        }
        $this->_sAjaxResponse = $this->successMessage($res);
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
                    'id'       => $oCategory->getId(),
                    'title'    => preg_replace(
                        '/^[- ]+/',
                        '',
                        html_entity_decode($oCategory->oxcategories__oxtitle->rawValue)
                    ),
                    'hasChild' => $oCategory->getHasSubCats(),
                );
            }
        }
        $this->_sAjaxResponse = $this->successMessage($aCatList);
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

        $this->_sAjaxResponse = $this->successMessage(array('count' => $count, 'articles' => $result));
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
        $this->_sAjaxResponse = $this->successMessage($response);
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
        $oArticle             = $this->_getArticleById();
        $aGallery             = $oArticle->getPictureGallery();
        $this->_sAjaxResponse = $this->successMessage($aGallery);
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

        $oBasket->calculateBasket(true);
        $response = array(
            'articles'      => array(),
            'totalBrutto'   => $oBasket->getFProductsPrice(),
            'totalDelivery' => $oBasket->getFDeliveryCosts(),
            'total'         => $oBasket->getFPrice(),
            'currency'      => '€',
        );
        foreach ($oBasket->getContents() as $key => $oBasketItem) {
            $response['articles'][$key]           = $this->articleToArray($oBasketItem->getArticle());
            $response['articles'][$key]['amount'] = $oBasketItem->getAmount();
            $response['articles'][$key]['total']  = $oBasketItem->getFTotalPrice();
        }

        $this->_sAjaxResponse = $this->successMessage($response);
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
            $this->_sAjaxResponse = $this->successMessage(true);
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
            $this->_sAjaxResponse = $this->errorMessage('Basket item not found');
            foreach ($oBasket->getContents() as $oBasketItem) {
                if ($oBasketItem->getArticle()->oxarticles__oxid->value == $oArticle->oxarticles__oxid->value) {
                    $oBasketItem->setAmount($iQuantity);

                    $this->_sAjaxResponse = $this->successMessage(true);
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
        $oArticle  = $this->_getArticleById();
        $iQuantity = max($this->_oVersionLayer->getRequestParam('qty'), 1);

        try {
            if ($oArticle) {
                $oBasket->addToBasket($oArticle->oxarticles__oxid->value, $iQuantity);
                $this->_sAjaxResponse = $this->successMessage(true);
            }
        } catch (Exception $e) {
            $oLang = $this->_oVersionLayer->getLang();
            $this->_sAjaxResponse = $this->errorMessage($oLang->translateString($e->getMessage()));
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
            $this->_sAjaxResponse = $this->successMessage($address);
        } else {
            $this->_sAjaxResponse = $this->errorMessage("No address available");
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
            $this->_sAjaxResponse = $this->successMessage($res);
        } else {
            $this->_sAjaxResponse = $this->errorMessage("No address available");
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

        $this->_sAjaxResponse = $this->successMessage($result);
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
            $this->_sAjaxResponse = $this->errorMessage("No shipping id given");

            return;
        }
        $payment = $this->_oVersionLayer->getRequestParam('payment');
        if (!$payment) {
            $payment = $this->_oVersionLayer->getSession()->getVariable('payment');
        }

        if (!$payment) {
            $this->_sAjaxResponse = $this->errorMessage("No payment type given");

            return;
        }

        // Check if user is logged in
        if (!$oUser = $this->getUser()) {
            $this->_sAjaxResponse = $this->errorMessage("User not logged on");

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
                $this->_sAjaxResponse = $this->errorMessage(
                    array('message' => "error executing order", 'data' => $oEx)
                );

                return;
            }
        }

        $this->_sAjaxResponse = $this->successMessage("done order");

        return;
    }

    /**
     * Get content by ident
     *
     * @param string $sLoadId
     *
     * @return string
     */
    protected function _getContentByIdent($sLoadId)
    {
        $oContent = oxNew('oxcontent');
        $oContent->loadByIdent($sLoadId);

        return $oContent->oxcontents__oxcontent->rawValue;
    }

    /*
     * Get the terms and conditions
     *
     * Returns: string
     */
    public function getTermsAndConditions()
    {
        $sContent             = $this->_getContentByIdent('oxagb');
        $this->_sAjaxResponse = $this->successMessage($sContent);
    }

    /**
     * Get the imprint
     *
     * Returns: string
     */
    public function getImprint()
    {
        $sContent             = $this->_getContentByIdent('oximpressum');
        $this->_sAjaxResponse = $this->successMessage($sContent);
    }

    /*
     * Get list of countries
     *
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
            $this->_sAjaxResponse = $this->successMessage($res);
        } else {
            $this->_sAjaxResponse = $this->errorMessage("no countries found");
        }
    }

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
        $this->_sAjaxResponse = $this->successMessage(true);
    }

    /**
     * Returns the version of the API
     */
    public function getVersion()
    {
        $this->_sAjaxResponse = $this->successMessage(self::VERSION);
    }
}
