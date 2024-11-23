/* eslint-disable */

export const displayMap = (locations) => {
	// Initialize the map
	const map = new maplibregl.Map({
		container: "map", // The ID of the div where the map will be rendered
		style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json", // Base map style
		center: locations[0].coordinates, // Center map on the first location [lng, lat]
		zoom: 8, // Initial zoom level
	});

	// Add markers for each location
	locations.forEach((location) => {
		// Create a new marker element
		const el = document.createElement("div");
		el.className = "marker";

		// Add marker and popup
		new maplibregl.Marker(el)
			.setLngLat(location.coordinates)
			.setPopup(
				new maplibregl.Popup({ offset: 25 }) // Add a popup
					.setMaxWidth("25rem")
					.setHTML(
						`<div class='maplibregl-popup-content'><h4>${location.description}</h4><p>Day: ${location.day}</p></div>`
					)
			)
			.addTo(map);
	});
};
