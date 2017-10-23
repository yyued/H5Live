
/**
 * 在区间 [min, max] 上的等概率随机整数
 * @param  {Number} min 最小值
 * @param  {Number} max 最大值
 * @return {Number} value 随机数
 */
let getRandomBetweenInt = function ( min, max ) {
    min = parseInt(min) || 0;
    max = parseInt(max) || 0;
    if (min > max) {
        [min, max] = [max, min];
    }
    let value = min + Math.round(Math.random() * (max + 1 - min));
    return value == max + 1 ? min : value;
};

/**
 * 以 value 为中数上下浮动 percentage 的区间上的等概率随机整数
 * @param  {Number} value 中数
 * @param  {Number} percentage 浮动系数
 * @return {Number} value 随机数
 */
let getRandomByMedian = function ( value, percentage ) {
    value = parseInt(value) || 0;
    if (percentage < 0) {
        percentage = 0;
    }
    if (percentage > 1) {
        percentage = 1;
    }
    return getRandomBetweenInt(value * (1 - percentage), value * (1 + percentage));
};

/**
 * 在区间 [min, max] 上的遵循二项分布的随机整数 其中中数概率最高
 * @param  {Number} min 最小值
 * @param  {Number} max 最大值
 * @return {Number} value 随机数
 */
let getRandomWithBinomial = function ( min, max ) {
    min = parseInt(min) || 0;
    max = parseInt(max) || 0;
    if (min > max) {
        [min, max] = [max, min];
    }
    let median = parseInt((max - min) / 2);
    return min + getRandomBetweenInt(0, median) + getRandomBetweenInt(0, median);
};

export {
    getRandomByMedian,
    getRandomBetweenInt,
    getRandomWithBinomial,
};
