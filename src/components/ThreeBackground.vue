<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const mountRef = ref<HTMLDivElement | null>(null)
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let animationFrameId: number
let scrollY = window.scrollY
let targetScrollY = scrollY

// Three objects
let waveGeo: THREE.PlaneGeometry
let waveMat: THREE.MeshBasicMaterial
let blueprintGroup: THREE.Group
let particles: THREE.Points
let gears: THREE.Group[] = []
let gear1: THREE.Group
let gear2: THREE.Group

const clock = new THREE.Clock()

const createGear = (
  radius: number,
  teeth: number,
  color: number,
  x: number,
  y: number,
  z: number
) => {
  const group = new THREE.Group()
  const bodyGeo = new THREE.CylinderGeometry(radius, radius, 1, 32)
  const bodyMat = new THREE.MeshBasicMaterial({
    color,
    wireframe: true,
    transparent: true,
    opacity: 0.2
  })
  
  const body = new THREE.Mesh(bodyGeo, bodyMat)
  body.rotation.x = Math.PI / 2
  group.add(body)

  const innerGeo = new THREE.CylinderGeometry(
    radius * 0.6,
    radius * 0.6,
    1.2,
    32
  )
  const inner = new THREE.Mesh(innerGeo, bodyMat)
  inner.rotation.x = Math.PI / 2
  group.add(inner)

  const toothGeo = new THREE.BoxGeometry(radius * 0.3, radius * 0.4, 1)
  for (let i = 0; i < teeth; i++) {
    const angle = (i / teeth) * Math.PI * 2
    const tooth = new THREE.Mesh(toothGeo, bodyMat)
    tooth.position.x = Math.cos(angle) * radius
    tooth.position.y = Math.sin(angle) * radius
    tooth.rotation.z = angle
    group.add(tooth)
  }

  group.position.set(x, y, z)
  scene.add(group)
  gears.push(group)
  return group
}

const handleScroll = () => {
  targetScrollY = window.scrollY
}

const handleResize = () => {
  if (!mountRef.value) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const animate = () => {
  const time = clock.getElapsedTime()
  scrollY += (targetScrollY - scrollY) * 0.05

  // Animate Wave
  const posAttribute = waveGeo.attributes.position
  for (let i = 0; i < posAttribute.count; i++) {
    const x = posAttribute.getX(i)
    const y = posAttribute.getY(i)
    const z =
      Math.sin(x * 0.05 + time * 0.5 + scrollY * 0.002) *
      Math.cos(y * 0.05 + time * 0.3) *
      4
    posAttribute.setZ(i, z)
  }
  posAttribute.needsUpdate = true

  // Animate Gears
  if (gear1) gear1.rotation.z = time * 0.05 + scrollY * 0.001
  if (gear2) gear2.rotation.z = -time * 0.03 - scrollY * 0.0008

  // Camera Movement
  camera.position.y = 5 - scrollY * 0.025
  camera.position.x = Math.sin(scrollY * 0.001) * 3

  // Rotate blueprint & particles
  blueprintGroup.rotation.y = scrollY * 0.0005
  particles.rotation.y = time * 0.02

  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!mountRef.value) return

  // 1. Scene Setup
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x050505, 0.015)
  
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.set(0, 5, 30)

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  mountRef.value.appendChild(renderer.domElement)

  // 2. Wave Floor
  waveGeo = new THREE.PlaneGeometry(400, 400, 120, 120)
  waveMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.15
  })
  const waveMesh = new THREE.Mesh(waveGeo, waveMat)
  waveMesh.rotation.x = -Math.PI / 2
  waveMesh.position.y = -10
  scene.add(waveMesh)

  // 3. Gears
  gear1 = createGear(12, 24, 0x3b82f6, -15, 8, -15)
  gear2 = createGear(18, 36, 0x94a3b8, 18, -5, -25)

  // 4. Blueprint Zone
  blueprintGroup = new THREE.Group()
  const gridHelper = new THREE.GridHelper(300, 150, 0x3b82f6, 0x1e3a8a)
  blueprintGroup.add(gridHelper)

  const buildingMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  })
  
  for (let i = 0; i < 40; i++) {
    const height = Math.random() * 30 + 10
    const boxGeo = new THREE.BoxGeometry(
      Math.random() * 15 + 5,
      height,
      Math.random() * 15 + 5
    )
    const box = new THREE.Mesh(boxGeo, buildingMat)
    box.position.set(
      (Math.random() - 0.5) * 200,
      height / 2,
      (Math.random() - 0.5) * 200
    )
    blueprintGroup.add(box)
  }
  blueprintGroup.position.y = -60
  scene.add(blueprintGroup)

  // 5. Particles
  const particlesGeo = new THREE.BufferGeometry()
  const particlesCount = 1500
  const posArray = new Float32Array(particlesCount * 3)
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i * 3] = (Math.random() - 0.5) * 200
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 100 - 20
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 100
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
  const particlesMat = new THREE.PointsMaterial({
    size: 0.1,
    color: 0x3b82f6,
    transparent: true,
    opacity: 0.5
  })
  particles = new THREE.Points(particlesGeo, particlesMat)
  scene.add(particles)

  // Events
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  
  animate()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  cancelAnimationFrame(animationFrameId)
  
  if (renderer) {
    renderer.dispose()
    if (mountRef.value) mountRef.value.removeChild(renderer.domElement)
  }
  if (waveGeo) waveGeo.dispose()
  if (waveMat) waveMat.dispose()
})
</script>

<template>
  <div
    ref="mountRef"
    class="fixed inset-0 z-0 pointer-events-none"
    style="background: #050505"
  />
</template>
