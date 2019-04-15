function formatFunction(fn, codeDiv) {
	codeDiv.innerText = fn.toString()
	.replace(/^            \}$/gm, '')
	.replace(/                (\S)/gm, '$1')
	.replace(/^function \(\) \{$/gm, '')
	.replace(/^(.{75}).+$/gm, '$1 ...')
	.trim();
	hljs.highlightBlock(codeDiv);
}

L.Map.addInitHook(function() {
	var slides = document.querySelector('.slides'),
	zoom = Number(slides.style.zoom);

	if (!zoom) {
		zoom = Number(slides.style.transform.replace(/.*scale\(([0-9\.]+)\).*/, '$1'));
	}

	this._container.style.zoom = 1/zoom;
	this.invalidateSize();
});



window.divaMap = (function() {
	var map;

	return {
		start: function() {
			var map = L.map('diva-map')

			Esri_OceanBasemap.addTo(map);

			var baseMaps = {
				"Ocean Basemap (ESRI)": Esri_OceanBasemap,
				"CartoDB": CartoDB,
				"CartoDB Dark": CartoDB_DarkMatter,
			};

			var heatStyle = {
				gradient : {.65: "white", .75:"#FFFF36", .85:"#FF9D00", .9:"#FF1700", .95:"#900000", 1:"black"},
				minOpacity: 0.25,
				radius: 5,
				blur: 5,
			};

			var dataStyle = {
				radius: 1,
				fillColor: 'red',
				weight: 1,
				opacity: 1,
				color: 'black',
				fillOpacity: 0.7
			}

			var meshStyle = {
				weight: 0.5,
				opacity: .7,
				color : 'black',
				fillOpacity: 0.
			}

			var contourStyle = {
				weight: 3,
				opacity: 1,
				color : 'black',
				fillOpacity: 0.
			}

			var heatStyle = {
				gradient : {.5: "white", .65:"#FFFF36", .85:"#FF9D00", .9:"#FF1700", .95:"#900000", 1:"black"},
				minOpacity: 0.75, radius: 2, blur: 2,
			};

			function getFieldColor(d) {
				return d > 22  ? '#d73027' :
				d > 21  ? '#f46d43' :
				d > 20  ? '#fdae61' :
				d > 19  ? '#fee090' :
				d > 18  ? '#e0f3f8' :
				d > 17  ? '#abd9e9' :
				d > 16  ? '#74add1' :
				'#4575b4' ;
			}


			function fieldStyle(feature) {
				return {
					radius: 5,
					fillColor: getFieldColor(feature.properties.field),
					color: 'k',
					weight: 2,
					opacity: 0.9,
					fillOpacity: 0.8
				};
			}

			latlon = [];

			var bcn = new L.LatLng(41.3225, 2.2089) 		// 18.8
			var cerema = new L.LatLng(42.93, 6.20)			// 21
			var midpoint = new L.LatLng(42.12625, 4.2)	// 20.535

			var bcnCircle = L.circle(bcn, {radius: 30000, color: 'blue', fillOpacity: .5});
			var ceremaCircle = L.circle(cerema, {radius: 30000, color: 'red', fillOpacity: .5});
			var midpointCircle = L.circle(midpoint, {radius: 30000, color: 'black', fillOpacity: .5});
			var cities = L.layerGroup([bcnCircle, ceremaCircle, midpointCircle]);
			cities.addTo(map);

			bcnCircle.bindTooltip("18.4°C", {permanent: true, className: "textlabel", offset: [-20, 0] });
			ceremaCircle.bindTooltip("19.8°C", {permanent: true, className: "textlabel", offset: [-20, 0] });
			midpointCircle.bindTooltip("<b> ? </b>", {permanent: true, className: "textlabel", offset: [-20, 0] });

			var bathymetry = L.tileLayer.wms('http://ows.emodnet-bathymetry.eu/wms', {
				layers: 'emodnet:mean_atlas_land,coastlines,world:sea_names'
			});

			var heatmap = L.heatLayer(datapoints, heatStyle);
			var divacontours = new L.GeoJSON(contours, {style: contourStyle});
			var divamesh = new L.GeoJSON(medmesh, {style: meshStyle});
			var divafield = new L.GeoJSON(temperature5m, {style: fieldStyle});

			markerlist = []
			for (var i = 0; i < grid.length; i++) {
				marker = new L.circleMarker([grid[i][0],grid[i][1]],
					{color: "k", radius: 3, opacity: 1, fillOpacity:.9});
					markerlist.push(marker);
			};
			var coarsegrid = L.layerGroup(markerlist);
				// coarsegrid.addTo(map);

			markerlist2 = []
			for (var i = 0; i < grid2.length; i++) {
				marker = new L.circleMarker([grid2[i][0], grid2[i][1]],
					{color: "k", radius: 2, opacity: 1, fillOpacity:.9});
					markerlist2.push(marker);
			};
			var finegrid = L.layerGroup(markerlist2);


			var overlayers = {
				"Cities": cities,
				"Heat map": heatmap,
				"Coarse grid": coarsegrid,
				"Fine grid": finegrid,
				"Bathymetry": bathymetry,
				"Contours": divacontours,
				"Finite-element mesh": divamesh,
				"Interpolated field": divafield,
			};

			map.setView([38.5,10], 5);
			L.control.scale().addTo(map);

			L.control.layers(baseMaps, overlayers,
				{autoZIndex:true, collapsed:true}).addTo(map);

			},
			stop: function() {
				map.remove();
			}
		};
	})();
