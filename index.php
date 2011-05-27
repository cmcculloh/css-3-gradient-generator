<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7 ]> <html class="no-js ie6" lang="en"> <![endif]-->
<!--[if IE 7 ]>    <html class="no-js ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]>    <html class="no-js ie8" lang="en"> <![endif]-->
<!--[if (gte IE 9)|!(IE)]><!--> <html class="no-js" lang="en"> <!--<![endif]-->
<head>
  <meta charset="utf-8">

  <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame
       Remove this if you use the .htaccess -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title></title>
  <meta name="description" content="">
  <meta name="author" content="">

  <!-- Mobile viewport optimized: j.mp/bplateviewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Place favicon.ico & apple-touch-icon.png in the root of your domain and delete these references -->
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">


  <!-- CSS: implied media="all" -->
  <link rel="stylesheet" href="css/style.css?v=2">

  <!-- Uncomment if you are specifically targeting less enabled mobile browsers
  <link rel="stylesheet" media="handheld" href="css/handheld.css?v=2">  -->

  <!-- All JavaScript at the bottom, except for Modernizr which enables HTML5 elements & feature detects -->
  <script src="js/libs/modernizr-1.7.min.js"></script>

  <style>
    #gradient{
      width: 600px;
      height: 200px;
      border: 1px solid black;
    }
  </style>
</head>

<body>

  <div id="container">
    <header>

    </header>
    <div id="main" role="main">
      <div id="gradient"></div>
      <div id="controls">
        <ul><?php
          $numstops = $_GET["numstops"];
          if(!isset($numstops)){
            $numstops=8;
          }
          $stopdistribution = 100/$numstops;

          for($i=0;$i<$numstops;$i++){
            echo '<li>';
            $stop = $i * $stopdistribution;
            echo '<label for="stop'.$i.'location">Stop '.$i.' Location:</label><input type="number" min="0" step="0.001" value="'.$stop.'" id="stop' . $i . 'location" name="stop'. $i . 'location">';
            $b = 10 - $i;
            if($b < 0){
              $b = $b * -1;
            }
            if($i < 10){
              $color = $i . $i . $b;
            }else if($i < 20){
              $color = ($i * 5) . $i . $b;
            }else if($i < 30){
              $color = ($i * 3) . $i . $b;
            }else if($i < 50){
              $color = ($i * 2) . $i . $b;
            }else{
              $color = $i . $i . $b;
            }
            
            if(strlen($color) > 3 && strlen($color) < 6){
              if(strlen($color) == 4){
                $color = substr($color, 0, 3);
              }else{
                $color.= 0;
              }
            }else if(strlen($color) > 6){
              $color = substr($color, 0, 6);
            }
            echo ' <label for="stop'.$i.'color">Stop '.$i.' Color:</label><input type="text" value="' . $color . '" id="stop' . $i . 'color" name="stop'. $i . 'color">';
            echo '</li>';
          }
        ?></ul>
        <br>
        <p><input type="button" value="toggle orientation" id="toggleorientation"></p>
        <br>
      <form>
        <label for="numstops">Number of Stops:</label><input type="number" min="0" step="1" value="8" name="numstops" id="numstops"><br>

        <input type="submit" value="change stops. DOES NOT SAVE CURRENT WORK">
      </form>
      <textarea id="output" rows="5" cols="80"></textarea>
      </div>
      
    </div>
    <footer>

    </footer>
  </div> <!--! end of #container -->


  <!-- JavaScript at the bottom for fast page loading -->

  <!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if necessary -->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.js"></script>
  <script>window.jQuery || document.write("<script src='js/libs/jquery-1.5.1.min.js'>\x3C/script>")</script>


  <!-- scripts concatenated and minified via ant build script-->
  <script src="js/plugins.js"></script>
  <script src="js/script.js"></script>
  <!-- end scripts-->

  <script>
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
  </script>

  <!--[if lt IE 7 ]>
    <script src="js/libs/dd_belatedpng.js"></script>
    <script>DD_belatedPNG.fix("img, .png_bg"); // Fix any <img> or .png_bg bg-images. Also, please read goo.gl/mZiyb </script>
  <![endif]-->


  <!-- mathiasbynens.be/notes/async-analytics-snippet Change UA-XXXXX-X to be your site's ID -->
  <script>
    var _gaq=[["_setAccount","UA-XXXXX-X"],["_trackPageview"]];
    (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
    g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
    s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>

</body>
</html>