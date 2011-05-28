/* Author: 

*/



jQuery("ul input").bind("change", function(){
  var $obj = jQuery(this);
  var id = $obj.attr("id");
  id = id.replace("location", "").replace("color", "");
  if($obj.attr("type") == "number"){
    console.log("changing location of " + id + " to " + $obj.val());
    gradients[id]["location"] = $obj.val();
  }else{
    gradients[id]["color"] = $obj.val();
  }
  console.dir(gradients);
  
  buildGradient();

  jQuery.bbq.pushState(jQuery.param(gradients));
});

jQuery("#toggleorientation").bind("click", function(){
  if(orientation == "top"){
    orientation = "left";
  }else{
    orientation = "top";
  }

  buildGradient();
});

var gradients = {
}

var orientation = "top";

getProperties = function(){
  jQuery("ul li").each(function(index){
    gradients["stop" + index]={};
  });

  jQuery("ul input[type=number]").each(function(index){
    gradients["stop" + index]["location"] = $(this).val();
    console.log("stop" + index + "; loc: " + $(this).val());
  });

  jQuery("ul input[type=text]").each(function(index){
    gradients["stop" + index]["color"] = $(this).val();
    console.log("stop" + index + "; color: " + $(this).val());
  });
}

buildGradient = function(){
  var bg;

  bg = "-webkit-linear-gradient(" + orientation;
  jQuery.each(gradients, function(key, value){
    bg += ", #" + gradients[key]["color"] + " " + gradients[key]["location"] + "%";
  });

  bg += ")";
  jQuery("#gradient").css({"background": bg});

  console.log("background: " + bg);

  jQuery("#output").val("background: " + bg);
}

getProperties();
buildGradient();



















