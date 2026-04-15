import vskm90 from './vskm90/vskm90.json';
import vskm90dg from './vskm90dg/vskm90dg.json';
import osvx from './osvx/osvx.json';
import osvxdg from './osvxdg/osvxdg.json';
import osvy from './osvy/osvy.json';
import osvydg from './osvydg/osvydg.json';

const device = {
  id: "61032-15",
  name: "Счетчики воды крыльчатые универсальные ВСКМ90 'Атлант' и ОСВ 'Нептун'.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    vskm90,
    vskm90dg,
    osvx,
    osvxdg,
    osvy,
    osvydg,

  }
};

export default device;