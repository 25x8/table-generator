export function validateData(data, rowNumber) {

    rowNumber === 0 && (rowNumber = +document.querySelector('tr[row-count]:last-of-type').getAttribute('row-count'));

    removeHighlight();

    let isValid = true;

    data.characteristics.forEach(el => {
        if(!checkValid(el)) {
         isValid = false;
            highlightNotValid(rowNumber, el.id, 'cell')
        }

    });

    if (!isValid) {
        return false
    }

    // const premium = data.rules.filter(el => {
    //     !checkValid(el) && (isValid = false);
    //     return el.grade === 'premium'
    // });
    // const secondary = data.rules.filter(el => {
    //     !checkValid(el) && (isValid = false);
    //     return el.grade === 'secondary'
    // });
    // const reject = data.rules.filter(el => {
    //     !checkValid(el) && (isValid = false);
    //     return el.grade === 'reject';
    // });
    //
    // isValid = checkValidDifference({gradeBetter: premium, gradeWorse: secondary});
    //
    // !isValid && highlightNotValid(rowNumber, 'secondary', 'field')
    //
    // isValid && (isValid = checkValidDifference({gradeBetter: secondary, gradeWorse: reject}));
    //
    // !isValid && highlightNotValid(rowNumber, 'reject', 'field');

    return isValid;
}

function checkValid(el) {


    (el.min === '' || el.min === 0) && (el.min = null);
    (el.max === '' || el.max === 0) && (el.max = null);
    (el.eq === '' || el.eq === 0) && (el.eq = null);

    if (el.max === null && el.min === null && el.eq === null) {
        return false
    }


    if (el.eq) {
        if (el.min !== null || el.max !== null) {
            return false;
        }
    }

    if (el.min) {
        if (el.max && (el.min < el.max)) {
            return false;
        }
    }

    if (el.max) {
        if (el.min && (el.min < el.max)) {
            return false;
        }
    }

    return true;
}

function checkValidDifference({gradeBetter, gradeWorse}) {

    const betterExtr = getMinMax(gradeBetter);
    const worseExtr = getMinMax(gradeWorse);


    return betterExtr.min > worseExtr.max;
}

function getMinMax(values) {
    const inner = values.filter(el => el.id === 'inner_diameter')[0];
    const outer = values.filter(el => el.id === 'outer_diameter')[0];
    const innerVal = +getValue(inner)
    const outerVal = +getValue(outer);

    const min = outerVal < innerVal ? outerVal : innerVal;
    const max = outerVal > innerVal ? outerVal : innerVal;

    return {
        min,
        max
    }
}

function getValue({min, max, eq}) {
    console.log(min, max, eq)
    if (min && min !== "-1") return min;
    if (max && max !== "-1") return max;
    if (eq && max !== "-1") return eq;
}

function removeHighlight() {
    const invalidFields = document.querySelectorAll('.invalid-field');
    invalidFields.forEach((el, index) => {
        el.classList.remove('invalid-field');
        index === 0 && el.classList.remove('invalid-field__first');
        index === invalidFields.length - 1 && el.classList.remove('invalid-field__last');
    })
}

function highlightNotValid(rowNumber, grade, type) {
    const invalidFields = document.querySelectorAll(`[row-count="${rowNumber}"] [${type}-type="${grade}"]`);
    invalidFields.forEach((el, index) => {
        el.classList.add('invalid-field');
        index === 0 && el.classList.add('invalid-field__first');
        index === invalidFields.length - 1 && el.classList.add('invalid-field__last');
    })
}