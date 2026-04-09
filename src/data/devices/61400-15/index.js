import vshnk from './vshnk/vshnk.json';
import vshnkd from './vshnkd/vshnkd.json';

const device = {
  id: "61400-15",
  name: "Счетчики холодной воды комбинированные ВСХНк, ВСХНкд.",
  hasModels: true,
  hasComposition: false,
  models: {
    vshnk,
    vshnkd,
  }
};

export default device;