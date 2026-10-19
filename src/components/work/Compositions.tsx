import { img } from '../../content/projects'
import { BrowserDevice } from '../devices/BrowserDevice'
import { FloatingPanel } from '../devices/FloatingPanel'
import { PhoneDevice } from '../devices/PhoneDevice'
import { Scene, Slot } from './Scene'

interface CompositionProps {
  href: string
  hint: string
}

/** BreakFit: an angled smartphone carrying the real app, flanked by two more real screens in depth. */
export function BreakfitComposition({ href, hint }: CompositionProps) {
  return (
    <Scene aspect={1.18} label="BreakFit app screens on three angled smartphones" href={href} hint={hint}>
      <Slot x={4} y={13} w={27} depth={-0.5} pose="translateZ(-110px) rotateY(32deg) rotateZ(-4deg)" z={1}>
        {(v) => <PhoneDevice style={v} image={img('breakfit', 'dish')} alt="BreakFit customise screen with add-ons grid." sizes="(min-width: 900px) 20vw, 40vw" />}
      </Slot>
      <Slot x={69} y={9} w={27} depth={-0.35} pose="translateZ(-90px) rotateY(-24deg) rotateZ(5deg)" z={1}>
        {(v) => <PhoneDevice style={v} image={img('breakfit', 'insights')} alt="BreakFit dietician’s insight screen with nutrition donuts and intake bars." sizes="(min-width: 900px) 20vw, 40vw" />}
      </Slot>
      <Slot x={33} y={2} w={35} depth={0.45} pose="translateZ(60px) rotateY(-18deg) rotateX(6deg) rotateZ(3deg)" z={2}>
        {(v) => <PhoneDevice style={v} image={img('breakfit', 'home')} alt="BreakFit home screen: green header with search, a hero banner, category row and dish grid." sizes="(min-width: 900px) 26vw, 56vw" />}
      </Slot>
    </Scene>
  )
}

/** IoT: a large floating browser frame with layered, real analytics panels lifted off the screen. */
export function IotComposition({ href, hint }: CompositionProps) {
  return (
    <Scene aspect={1.42} label="IoT monitoring dashboard in a browser window with floating analytics panels" href={href} hint={hint}>
      <Slot x={11} y={6} w={80} depth={-0.1} pose="rotateY(-15deg) rotateX(6deg) rotateZ(-1deg)" z={1}>
        {(v) => (
          <BrowserDevice
            style={v}
            image={img('iot', 'dashboard')}
            alt="IoT Observability fleet overview: five KPI tiles, device status distribution, device type mix, SIM-applet operations and security posture."
            label="iot-dashboard-snowy.vercel.app"
            secure
            sizes="(min-width: 900px) 46vw, 92vw"
          />
        )}
      </Slot>
      <Slot x={-2} y={44} w={36} depth={0.55} pose="translateZ(130px) rotateY(-16deg) rotateX(4deg)" z={3}>
        {(v) => <FloatingPanel style={v} image={img('iot', 'panel-status')} tag="Device status" />}
      </Slot>
      <Slot x={66} y={0} w={32} depth={0.7} pose="translateZ(110px) rotateY(-20deg) rotateX(4deg)" z={3}>
        {(v) => <FloatingPanel style={v} image={img('iot', 'panel-posture')} tag="Security posture" />}
      </Slot>
      <Slot x={36} y={66} w={54} depth={0.35} pose="translateZ(150px) rotateY(-12deg) rotateX(4deg)" z={4}>
        {(v) => <FloatingPanel style={v} image={img('iot', 'panel-kpi')} tag="Fleet KPIs" />}
      </Slot>
    </Scene>
  )
}

/** Validate: the presentation board in a desktop frame, with the app screen (extracted from that board) as a phone in front. */
export function ValidateComposition({ href, hint }: CompositionProps) {
  return (
    <Scene aspect={1.3} label="Validate case-study presentation on a desktop window with the app screen on a phone" href={href} hint={hint}>
      <Slot x={1} y={7} w={74} depth={-0.15} pose="rotateY(15deg) rotateX(5deg) rotateZ(1deg)" z={1}>
        {(v) => (
          <BrowserDevice
            style={v}
            image={img('validate', 'cover')}
            alt="Validate UX case-study cover: a hand holding a phone showing the app, the tagline “Verify once, share anywhere”, the title Validate and “Presented by: Akash Ganapathy”."
            label="Validate — UX case study"
            sizes="(min-width: 900px) 40vw, 90vw"
          />
        )}
      </Slot>
      <Slot x={63} y={14} w={29} depth={0.55} pose="translateZ(120px) rotateY(-18deg) rotateX(3deg) rotateZ(3deg)" z={3}>
        {(v) => (
          <PhoneDevice
            style={v}
            image={img('validate', 'phone')}
            alt="Validate app home screen: counters for 12 verified, 3 pending and 2 in-progress credentials, quick actions and recent activity."
            island={false}
            zoom={1.035}
            sizes="(min-width: 900px) 20vw, 40vw"
          />
        )}
      </Slot>
    </Scene>
  )
}
