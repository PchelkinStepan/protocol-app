import svm25 from './svm25/svm25.json';
import svm25d from './svm25d/svm25d.json';
import svm32 from './svm32/svm32.json';
import svm32d from './svm32d/svm32d.json';
import svm40 from './svm40/svm40.json';
import svm40d from './svm40d/svm40d.json';
import svm40c from './svm40c/svm40c.json';
import svm40cd from './svm40cd/svm40cd.json';

const device = {
  id: "22484-13",
  name: "Счетчики холодной и горячей воды СВМ (СВМ-25, СВМ-25Д, СВМ-32, СВМ-32Д, СВМ-40, СВМ-40Д, СВМ-40С, СВМ-40СД).",
  hasModels: true,
  hasTypes: false,
  hasClasses: false,
  hasComposition: false,
  models: {
    svm25,
    svm25d,
    svm32,
    svm32d,
    svm40,
    svm40d,
    svm40c,
    svm40cd,
  }
};

export default device;