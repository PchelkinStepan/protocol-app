import wphzf from './wphzf/wphzf.json';
import wphnk from './wphnk/wphnk.json';
import wsnk from './wsnk/wsnk.json';
import wi from './wi/wi.json';
import wphnw from './wphnw/wphnw.json';
import wsnw from './wsnw/wsnw.json';
import wphh from './wphh/wphh.json';
import wsh from './wsh/wsh.json';

const device = {
  id: "48422-11",
  name: "Счетчики холодной и горячей воды турбинные W.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    wphzf,
    wphnk,
    wsnk,
    wi,
    wphnw,
    wsnw,
    wphh,
    wsh,
  }
};

export default device;