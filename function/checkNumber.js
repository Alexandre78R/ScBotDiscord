function checkNumber (value) {
    
    if (isNaN(value)) {
        return 'Not a Number!';
    } else {
        return "Yes a number!";
    }
}

//Module export
module.exports = checkNumber;