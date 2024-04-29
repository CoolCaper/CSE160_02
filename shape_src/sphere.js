//draw cube class

class Sphere {
    constructor(color=[1.0,1.0,1.0,1.0],position=[]){
      this.type = 'cube';
      this.color = color;
      this.position = position;
      //this.vertices = this.initVertexArray()
      this.matrix = new Matrix4()
      this.drawMatrix = new Matrix4()
      this.vertices = this.sphereVerts()
      this.inds_raw = this.sphereInds()
      this.inds = new Uint8Array(this.inds)
      this.matrix = new Matrix4()
    }


    identity() { //resets to identity matrix
        this.matrix.elements = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }

    drawTriangleIn3D(vertices) {
        var n = this.vertices.length;
        var N = this.inds_raw.length;
        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
        }

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
           console.log('Failed to get the storage location of a_Position');
           return -1;
         }
        
        var rgba = this.color
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Pass the size of a point to u_Size variable

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        
        gl.drawArrays(gl.TRIANGLES, 0, N);
    
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    }

    render() {
        this.drawTriangleIn3D(this.verts);
    }

    sphereVerts() {
        var verts = [];
        var v1, v2, v3;
        var y1, y2, y3;
        for (var x = 0; x <= 12; x++) {
            v1 = x * Math.PI / 12;
            v2 = Math.sin(v1); 
            v3 = Math.cos(v1);
                for (var y = 0; y <= 12; y++) {
                    y1 = y * 2 * Math.PI / 12;
                    y2 = Math.cos(y1); 
                    y3 = Math.sin(y1);
                }                
            verts.push(y2 * v2); 
            verts.push(v3); 
            verts.push(y3 * v2);
        }
        return verts;
    }

    sphereInds() {
        var inds = [];
        var w1, w2;
        var z1, z2;
        z1 = 0;
        w1 = 0;
        w2 = 0;
        z2 = 0;
        for (var w = 0; w <= 12; w++) {
            for (var z = 0; z <= 12; z++) {
                w1 = (w * 13) + z; 
                w2 = w2 + 13;
                inds.push(w1); 
                inds.push(w2); 
                inds.push(w1 + 1)

                
                inds.push(z1 + 1); 
                inds.push(z2);
                inds.push(z2 + 1);
            }                
        }
        return inds;
    }

}
  