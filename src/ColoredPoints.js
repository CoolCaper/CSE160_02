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



var start_time;
var g_startTime;
var g_seconds;


g_startTime = performance.now() / 1000;
g_seconds = (performance.now() / 1000) - (g_startTime)

var render_list = []; //for animation function //use global lists to manage special animations, time, angle can be function parameters

function setupWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
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


let globalRotateMatrix = new Matrix4(); //You HAVE to declare this variable in the render function or else your rotation will be crazy inconsistent.
let cube_Method;
let leftArm;
let box;

function initAnimal(){
  cube_Method = new Cube(
    color = [1.0, 0.0, 0.0, 1.0]
  );

  leftArm = new Cube(
    color = [1.0, 1.0, 0.0, 1.0]
  );

  box = new Cube(
    color = [1.0, 0.0, 1.0, 1.0]
  );
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
  //FIRST CUBE


  cube_Method.matrix.setIdentity();
  cube_Method.matrix.translate(0.0, -.75, 0.0); 
  cube_Method.matrix.rotate(-5, 1, 0, 0)
  cube_Method.matrix.scale(.5, .3, .5);
  
  cube_Method.render();
  
  //ARM1

  leftArm.matrix.setIdentity();
  leftArm.matrix.translate(0, -.5, 0.0); 
  leftArm.matrix.rotate(-5, 1, 0, 0);

  updateAnimationAngles(g_seconds, leftArm, yellow_rot);
  var arm_mat = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, .7, .5);
  leftArm.matrix.translate(0.0, 0.25, 0);
  leftArm.render();
  //hand
  box.matrix.set(arm_mat);
  box.matrix.translate(0, .65, 0); 
  box.matrix.scale(.3, .3, .3); 
  box.matrix.translate(0.0, 0, .001);
  updateAnimationAngles(g_seconds, box, pink_rot);
  box.render()
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
  var limb = new limb([1, 0, 0, 1])
  renderScene();
  requestAnimationFrame(tick);
}


function sendTextToHTML(text, htmlID){
  var htmllm = document.getElementById(htmlID);
  if (!htmllm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmllm.innerHTML = text;
}