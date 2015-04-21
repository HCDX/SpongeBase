/**
 * Created by unicef-leb-inn on 4/9/15.
 */

/**
 * Created by unicef-leb-inn on 4/8/15.
 */

/**
 * Created by unicef-leb-inn on 4/5/15.
 */
        var map;
        var selectedli = 0;
        var adm1on = 0;
        var adm2on = 0;
        var adm3on = 0;
        var adm4on = 0;
        var itson = 0;
        var schoolon = 0;
		var phcon = 0;
		var municipalitieson = 0;
        var adm1layer;
        var adm2layer;
        var adm3layer;
        var adm4layer;
        var itslayer;
        var schoolslayer;
		var phclayer;
		var municipalitieslayer;
        var itslayerurl = 'http://unhcr.cartodb.com/api/v2/viz/6d01148e-ebbe-11e3-8ccb-0e230854a1cb/viz.json';
        var adm1layerurl = 'http://unhcr.cartodb.com/api/v2/viz/37b3bf66-ed76-11e3-abe6-0e230854a1cb/viz.json';
        var adm2layerurl = 'http://unhcr.cartodb.com/api/v2/viz/80a4de6a-f2eb-11e3-aea2-0e230854a1cb/viz.json';
        var adm3layerurl = 'http://unhcr.cartodb.com/api/v2/viz/2a7fe946-efe7-11e3-abb9-0e73339ffa50/viz.json';
        var adm4layerurl = 'http://unhcr.cartodb.com/api/v2/viz/46e8c810-4f9a-11e4-bbdf-0e4fddd5de28/viz.json';
        var schoolslayerurl = 'http://unhcr.cartodb.com/api/v2/viz/430d4bb0-face-11e3-ac1a-0e230854a1cb/viz.json';
		var phclayerurl='http://unhcr.cartodb.com/api/v2/viz/4704f114-bf68-11e4-a773-0e0c41326911/viz.json';
		var municipalitieslayerurl='http://unhcr.cartodb.com/api/v2/viz/497cfb5a-d31b-11e4-ace7-0e0c41326911/viz.json';

$(document).ready( function(){

    map = L.map('map', {
        zoomControl: true,
        center: [34, 36.1],
        zoom: 9
    });

        //map quest baselayer
    L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">'
    }).addTo(map);

    //      addcustomlayer(adm1layerurl, adm1layer);

    addadm1layer(adm1layerurl);
    addadm2layer(adm2layerurl);
    addadm3layer(adm3layerurl);
    addadm4layer(adm4layerurl);
    //addadm1layer(map, adm1layer, adm1layerurl);
    additslayer(itslayerurl);
    addschoolslayer(schoolslayerurl);
    addphclayer(phclayerurl);
    addmunicipalitieslayer(municipalitieslayerurl);

});


function createSelector(origin) {

    var $options = $('#layer_selector li');
    $options.click(function (e) {
        // get the area of the selected layer
        var $li = $(e.target);
        var area = $li.attr('data');

        // deselect all and select the clicked one
        //$options.removeClass('selected');

        //$li.addClass('selected');

        if (origin == 'adm1') {
            if (area == '1' && adm1on == 0) {
                //show adm1 layer
                adm1on = 1;
                adm1layer.show();
                $li.addClass('selected');
            }
            else if (area == '1' && adm1on == 1) {
                $li.removeClass('selected');
                //hide layer
                adm1layer.hide();
                adm1on = 0;
            }
        }

        if (origin == 'adm3') {
            if (area == '3' && adm3on == 0) {
                //show adm3 layer
                adm3on = 1;
                adm3layer.show();
                $li.addClass('selected');
            }
            else if (area == '3' && adm3on == 1) {
                //hide layer
                $li.removeClass('selected');
                adm3layer.hide();
                adm3on = 0;
            }
        }
        if (origin == 'adm4') {
            if (area == '4' && adm4on == 0) {
                //show adm3 layer
                adm4on = 1;
                adm4layer.show();
                $li.addClass('selected');
            }
            else if (area == '4' && adm4on == 1) {
                //hide layer
                $li.removeClass('selected');
                adm4layer.hide();
                adm4on = 0;
            }
        }

        if (origin == 'adm2') {
            if (area == '2' && adm2on == 0) {
                //show adm3 layer
                adm2on = 1;
                adm2layer.show();
                $li.addClass('selected');
            }
            else if (area == '2' && adm2on == 1) {
                //hide layer
                $li.removeClass('selected');
                adm2layer.hide();
                adm2on = 0;
            }
        }


        if (origin == 'its') {
            if (area == '5' && itson == 0) {
                //show adm1 layer
                itson = 1;
                itslayer.show();
                $li.addClass('selected');
            }
            else if (area == '5' && itson == 1) {
                //hide layer
                $li.removeClass('selected');
                itslayer.hide();
                itson = 0;
            }
        }
        if (origin == 'schools') {
            if (area == '6' && schoolon == 0) {
                //show adm1 layer
                schoolon = 1;
                schoolslayer.show();
                $li.addClass('selected');
            }
            else if (area == '6' && schoolon == 1) {
                //hide layer
                $li.removeClass('selected');
                schoolslayer.hide();
                schoolon = 0;
            }
        }

          if (origin == 'phc') {
            if (area == '7' && phcon == 0) {
                //show adm1 layer
                phcon = 1;
                phclayer.show();
                $li.addClass('selected');
            }
            else if (area == '7' && phcon == 1) {
                //hide layer
                $li.removeClass('selected');
                phclayer.hide();
                phcon = 0;
            }
        }

         if (origin == 'municipalities') {
            if (area == '8' && municipalitieson == 0) {
                //show adm1 layer
                municipalitieson = 1;
                municipalitieslayer.show();
                $li.addClass('selected');
            }
            else if (area == '8' && municipalitieson == 1) {
                //hide layer
                $li.removeClass('selected');
                municipalitieslayer.hide();
                municipalitieson = 0;
            }
        }

        selectedli = area;
        // change the query in the layer to update the map

    });
}

function clearMap() {
    for (i in map._layers) {
        try {
            if (i !== '18') {
                map.removeLayer(map._layers[i]);
            }
        }
        catch (e) {
            console.log("problem with " + e + map._layers[i]);
        }
    }
}

function main() {


    // add a nice baselayer from Stamen
    //L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    //    attribution: 'Stamen'
    //}).addTo(map);



}
//Custom Layer


//function to add new adm1 layer
function addadm1layer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {
             // get sublayer 0 and set the infowindow template
             adm1layer = layer.getSubLayer(0);
             adm1layer.infowindow.set('template', $('#infowindow_template').html());
             adm1layer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });


    createSelector('adm1');

}

//function to add new adm1 layer
function addadm2layer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {
             // get sublayer 0 and set the infowindow template
             adm2layer = layer.getSubLayer(0);
             adm2layer.infowindow.set('template', $('#infowindow_template').html());
             adm2layer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });


    createSelector('adm2');

}

function addadm4layer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
          function (layer) {
             adm4layer = layer.getSubLayer(0);
             adm4layer.on('featureClick', function (e, pos, latlng, data) {
                 $(function () {
                     Fetch(data.pcode, data.location_name_en);

                 });
             });
             adm4layer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });


    createSelector('adm4');

}


function addadm3layer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {
             // get sublayer 0 and set the infowindow template
             adm3layer = layer.getSubLayer(0);
             adm3layer.on('featureClick', function (e, pos, latlng, data) {
                 $(function () {
                     Fetch(data.acs_code, data.acs_name);
                  //   $("#page-wrap").dialog({ width: 800, title: "Location: " + data.acs_code + "| pcode: " + data.acs_name });
                 });
             });
             adm3layer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });


    createSelector('adm3');
}

//function to add new ITS layer
function additslayer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {
             // get sublayer 0 and set the infowindow template
             itslayer = layer.getSubLayer(0);
             itslayer.on('featureClick', function (e, pos, latlng, data) {
                 //  alert("You clicked " + data.p_code);
                 $(function () {
                     Fetch(data.pcode, data.pcode_name);

                 });
             });


             itslayer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });

    createSelector('its');


}
function addschoolslayer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {
             // get sublayer 0 and set the infowindow template
             schoolslayer = layer.getSubLayer(0);
             schoolslayer.on('featureClick', function (e, pos, latlng, data) {
                 //  alert("You clicked " + data.p_code);
                 $(function () {
                     Fetch("cerd: "+ data.cerd, data.school_name);

                 });
             });
             schoolslayer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });

    createSelector('schools');
}

 function addphclayer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {

             phclayer = layer.getSubLayer(0);
             phclayer.on('featureClick', function (e, pos, latlng, data) {
                 //  alert("You clicked " + data.p_code);
                 $(function () {
                     Fetch(""+ data.p_code, data.name_of_health_facility);

                 });
             });
             phclayer.hide();
         }).on('error', function () {
             console.log("some error occurred");
         });

    createSelector('phc');
}

         function addmunicipalitieslayer(layerurl) {
    cartodb.createLayer(map, layerurl).addTo(map)
         .on('done',
         function (layer) {

             municipalitieslayer = layer.getSubLayer(0);
             municipalitieslayer.on('featureClick', function (e, pos, latlng, data) {
                 //  alert("You clicked " + data.p_code);
                 $(function () {
                     Fetch(""+ data.pcode, data.mun_en);

                 });
             });
             municipalitieslayer.hide();
         }).on('error', function () {
             console.log("some error occurred in municipalities layer");
         });

    createSelector('municipalities');
}

window.onload = main;

function Fetch(pcode, name) {

    $.ajax({
        url: "http://ai-aggregator.apps.uniceflebanon.org/reports/?p_code=" + pcode,
        //dataType: "jsonp",
        success: function (retdata, statuss) {
            var marker_content = '\
          <span><font size="4">Location: ' + name + ' | Pcode: ' + pcode+'</font></span>\
          <table cellpadding="4" cellspacing="0" border="0" id="dogtable" class="table table-striped" style="color:black" bgcolor="#C0C0C0 ">\
            <thead>\
                          <tr>\
                               <th class="header"><b>Date</b></th>\
                                <th class="header"><b>Description</b></th>\
                                <th class="header"><b>Value</b></th>\
                                 <th class="header"><b>Category</b></th>\
                                <th class="header"><b>Source</b></th>\
                          </tr>\
            </thead>\
            <tbody>\ ';


            for (var i = 0; i < retdata.data.length; i++) {
                var obj = retdata.data[i];
                marker_content += '\
          <tr>\
          <td style="vertical-align:top; white-space:nowrap;">' + obj.date + '</td>\
          <td style="vertical-align:top;">' + obj.indicator_name + '</td>\
          <td style="vertical-align:top;">' + obj.value + '</td>\
          <td style="vertical-align:top;">' + obj.category + '</td>\
          <td style="vertical-align:top;">ActivityInfo: ' + obj.partner_name + '</td>\
                                </tr>\ ';
            }
            marker_content += '</tbody>\
                            </table>\
                            ';

            $("#page-wrap").attr("title", pcode);
            $("#page-wrap").html(marker_content);
            $('table').tablesorter({
                usNumberFormat: false,
                sortReset: true,
                sortRestart: true,
                sortList: [[0,1], [1,0]]
            });

            $("table").addTableFilter();
            }
    });


}

function processFormData() {
return document.getElementById('searchTxt').value;
}

function searchFunction(){

var mySearch = processFormData();
var sql = new cartodb.SQL({ user: 'unhcr' });
sql.getBounds("SELECT * FROM ai_allsites where lower(pcode) LIKE lower('%" + mySearch + "%') OR lower(site_name) LIKE lower('%" +
mySearch + "%')").done(function(bounds) {
    map.fitBounds(bounds);
    if (map.getZoom() > 18) {
        map.setZoom(18);
    }
});
}






