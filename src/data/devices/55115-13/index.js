import vshn from './vshn/vshn.json';
import vshnd from './vshnd/vshnd.json';
import vsgn from './vsgn/vsgn.json';
import vsgnd from './vsgnd/vsgnd.json';
import vstn from './vstn/vstn.json';

const device = {
  id: "55115-13",
  name: "Счетчики воды крыльчатые ВСХН, ВСХНд, ВСГН, ВСГНд, ВСТН.",
  hasModels: true,
  hasComposition: false,
  models: {
    vshn,
    vshnd,
    vsgn,
    vsgnd,
    vstn
  }
};

export default device;