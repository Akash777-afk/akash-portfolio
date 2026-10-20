import { img } from '../../content/projects'
import { BrowserDevice } from '../devices/BrowserDevice'
import { PhoneDevice } from '../devices/PhoneDevice'
import { Scene, Slot } from '../work/Scene'

/** The hero's CSS-3D version: the same three real devices as the WebGL scene, used when WebGL isn't (or can't be) used. */
export function HeroComposition() {
  return (
    <Scene aspect={1.7} label="BreakFit and Validate on phones and the IoT dashboard in a browser window">
      <Slot x={14} y={9} w={67} depth={-0.2} pose="translateZ(-80px) rotateY(-17deg) rotateX(6deg)" z={1}>
        {(v) => (
          <BrowserDevice style={v} image={img('iot', 'hero')} alt="IoT Observability analytics dashboard: network quality distribution, circle-wise issues, customer impact and the reporting, high-risk and monthly network trends." label="iot-dashboard-snowy.vercel.app" secure sizes="(min-width: 900px) 40vw, 90vw" />
        )}
      </Slot>
      <Slot x={4} y={22} w={21} depth={0.5} pose="translateZ(100px) rotateY(24deg) rotateZ(-3deg)" z={2}>
        {(v) => <PhoneDevice style={v} image={img('breakfit', 'home')} alt="BreakFit home screen." sizes="(min-width: 900px) 18vw, 40vw" />}
      </Slot>
      <Slot x={77} y={30} w={18} depth={0.7} pose="translateZ(130px) rotateY(-24deg) rotateZ(3deg)" z={3}>
        {(v) => <PhoneDevice style={v} image={img('validate', 'phone')} alt="Validate app home screen." island={false} zoom={1.035} sizes="(min-width: 900px) 16vw, 36vw" />}
      </Slot>
    </Scene>
  )
}
