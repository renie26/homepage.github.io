const elem = document.getElementById('3d-graph');
let selectedNodes = new Set();
let highlightLinks = new Set();
let linkedNodes = new Set();
let hoverNode = null;
var sprite;
var spriteN;

const Graph = ForceGraph3D()(elem)
    .jsonUrl('data/allnoderel.json')
    .nodeColor(node => {
        if (node === hoverNode)
            return "red";
        else if (linkedNodes.has(node))
            return getColorByClass(node.class)
        else if (selectedNodes.size) return "black"
        else return getColorByClass(node.class)
    })
    .linkWidth(link => highlightLinks.has(link) ? 4 : 1)
    .linkDirectionalParticles(link => highlightLinks.has(link) ? 4 : 0)
    .linkDirectionalParticleWidth(2)
    .nodeLabel(node => {
        if (node.properties.ontoMA_name_zh)
            return node.properties.rdfs__label + ": " + node.properties.ontoMA_name_zh;
        else
            return node.properties.rdfs__label;
    })
    .nodeVal(node => { return getNodeSize(node.class) })
    .linkColor(link => {
        if (highlightLinks.has(link))
            return "yellow";
        else if (selectedNodes.size)
            return "black"
        else return getLinkColor(link.type)
    })
    .linkOpacity(0.2);

Graph.onNodeHover(node => {
    if ((!node && !linkedNodes.size) || (node && hoverNode === node)) return;
    if (selectedNodes.size && !linkedNodes.has(node)) return;

    linkedNodes.clear();
    highlightLinks.clear();
    if (node) {
        hoverNode = node;
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
                else {
                    linkedNodes.add(link.source);
                    highlightLinks.add(link);
                }
        });
    }
    updateHighlight();
});

Graph.onNodeClick(node => {
    var distance = 40;

    document.getElementById("myVideo").pause();
    
    if (selectedNodes.has(node)) {
        selectedNodes.clear();
        linkedNodes.clear();
        highlightLinks.clear();

        distance = 500;

        d3.select(".colLeft").transition().duration(500)
            .style("opacity", "0");


        setTimeout(function () {
            $('.colLeft').css("display", "none");
            $('.title').css("display", "none");
            $('.vWindow').css("display", "none");
        }, 500);
        updateHighlight();
    } else {
        if (linkedNodes.size) {
            selectedNodes.clear();
            selectedNodes.add(node);
        } else {
            linkedNodes.clear();
            highlightLinks.clear();
            if (node) {
                hoverNode = node;
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
                        else {
                            linkedNodes.add(link.source);
                            highlightLinks.add(link);
                        }
                });
            }
        }

        updateHighlight();
        setTimeout(function () {
	            $('.colLeft').css("display", "block");
	            $('.title').css("display", "block");
	            d3.select(".colLeft").transition().duration(500)
	                .style("opacity", "1");
	        }, 2000);

	        setTimeout(function () {
	            $('.colLeft').css("opacity", "1");
	        }, 2500);

        if(node.class == ("MA_form")){
	        setTimeout(function () {
	            $('.vWindow').css("display", "block");
	            d3.select(".vWindow").transition().duration(500)
	                .style("opacity", "1");
	        }, 2000);

            d3.json('data/all_forms_data/' + node.properties.rdfs__label + '.json')
                .then(function (result) {
                    window.displayNodeProperties(result.node_properties);
                    window.playVideoSegment(result.videoInfo, true);
                    //window.draw(result.data);
                    //window.recomd(result.recoInfo, result.recoLinks);
                })
                .catch(function (error) {
                    console.error('Error:', error);
            });
        }
        else if(selectedNodes.size)
        {
        	window.displayOtherNodeProperties(node);
			d3.select(".vWindow").transition().duration(500)
                .style("opacity", "0");
        	setTimeout(function () {
	            $('.vWindow').css("display", "none");
    		}, 500);
        }
    		
        else{
        	setTimeout(function () {
	            $('.colLeft').css("display", "block");
	            d3.select(".colLeft").transition().duration(500)
	                .style("opacity", "1");
        	}, 2000);

	        setTimeout(function () {
	            $('.colLeft').css("opacity", "1");
	        }, 2500);        	
        }
    }


    //Graph.nodeColor(Graph.nodeColor());

    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

    const newPos = node.x || node.y || node.z
        ? { x: (node.x * distRatio), y: (node.y * distRatio), z: node.z * distRatio }
        : { x: 0, y: 0, z: distance };

    Graph.cameraPosition(
        newPos,
        node,
        2000
    );
});

//Graph.d3Force('charge').strength(node => { return getLinkForce(linkedNodes.has(node),node.class) });

Graph.d3Force('charge').theta(0.5).strength(node => { return getLinkForce(linkedNodes.has(node),node.class) });

function updateHighlight() {
    Graph
        .nodeColor(node => {
	        if (node === hoverNode)
	            return "red";
	        else if (linkedNodes.has(node))
	            return getColorByClass(node.class)
	        else if (selectedNodes.size) return "black"
	        else return getColorByClass(node.class)
	    	})
        .linkWidth(Graph.linkWidth())
        .linkDirectionalParticles(Graph.linkDirectionalParticles());
}


const groupColors = {
    "group-0": "lightblue",
    "group-1": "lightgreen",
    "group-2": "#883a19",
    "group-3": "#c7a46a",
    "group-4": "#df8b46",
    "group-5": "#be5f1b",
    "group-6": "#cabcab"
};

function getColorByClass(nclass) {
    if (nclass.includes("_tech") && nclass !== 'combo_tech')
        return groupColors['group-1'];
    switch (nclass) {
        case 'combo_tech':
        case 'gestrue':
        case 'stance':
        case 'handwork':
        case 'bodywork':
        case 'footwork':
            return groupColors['group-0'];
        case 'fighting_strategy':
        case 'symbolic_animal':
            return groupColors['group-2'];
        case 'MA_form':
            return groupColors['group-3'];
        case 'MA_tactic':
            return groupColors['group-4'];
        case 'Form_set':
        case 'MA_style':
        case 'MA_system':
        case 'MA_principle':
            return groupColors['group-5'];
        default:
            return groupColors['group-6'];
    }
}

const color4link = {
    'contains': '#90ab9b',
    'similar_form_to': '#be6731',
    'represents': '#213e5a',
    'has_intent': '#e1d5b9',
    'employs': '#7b7872'
};

function getLinkColor(type) {
    switch (type) {
        case 'contains':
            return color4link['contains'];
        case 'similar_form_to':
            return color4link['similar_form_to'];
        case 'represents':
            return color4link['represents'];
        case 'has_intent':
            return color4link['has_intent'];
        case 'employs':
            return color4link['employs'];
        default:
            return "grey";
    }
}

function getNodeSize(nclass) {
    if (nclass.includes("_tech") && nclass !== 'combo_tech')
        return 6;
    switch (nclass) {
        case 'combo_tech':
            return 6;
        case 'gestrue':
        case 'stance':
        case 'handwork':
        case 'bodywork':
        case 'footwork':
            return 4;
        case 'symbolic_animal':
            return 3;
        case 'MA_form':
            return 8;
        case 'MA_tactic':
            return 4;
        case 'MA_style':
        case 'MA_system':
            return 40;
        case 'Form_set':
            return 30;
        case 'fighting_strategy':
        case 'MA_principle':
            return 12;
        default:
            return 2;
	    }
}

function getLinkForce(islinked, nclass) {
	var weight = -150;
	
	if(nclass.includes("_tech"))
		return 2 * weight;
    switch (nclass) {
        case 'gestrue':
        case 'stance':
        case 'handwork':
        case 'bodywork':
        case 'footwork':
        case 'MA_principle':
        case 'MA_tactic':
        		return 3 * weight;
        case 'MA_form':
        case 'fighting_strategy':
        		return 2 * weight;
        case 'MA_style':
        case 'MA_system':
        		return  5 * weight;
        case 'Form_set':
        		return  4 * weight;
        case 'symbolic_animal':
            return 4 * weight;
        default:
            return 5 * weight;
    }

}

