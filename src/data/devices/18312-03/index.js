import vmx from './vmx/vmx.json';
import vmg from './vmg/vmg.json';

const device = {
  id: "18312-03",
  name: "Счетчики холодной и горячей воды ВМХ и ВМГ.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    vmx,
    vmg
  }
};

export default device;