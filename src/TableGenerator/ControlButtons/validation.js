export function validateData(data) {
    let isValid = true;
    data.characteristics.forEach(el => {
        !checkValid(el) && (isValid = false)
    });

    if(!isValid) {
        return false
    }


    const premium = data.rules.filter(el => {
        !checkValid(el) && (isValid = false);
        return el.grade === 'premium'
    });
    const secondary = data.rules.filter(el => {
        !checkValid(el) && (isValid = false);
        return el.grade === 'secondary'
    });
    const reject = data.rules.filter(el => {
        !checkValid(el) && (isValid = false);
        return el.grade === 'reject';
    });

    // isValid = checkValidDifference(premium)
    // isValid && (isValid = checkValidDifference(secondary))
    // isValid && (isValid = checkValidDifference(reject))

    return isValid;

}

function checkValid(el) {


    // (el.min === '' || el.min === 0) && (el.min = null);
    // (el.max === '' || el.max === 0) && (el.max = null);
    // (el.eq === '' || el.eq === 0) && (el.eq = null);
    //
    // if (el.max === null && el.min === null && el.eq === null) {
    //     return false
    // }
    //
    //
    // if (el.eq) {
    //     if (el.min !== null || el.max !== null) {
    //         return false;
    //     }
    // }
    //
    // if (el.min) {
    //     if (el.max && (el.min > el.max)) {
    //         return false;
    //     }
    // }
    //
    // if (el.max) {
    //     if (el.min && (el.min > el.max)) {
    //         return false;
    //     }
    // }

    return true;
}

function checkValidDifference(values) {
    const inner = values.filter(el => el.id === 'inner_diameter')[0];
    const outer = values.filter(el => el.id === 'outer_diameter')[0];
    const innerVal = getValue(inner)
    const outerVal = getValue(outer);

    return +outerVal > +innerVal;
}

function getValue({min, max, eq}) {
    console.log(min, max, eq)
    if(min && min !== "-1") return min;
    if(max && max !== "-1") return max;
    if(eq && max !== "-1") return eq;
}