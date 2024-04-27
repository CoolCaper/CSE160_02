
class limb {
    constructor(color=[1.0,1.0,1.0,1.0]){
        this.color = color;
        this.matrix = new Matrix4()
        this.render_list = []

      //INIT LIMB PARTS
      
        this.shoulder = new Cube(
            color = this.color
        );

        this.arm = new Cube(
            color = this.color
        );

        this.hand = new Cube(
            color = this.color
        );
    }

    setUpLimb() {
        //transform matrices
        //arm should be scaled into rectangle bring transformations from main to do there automatically
        //what you
        return true;
    }

    renderLimb() {
        //render
        return true;
    }
}