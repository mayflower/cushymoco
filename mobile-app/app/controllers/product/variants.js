var args = arguments[0] || {};
var variantSelects = [];
var structuredVariants = [];
var currentGroupId;
var selectedVariant = [];
var labels = [];

var productVariants = Alloy.createCollection("productVariant");
var productVariantGroups = Alloy.createCollection("productVariantGroup");

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
});

productVariantGroups.on("reset", function() {
    productVariants.fetch({data:{productId:args.productId,selectedVariants:selectedVariant}});
});

productVariantGroups.fetch({data:{productId:args.productId}});
