import stvx from './stvx/stvx.json';
import stvy from './stvy/stvy.json';

const device = {
  id: "32540-11",
  name: "Счетчики турбинные холодной и горячей воды СТВХ и СТВУ.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    stvx,
    stvy
  }
};

export default device;