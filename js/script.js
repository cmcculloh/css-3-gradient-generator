/* Author: Christopher McCulloh

*/

;var limeberry = {
    numSaved : 0
  , numStops : 4
  , stopDistribution: 0
  , $numStops : null
  , orientation: "top"
  , gradients: {}
  , init : function(){
      limeberry.$numStops = jQuery("#numstops");
      
      /*START EVENT BINDINGS*/
      limeberry.$numStops.bind("click", function(){
        limeberry.updateStops();
      });

      jQuery("#savedGradients div").live("hover", function(){
        jQuery("#output").val(jQuery(this).find(".popup").html());  
      });

      jQuery("ul input").live("change", function(){
        var $obj = jQuery(this);
        var id = $obj.attr("id");
        id = id.replace("location", "").replace("color", "");
        if($obj.attr("type") == "number"){
          console.log("changing location of " + id + " to " + $obj.val());
          limeberry.gradients[id]["location"] = $obj.val();
        }else{
          limeberry.gradients[id]["color"] = $obj.val();
        }
        console.dir(limeberry.gradients);
        
        var bg = limeberry.buildGradient();

        limeberry.updateGradient(bg);
      });


      jQuery("#toggleorientation").bind("click", function(){
        if(limeberry.orientation == "top"){
          limeberry.orientation = "left";
        }else{
          limeberry.orientation = "top";
        }

        limeberry.updateGradient(limeberry.buildGradient());
      });
      /*END EVENT BINDINGS*/


      jQuery("#controls ul").html("");

      limeberry.numStops = limeberry.$numStops.val();
      limeberry.updateStops();
  }
  , generateLocation: function(stop, coord){
    return '<label for="stop'
                      +stop+'location">Stop '
                      +stop+' Location:</label>'
                      +'<input type="number" min="0" step="0.001" value="'
                      +coord+'" id="stop' 
                      +stop+ 'location" name="stop' 
                      +stop+ 'location">';
  }
  , generateColor: function(stop){
    return '<label for="stop'
                       + stop + 'color">Stop '
                       + stop + ' Color:</label><input type="text" value="' 
                       + limeberry.buildRandomHexColor(stop) + '" id="stop' 
                       + stop + 'color" name="stop'
                       + stop + 'color">';
  }
  , updateStopDistribution: function(){
      limeberry.numStops = limeberry.$numStops.val();
      limeberry.numStops = (limeberry.numStops <= 1 ? 2 : limeberry.numStops);
      console.log('numStops: ' + limeberry.numStops);

      limeberry.stopDistribution = 100/(limeberry.numStops - 1);
  }
  , updateStops: function(){
    var prevNumStops = limeberry.numStops;
    limeberry.updateStopDistribution();
    var coord = limeberry.numStops * limeberry.stopDistribution;

    if(limeberry.numStops <= prevNumStops){
      jQuery("#controls ul").html("");
      console.log('init or decrease stops');
      for(var i = 0; i < limeberry.numStops; i++){
        var coord = i * limeberry.stopDistribution;

        var theHTML = '<li>'+limeberry.generateColor(i)+limeberry.generateLocation(i,coord)+'</li>';

        jQuery("#controls ul").append(theHTML);
      }
    }else{
      console.log('increase stops');
      for(var i = prevNumStops, ii = limeberry.numStops; i < ii; i++){
        jQuery("#controls ul").append('<li>'+limeberry.generateColor(i)+limeberry.generateLocation(i, coord)+'</li>');
      }
    }

    limeberry.getProperties();
    limeberry.updateGradient(limeberry.buildGradient());
  }
  , buildRandomHexColor: function(i){
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

      return limeberry.normalizeHexColor(color);
  }
  , normalizeHexColor: function(color){
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
  , saveTemplate: function(gradients){
    var theHTML;

    theHTML = '<div id="saved' + limeberry.numSaved + '" class="pastGradientState">';
    theHTML += '<style>#saved'+limeberry.numSaved+'{float: left; width: 50px; height: 50px; background: ';
    theHTML += limeberry.buildGradient();
    theHTML += '} #saved'+limeberry.numSaved + ' .popup{display:none;}';
    theHTML += '</style><div class="popup">background: '+limeberry.buildGradient()+'</div></div>';

    jQuery("#savedGradients").append(theHTML);

    limeberry.numSaved++;

    console.log('theHTML: ' + theHTML);
    
    jQuery.bbq.pushState(jQuery.param(gradients));  
  }
  , buildGradient: function(){
    var bg;

    bg = "-webkit-linear-gradient(" + limeberry.orientation;
    jQuery.each(limeberry.gradients, function(key, value){
      bg += ", #" + limeberry.gradients[key]["color"] + " " + limeberry.gradients[key]["location"] + "%";
    });

    bg += ")";

    return bg;
  }
  , getProperties: function(){
    jQuery("ul li").each(function(index){
      limeberry.gradients["stop" + index]={};
    });

    jQuery("ul input[type=number]").each(function(index){
      limeberry.gradients["stop" + index]["location"] = $(this).val();
      console.log("stop" + index + "; loc: " + $(this).val());
    });

    jQuery("ul input[type=text]").each(function(index){
      limeberry.gradients["stop" + index]["color"] = $(this).val();
      console.log("stop" + index + "; color: " + $(this).val());
    });
  }
  , updateGradient: function(bg){
    jQuery("#gradient").css({"background": bg});

    console.log("background: " + bg);

    jQuery("#output").val("background: " + bg);

    limeberry.saveTemplate(limeberry.gradients);
  }
};

limeberry.init();




















