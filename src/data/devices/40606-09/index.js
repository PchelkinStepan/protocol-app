import vshn from './vshn/vshn.json';
import vshnd from './vshnd/vshnd.json';
import vsgn from './vsgn/vsgn.json'
import vstn from './vstn/vstn.json'

const device = {
  id: "40606-09",
  name: "Счетчики холодной и горячей воды ВСХН, ВСХНд, ВСГН, ВСТН.",
  hasModels: true,
  hasComposition: false,
  models: {
    vshn,
    vshnd,
    vsgn,
    vstn
  }
};

export default device;