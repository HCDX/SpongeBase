function GetLayer(adminLayer) {
    // get sublayer 0 and set the infowindow template
    adminLayer.getSubLayer(0);
    var adm1layer = adminLayer.getSubLayer(0);
    adm1layer.infowindow.set('template', $('#infowindow_template').html());
}

function addadm1layer(map, adminLayer, layerurl) {
    adminLayer = cartodb.createLayer(map, layerurl).addTo(map).on('done', 'nothing');
    var adm1layer = adminLayer.getSubLayer(0);
    //GetLayer(adminLayer, adminLayer);
    createSelector('adm1');
}