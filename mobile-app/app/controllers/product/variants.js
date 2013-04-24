var args = arguments[0] || {};
var communication = require('communication');

var variantSelects = [];
var structuredVariants = [];
var currentGroupId;
var selectedVariant = [];
var labels = [];

var productVariants = Alloy.createCollection("productVariant");
var productVariantGroups = Alloy.createCollection("productVariantGroup");

Alloy.Globals.addToBasketProductId = '';
Alloy.Globals.cartButton.enabled = false;

productVariants.on("reset", function() {
    variantSelects = [];
    structuredVariants = [];
    currentGroupId;
    labels.map(function(label) {
        $.variantsView.remove(label);
    });
    labels = [];

    for (var i = 0; i < args.variantGroupCount; i++) {
        var variantGroup = productVariantGroups.at(i);
        var groupId = variantGroup.get('groupId');
        var groupVariants = productVariants.where({groupId:groupId});
        var rows = [];
        structuredVariants[groupId] = [];

        groupVariants.map(function(productVariant, index) {
            structuredVariants[groupId][index] = productVariant;
            rows.push(productVariant.get('title'));
        });
        
        variantSelects[groupId] = Titanium.UI.createOptionDialog({
            title:variantGroup.get('title'),
            options:rows
        });
        variantSelects[groupId].addEventListener('click', function(e) {
            var variant = structuredVariants[currentGroupId][e.index];
            var group = productVariantGroups.where({groupId:currentGroupId})[0];
            
            selectedVariant[currentGroupId] = variant.get('variantId');
            labels[currentGroupId].text = group.get('title') + ': '  + variant.get('title');
            productVariantGroups.fetch({data:{productId:args.productId}});
        });

        var labelText = variantGroup.get('title');
        if (selectedVariant[groupId]) {
            var variant = productVariants.where({groupId:groupId,variantId:selectedVariant[groupId]})[0];
            
            labelText += ': ' + variant.get('title');
        }
        
        var label = Titanium.UI.createLabel({
            text:labelText,
            id:groupId
        });
        label.addEventListener('click', function(e) {
            currentGroupId = e.source.id;
            variantSelects[currentGroupId].show();
        });
        labels[groupId] = label;
        
        $.variantsView.add(label);
    }
    
    communication.productVariantId(args.productId, selectedVariant, function(response) {
        if (response.length == 32) {
            Alloy.Globals.addToBasketProductId = response;
            Alloy.Globals.cartButton.enabled = true;
        }
    }, function(errorMessage) {
        alert(errorMessage);
    });
});

productVariantGroups.on("reset", function() {
    Alloy.Globals.addToBasketProductId = '';
    Alloy.Globals.cartButton.enabled = false;
    productVariants.fetch({data:{productId:args.productId,selectedVariants:selectedVariant}});
});

productVariantGroups.fetch({data:{productId:args.productId}});
