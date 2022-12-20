import _ from 'lodash';
const nessaceryWordList: string[] = ['이다', '정도'];

export default {
  isNecessaryWord(word: string) {
    const ret = _.some(nessaceryWordList, (w) => w === word);
    // console.error(word, nessaceryWordList, ret);
    return ret;
  }
};
