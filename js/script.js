/* Author: 

*/

var numSaved = 0;
var numStops = 4;
var init = function(){
  jQuery("#controls ul").html("");
  numStops = jQuery("#numstops").val();
  numStops <= 1 ? numStops=2 : '';

  var stopDistribution = 100/(numStops - 1);

  for(var i = 0; i < numStops; i++){
    coord = i * stopDistribution;

    color = buildRandomHexColor(i);

    var theHTML = '<li><label for="stop'
                   + i + 'color">Stop '
                   + i + ' Color:</label><input type="text" value="' 
                   + color + '" id="stop' 
                   + i + 'color" name="stop'
                   + i + 'color">'+generateLocation(i,coord)+'</li>';
    jQuery("#controls ul").append(theHTML);
  }

  getProperties();
  updateGradient(buildGradient());
}
var generateLocation = function(stop, coord){
  return '<label for="stop'+stop+'location">Stop '+stop+' Location:</label><input type="number" min="0" step="0.001" value="'+coord+'" id="stop' +stop+ 'location" name="stop' + stop + 'location">';
}
var buildRandomHexColor = function(i){
  var r, g, b;

  b = 10 - i;
  g = 0;

  if(i < 10 || i >= 50){
    r = i;
  }else if(i < 20){
    r = i * 5;
  }else if(i < 30){
    r = i * 3;
  }else if(i < 50){
    r = i * 2;
  }

  if(b < 0){
    g = b * -1;
    b = '';
    if(g > 99){
      g-= 100;
    }
  }

  color = r + "" + g + "" + b;

  return normalizeHexColor(color);
}

var normalizeHexColor = function(color){
  console.log(color.length);
  if(color.length > 3 && color.length < 6){
    if(color.length == 4){
      color = color.substr(0,3);//just get the first three
    }else{
      color += "0";//add a zero to make it six
    }
  }else if(color.length > 6){
    color = color.substr(0,6);//just get the first six
  }else if(color.length < 3){
    if(color.length <= 0){
      color = "0";
    }
    if(color.length == 1){
      color+= "0";//need to add two zeros, add the first
    }
    color+= "0";//add a zero to bring to three
  }

  return color;
}

var saveTemplate = function(gradients){
	var theHTML;

	theHTML = '<div id="saved' + numSaved + '" class="pastGradientState">';
	theHTML += '<style>#saved'+numSaved+'{float: left; width: 50px; height: 50px; background: ';
	theHTML += buildGradient();
	theHTML += '} #saved'+numSaved + ' .popup{display:none;}';
	theHTML += '</style><div class="popup">background: '+buildGradient()+'</div></div>';

	jQuery("#savedGradients").append(theHTML);

	numSaved++;

	console.log('theHTML: ' + theHTML);
}

jQuery("#savedGradients div").live("hover", function(){
	jQuery("#output").val(jQuery(this).find(".popup").html());	
});

jQuery("ul input").live("change", function(){
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
  
  var bg = buildGradient();

  updateGradient(bg);
});

jQuery("#numstops").bind("change", function(){
  init();
});

jQuery("#toggleorientation").bind("click", function(){
  if(orientation == "top"){
    orientation = "left";
  }else{
    orientation = "top";
  }

  updateGradient(buildGradient());
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

  return bg;
}

updateGradient = function(bg){
  jQuery("#gradient").css({"background": bg});

  console.log("background: " + bg);

  jQuery("#output").val("background: " + bg);

  saveTemplate(gradients);

  jQuery.bbq.pushState(jQuery.param(gradients));	
}

init();




















