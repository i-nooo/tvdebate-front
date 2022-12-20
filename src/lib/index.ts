import nlp, { Nlp } from './nlp';
import samsung, { Samsung } from './samsung';
import Util from './util';

export interface API {
  nlp: Nlp;
  samsung: Samsung;
}

const api: API = {
  nlp,
  samsung
};

export { Util };

export default api;
