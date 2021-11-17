import * as THREE from 'three'; //eslint-disable-line 
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as dat from 'dat.gui';

const gui = new dat.GUI();

export default () => {
  // class BasicCharacterController {
  //   constructor() {
  //     this._input = new BasicCharacterControllerInput();
  //     this._stateMachine = new FiniteStateMachine(new BasicCharacterControllerProxy(this));

  //     this._LoadModels();
  //   }

  //   _LoadModels() {
  //     const loader = new FBXLoader();
  //     const path = require('../assets/character_Models/sporty_granny.fbx'); // eslint-disable-line
  //     const animPath = require('../assets/character_Animations/walk.fbx'); // eslint-disable-line
  //     loader.load(path, (fbx) => {
  //       fbx.scale.setScalar(0.35);
  //       fbx.position.set(0, -50, 20); // eslint-disable-line
  //       fbx.traverse((c) => {
  //         c.castShadow = true; // eslint-disable-line
  //       });

  //       const params = {
  //         target: fbx,
  //         camera: this._camera,
  //       };
  //       this._controls = new BasicCharacterControls(params);

  //       const anim = new FBXLoader();
  //       anim.load(animPath, (animation) => {
  //         const m = new THREE.AnimationMixer(fbx);
  //         this._mixers.push(m);
  //         const idle = m.clipAction(animation.animations[0]);
  //         idle.play();
  //       });
  //       this._scene.add(fbx);
  //     });
  //   }
  // };

  // class BasicCharacterControllerInput {
  //   constructor() {

  //   }
  // };

  // class FiniteStateMachine {
  //   constructor() {

  //   }
  // };

  class BasicCharacterControls {
    constructor(params) {
      this._Init(params);
    }

    _Init(params) {
      this._params = params;
      this._move = {
        left: false,
        right: false,
        jump: false,
      };
      this._isJumping = false;
      this._hasReachedApex = false;
      this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
      this._acceleration = new THREE.Vector3(10, 0.25, 50.0);
      this._velocity = new THREE.Vector3(0, 0, 0);

      document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
      document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }

    _onKeyDown(event) {
      switch (event.keyCode) {
        case 65: // a
          this._move.left = true;
          break;
        case 68: // d
          this._move.right = true;
          break;
        case 32: // space
          this._move.jump = true;
          break;
        case 38: // up
        case 37: // left
        case 40: // down
        case 39: // right
          break;
        default:
          return null;
      }
      return null;
    }

    _onKeyUp(event) {
      switch (event.keyCode) {
        case 65: // a
          this._move.left = false;
          break;
        case 68: // d
          this._move.right = false;
          break;
        case 32: // space
          this._move.jump = false;
          break;
        case 38: // up
        case 37: // left
        case 40: // down
        case 39: // right
          break;
        default:
          return null;
      }
      return null;
    }

    Update(timeInSeconds) {
      const velocity = this._velocity;
      const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z,
      );
      frameDecceleration.multiplyScalar(timeInSeconds);
      frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z),
      );

      velocity.add(frameDecceleration);

      const controlObject = this._params.target;
      const _Q = new THREE.Quaternion(); // eslint-disable-line
      const _A = new THREE.Vector3(); // eslint-disable-line
      const _R = controlObject.quaternion.clone();
      const ground = -48;

      if (this._move.left) {
        if (_R._y >= -0.70) {
          _A.set(0, -1, 0);
          _Q.setFromAxisAngle(_A, 15 * timeInSeconds);
          _R.multiply(_Q);
        }
        if (controlObject.position.x >= -200) controlObject.position.x -= 2;
        velocity.x -= this._acceleration.x * timeInSeconds;
      }
      if (this._move.right) {
        if (_R._y <= 0.70) {
          _A.set(0, 1, 0);
          _Q.setFromAxisAngle(_A, 15 * timeInSeconds);
          _R.multiply(_Q);
        }
        if (controlObject.position.x <= 200) controlObject.position.x += 2;
        velocity.x += this._acceleration.x * timeInSeconds;
      }

      if (this._move.jump || this._isJumping) {
        this._isJumping = true;
        if (!this._hasReachedApex) {
          controlObject.position.y += 4;
          this._hasReachedApex = controlObject.position.y >= 2;
        } else if (this._hasReachedApex) {
          controlObject.position.y -= 4;
          this._isJumping = controlObject.position.y >= ground;
        }

        if (!this._isJumping) this._hasReachedApex = false;
      }

      controlObject.quaternion.copy(_R);

      // const oldPosition = new THREE.Vector3();
      // oldPosition.copy(controlObject.position);

      // const forward = new THREE.Vector3(1, 0, 0);
      // forward.applyQuaternion(controlObject.quaternion);
      // forward.normalize();

      // const sideways = new THREE.Vector3(0, 0, 1);
      // sideways.applyQuaternion(controlObject.quaternion);
      // sideways.normalize();

      // sideways.multiplyScalar(velocity.x * timeInSeconds);
      // forward.multiplyScalar(velocity.x * timeInSeconds);

      // controlObject.position.add(forward);
      // controlObject.position.add(sideways);

      // oldPosition.copy(controlObject.position);
    }
  }

  class LoadModelDemo {
    constructor() {
      this._Initialize();
    }

    _Initialize() {
      this._threejs = new THREE.WebGLRenderer({
        canvas: document.querySelector('#scene'),
        antialias: true,
      });
      this._threejs.shadowMap.enabled = true;
      this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
      this._threejs.setPixelRatio(window.devicePixelRatio);
      this._threejs.setSize(window.innerWidth, window.innerHeight);

      // document.body.appendChild(this._threejs.domElement);

      window.addEventListener('resize', () => {
        this._OnWindowResize();
      }, false);

      const fov = 75; // FOV in degrees
      const aspect = window.innerWidth / window.innerHeight; // aspect ratio
      const near = 1.0;
      const far = 1000.0;
      this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      this._camera.position.set(0, 14, 160);
      // this._camera.position.set(75, 20, 0);

      this._scene = new THREE.Scene();

      let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
      light.position.set(20, 100, 10);
      light.target.position.set(0, 0, 0);
      light.castShadow = true;
      light.shadow.bias = -0.001;
      light.shadow.mapSize.width = 2048;
      light.shadow.mapSize.height = 2048;
      light.shadow.camera.near = 0.1;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 500.0;
      light.shadow.camera.left = 100;
      light.shadow.camera.right = -100;
      light.shadow.camera.top = 100;
      light.shadow.camera.bottom = -100;

      light = new THREE.AmbientLight(0xFFFFFF, 1.0);
      this._scene.add(light);

      const controls = new OrbitControls(
        this._camera, this._threejs.domElement,
      );
      controls.target.set(0, 20, 0);
      controls.update();

      const loader = new THREE.TextureLoader();

      const texture = require('../assets/background/office.jpg'); // eslint-disable-line
      const backgroundTexture = loader.load(texture);
      const background = new THREE.Mesh(
        new THREE.PlaneGeometry(700, 400, 100, 64),
        new THREE.MeshStandardMaterial({
          map: backgroundTexture,
        }),
      );
      this._scene.add(background);

      const floorImg = require('../assets/office_tiles.jpg'); // eslint-disable-line
      const floorTexture = loader.load(floorImg);

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(470, 100, 64, 64),
        new THREE.MeshStandardMaterial({
          map: floorTexture,
        }),
      );
      plane.castShadow = false;
      // plane.receiveShadow = true;
      // plane.rotation.x = -Math.PI / 2;
      plane.rotation.x = 74;
      plane.position.z = 40;
      plane.position.y = -50;
      gui.add(plane.rotation, 'x').min(0).max(600);
      this._scene.add(plane);

      this._mixers = [];
      this._previousRAF = null;

      this._LoadAnimatedModel();
      this._RAF();
    }

    _LoadAnimatedModel() {
      const loader = new FBXLoader();
      const path = require('../assets/character_Models/sporty_granny.fbx'); // eslint-disable-line
      const animPath = require('../assets/character_Animations/walk.fbx'); // eslint-disable-line
      loader.load(path, (fbx) => {
        fbx.scale.setScalar(0.35);
        fbx.position.set(0, -50, 20); // eslint-disable-line
        fbx.traverse((c) => {
          c.castShadow = true; // eslint-disable-line
        });

        const params = {
          target: fbx,
          camera: this._camera,
        };
        this._controls = new BasicCharacterControls(params);

        const anim = new FBXLoader();
        anim.load(animPath, (animation) => {
          const m = new THREE.AnimationMixer(fbx);
          this._mixers.push(m);
          const idle = m.clipAction(animation.animations[0]);
          idle.play();
        });
        this._scene.add(fbx);
      });
    }

    _LoadAnimatedModelAndPlay(path, modelFile, animFile, offset) {
      const loader = new FBXLoader();
      loader.setPath(path);
      loader.load(modelFile, (fbx) => {
        fbx.scale.setScalar(0.1);
        fbx.traverse((c) => {
          c.castShadow = true; // eslint-disable-line
        });
        fbx.position.copy(offset);

        const anim = new FBXLoader();
        anim.setPath(path);
        anim.load(animFile, (animation) => {
          const m = new THREE.AnimationMixer(fbx);
          this._mixers.push(m);
          const idle = m.clipAction(animation.animations[0]);
          idle.play();
        });
        this._scene.add(fbx);
      });
    }

    // _LoadModel() {
    //   const loader = new FBXLoader();
    //   loader.load('./resources/thing.glb', (gltf) => {
    //     gltf.scene.traverse((c) => {
    //       c.castShadow = true; // eslint-disable-line
    //     });
    //     this._scene.add(gltf.scene);
    //   });
    // }

    _OnWindowResize() {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
      requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
          this._previousRAF = t;
        }

        this._RAF();

        this._threejs.render(this._scene, this._camera);
        this._Step(t - this._previousRAF);
        this._previousRAF = t;
      });
    }

    _Step(timeElapsed) {
      const timeElapsedS = timeElapsed * 0.001;
      if (this._mixers) {
        this._mixers.map((m) => m.update(timeElapsedS));
      }

      if (this._controls) {
        this._controls.Update(timeElapsedS);
      }
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const _APP = new LoadModelDemo(); // eslint-disable-line
  });
};
