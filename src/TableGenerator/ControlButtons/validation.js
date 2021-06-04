export function validateData(data) {
    let isValid = true;
    data.characteristics.forEach(el => {
        !checkValid(el) && (isValid = false)
    });

    if(!isValid) {
        return false
    }

    data.rules.forEach(el => {
        !checkValid(el) && (isValid = false)
    })

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