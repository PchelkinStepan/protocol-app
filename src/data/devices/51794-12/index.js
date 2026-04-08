import vsh from './vsh/vsh.json';
import vshd from './vshd/vshd.json';
import vsg from './vsg/vsg.json';
import vsgd from './vsgd/vsgd.json';
import vst from './vst/vst.json';

const device = {
  id: "51794-12",
  name: "Счетчики холодной и горячей воды ВСХ, ВСХд, ВСГ, ВСГд, ВСТ.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    vsh,
    vshd,
    vsg,
    vsgd,
    vst,
  }
};

export default device;