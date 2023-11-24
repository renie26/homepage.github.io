const video = document.getElementById('myVideo');

$('.infobtn').click(function(){
  $('.info').css("display", "none");
});

$('.legendbtn').click(function(){
    console.log("cnt")
    if( $('.legendimg').css("display")=="block")
        $('.legendimg').css("display", "none")
    else
        $('.legendimg').css("display", "block");
});

window.playVideoSegment = function(videoInfo, isVideoPlay) {
    if (!video) {
        console.error('Video element not found');
        return;
    }

    video.currentTime = videoInfo.startTime;
    video.endTime = videoInfo.endTime;
    video.innerHTML ="<source src=video/video_lowres.mp4#t="+ videoInfo.startTime +","+ videoInfo.endTime + "type='video/mp4'>"

    setTimeout(function () {
        video.play();
    }, 2000);
    

}


window.displayNodeProperties = function(node_properties) {
    console.log(node_properties)
    var zh_name = document.querySelector("#zh_name");
    var en_name = document.querySelector("#en_name");
    var nodetype = document.querySelector("#nodetype");

    zh_name.textContent = '';
    en_name.textContent = '';
    nodetype.textContent = '';
    //link.textContent = '';
    //link.href = '';

    for (var key in node_properties) {
        if (node_properties.hasOwnProperty(key)) {
            if (key == "ns1__ontoMA_name_zh") {
                zh_name.textContent = node_properties[key];
            } else if (key == "ns0__name_en") {
                en_name.textContent = node_properties[key];
            } else if (key == "rdfs__description") {
                nodetype.textContent = "Category: Martial Art Form";
            } 
            //else if (key == "uri") {
            //    link.textContent = "URI: " + node_properties[key];
            //    link.href = node_properties[key];
            //}
        }
    }
}


window.displayOtherNodeProperties = function(node) {
    var zh_name = document.querySelector("#zh_name");
    var en_name = document.querySelector("#en_name");
    var nodetype = document.querySelector("#nodetype");

    zh_name.textContent = '';
    en_name.textContent = '';
    nodetype.textContent = '';
    //link.textContent = '';
    //link.href = '';

    for (var key in node.properties) {
        if (node.properties.hasOwnProperty(key)) {
            if (key == "ontoMA_name_zh") {
                zh_name.textContent = node.properties[key];
            } else if (key == "name_en") {
                en_name.textContent = node.properties[key];
            }
        }
        nodetype.textContent = "Category: " +node.class;
    }
}