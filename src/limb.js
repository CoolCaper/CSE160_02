
class limb {
    constructor(color=[1.0,1.0,1.0,1.0]){
      this.color = color;
      this.vertices = this.initVertexArray()
      this.matrix = new Matrix4()
      this.render_list = []
    }
}