import osvx from './osvx/osvx.json';
import osvy from './osvy/osvy.json';

const device = {
  id: "32538-11",
  name: "Счетчики крыльчатые одноструйные холодной и горячей воды ОСВХ и ОСВУ.",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    osvx,
    osvy,
  }
};

export default device;