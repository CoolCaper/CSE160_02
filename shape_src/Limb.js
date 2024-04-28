
class Limb {
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
        
        this.shoulder_mat = null;
        this.arm_mat = null;
        this.hand_mat = null;

        //this.setUpLimb()
    }

    setUpLimb() {
        //transform matrices
        //this.arm should be scaled into rectangle bring transformations from main to do there automatically
        //what you
    this.shoulder_mat = new Matrix4() // you'd replace this with this.shoulder_mat.setIdentity() in the render function
    
    this.shoulder.matrix.set(this.shoulder_mat);
    this.shoulder.matrix.translate(0, -.75, 0.0); 
    this.shoulder.matrix.rotate(-5, 1, 0, 0)
    this.shoulder.matrix.scale(.5, .3, .5);
    
    this.shoulder.render();
    this.arm.matrix.setIdentity()
    //this.arm.matrix.set(this.shoulder_mat); 
    this.arm.matrix.translate(0, -.5, 0.0); 
    //this.arm.matrix.rotate(-5, 1, 0, 0);

    this.arm_mat = new Matrix4(this.arm.matrix); // you'd replace this with this.arm_mat.set(this.arm_matrix) in the render function

    this.arm.matrix.set(this.arm_mat)
    this.arm.matrix.scale(0.25, .7, .5);
    this.arm.matrix.translate(0, 0.25, 0);
    //hand

    this.hand_mat = new Matrix4(this.arm_mat) // you'd replace this with this.hand_mat.set(this.arm_mat) in the render function
    this.hand.matrix.set(this.hand_mat);
    this.hand.matrix.translate(0, .65, 0);
    this.hand.matrix.scale(.3, .3, .3); 
    this.hand.matrix.translate(1.0, 0, .001);
    //updateAnimationAngles(g_seconds, hand, pink_rot);
    //this.hand.render()
    this.render_list.push(this.shoulder);
    this.render_list.push(this.arm);
    this.render_list.push(this.hand);
    return true;
    }

    updateJoints(){
        // this function should help with animations... and controlling the joint angles!!!
        // Remember, you still need your sliders to work...
        //thanks Arrian
    }

    renderLimb() {
        //render
        // No need to do this because you already pushed these!
        //yeah TBH I wasn't sure if it was working so I changed it just in case LOL
        // this.hand.render()
        // this.arm.render()
        // this.shoulder.render()

        // you could do what you were doing in renderscene here...
        for (var L = 0; L < this.render_list.length; L++) {
            this.render_list[L].render()
        }
        return true;
    }

    translateAll(x, y, z) {
        this.shoulder.matrix.translate(x, y, z)
        this.arm.matrix.translate(x - 1.4, y, z)
        this.hand.matrix.translate(x - .9, y, z)
        this.renderLimb()

    }
    
    rotateAll(angle, x, y, z) { //x y and z should be one or zero
        this.shoulder.matrix.rotate(angle, x, y, z)
        this.arm.matrix.rotate(angle, x, y, z)
        //this.arm.matrix.set(this.shoulder.matrix)
        this.hand.matrix.rotate(angle, x, y, z)
        this.renderLimb()

    }

    scaleAll(x, y, z) {
        this.shoulder.matrix.scale(x, y, z)
        this.arm.matrix.scale(x, y, z)
        this.hand.matrix.scale(x, y, z)
        this.renderLimb()
    }

    identityAll() {
        this.shoulder.setIdentity()
        this.arm.setIdentity()
    }

}