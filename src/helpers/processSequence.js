/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import * as R from 'ramda';

const api = new Api();

const validateLength = R.both(
  R.pipe(R.prop('length'), R.gt(R.__, 2)),
  R.pipe(R.prop('length'), R.lt(R.__, 10))
);

const validateFormat = R.test(/^[0-9]+(\.[0-9]+)?$/);

const validatePositive = R.pipe(
  parseFloat,
  R.gt(R.__, 0)
);

const validateInput = R.allPass([validateLength, validateFormat, validatePositive]);
const createTransformers = (writeLog) => {
  const log = R.tap(writeLog);
  const logAndPass = R.pipe(log, R.identity);

  return {
    processNumber: R.pipe(parseFloat, Math.round, logAndPass),
    logResult: log,
    logBinaryLength: R.pipe(R.prop('length'), logAndPass),
    squareAndLog: R.pipe(x => x ** 2, logAndPass),
    mod3AndLog: R.pipe(x => x % 3, logAndPass)
  };
};

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  writeLog(value);

  if (!validateInput(value)) {
    handleError('ValidationError');
    return;
  }

  const {processNumber, logResult, logBinaryLength, squareAndLog, mod3AndLog} = 
    createTransformers(writeLog);

  Promise.resolve(processNumber(value))
    .then(num => api.get('https://api.tech/numbers/base', {
      from: 10,
      to: 2,
      number: num
    }))
    .then(R.prop('result'))
    .then(logResult)
    .then(logBinaryLength)
    .then(squareAndLog)
    .then(mod3AndLog)
    .then(mod => api.get(`https://animals.tech/${mod}`, {}))
    .then(R.prop('result'))
    .then(handleSuccess)
    .catch(handleError);
};

export default processSequence;