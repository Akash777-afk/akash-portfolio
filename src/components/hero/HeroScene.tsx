import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { sceneStore, smoother } from '../../lib/sceneStore'
import { readToken } from '../../lib/tokens'

/**
 * The hero's one WebGL scene: three real devices — BreakFit and Validate on phones, the IoT dashboard in a browser
 * window — floating in a dark void. The screens are the project's actual screenshots (unlit, so colour and text stay true);
 * bodies are lit metal with a locally generated environment map (no HDR download).
 *
 * Scroll (via GSAP, through sceneStore.heroT) tilts the group back and sinks it as the hero leaves; the pointer adds a
 * few degrees of parallax on mouse devices only.
 */

export interface HeroTextureUrls {
  phoneA: string
  phoneAspectA: number
  browser: string
  browserAspect: number
  phoneB: string
  phoneAspectB: number
}

interface Props {
  textures: HeroTextureUrls
  paused: boolean
  lite: boolean
  compact: boolean
  onReady: () => void
  onLost: () => void
}

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x + w, y + h - r)
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  s.lineTo(x + r, y + h)
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(x, y + r)
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

/** Flat rounded plane with 0–1 UVs (ShapeGeometry's default UVs are in world units). */
function roundedPlane(w: number, h: number, r: number): THREE.ShapeGeometry {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, r), 10)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h)
  uv.needsUpdate = true
  return g
}

function slab(w: number, h: number, r: number, depth: number): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), { depth, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 3, curveSegments: 10 })
  g.center()
  return g
}

function useScreenTexture(url: string) {
  const tex = useLoader(THREE.TextureLoader, url)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
    tex.needsUpdate = true
  }, [tex, gl])
  return tex
}

function Phone({ url, aspect }: { url: string; aspect: number }) {
  const tex = useScreenTexture(url)
  const screenW = 1.46
  const screenH = screenW / aspect
  const body = useMemo(() => slab(screenW + 0.17, screenH + 0.17, 0.27, 0.12), [screenH])
  const screen = useMemo(() => roundedPlane(screenW, screenH, 0.2), [screenH])
  const front = 0.12 / 2 + 0.025 + 0.002
  return (
    <group>
      <mesh geometry={body}>
        <meshStandardMaterial color="#1b2027" metalness={0.92} roughness={0.3} envMapIntensity={1.2} />
      </mesh>
      <mesh geometry={screen} position={[0, 0, front]}>
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Browser({ url, aspect }: { url: string; aspect: number }) {
  const tex = useScreenTexture(url)
  const sw = 5.1 // wide screenshot (≈2.3:1): a wider window keeps its panels legible next to the tall phones
  const sh = sw / aspect
  const bar = 0.3
  const body = useMemo(() => slab(sw + 0.17, sh + bar + 0.17, 0.16, 0.12), [sh])
  const screen = useMemo(() => roundedPlane(sw, sh, 0.06), [sh])
  const pill = useMemo(() => roundedPlane(1.7, 0.14, 0.07), [])
  const front = 0.12 / 2 + 0.025 + 0.002
  return (
    <group>
      <mesh geometry={body}>
        <meshStandardMaterial color="#1b2027" metalness={0.92} roughness={0.3} envMapIntensity={1.2} />
      </mesh>
      <mesh position={[0, sh / 2 + 0.005, front]}>
        <planeGeometry args={[sw, bar]} />
        <meshBasicMaterial color="#1c2027" toneMapped={false} />
      </mesh>
      {[-1, 0, 1].map((i) => (
        <mesh key={i} position={[-sw / 2 + 0.2 + i * 0.16 + 0.16, sh / 2 + 0.005, front + 0.001]}>
          <circleGeometry args={[0.045, 16]} />
          <meshBasicMaterial color={['#ff6b6b', '#ffcb4d', '#5be7a0'][i + 1]} toneMapped={false} />
        </mesh>
      ))}
      <mesh geometry={pill} position={[0.25, sh / 2 + 0.005, front + 0.001]}>
        <meshBasicMaterial color="#0b0d11" toneMapped={false} />
      </mesh>
      <mesh geometry={screen} position={[0, -bar / 2, front]}>
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Devices({ t, compact }: { t: HeroTextureUrls; compact: boolean }) {
  const root = useRef<THREE.Group>(null)
  const a = useRef<THREE.Group>(null)
  const b = useRef<THREE.Group>(null)
  const c = useRef<THREE.Group>(null)
  const smooth = useRef({ hero: 0, px: 0, py: 0 })

  useFrame((state, delta) => {
    const k = 1 - Math.exp(-delta * 4.5)
    const s = smooth.current
    s.hero += (sceneStore.heroT - s.hero) * k
    s.px += (sceneStore.pointerX - s.px) * k
    s.py += (sceneStore.pointerY - s.py) * k
    const time = state.clock.elapsedTime
    const leave = smoother(s.hero)

    if (root.current) {
      root.current.rotation.y = s.px * 0.1 + leave * 0.55
      root.current.rotation.x = -s.py * 0.05 - leave * 0.45
      root.current.position.y = -leave * 2.4
      root.current.position.z = -leave * 3
    }
    const float = (g: THREE.Group | null, seed: number, base: number, amp: number) => {
      if (!g) return
      g.position.y = base + Math.sin(time * 0.6 + seed) * amp
      g.rotation.z += (Math.sin(time * 0.4 + seed) * 0.012 - g.rotation.z) * 0.05
    }
    float(a.current, 0.4, compact ? -0.45 : -0.55, 0.07)
    float(b.current, 1.7, compact ? 0.2 : 0.3, 0.05)
    float(c.current, 3.1, compact ? -0.8 : -0.9, 0.08)
  })

  const sc = compact ? 0.78 : 1
  return (
    <group ref={root} scale={sc}>
      <group ref={b} position={[0.55, 0.3, -1.4]} rotation={[0.05, -0.36, 0]}>
        <Browser url={t.browser} aspect={t.browserAspect} />
      </group>
      <group ref={a} position={[-2.7, -0.55, 0.5]} rotation={[0.04, 0.4, 0.05]}>
        <Phone url={t.phoneA} aspect={t.phoneAspectA} />
      </group>
      {!compact && (
        <group ref={c} position={[3.55, -0.9, 0.7]} rotation={[0.03, -0.46, -0.04]} scale={0.92}>
          <Phone url={t.phoneB} aspect={t.phoneAspectB} />
        </group>
      )}
    </group>
  )
}

function glowTexture(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(200,255,46,0.5)')
  g.addColorStop(1, 'rgba(200,255,46,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

function Floor({ lime }: { lime: string }) {
  const glow = useMemo(() => glowTexture(), [])
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(60, 40, lime, lime)
    const m = g.material as THREE.LineBasicMaterial
    m.transparent = true
    m.opacity = 0.1
    m.depthWrite = false
    return g
  }, [lime])
  return (
    <group position={[0, -2.5, -2]}>
      <primitive object={grid} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.4, 0.02, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshBasicMaterial map={glow} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
    </group>
  )
}

function Dust({ lime }: { lime: string }) {
  const geometry = useMemo(() => {
    const count = 140
    const positions = new Float32Array(count * 3)
    let seed = 11
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 18
      positions[i * 3 + 1] = (rand() - 0.5) * 9
      positions[i * 3 + 2] = 4 - rand() * 14
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])
  return (
    <points geometry={geometry}>
      <pointsMaterial color={lime} size={0.04} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  )
}

function Rig({ onReady, compact }: { onReady: () => void; compact: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const setDpr = useThree((s) => s.setDpr)
  const viewport = useThree((s) => s.viewport)
  const frames = useRef(0)
  const avg = useRef(1 / 60)
  const slow = useRef(0)
  const dpr = useRef(viewport.dpr)

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])

  // Fit the composition to the canvas at any aspect ratio: by width first, and by height when the canvas is wide and short.
  useEffect(() => {
    camera.fov = 30
    const aspect = size.width / Math.max(1, size.height)
    const halfWidth = compact ? 2.75 : 4.85
    const halfHeight = compact ? 2.1 : 2.7
    const tan = Math.tan(THREE.MathUtils.degToRad(15))
    const distance = Math.max(halfWidth / (tan * aspect), halfHeight / tan)
    const cx = compact ? 0.15 : 0.38
    camera.position.set(cx, compact ? 0.5 : 0.7, Math.max(9, distance))
    camera.lookAt(cx, compact ? 0.1 : 0.15, 0)
    camera.updateProjectionMatrix()
  }, [camera, size, compact])

  useFrame((_, delta) => {
    avg.current = avg.current * 0.95 + Math.min(delta, 0.2) * 0.05
    if (avg.current > 0.034) slow.current += delta
    else slow.current = Math.max(0, slow.current - delta)
    if (slow.current > 2 && dpr.current > 0.8) {
      dpr.current = Math.max(0.75, dpr.current * 0.8)
      setDpr(dpr.current)
      slow.current = 0
    }
    if (frames.current < 3) {
      frames.current += 1
      if (frames.current === 3) onReady()
    }
  })
  return null
}

export default function HeroScene({ textures, paused, lite, compact, onReady, onLost }: Props) {
  const lime = useMemo(() => readToken('--lime-500', '#c8ff2e'), [])
  return (
    <Canvas
      dpr={[1, lite ? 1.25 : 1.75]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: 30, near: 0.1, far: 80, position: [0, 0.9, 16] }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (event) => {
          event.preventDefault()
          onLost()
        })
      }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[-4, 5, 6]} intensity={1.1} />
      <directionalLight position={[5, 2, -4]} intensity={2.2} color={lime} />
      <Floor lime={lime} />
      <Dust lime={lime} />
      <Rig onReady={onReady} compact={compact} />
      <Devices t={textures} compact={compact} />
    </Canvas>
  )
}
