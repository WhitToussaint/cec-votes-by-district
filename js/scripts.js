mapboxgl.accessToken = 'pk.eyJ1Ijoid2hpdHRvdXNzYWludCIsImEiOiJjbGc1cTkwZjcwM29uM2ZvZGVrN3o3dmpvIn0.vjFrPBBbMA0FjhY7VhNbZA';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    bounds: [[-74.67724, 40.49567], [-73.29065, 40.91585]]
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function () {
    map.addSource('school-districts-nyc-simplified', {
        type: 'geojson',
        data: 'data/school-districts-nyc-simplified.geojson'

    })

    map.addLayer({
        id: 'fill-school-districts-nyc-simplified',
        type: 'fill',
        source: 'school-districts-nyc-simplified',
        paint: {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'votes_cast'],
                1,
                '#edf8fb',
                3000,
                '#b3cde3',
                5000,
                '#8c96c6',
                7000,
                '#8856a7',
                10000,
                '#810f7c',
            ]
        }
    })


    map.addLayer({
        id: 'line-school-districts-nyc-simplified',
        type: 'line',
        source: 'school-districts-nyc-simplified',
        paint: {
            'line-color': '#525050'
        }
    })

    map.on('click', 'fill-school-districts-nyc-simplified', (e) => {
        //use Jquery to display district vote information text on popup
        var popupContent = '<div class="popup-content">' +
            '<h3>' + e.features[0] + '</h3>' +
            '<p>' + e.features[0] + '</p>' +
            '</div>';
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map);
    });
    // update featurestate when the mouse moves around within the school district layer
    map.on('mousemove', 'fill-school-districts-nyc-simplified', (e) => {
        if (e.features.length > 0) {
            if (hoveredStateId !== null) {
                map.setFeatureState(
                    { source: 'school-districts-nyc-simplified', id: hoveredStateId },
                    { hover: false }
                );
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                { source: 'school-districts-nyc-simplified', id: hoveredStateId },
                { hover: true }
            );
        }
    });

    // when the mouse leaves the school district layer, make sure nothing has the hover featurestate
    map.on('mouseleave', 'fill-school-districts-nyc-simplified', () => {
        if (hoveredStateId !== null) {
            map.setFeatureState(
                { source: 'school-districts-nyc-simplified', id: hoveredStateId },
                { hover: false }
            );
        }
        hoveredStateId = null;
    });
})

$('#vote').on('click', function () {
    window.open('https://www.schoolsaccount.nyc/', '_blank');
});
