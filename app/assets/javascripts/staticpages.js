
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
// custom global variables
var cube;
var wireframeMaterial2 = new THREE.MeshBasicMaterial( { color: "white", wireframe: true, transparent: true } ); 
var wireframeMaterial = new THREE.MeshBasicMaterial( { color: "#ffd700", wireframe: true, transparent: true } ); 
var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
init();
animate();

var STATE = {}


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

    var spritey4 = makeTextSprite( "[about me]",{ fontsize: 17, borderColor: {r:255, g:0, b:0, a:0}, backgroundColor: {r:255, g:100, b:100, a:0} } );
    spritey4.position.set(0 , 0, -100);
    sprite4 = spritey4;
    scene.add(spritey4);

    var sphereGeom2 = new THREE.SphereGeometry( 10, 8, 8);
    var sphere2 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere2.position.set(-100, 50, 0);
    globalSphere2 = sphere2;
    scene.add(sphere2);

    var sphere3 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere3.position.set(100, 50, 0);
    globalSphere3 = sphere3;
    scene.add(sphere3);

    var sphere4 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere4.position.set(0, 50, 100);
    globalSphere4 = sphere4
    scene.add(sphere4);

    var sphere5 = new THREE.Mesh(sphereGeom2, wireframeMaterial2);
    sphere5.position.set(0, 50, -100);
    globalSphere5 = sphere5
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
    requestAnimationFrame( animate );

    render();       
    update();
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

function onMouseMove( e ) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;}



