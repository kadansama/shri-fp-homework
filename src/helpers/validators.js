/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { propSatisfies } from "ramda";
import { complement } from "ramda";
import { props, equals, length, filter, propEq, anyPass, allPass} from "ramda";

const getColors = props(['star', 'square', 'triangle', 'circle']);
const isColored = complement(equals('white'));
const calcedColor = (color, figures) => length(filter(equals(color), getColors(figures)));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    propEq('star', 'red'),
    propEq('square', 'green'),
    propEq('triangle', 'white'),
    propEq('circle', 'white')
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (figures) => calcedColor('green', figures) >= 2

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) => equals(calcedColor('red', figures), calcedColor('blue', figures));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    propEq('star', 'red'),
    propEq('square', 'orange'),
    propEq('circle', 'blue')
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
    figures => calcedColor('red', figures) >= 3,
    figures => calcedColor('blue', figures) >= 3,
    figures => calcedColor('orange', figures) >= 3,
    figures => calcedColor('green', figures) >= 3,
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    figures => calcedColor('green', figures) === 2,
    propEq('triangle', 'green'),
    figures => calcedColor('red', figures) === 1,
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => calcedColor('orange', figures) === 4

export const validateFieldN8 = complement(anyPass([propEq('star', 'white'), propEq('star', 'red')]));

// 9. Все фигуры зеленые.
export const validateFieldN9 = (figures) => calcedColor('green', figures) === 4

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    figures => figures.triangle === figures.square,
    propSatisfies(isColored, 'triangle'),
    propSatisfies(isColored, 'square')
])
