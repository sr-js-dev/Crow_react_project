export const formatDate = (startdate) => {
    var dd = new Date(startdate).getDate();
    var mm = new Date(startdate).getMonth()+1; 
    var yyyy = new Date(startdate).getFullYear();
    var formatDate = '';
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    formatDate = yyyy+'-'+mm+'-'+dd;
    return formatDate;
};

export const formatMoney = (num) => {
    if(num){
        var value = num.toFixed(2);
        return  "€ " + value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }else{
        return "€ 0.00" 
    }
   
};

export const formatPercent = (num) => {
    if(num){
        var value = num.toFixed(2);
        return  value.toString()+" %";
    }else{
        return "0.00 %" 
    }
   
};