import vskm90 from './vskm90/vskm90.json';
import vskm90x from './vskm90x/vskm90x.json';
import osvx from './osvx/osvx.json';
import osvy from './osvy/osvy.json';
import vkm from './vkm/vkm.json';
import vkmm from './vkmm/vkmm.json';
import stvx from './stvx/stvx.json';
import stvy from './stvy/stvy.json';

const device = {
  id: "77560-20",
  name: "Счетчики холодной и горячей воды Декаст.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    vskm90,
    vskm90x,
    osvx,
    osvy,
    vkm,
    vkmm,
    stvx,
    stvy,
  }
};

export default device;