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
     * Render template
     *
     * @return string The template name
     */
    public function render()
    {
        parent::render();
        $this->_aViewData['sAjaxResponse'] = json_encode($this->_sAjaxResponse, JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT);
        return $this->_sThisTemplate;
    }

    /**
     * Put together an message
     *
     * @static
     *
     * @param mixed $error   error data
     * @param mixed $result  result data
     *
     * @return array
     */
    protected static function generateMessage($error = null, $result = null)
    {
        return array(
            'error'   => $error,
            'result'  => $result,
        );
    }

    /**
     * Put an error message
     *
     * @static
     *
     * @param $error
     * @return array
     */
    protected static function errorMessage($error)
    {
        return self::generateMessage($error);
    }

    /**
     * Put an success message
     *
     * @static
     *
     * @param $result
     * @return array
     */
    protected static function successMessage($result)
    {
        return self::generateMessage(null, $result);
    }

    /**
     * Get session id
     * @static
     * @return null|string
     */
    protected static function sessionId()
    {
        $sSessionId = NULL;
        if (oxConfig::getParameter('sid') === '' || oxConfig::getParameter('sid') === NULL) {
            $oSession = oxSession::getInstance();
            $sSessionId = $oSession->getId();
        } else {
            $sSessionId = oxConfig::getParameter('sid');
            $oSession = oxSession::getInstance();
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
        $sArticleId = oxConfig::getParameter($key);
        if (empty($sArticleId)) {
            $this->_sAjaxResponse = self::errorMessage("article id not provided");
        } else {
            $oArticle = oxnew ('oxarticle');
            $oArticle->load($sArticleId);

            if (empty($oArticle)) {
                $this->_sAjaxResponse = self::errorMessage("article could not be loaded");
            } else {
                return $oArticle;
            }
        }
        return false;
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
        $oCmps = $this->getComponents();
        $oCmpUsr = $oCmps['oxcmp_user'];
        $sUserName = oxConfig::getParameter('lgn_usr');
        $sUserPwd = oxConfig::getParameter('lgn_pwd');
        if (!empty($sUserName)  && !empty($sUserPwd)) {
            $oCmpUsr->login_noredirect();
            $oSession = $oCmpUsr->getSession();
            $sSessionId = $oSession->getId();
            $oUser = $oSession->getUser();
                if ($oUser != NULL ) {
                    $oLogin = new stdClass();
                    $oLogin->username = $sUserName;
                    $oLogin->sessionId = $sSessionId;
                    $this->_sAjaxResponse =  self::successMessage($oLogin);
                } else {
                    $this->_sAjaxResponse = self::errorMessage("User ".$sUserName." does not exist");
                }
            } else {
               $this->_sAjaxResponse = self::errorMessage("User ".$sUserName." can not be logged in");
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

        $sContentId = oxConfig::getParameter('cnid');
        $iLangId = oxConfig::getParameter('lid');

        $oContent = oxNew( 'oxcontent' );
        $oContent->loadByIdent($sContentId);

        if ($oContent->oxcontents__oxactive->value == 1) {

            if ($iLangId) {
                $sContentByLang = 'oxcontents__oxcontent_' . $iLangId;
                $sTitleByLang = 'oxcontents__oxtitle_'. $iLangId;
            } else {
                $sContentByLang = 'oxcontents__oxcontent';
                $sTitleByLang = 'oxcontents__oxtitle';
            }

            $aResult['title'] = $oContent->$sTitleByLang->value;
            $aResult['content'] = htmlspecialchars($oContent->$sContentByLang->value);

        }

        if (count($aResult)) {
            $this->_sAjaxResponse = self::successMessage($aResult);
        } else {
            $this->_sAjaxResponse = self::errorMessage('EMPTY');
        }

    }

    /**
     * Log out user
     *
     * Return: sessionId
     */
    public function logout()
    {
        $sSessionId = self::sessionId();
        $oCmps = $this->getComponents();
        $oCmpUsr = $oCmps['oxcmp_user'];

        if ($sSessionId != '') {
            $oSession = oxSession::getInstance();
            if ($sSessionId != '' && $sSessionId == $oSession->getId()) {
                $oCmpUsr->logout();
                $oSession->destroy();

                $oLogout = new stdClass();
                $oLogout->sessionId = $sSessionId;
                $oLogout->logout = true;

                $this->_sAjaxResponse = self::successMessage($oLogout);
            } else {
                $this->_sAjaxResponse = self::errorMessage("User cannot be logged out");
            }
        } else {
            $this->_sAjaxResponse = self::errorMessage("Session id missing");
        }
    }

    /**
     * Provides data on the currently logged on user
     *
     */
    public function getUserData()
    {
        $oUser = $this->getUser();
        if (!empty($oUser)) {
            $aResult = array(
                'username'  => $oUser->oxuser__oxusername->value,
                'firstname' => $oUser->oxuser__oxfname->value,
                'lastname'  => $oUser->oxuser__oxlname->value,
                'company'   => $oUser->oxuser__oxcompany->value,
            );
            $this->_sAjaxResponse = self::successMessage($aResult);
        } else {
            $this->_sAjaxResponse = self::errorMessage("user not logged on");
        }
    }

    protected function articleToArray($oArticle)
    {
        $res = array(
            'id'    => $oArticle->oxarticles__oxid->value,
            'title' => html_entity_decode($oArticle->oxarticles__oxtitle->rawValue),
            'short' => html_entity_decode($oArticle->oxarticles__oxshortdesc->rawValue),
            'data'  => array($oArticle->oxarticles__oxlongdesc->value),
            'price' => $oArticle->getFPrice(),
            'link'  => $oArticle->getLink(),
            'icon'  => $oArticle->getIconUrl(),
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
            $res = $this->articleToArray($oArticle);
            $this->_sAjaxResponse = self::successMessage($res);
        } else {
            $this->_sAjaxResponse = self::errorMessage('article not found');
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
        $oArtList = oxNew( 'oxarticlelist' );
        $perpage = $this->getConfig()->getConfigParam( 'iNrofCatArticles' );
        $page = $this->getActPage();
        $oArtList->setSqlLimit( $perpage * $page, $perpage );
        //$oArtList->setCustomSorting( $this->getSortingSql( $oCategory->getId() ) );
        $aSessionFilter = null;//oxSession::getVar( 'session_attrfilter' );

        $sActCat = oxConfig::getParameter( 'cnid' );
        $iACount = $oArtList->loadCategoryArticles( $sActCat, $aSessionFilter );

        $res = new stdClass();
        $res->count = $iACount;
        $res->articles = array();
        foreach($oArtList as $oArticle) {
            $res->articles[] = $this->articleToArray($oArticle);
        }
        $this->_sAjaxResponse = self::successMessage($res);
    }

    public function getCategoryList()
    {
        $oCatTree = oxNew( "oxCategoryList" );
        $oCatTree->buildList( true );

        $sActCat = oxConfig::getParameter( 'cnid' );

        $aCatList = array();
        foreach ( $oCatTree as $oCategory ) {
            $oParentCategory = $oCategory->getParentCategory();
            if ($oCategory->getIsVisible() && ($sActCat === $oParentCategory || (null !== $oParentCategory && $sActCat == $oParentCategory->getId()))) {
                $aCatList[] = array(
                    'id'       => $oCategory->getId(),
                    'title'    => preg_replace('/^[- ]+/', '', html_entity_decode($oCategory->oxcategories__oxtitle->rawValue)),
                    'hasChild' => $oCategory->getHasSubCats(),
                );
            }
        }
        $this->_sAjaxResponse = self::successMessage($aCatList);
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
        $searchParam        = oxConfig::getParameter( 'searchparam' );
        $searchCnid         = oxConfig::getParameter( 'searchcnid' );
        $searchVendor       = oxConfig::getParameter( 'searchvendor' );
        $searchManufacturer = oxConfig::getParameter( 'searchmanufacturer' );

        $oSearchHandler = oxNew( 'oxsearch' );
        $oSearchList = $oSearchHandler->getSearchArticles(
            $searchParam,
            $searchCnid,
            $searchVendor,
            $searchManufacturer,
            $this->getSortingSql( 'oxsearch' )
        );

        $count = $oSearchHandler->getSearchArticleCount(
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

        $this->_sAjaxResponse = self::successMessage(array('count' => $count, 'articles' => $result));
    }
    public function getArticleMedia()
    {
        /**
         * @var oxarticle $oArticle
         */
        $oArticle = $this->_getArticleById();
        $aMedia = $oArticle->getMediaUrls();
        $response = array();
        foreach($aMedia as $medium) {
            $response[] = array(
                'id'     => $medium->oxmediaurls__oxid->value,
                'url'    => $medium->oxmediaurls__oxurl->value,
                'desc'   => $medium->oxmediaurls__oxdesc->value,
                'upload' => $medium->oxmediaurls__oxisuploaded->value,
            );
        }
        $this->_sAjaxResponse = self::successMessage($response);
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
        $oArticle = $this->_getArticleById();
        $aGallery = $oArticle->getPictureGallery();
        $this->_sAjaxResponse = self::successMessage($aGallery);
    }

    /**
     * Get the basket
     *
     * Returns: all articles in basket and the basket summery
     */
    public function getBasket()
    {
        self::sessionId();
        $oBasket = $this->getSession()->getBasket();

        $oBasket->calculateBasket(true);
        $response = array(
            'articles'      => array(),
            'totalBrutto'   => $oBasket->getFProductsPrice(),
            'totalDelivery' => $oBasket->getFDeliveryCosts(),
            'total'         => $oBasket->getFPrice(),
            'currency'      => '€',
        );
        foreach($oBasket->getContents() as $key => $oBasketItem) {
            $response['articles'][$key] = $this->articleToArray($oBasketItem->getArticle());
            $response['articles'][$key]['amount'] = $oBasketItem->getAmount();
            $response['articles'][$key]['total'] = $oBasketItem->getFTotalPrice();
        }

        $this->_sAjaxResponse = self::successMessage($response);
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
        self::sessionId();
        $oBasket = $this->getSession()->getBasket();
        $oArticle = $this->_getArticleById();

        if($oArticle) {
            $sItemKey = $oBasket->getItemKey($oArticle->oxarticles__oxid->value);
            if ($sItemKey) {
                $oBasket->removeItem($sItemKey);
            }
            $this->_sAjaxResponse = self::successMessage(true);
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
        self::sessionId();
        $oBasket = $this->getSession()->getBasket();
        $oArticle = $this->_getArticleById();
        $iQuantity = max(oxConfig::getParameter( 'qty' ), 1);

        if ($oArticle) {
            $this->_sAjaxResponse = self::errorMessage('Basket item not found');
            foreach($oBasket->getContents() as $oBasketItem) {
                if ($oBasketItem->getArticle()->oxarticles__oxid->value == $oArticle->oxarticles__oxid->value) {
                    $oBasketItem->setAmount($iQuantity);

                    $this->_sAjaxResponse = self::successMessage(true);
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
        self::sessionId();
        $oBasket = $this->getSession()->getBasket();
        $oArticle = $this->_getArticleById();
        $iQuantity = max(oxConfig::getParameter( 'qty' ), 1);

        try
        {
            if ($oArticle) {
                $oBasket->addToBasket($oArticle->oxarticles__oxid->value, $iQuantity);
                $this->_sAjaxResponse = self::successMessage(true);
            }
        }
        catch (Exception $e)
        {
            $this->_sAjaxResponse = self::errorMessage($e->getMessage());
        }
    }

    /**
     * Invoice Address
     *
     * Returns: Array with formdata
     */
    public function getInvoiceAddress()
    {
        $oUser = $this->getUser();
        $address = array();
        if (!empty($oUser)) {
            $address = oxConfig::getParameter( 'invadr');
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
            $this->_sAjaxResponse = self::successMessage($address);
        } else {
            $this->_sAjaxResponse = self::errorMessage("No address available");
        }
    }

    /**
     * Get Delivery Address from database
     *
     * Returns: Array of Arrays (Addressid => Address)
     */
    public function getDeliveryAddresses()
    {
        $oUser = $this->getUser();
        $addresses = $oUser->getUserAddresses();
        $res = array();
        foreach($addresses as $address) {
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
            $this->_sAjaxResponse = self::successMessage($res);
        } else {
            $this->_sAjaxResponse = self::errorMessage("No address available");
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
        $sActShipSet = oxConfig::getParameter( 'sShipSet' );
        if ( !$sActShipSet ) {
            $sActShipSet = oxSession::getVar( 'sShipSet' );
        }

        $oBasket = $this->getSession()->getBasket();
        $oBasket->setShipping( null );
        $oBasket->onUpdate();
        oxSession::setVar( 'sShipSet', $sActShipSet );

        // load sets, active set, and active set payment list
        list( $aAllSets, $sActShipSet, $aPaymentList ) = oxDeliverySetList::getInstance()->getDeliverySetData( $sActShipSet, $this->getUser(), $oBasket );

        foreach($aAllSets as $set) {
            $deliveries[] = array(
                'id'    => $set->oxdeliveryset__oxid->value,
                'title' => $set->oxdeliveryset__oxtitle->value,
                'pos'   => $set->oxdeliveryset__oxpos->value,
            );
        }
        foreach($aPaymentList as $pay) {
            $payments[] = array(
                'id' => $pay->oxpayments__oxid->value,
                'title' => $pay->oxpayments__oxdesc->value,
                'pos' => $pay->oxpayments__oxsort->value,
            );
        }
        $this->_sAjaxResponse = self::successMessage(array(
            'deliveries' => $deliveries,
            'payments'   => $payments,
            'actship'    => $sActShipSet,
        ));
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
        if ( !oxConfig::getParameter( 'ord_agb' ) && $myConfig->getConfigParam( 'blConfirmAGB' ) ) {
            $this->_sAjaxResponse = self::errorMessage("TNS not accepted");
            return;
        }
        if ( !$oUser= $this->getUser() ) {
            $this->_sAjaxResponse = self::errorMessage("User not logged on");
        }
        $oBasket  = $this->getSession()->getBasket();
        if ( $oBasket->getProductsCount() ) {

            try {
                $oOrder = oxNew( 'oxorder' );

                // finalizing ordering process (validating, storing order into DB, executing payment, setting status ...)
                $iSuccess = $oOrder->finalizeOrder( $oBasket, $oUser );

                // performing special actions after user finishes order (assignment to special user groups)
                $oUser->onOrderExecute( $oBasket, $iSuccess );

                // proceeding to next view
                return $this->_getNextStep( $iSuccess );
            } catch ( Exception $oEx ) {
                $this->_sAjaxResponse = self::errorMessage(array('message'=>"error executing order",'data'=>$oEx));
            }
        }

        $this->_sAjaxResponse = self::successMessage("done order");
    }
    /**
     * Get content by ident
     *
     * @param string $sLoadId
     * @return string
     */
    protected function _getContentByIdent($sLoadId)
    {
        $oContent = oxNew( 'oxcontent' );
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
        $sContent = $this->_getContentByIdent('oxagb');
        $this->_sAjaxResponse = self::successMessage($sContent);
    }

    /**
     * Get the imprint
     *
     * Returns: string
     */
    public function getImprint()
    {
        $sContent = $this->_getContentByIdent('oximpressum');
        $this->_sAjaxResponse = self::successMessage($sContent);
    }
    /*
     * Get list of countries
     *
     */
    public function getCountryList()
    {
        $oCountryList = oxNew( 'oxcountrylist' );
        $oCountryList->loadActiveCountries();
        $res = array();
        foreach($oCountryList as $country) {
            $res[] = array(
                'id'     => $country->oxcountry__oxid->value,
                'title'  => $country->oxcountry__oxtitle->value,
                'iso2'   => $country->oxcountry__oxisoalpha2->value,
                'iso3'   => $country->oxcountry__oxisoalpha3->value,
            );
        }
        if (!empty($res)) {
            $this->_sAjaxResponse = self::successMessage($res);
        } else {
            $this->_sAjaxResponse = self::errorMessage("no countries found");
        }
    }

    public function setLanguage()
    {
        $sLang = oxConfig::getParameter( 'device_language' );
        $oLang = oxLang::getInstance();
        foreach($oLang->getLanguageArray() as $oLanguage) {
            if (strtolower($oLanguage->oxid) == strtolower($sLang) && $oLang->getBaseLanguage() != $oLanguage->id) {
                $oLang->setBaseLanguage($oLanguage->id);
                oxUtilsServer::getInstance()->setOxCookie( 'language', $oLang->getBaseLanguage() );
            }
        }
        $this->_sAjaxResponse = self::successMessage(true);
    }

    /**
     * Returns the version of the API
     */
    public function getVersion()
    {
        $this->_sAjaxResponse = self::successMessage(self::VERSION);
    }
}
