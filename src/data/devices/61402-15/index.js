import vshn from './vshn/vshn.json';
import vshnd from './vshnd/vshnd.json';
import vsgn from './vsgn/vsgn.json';
import vsgnd from './vsgnd/vsgnd.json';
import vstn from './vstn/vstn.json';

const device = {
  id: "61402-15",
  name: "Счетчики воды крыльчатые ВСХН, ВСХНд, ВСГН, ВСГНд, ВСТН.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    vshn,
    vshnd,
    vsgn,
    vsgnd,
    vstn,
  }
};

export default device;