// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program


//Render List
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_globalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_globalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +

  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';
//VARIABLE
var gl;
var canvas;
var a_Position;
var u_FragColor;
var u_Size;

let color_storage = [1.0, 1.0, 1.0, 1.0];
var radiansX = 0;
var radiansY = 0;
var radiansZ = 0;

var xVec = 0;
var YVec = 0;
var ZVec = 0
let pink_rot = 0;
let yellow_rot = 0;
var animation_on = false;
let leg;
let leg2;
let limb;
let limb2

//let pyr; // can you share the server
//it is shared 
//as 't'
//sorry I'm tired LOL
//the
// are you hosting the javascript
//the server is running 
// make sure you are running on 5500
//I am
// .. it works now
let pyramid;

var start_time;
var g_startTime;
var g_seconds;


g_startTime = performance.now() / 1000;
g_seconds = (performance.now() / 1000) - (g_startTime)


let globalRotateMatrix = new Matrix4(); //You HAVE to declare this variable in the render function or else your rotation will be crazy inconsistent.
let cube_Method;
let leftArm;
let box;
var torso;

let pyr;
var render_list = []; //for animation function //use global lists to manage special animations, time, angle can be function parameters

var canvas;

//var sphere = new Sphere([1, 0, 0, 1], [0, 0])
//console.log(sphere)

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  console.log(canvas)
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  console.log(gl)
  gl.enable(gl.DEPTH_TEST);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}


function connectVariablesToGLSL() {

  
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = 3;
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get model matrix')
  }

  u_globalRotateMatrix = gl.getUniformLocation(gl.program, 'u_globalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get model matrix')
  }
  gl.enable(gl.DEPTH_TEST);

  return;

}

function addActionsforHTMLUI() {
  document.getElementById("rot_camX").value = 0;
  document.getElementById("rot_camX").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansX = this.value;
    }
  })

  document.getElementById("rot_camY").value = 0;
  document.getElementById("rot_camY").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansY = this.value;
    }
  })

  document.getElementById("rot_camZ").value = 0;
  document.getElementById("rot_camZ").addEventListener("mousemove", function (event) {
    if (event.buttons == 1) {
      radiansZ = this.value;
    }
  })


  document.getElementById("yellow_rot").addEventListener("mousemove", function (event) {

    if (event.buttons == 1) {
      yellow_rot = this.value;
      //joints_only = true;
      renderScene()

    }
  }
  )



  document.getElementById("yellow_rot").addEventListener("click", function (event) {
    yellow_rot = this.value;
    renderScene()
  })


  document.getElementById("pink_rot").addEventListener("mousemove", function (event) {

    if (event.buttons == 1) {
      pink_rot = this.value;
      renderScene()

    }
  }
  )


  document.getElementById("pink_rot").addEventListener("click", function (event) {
    pink_rot = this.value;
    renderScene()
  })



  document.getElementById("on").addEventListener("click", function (event) { 
    console.log("True"); 
    animation_on = true;
  })
  document.getElementById("off").addEventListener("click", function (event) { 
    console.log("False")
    animation_on = false;
  })
}

function initAnimal() {
//   cube_Method = new Cube(
//     color = [1.0, 0.0, 0.0, 1.0]
//   );

//   leftArm = new Cube(
//     color = [1.0, 1.0, 0.0, 1.0]
//   );

//   box = new Cube(
//     color = [1.0, 0.0, 1.0, 1.0]
//   );
  leg = new Limb([0,1,0,1])
  leg2 = new Limb([0,1,0,1])
  limb = new Limb([0,1,0,1])
  limb2 = new Limb([0,1,0,1])
  
  // //render limbs
  // //  leg
  // leg.setUpLimb()
  // //  leg2
  // leg2.setUpLimb()
  // //  limb2
  // limb2.setUpLimb()
  // //  limb
  // limb.setUpLimb()
  
  limb.setUpLimb()
  limb.scaleAll(.5, .5, .5)
  limb.shoulder.matrix.translate(1.5, 0, 0)
  limb.arm.matrix.translate(3, 0, 0)
  limb.hand.matrix.translate(2.5, 0, 0)
  limb2.setUpLimb()
  limb2.scaleAll(.5, .5, .5)
  leg.setUpLimb()
  leg.shoulder.matrix.translate(0, -1, 0)
  leg.arm.matrix.translate(0, -1, 0)
  leg.hand.matrix.translate(0, -3.75, 0)
  leg.scaleAll(.5, .5, .5)
  leg.shoulder.matrix.scale(.65, 1, 1)
  leg2.setUpLimb()
  leg2.shoulder.matrix.translate(.75, 0, 0)
  leg2.arm.matrix.translate(1.5, 0, 0)
  leg2.hand.matrix.translate(1.25, 0, 0)

  
  leg2.shoulder.matrix.translate(0, -1, 0)
  leg2.arm.matrix.translate(0, -1, 0)
  leg2.hand.matrix.translate(0, -3.75, 0)
  leg2.scaleAll(.5, .5, .5)
  leg2.shoulder.matrix.scale(.65, 1, 1)
  torso = new Cube([0, 1, 0, 1])
  torso.matrix.translate(.2, .1, 0)
  torso.matrix.scale(.35, .8, .25)
  //limb2.setUpLimb()
  pyr = new Pyramid([1, 0, 0, 1])
  pyr.matrix.translate(0.2, 0.7,0.0)
  pyr.matrix.scale(.5, .5, .5)
  
//yep!
}

function renderScene() {
  //global matrix set up
  //clear canvas  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  globalRotateMatrix.setIdentity();
  globalRotateMatrix.rotate(radiansX, 1, 0, 0);
  globalRotateMatrix.rotate(radiansY, 0, 1, 0);
  globalRotateMatrix.rotate(radiansZ, 0, 0, 1);
  
  gl.uniformMatrix4fv(u_globalRotateMatrix, false, globalRotateMatrix.elements);
  limb2.renderLimb()
  limb.renderLimb()
  limb2.renderLimb()
  leg.renderLimb()
  leg2.renderLimb()
  torso.render()
  pyr.render()
  //limb.scaleAll(3, 3, 3)
  //pyramid
  // var red1 = new Pyramid([0, 1, 0, 1])  
  // red1.matrix.scale(.5, .5, .5)
  // red1.matrix.rotate(90, 1, 0, 0)
  // red1.matrix.translate(0, 3, 0)
  // red1.drawFace()
  // var blue = new Pyramid([0, 1, 0, 1])
  // blue.matrix.rotate(-90, 0, 1, 0)
  // blue.matrix.rotate(-90, 0, 1, 0);   
  // blue.matrix.scale(.5, .5, .5);
  // blue.matrix.rotate(90, 0, 1, 0);  
  // var blue_matrix = new Matrix4(blue.matrix)
  // blue.matrix.rotate(-30, 1, 0, 0);  
  // blue.matrix.translate(0, 3, 0)
  // blue.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var pink = new Pyramid([0, 1, 0, 1])
  // pink.matrix.set(blue_matrix);
  // pink.matrix.rotate(90, 0, 1, 0);
  // var pink_mat = new Matrix4(pink.matrix)
  // pink.matrix.rotate(30, 1, 0, 0)
  // pink.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var yellow = new Pyramid([0, 1, 0, 1])
  // yellow.matrix.set(pink_mat)
  // yellow.matrix.rotate(90, 0, 1, 0)
  // yellow.matrix.translate(3, 0, 1)
  // yellow.matrix.rotate(-30, 1, 0, 0)
  // yellow.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var green = new Pyramid([0, 1, 0, 1])
  // green.matrix.set(pink_mat)
  // green.matrix.translate(0, 0, 1)
  // green.matrix.rotate(-30, 1, 0, 0)
  // green.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  

  updateAnimationAngles(g_seconds, limb2.arm, yellow_rot);

  //limb2.arm.render()

  updateAnimationAngles(g_seconds, limb2.hand, pink_rot);













































  // //pyramid
  // var red1 = new Pyramid([0, 1, 0, 1])  
  // red1.matrix.scale(.5, .5, .5)
  // red1.matrix.rotate(90, 1, 0, 0)
  // red1.drawFace()
  // var blue = new Pyramid([0, 1, 0, 1])
  // blue.matrix.rotate(-90, 0, 1, 0)
  // blue.matrix.rotate(-90, 0, 1, 0);   
  // blue.matrix.scale(.5, .5, .5);
  // blue.matrix.rotate(90, 0, 1, 0);  
  // var blue_matrix = new Matrix4(blue.matrix)
  // blue.matrix.rotate(-30, 1, 0, 0);  
  // blue.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var pink = new Pyramid([0, 1, 0, 1])
  // pink.matrix.set(blue_matrix);
  // pink.matrix.rotate(90, 0, 1, 0);
  // var pink_mat = new Matrix4(pink.matrix)
  // pink.matrix.rotate(30, 1, 0, 0)
  // pink.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var yellow = new Pyramid([0, 1, 0, 1])
  // yellow.matrix.set(pink_mat)
  // yellow.matrix.rotate(90, 0, 1, 0)
  // yellow.matrix.translate(-1, 0, 1)
  // yellow.matrix.rotate(-30, 1, 0, 0)
  // yellow.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  // var green = new Pyramid([0, 1, 0, 1])
  // green.matrix.set(pink_mat)
  // green.matrix.translate(0, 0, 1)
  // green.matrix.rotate(-30, 1, 0, 0)
  // green.drawTriangleIn3D([
  //   0.0, 0.0, 0.0, 
  //   .5, 1.0, 0.0,
  //   1.0, 0.0, 0.0]);
  

  // green = new Pyramid([1, 0, 0, 1])
  // pyr.matrix.scale(.5, .5, .5)
  // pyr.render()
  //limb2.hand.render()
  //sphere.render()
  //arm
  // Remember, the matrix of each part of a limb is dependent on the part before it
//there I've already made an improvement :) // yea!

// you should have a funciton like updateAnimationAngles in your limb class
// you should also keep the matrices of the joints in there
// as well as the angles
// that way, you can easily modify them in the main file
//I am already doing that :(
// are you sure? here lemme give you a template of what i mean


  // a hand's matrix depends on the 
  //fo re arm, the fore arm depends on the upper arm, and the upper arm depends on the shoulder
  // it is fine to allocate memory here (you might just need to, either that or you create your arm matrices
  // as members of the class)

  // so don't set identity... wait but you need to know what matrices they are all dependent on
  // limb2.arm.matrix.setIdentity();  //i think this one is fine... cuz im not sure what the matrices should start out with. 
  //they are set up in a separate function so I think setting the identity was a mistake  // but every time render scene is called, they need to be reset...a
  //oh
  //
  // refer to the video tutorial, or back track if you need to

    //sdnepe
  //my current problem is that my joint rotator isn't doing it right
  //my current problem is that my joint rotator isn't doing it right
  //my current problem is that my joint rotator isn't doing it right
  //my current problem is that my joint rotator isn't doing it right
  //my current problem is that my joint rotator isn't doing it right
  //var arm_mat = new Matrix4(limb2.arm.matrix);
  //arrian my arm isn't rendering
  
  
  
  //ARM1

  // leftArm.matrix.setIdentity();
  // leftArm.matrix.translate(0, -.5, 0.0); 
  // leftArm.matrix.rotate(-5, 1, 0, 0);
  
  //  limb2
  //limb2.renderLimb()
  //updateAnimationAngles(g_seconds, limb2.arm, yellow_rot)
  // updateAnimationAngles(g_seconds, leftArm, yellow_rot);
  // var arm_mat = new Matrix4(leftArm.matrix);
  // leftArm.matrix.scale(0.25, .7, .5);
  // leftArm.matrix.translate(0.0, 0.25, 0);
  // leftArm.render();
  // //hand
  // box.matrix.set(arm_mat);
  // box.matrix.translate(0, .65, 0); 
  // box.matrix.scale(.3, .3, .3); 
  // box.matrix.translate(0.0, 0, .001);
  // updateAnimationAngles(g_seconds, box, pink_rot);
  // box.render()

  //arm2
  
  //render limbs
  //  leg
  //leg.renderLimb()
  //  leg2
  //leg2.renderLimb()
  //  limb
  //limb.renderLimb()
  
  
}

let frames_rendered = 0;
function tick() {
  g_seconds = (performance.now() / 1000) - (g_startTime)
  renderScene()
  requestAnimationFrame(tick);


  let duration = performance.now() - start_time;
  frames_rendered += 1;
  sendTextToHTML(
                " ms: " + Math.floor(duration) +
                " fps: " + Math.floor(1000* frames_rendered/duration), "perf");
}

function updateAnimationAngles(secs, cube_obj, angle) {   
  if (animation_on) {
    cube_obj.matrix.rotate(45*Math.sin(secs), 0, 0, 1);
  } else {    
    cube_obj.matrix.rotate(angle, 0, 0, 1);
  }
}



function main() {
  start_time = performance.now();
  // var performance;
  setupWebGL();
  // Initialize shaders
  connectVariablesToGLSL();
  addActionsforHTMLUI();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  initAnimal();
  renderScene();
  requestAnimationFrame(tick);  
  
 if (canvas.ev == 1) {
    var preserveDrawingBuffer = true
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
    click()
  }
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons==1) {click(ev)}}
}


function sendTextToHTML(text, htmlID){
  var htmllm = document.getElementById(htmlID);
  if (!htmllm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmllm.innerHTML = text;
}
function click(ev) {
  //console.log(canvas.width);
  //console.log(width);
  var width = 400
  var height = 400
  var rect = ev.target.getBoundingClientRect();  
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  // //var z = ev.clientZ; // z coord?
  x = ((x - rect.left) - width / 2)/(width / 2);
  y = (height / 2 - (y - rect.top))/(height / 2);
  radiansX =  y * 360;
  radiansY =  x * 360;
  //console.log("Radians X:", radiansX, "\nRadians Y: ", radiansY);
  
  //console.log("x:", x, "\ny: ", y);
  //renderScene()
  // if (choose_shape == 1) {
  //   tri_type = document.getElementById("tri_type").value
  //   console.log("Tri_type outside", tri_type)
  //   point = new Triangle(color=color_storage.slice(),size=selected_Size,position=[x, y],vertices=[],tri_type)
  // } else if (choose_shape == 0){
  //   point = new Point(color_storage.slice(), selected_Size, [x, y])
  // } else {
  //   point = new Circle(color=color_storage.slice(), size=selected_Size, position=[x, y], segments)
  //   // draw Circle
  // }
  //g_shapes_list.push(point)
  //console.log(point)
  renderScene()
  
}