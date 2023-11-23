window.displayNodeProperties = function(node_properties) {
    var zh_name = document.querySelector("#zh_name");
    var en_name = document.querySelector("#en_name");
    var description = document.querySelector("#description");
    var link = document.querySelector("#uri"); // 保持对 DOM 元素的引用

    zh_name.textContent = '';
    en_name.textContent = '';
    description.textContent = '';
    link.textContent = '';
    link.href = '';

    for (var key in node_properties) {
        if (node_properties.hasOwnProperty(key)) {
            if (key == "ns1__ontoMA_name_zh") {
                zh_name.textContent = node_properties[key];
            } else if (key == "ns0__name_en") {
                en_name.textContent = node_properties[key];
            } else if (key == "rdfs__description") {
                description.textContent = "Description: " + node_properties[key];
            } else if (key == "uri") {
                link.textContent = "URI: " + node_properties[key];
                link.href = node_properties[key];
            }
        }
    }
}
