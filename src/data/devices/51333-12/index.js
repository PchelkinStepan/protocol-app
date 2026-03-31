import wrc from './wrc/wrc.json';
import wrh from './wrh/wrh.json';
import drci from './drci/drci.json';
import drhi from './drhi/drhi.json';
import drc from './drc/drc.json';
import drh from './drh/drh.json';
import dual from './dual/dual.json';
import wtc from './wtc/wtc.json';
import wth from './wth/wth.json';

const device = {
  id: "51333-12",
  name: "Счетчики холодной и горячей воды тахометрические GROEN серии DUAL, WR, DR, WT.",
  hasModels: true,
  hasComposition: false,
  models: {
    wrc,
    wrh,
    drci,
    drhi,
    drc,
    drh,
    dual,
    wtc,
    wth,
  }
};

export default device;