//Function dateFormat DAY/MONTH/YEAR
function dateFormat (newDate) {
    
    var date = new Date(newDate);
    var newFormatDate = "";

    if(date.getDate() < 10){
        newFormatDate += "0" + date.getDate() + "/"
    }else{
        newFormatDate += date.getDate() + "/"
    }

    if(date.getMonth() <10){
        newFormatDate += "0" + (date.getMonth() + 1) + "/";
    }else{
        newFormatDate += (date.getMonth() + 1) + "/"
    }

    newFormatDate += date.getFullYear();

    return newFormatDate;
}

//Module export
module.exports = dateFormat;