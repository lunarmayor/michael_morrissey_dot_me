
/*
    Three.js "tutorials by example"
    Author: Lee Stemkoski
    Date: July 2013 (three.js v59dev)
 */

// MAIN

// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();
var sphere1;
var globalSphere2;
var globalSphere3;
var globalSphere4;
var globalSphere5;
var sprite1;
var sprite2;
var sprite3;
var sprite4;
var mouse= {};
var targetList = []
// custom global variables
var cube;
var wireframeMaterial2 = new THREE.MeshBasicMaterial( { color: "white", wireframe: true, transparent: true } ); 
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: "#ffd700", wireframe: true, transparent: true } ); 
var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
init();
var state = {current_page: "home", objects: {}};
console.log(state);
animate();
// FUNCTIONS        
function init() 
{
    // SCENE
    scene = new THREE.Scene();
    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0,150,400);
    camera.lookAt(scene.position);  
    // RENDERER
    if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer( {antialias:true} );
    else
        renderer = new THREE.CanvasRenderer(); 

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    
    document.body.appendChild( renderer.domElement );
    // EVENTS
    THREEx.WindowResize(renderer, camera);
    THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    // CONTROLS
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    // STATS
    //controls.userZoom = false;


    // LIGHT
    var light = new THREE.PointLight(0xffffff);
    light.position.set(0,250,0);
    scene.add(light);

    // SKYBOX/FOG
    var skyBoxGeometry = new THREE.CubeGeometry( 10000, 10000, 10000 );
    var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
    skyBox.flipSided = true; // render faces from inside of the cube, instead of from outside (default).
    // scene.add(skyBox);
    scene.fog = new THREE.FogExp2( 'black', 0.00025 );
    
    ////////////
    // CUSTOM //
    ////////////
    // Sphere parameters: radius, segments along width, segments along height
    var sphereGeom =  new THREE.SphereGeometry( 50, 16 , 16 );
    
    // Basic wireframe materials.
   
        
    // Creating three spheres to illustrate wireframes.
    var sphere = new THREE.Mesh( sphereGeom, wireframeMaterial2 );
    sphere.position.set(0, 50, 0);
    sphere1 = sphere;
    scene.add( sphere );

    var spritey = makeTextSprite( "[web]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey.position.set(-100 , 0, 0);
    sprite1 = spritey
    scene.add(spritey);

    var spritey2 = makeTextSprite( "[video]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey2.position.set(100 , 0, 0);
    sprite2 = spritey2
    scene.add(spritey2);

    var spritey3 = makeTextSprite( "[images]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey3.position.set(0 , 0, 100);
    sprite3 = spritey3;
    scene.add(spritey3);

    var spritey4 = makeTextSprite( "[me]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey4.position.set(0 , 0, -100);
    sprite4 = spritey4;
    scene.add(spritey4);

    var sphereGeom2 = new THREE.SphereGeometry( 10, 8, 8);
    var sphere2 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere2.position.set(-100, 50, 0);
    targetList.push(sphere2);
    globalSphere2 = sphere2;

    scene.add(sphere2);

    var sphere3 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere3.position.set(100, 50, 0);
    globalSphere3 = sphere3;
    targetList.push(sphere3);
    scene.add(sphere3);

    var sphere4 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere4.position.set(0, 50, 100);
    globalSphere4 = sphere4
    targetList.push(sphere4);
    sphere.position.needsUpdate = true;
    sphere.geometry.dynamic = true;
    scene.add(sphere4);

    var sphere5 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere5.position.set(0, 50, -100);
    globalSphere5 = sphere5;
    targetList.push(sphere4);
    scene.add(sphere5);
    
    // Create a sphere then put the wireframe over it.    
    
    //scene.add( sphereWire );    
    
    // This sphere is created using an array containing both materials above.
    //var sphere = THREE.SceneUtils.createMultiMaterialObject( 
      //  sphereGeom.clone(), multiMaterial );
    //sphere.position.set(150, 50, 0);
    //scene.add( sphere );        
}

function animate() 
{
    if(state.current_page === "home"){
      requestAnimationFrame( animate );
      render();       
      update();
    } else{
        false;
    }
   

}

function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    
    var fontface = parameters.hasOwnProperty("fontface") ? 
        parameters["fontface"] : "Arial";
    
    var fontsize = parameters.hasOwnProperty("fontsize") ? 
        parameters["fontsize"] : 18;
    
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
        parameters["borderThickness"] : 4;
    
    var borderColor = parameters.hasOwnProperty("borderColor") ?
        parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
    
    var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
        parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

    var spriteAlignment = THREE.SpriteAlignment.topLeft;
        
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    
    // get size data (height depends only on font size)
    var metrics = context.measureText( message );
    var textWidth = metrics.width;
    
    // background color
    context.fillStyle   =  "rgba(0,0,0,0)";
    // border color
    context.strokeStyle = "rgba(0,0,0,0)";

    context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
    // 1.4 is extra height factor for text below baseline: g,j,p,q.
    
    // text color
    context.fillStyle = "rgba(255, 255, 255, 1.0)";

    context.fillText( message, borderThickness, fontsize + borderThickness);
    
    // canvas contents will be used for a texture
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true;

    var spriteMaterial = new THREE.SpriteMaterial( 
        { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(100 ,50,1.0);
    return sprite;  
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) 
{
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();   
}

function update()
{
    if ( keyboard.pressed("z") ) 
    { 
        // do something
    }
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere4.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;

    
    controls.update();

}

function render() 
{
    renderer.render( scene, camera );
}



$(document).ready(function(){
  $('.web').on("mouseout", function(){
    globalSphere2.material = wireframeMaterial2;
  });

  $('.web').on("mouseover", function(){
    globalSphere2.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.video').on("mouseout", function(){
    globalSphere3.material = wireframeMaterial2;
  });

  $('.video').on("mouseover", function(){
    globalSphere3.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.images').on("mouseout", function(){
    globalSphere4.material = wireframeMaterial2;
  });

  $('.images').on("mouseover", function(){
    globalSphere4.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.about-me').on("mouseout", function(){
    globalSphere5.material = wireframeMaterial2;
  });

  $('.about-me').on("mouseover", function(){
    globalSphere5.material = wireframeMaterial;
  });

});

/*$(document).click(function( event ) {

                event.preventDefault();

                var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
                projector.unprojectVector( vector, camera );

                var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
                var material = new THREE.LineBasicMaterial({color: "white"});
                var geom = new THREE.Geometry();
                geom.vertices.push(camera.position);
                geom.vertices.push(vector.sub( camera.position ).normalize() );
                line = new THREE.Line(geom, material);
                scene.add(line);
                
                var intersects = raycaster.intersectObjects( targetList );
                console.log(intersects);
                if ( intersects.length > 0 ) {
                    console.log(intersects);
                    intersects[ 0 ].object.material = wireframeMaterial;

                    var particle = new THREE.Sprite();
                    particle.position = intersects[ 0 ].point;
                    particle.scale.x = particle.scale.y = 8;
                    scene.add( particle );
                }

                

})*/
   


  
    


$(document).ready(function(){
  $('h1').on("mouseout", function(){
    sphere1.material = wireframeMaterial2;
  });

  $('h1').on("mouseover", function(){
    sphere1.material = wireframeMaterial;
  });

});

$(document).ready(function(){
  $('.about-me').on("click", function(){
    
  });

});


//

$(document).ready(function(){
  $('.images').on("click", function(){
    state.current_page = "imagesTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();

    $('h2').text("[ images ]");

    imagesTransition();
    
  })
})


var imagesTransition = function(){
  if(state.current_page === "imagesTransition"){
    requestAnimationFrame( imagesTransition );
    render();       
    updateImagesTransition();
  } else{
    initImages();
    imagesTransition2();

  };


};

var spherePos = 100;
var subtractedVal = -0.0035;


var updateImagesTransition = function(){
  if ((sprite1.material.opacity > 0) || (spherePos > 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere3.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere2.material.opacity +=  subtractedVal;
   globalSphere3.material.opacity +=  subtractedVal;
   sprite1.material.opacity += subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere5.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere4.position.z = spherePos;
   globalSphere4.position.y += -0.2
   
   globalSphere4.scale.x += 0.01;
   globalSphere4.scale.y += 0.01;
   globalSphere4.scale.z += 0.01;

   spherePos = spherePos - 0.5;
   controls.update();

  } else {
    state.current_page = "imagesTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere2);
    scene.remove(globalSphere3);
    scene.remove(globalSphere5);

  }
}


var imagesTransition2 = function(){
  if(state.current_page === "imagesTransition2"){
    requestAnimationFrame( imagesTransition2 );
    render();       
    updateImagesTransition2();
  } else{
    false;
};
};




var initImages = function(){
  $('#content').html("<a href='/assets/gallery9.jpg' data-lightbox = 'gallery'><img src= '/assets/gallery9.jpg'/></a><a href='/assets/gallery4.jpg' data-lightbox = 'gallery'><img src= '/assets/gallery4.jpg'/></a><a href='/assets/gallery10.png' data-lightbox = 'gallery'><img src= '/assets/gallery10.png' /></a><a href='/assets/gallery11.jpeg' data-lightbox = 'gallery'><img src= '/assets/gallery11.jpeg' /></a><a href='/assets/gallery13.jpeg' data-lightbox = 'gallery'><img src= '/assets/gallery13.jpeg'/></a><a href='/assets/gallery7.jpg' data-lightbox = 'gallery'><img src= '/assets/gallery7.jpg'/></a>");
  setTimeout(function(){$('#content').animate({ opacity: 1 }, 2000 );
  }, 200)
}

var updateImagesTransition2 = function(){
  globalSphere4.rotation.y +=  1 * Math.PI / 200;
  




  controls.update();


}


//video



$(document).ready(function(){
  $('.video').on("click", function(){
    state.current_page = "videoTransition"
    $( ".images" ).off();
    $( ".web").off();
    $(".about-me").off();
    $(".video").off();

    $('h2').text("[ video ]");

    videoTransition();
    
  })
})


var videoTransition = function(){
  if(state.current_page === "videoTransition"){
    requestAnimationFrame( videoTransition );
    render();       
    updateVideoTransition();
  } else{
    initVideo();
    videoTransition2();

  };


};

var spherePos = 100;
var subtractedVal = -0.0035;


var updateVideoTransition = function(){
  if ((sprite1.material.opacity > 0) || (spherePos > 0)){
    camera.position.x = 300 * Math.sin(Date.now()* 0.0003);
    camera.position.z = 300 * Math.cos(Date.now()* 0.0003);
    sphere1.position.y = 20 + 10 * Math.cos(Date.now()* 0.0005);
    globalSphere2.position.y = (15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite1.position.y = (15 * Math.sin(Date.now()* 0.0006))+ 12;
    globalSphere4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +25;
    sprite2.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
    sprite3.position.y = (15 * Math.sin(Date.now()* 0.0006)) +12;
    globalSphere5.position.y = (-15 * Math.sin(Date.now()* 0.0006)) + 25;
    sprite4.position.y = (-15 * Math.sin(Date.now()* 0.0006)) +12;
   

   globalSphere2.material.opacity +=  subtractedVal;
   globalSphere4.material.opacity +=  subtractedVal;
   sprite1.material.opacity += subtractedVal * 2;
   sprite2.material.opacity += subtractedVal * 2;
   sprite3.material.opacity += subtractedVal * 2;
   
   sprite4.material.opacity += subtractedVal * 2;
   if(sphere1.material.opacity < 0){
     scene.remove(sphere1);
   };

   
   globalSphere5.material.opacity +=  subtractedVal;
   subtractedVal += 0.000001;
   globalSphere3.position.x = spherePos;
   globalSphere3.position.y += -0.25
   
   globalSphere3.scale.x += 0.01;
   globalSphere3.scale.y += 0.01;
   globalSphere3.scale.z += 0.01;

   spherePos = spherePos - 0.5;
   controls.update();

  } else {
    state.current_page = "videoTransition2";
    scene.remove(sphere1);
    scene.remove(globalSphere2);
    scene.remove(globalSphere4);
    scene.remove(globalSphere5);

  }
}


var videoTransition2 = function(){
  if(state.current_page === "videoTransition2"){
    requestAnimationFrame( videoTransition2 );
    render();       
    updateVideoTransition2();
  } else{
    false;
};
};




var initVideo = function(){
  $('#content').html("<iframe class='vine-embed' src='https://vine.co/v/haXQeXAUqj1/embed/simple' frameborder='0' height= '320' width= '320'/>");

  setTimeout(function(){
    $('#content').animate({ opacity: 1 }, 2000 );
    startVine();
  }, 200)
}

var updateVideoTransition2 = function(){
  globalSphere3.rotation.y +=  1 * Math.PI / 200;
  




  controls.update();


}



