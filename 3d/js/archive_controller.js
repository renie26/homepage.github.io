	const Settings = function() {
	  this.LinkDistance = 100;
	};

	const settings = new Settings();
	const gui = new dat.GUI();

	const controller = gui.add(settings, 'LinkDistance', 100, 500);

	controller.onChange(updateLinkDistance);


	const linkForce = Graph.d3Force('link');
	console.log(linkForce.distance)
	updateLinkDistance();
	
	function updateLinkDistance() {
	  linkForce.distance(link => {console.log(link); return getLinkForce(linkForce.distance, link.type)});//settings.LinkDistance
	  Graph.numDimensions(3); // Re-heat simulation
	}
	