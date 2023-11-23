
const elem = document.getElementById('3d-graph');
let selectedNodes = new Set();
let highlightNodes = new Set();
let highlightLinks = new Set();
let linkedNodes = new Set();
let hoverNode = null;

const Graph = ForceGraph3D()(elem)
    //.jsonUrl('./tordfs_allforms_vsSecondarylink.json')
    .jsonUrl('./allnoderel.json')
    .nodeAutoColorBy('class')
    .nodeLabel(node => {
    	if (node.properties.ontoMA_name_zh) 
    		return node.properties.rdfs__label +": "+node.properties.ontoMA_name_zh;
    	else
    		return node.properties.rdfs__label;
    })
    //.nodeVal(node => {return getNodeSize(node.properties.linkCount) })
    //.nodeOpacity(node => {return getNodeOpacity(node.properties.linkCount) })
    .linkAutoColorBy("type")
    //.linkColor(d => {
    //	if (d.type=="share_principle")
    //		return '#EB3324'
    //	else if (d.type=="share_tech") 
    //		return '#16417C'
    //	else return '#75FA61'
    //})
    .linkOpacity(0.04);

    Graph.onNodeHover(node => {
        // no state change
        if ((!node && !highlightNodes.size) || (node && hoverNode === node)) return;

        highlightNodes.clear();
        highlightLinks.clear();
        if (node) {
        		linkedNodes.clear();
						let { nodes, links } = Graph.graphData();
						
						links.forEach(link => {

							if (link.source.id == node.id)
								if (linkedNodes.has(node))
									return
								else {
									linkedNodes.add(link.target);
									highlightLinks.add(link);
								}
							
							else if (link.target.id == node.id)
								if (linkedNodes.has(node))
									return
								else{
									linkedNodes.add(link.source);
									highlightLinks.add(link);
								}
							});
        }

        hoverNode = node || null;

        updateHighlight();
      }); 


    Graph.onNodeClick(node => {

		var distance = 40;
  	
  	if(selectedNodes.has(node)){
  		selectedNodes.clear();
			linkedNodes.clear();

			distance = 500;

			d3.select(".colLeft").transition().duration(500)
            .style("opacity", "0");

      setTimeout(function(){
        $('.colLeft').css("display", "none");
				d3.select(".mainview").transition().duration(2000)
            .style("left", "0%");
      }, 500);
  	}

  	else{

  		selectedNodes.clear();
			selectedNodes.add(node);

			linkedNodes.clear();
			let { nodes, links } = Graph.graphData();

			links.forEach(link => {
				//console.log("traverse"+link.source.id)
				if (link.source.id == node.id)
					if (linkedNodes.has(node))
						return
					else linkedNodes.add(link.target);
				
				else if (link.target.id == node.id)
					if (linkedNodes.has(node))
						return
					else linkedNodes.add(link.source);
				});

			d3.select(".mainview").transition().duration(2000)
            .style("left", "25%");

      setTimeout(function(){
      	$('.colLeft').css("display", "block");
				d3.select(".colLeft").transition().duration(500)
            .style("opacity", "1");
      }, 2000);
      setTimeout(function(){
      	$('.colLeft').css("opacity", "1");
      }, 2500);
  	}

    if(selectedNodes.size>0)
			Graph.nodeColor(node => {
      	if(selectedNodes.has(node))
        		return '#F09B59'
        if(linkedNodes.has(node))
        		return '#D3D3D3'
        else return "C0C0C0"
      })

		//if(selectedNodes.size>0){
		//	Graph.nodeColor(node => {
    //  	if(selectedNodes.has(node))
    //    		return '#F09B59'
    //    	else if(linkedNodes.has(node))
    //    		return '#D3D3D3'
    //  })
		//}
    //else
    //  	Graph.nodeAutoColorBy('class')

		Graph.nodeColor(Graph.nodeColor()); 
		// Aim at node from outside it
		//const distance = 40;
		const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
		
		const newPos = node.x || node.y || node.z
			? { x: (node.x * distRatio) , y: (node.y * distRatio), z: node.z * distRatio }
          	: { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)

        Graph.cameraPosition(
            newPos, // new position
            node, // lookAt ({ x, y, z })
            3000  // ms transition duration
    );

});

// trigger update of highlighted objects in scene
function updateHighlight() {
  Graph
    .nodeColor(Graph.nodeColor())
    .linkWidth(Graph.linkWidth())
    .linkDirectionalParticles(Graph.linkDirectionalParticles());
}
    
// fit to canvas when engine stops
	//Graph.onEngineStop(() => Graph.zoomToFit(400));

// Define the node size scale
function getNodeSize(numLinks) {
    const nodeSize = d3.scaleLinear([4, 70], [5, 20]);
    
    if (numLinks === 0) return "2"; // smallest nodes for just one link
    else if (numLinks === 1) return "3";
    else if (numLinks < 4) return "4"; // small nodes for 1-20 links
    else if (numLinks > 70)
        return "30";
    else return nodeSize(numLinks)
}

