import vsh from './vsh/vsh.json';
import vshd from './vshd/vshd.json';

const device = {
  id: "40607-09",
  name: "Счетчики холодной и горячей воды ВСХ, ВСХд, ВСГ, ВСГд, ВСТ.",
  hasModels: true,
  hasComposition: false,
  models: {
    vsh,
    vshd
  }
};

export default device;