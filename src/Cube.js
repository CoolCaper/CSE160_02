// Fragment shader program

class Cube {
    constructor(color=[1.0,1.0,1.0,1.0], size=5.0,position=[]){
      this.type = 'cube';
      this.color = color;
      this.size = size;
      this.position = position;
      this.vertices = this.initVertexArray()
      this.matrix = new Matrix4()
      //console.log("Aren't I getting the identity matrix?")
      //console.log(this.matrix.elements)
    }

    initVertexArray(){
        let vertices = [];
        
        

        return vertices;
    }
    identity() { //resets to identity matrix
        this.matrix.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }
  
    drawTriangle(vertices) {
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }
    
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // if (a_Position < 0) {
        //   console.log('Failed to get the storage location of a_Position');
        //   return -1;
        // }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }
    static staticDrawTriangleIn3D(vertices) {
        //console.log("DT")
        var n = 3
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }
        //color
        var rgba = [1.0, 0.0, 0.0, 1.0]; //red
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //console.log("Get elements")
        var matrix = new Matrix4() //no cube object initiated here
        gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);
        // Pass the size of a point to u_Size variable
        gl.uniform1f(u_Size, 10.0);
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        // var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        // if (a_Position < 0) {
        //   console.log('Failed to get the storage location of a_Position');
        //   return -1;
        // }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);    
    }
    
    drawTriangleIn3D(vertices) {
        var n = 3
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }
        var rgba = this.color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //console.log("Get elements")
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // Pass the size of a point to u_Size variable
        //gl.uniform1f(u_Size, 5.0);
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
           console.log('Failed to get the storage location of a_Position');
           return -1;
         }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }
    
  
  
    render() {
        //console.log("Rendering...")
        // Pass the position of a point to a_Position variable
        // gl.disableVertexAttribArray(a_Position);
        // var Xy = this.position;
        // var size = this.size;
        var rgba = this.color;
    
        // Pass the position of a point to a_Position variable
        // gl.vertexAttrib3f(a_Position, Xy[0], Xy[1], 0.0);
    
    
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //this.drawTriangle(this.vertices);
        this.drawFace(); //red
        //this.color = [1, 0, 1, 1] 
        this.matrix.rotate(90, 1, 0, 0)
        this.drawFace(); //pink
        //this.color = [1, 1, 1, 1]
        this.matrix.rotate(90, 0, 1, 0)
        this.drawFace(); //white
        //this.color = [0, 1, 0, 1] //green
        this.matrix.rotate(270, 1, 0, 0)
        this.matrix.rotate(90, 0, 1, 0)
        this.matrix.translate(-1, -1, 1)
       // this.matrix.rotate(90, 0, 0, 1)
       // this.matrix.rotate(90, 0, 1, 0)
       //red is y
        this.drawFace();
        //this.color = [1, 1, 0, 1] //yellow
        this.matrix.rotate(90, 0, 1, 0)
        this.drawFace();
        this.matrix.translate(0, -1, 0)
        this.matrix.rotate(90, 1, 0, 0)        
        this.matrix.translate(0, 1, -1)
        this.matrix.rotate(90, 1, 0, 0)
        this.matrix.rotate(90, 1, 0, 0)
        //this.color = [0, 1, 1, 1] //sea green
        this.drawFace();
        
        //this.color = [1, 1, 1, 1] change color slightly so different people can see differently
    }

    drawFace() {        
    this.drawTriangleIn3D([
        0.0, 0.0, 0.0, 
        1.0, 1.0, 0.0,
        1.0, 0.0, 0.0])
    this.drawTriangleIn3D([
        0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 
        1.0, 1.0, 0.0])        

    }
}
  