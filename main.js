window.onload = function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
    renderer.setSize(window.innerWidth, window.innerHeight);
  
    camera.position.set(10, 10, 10);
    camera.lookAt(0, 0, 0);
  
    const light = new THREE.AmbientLight(0xffffff);
    scene.add(light);
  
    const blockSize = 1;
    const blockTextures = {};
  
    function loadTexture(name) {
      return new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(`assets/${name}.png`)
      });
    }
  
    function createBlock(x, y, z, type) {
      if (!blockTextures[type]) {
        blockTextures[type] = loadTexture(type);
      }
      const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
      const cube = new THREE.Mesh(geometry, blockTextures[type]);
      cube.position.set(x, y, z);
      scene.add(cube);
    }
  
    function loadTemplate(templateName) {
      fetch(`assets/${templateName}.json`)
        .then(res => res.json())
        .then(data => {
          scene.clear();
          scene.add(light); // re-add the light
          data.blocks.forEach(b => {
            createBlock(b.x, b.y, b.z, b.type);
          });
        })
        .catch(err => {
          console.error("Error loading template:", err);
        });
    }
  
    window.loadTemplate = loadTemplate;
  
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  };
  