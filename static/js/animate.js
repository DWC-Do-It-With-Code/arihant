const scene = new THREE.Scene();

// Create a camera  360 - 1024
let ww = window.innerWidth;
let wh = window.innerHeight-90;
document.getElementById('section_1').style.height = wh + 'px';
if(ww<360){
  ww = 360;
}
else if(ww>1024){
  ww = 1024;
}

let cameraWidth = ((ww-360)/(1024-360))*3;
const camera = new THREE.PerspectiveCamera(20-cameraWidth, (window.innerWidth) / wh, 0.01, 1000);

camera.position.z = 8;
camera.position.y = 2;

//Light
const light = new THREE.DirectionalLight(0xffffff, 0.3);
light.position.set(0, 10, 3);
light.shadow.bias = -0.002;

light.castShadow = true;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.bias = -0.001;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 500;
light.shadow.radius = 10
light.shadow.blurSamples = 1

scene.add(light);

const light2 = new THREE.AmbientLight(0xffffff, 0.9);
light2.position.set(8, 20, 10);
scene.add(light2);

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, wh);
renderer.shadowMap.enabled = true;
const sectionHold = document.getElementById("section_1");
document.getElementById('section_1').appendChild(renderer.domElement);
document.getElementById('section_1').style.height = wh+"px";


function actionInit(act) {
  act.setLoop(THREE.LoopOnce); // Make the animation play once
  act.clampWhenFinished = true;
//  act.play()
  act.timeScale = 1;
//  act.paused = true;
}

function getCompletionPercentage(action) {
  // Calculate the percentage of completion
  const timeElapsed = action.time;
  const duration = action._clip.duration; // Get the total duration of the animation
  const percentage = (timeElapsed / duration) * 100;

  // Ensure the percentage is within the range [0, 100]
  return Math.min(100, Math.max(0, percentage));
}


// Create a loader
const loader = new THREE.GLTFLoader();
let bones, bgm, t=0.01;
let mixer, lneed, ltook=false, onbo=0;
let Mixer, LF, FR, RB, BL;
let leftFront, frontRight, rightBack, backLeft, rotation;
let formal, jacket, school, tshirt;
let cube, trig=false, animations, goright=true;

function amupdate(){
    let speed = 0.02;
    LF.update(speed);
    FR.update(speed);
    RB.update(speed);
    BL.update(speed);
}

const explore = new Promise((resolve, reject) => {
//  let time = Math.floor(10000 * Math.random() + 1); //'any random number between 1000-9000?
  setTimeout(() => {
    document.getElementById("loading").style.opacity = 0;
//    document.getElementById("loading").style.display = "none";
    resolve("request successful");

    resolve("request successful");
  }, 11000);
});

function animationOBJ(){
    leftFront = LF.clipAction(animations[0]);
    actionInit(leftFront);

    frontRight = FR.clipAction(animations[3]);
    actionInit(frontRight);

    rightBack = RB.clipAction(animations[2]);
    actionInit(rightBack);

    backLeft = BL.clipAction(animations[1]);
    actionInit(backLeft);
}

function updateOpacity() {
  if (trig) {
    const completionPercentage = getCompletionPercentage(rightBack);
    const targetOpacity = 100 - Math.round(completionPercentage);
    const currentOpacity = RB._root.material.opacity;

    // Gradually update the opacity
    const opacitySpeed = 0.005; // Adjust this value for the desired transition speed
    if (currentOpacity > targetOpacity) {
      RB._root.material.opacity = Math.max(targetOpacity, currentOpacity - opacitySpeed);
    }

    renderer.render(scene, camera);

    // Check if the animation has completed
    if (completionPercentage >= 100) {
      trig = false;
      // Animation has completed; you can perform any post-animation logic here
    }
  }
}


// Load the .glb file
loader.load(
  "/arihant/static/glb/try75.glb",
  function (gltf) {
    // Called when the model is loaded
    const model = gltf.scene;

    gltf.scene.traverse(function (object) { object.frustumCulled = false; });

    animations = gltf.animations;
    console.log(animations);
//    document.getElementById("loading").style.opacity = 0;

    // let skinnedMesh;
    // Find the materials in the model
    model.traverse(function (object) {
      if (object.isSkinnedMesh) {
        skinnedMesh = object;
      }
      if (object.isMesh) {
        object.castShadow = true;
//        object.receiveShadow = true;
        console.log(object.name);
        const uvs = object.geometry.attributes.uv.array;
        for (let i = 0; i < uvs.length; i += 2) {
          uvs[i + 1] = 1 - uvs[i + 1]; // Invert the V coordinate
        }
        object.geometry.attributes.uv.needsUpdate = true;

        const texture = new THREE.TextureLoader().load('/arihant/static/glb/texture/' + object.name + ".png");
        let material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 1, side: THREE.DoubleSide});

        if(object.name == "Text"){
            material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            material.transparent = true;
            material.opacity = 0.20;
        }
        else if(object.name == "formalM"){formal = object;}
        else if(object.name == "jacketM"){
            jacket = object;
            jacket.material.opacity = 0;
        }
        else if(object.name == "schoolM"){school = object;}
        else if(object.name == "tshirtM"){tshirt = object;}
        else if(object.name == "bg2"){
            material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 1, side: THREE.DoubleSide,
              emissive: 0xff0000, // Emissive color (red)
              emissiveIntensity: 0.8,});
        }
        material.skinning = true;
        object.material = material;
        onbo++;
      }
    });

    scene.add(model);
  },
  function (xhr) {
    // Called while the model is loading
    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // Called if there's an error loading the model
    console.error('An error occurred loading the model:', error);
  }
);

// Loading second file
loader.load(
    "/arihant/static/glb/try75_2.glb",
    function (gltf){
        const model = gltf.scene;
        gltf.scene.traverse(function (object) { object.frustumCulled = false; });
        model.traverse(function (object) {
          if (object.isSkinnedMesh) {
            skinnedMesh = object;
          }
          if (object.isMesh) {
            object.castShadow = true;
            console.log(object.name);
            const uvs = object.geometry.attributes.uv.array;
            for (let i = 0; i < uvs.length; i += 2) {
              uvs[i + 1] = 1 - uvs[i + 1]; // Invert the V coordinate
            }
            object.geometry.attributes.uv.needsUpdate = true;

            const texture = new THREE.TextureLoader().load('/arihant/static/glb/texture/' + object.name + ".png");
            let material = new THREE.MeshStandardMaterial({ map: texture, transparent: true, opacity: 1, side: THREE.DoubleSide});

            if(object.name == "formal"){
                formal.parent.remove(formal);
                formal = object;}
            else if(object.name == "jacket"){
                jacket.parent.remove(jacket);
                jacket = object;
            }
            else if(object.name == "SchoolDress"){
                school.parent.remove(school);
                school = object;
            }
            else if(object.name == "Tshirt"){
                tshirt.parent.remove(tshirt);
                tshirt = object;
            }
            material.skinning = true;
            object.material = material;
          }
        });

        if (animations && animations.length > 0) {
        // Create an AnimationMixer and add the animations to it
        // mixer = new THREE.AnimationMixer(model);
        jacket.tagLine = "Responsibility";
        LF = new THREE.AnimationMixer(jacket);
        formal.tagLine = "Business";
        FR = new THREE.AnimationMixer(formal);
        school.tagLine = "Discipline";
        RB = new THREE.AnimationMixer(school);
        tshirt.tagLine = "Community";
        BL = new THREE.AnimationMixer(tshirt);
        animationOBJ();

        amupdate();
      }

        moveLeft();
        moveLeft();

        // Render the scene
        function animate() {
         if(leftFront.isRunning()){
            trig = true;
            let op = Math.round(getCompletionPercentage(rightBack));
            RB._root.material.opacity = (100-op)/100;
            BL._root.material.opacity = op/100;
            if(goright){
                ac = (THREE.MathUtils.radToDeg(FR._root.rotation.z)%360);
                need = 360 - Math.round(ac);
                FR._root.rotation.z = THREE.Math.degToRad(ac+(need*(op/100)));
            }
            else{
                ac = (THREE.MathUtils.radToDeg(LF._root.rotation.z)%360);
                need = 360 - Math.round(ac);
                LF._root.rotation.z = THREE.Math.degToRad(ac+(need*((100-op)/100)));
                op = 100-op;
            }
            if(op<50){
                    if(ltook==false){
                        lneed = document.getElementById("ch").innerHTML;
                        ltook = true;
                    }
                    document.getElementById("ch").innerHTML = lneed.slice(0, (1-((Math.round(op/5) * 5)/50))*lneed.length);
                }
            else{
                    ltook = false;
                    target = "";
                    if(goright){target = LF._root.tagLine;}
                    else{target = FR._root.tagLine;}
                    content = "";
                    geto = ((Math.round(op/5) * 5)-50)/50;
                    document.getElementById("ch").innerHTML = target.slice(0, Math.round(geto*target.length))
            }
         }
         else if(goright){FR._root.rotation.z += THREE.Math.degToRad(1);}
         else{LF._root.rotation.z += THREE.Math.degToRad(1);}
         if(trig && leftFront.paused){
            endLF();
            trig = false;
         }
         amupdate();
         requestAnimationFrame(animate);
         renderer.render(scene, camera);
        }
        animate();

        document.getElementById("left").disabled =  false
        document.getElementById("right").disabled =  false

        scene.add(model);
    },
    function (xhr) {
    renderer.render(scene, camera);
    // Called while the model is loading
    // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    // Called if there's an error loading the model
    console.error('An error occurred loading the model:', error);
  }
);

//function explore(){
//    console.log("Boom")
//    document.getElementById("loading").style.display = "none";
//}

function letsee(){
    if(onbo>4){
        console.log(onbo);
        explore.then((data) => {
            document.getElementById("loading").style.display = "none";
//            document.getElementById("loading").style.display = "none";
            console.log("wow"); // "request successful"
          })
        return;
    };
    window.requestAnimationFrame(letsee);
}
letsee();

function start(an, ts = 1){
    if(ts==-1){
        an.setEffectiveTimeScale(-1); // Play in reverse
        an.time = an.getClip().duration; // Start from the last frame

    }
    an.paused = false;
    an.play();
}

function stop(an){
    an.stop();
    an.reset();
}

function moveRight(){
    if(!goright){
        goright = true;
        endLF();
    }
    goright = true;
    start(leftFront);
    start(frontRight);
    start(rightBack);
    start(backLeft);
}

function moveLeft(){
    if(goright){
        goright = false;
        endLF();
    }
    goright = false;
    start(leftFront, -1);
    start(frontRight, -1);
    start(rightBack, -1);
    start(backLeft, -1);
}

function endLF(){
  let temp = FR._root;
  if(goright){
    FR = new THREE.AnimationMixer(LF._root);
    LF = new THREE.AnimationMixer(BL._root);
    BL = new THREE.AnimationMixer(RB._root);
    RB = new THREE.AnimationMixer(temp);
    animationOBJ();
  }
  else{
    FR = new THREE.AnimationMixer(RB._root);
    RB = new THREE.AnimationMixer(BL._root);
    BL = new THREE.AnimationMixer(LF._root);
    LF = new THREE.AnimationMixer(temp);
    animationOBJ();
  }
}