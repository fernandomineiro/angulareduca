let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = new Date().getFullYear();
let months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
var monthAndYear;

for(var i = 0 ; i<2 ; i++){
    var selectMonth;
    monthAndYear = document.getElementById("monthAndYear"+i);
    if(new Date().getMonth() == 11 && i == 1){
        selectMonth= 0;
        showCalendar(currentMonth, currentYear,i);
    }
    else if(i == 0){
        selectMonth = new Date().getMonth();
        showCalendar(currentMonth, currentYear,i);
    }
    else{
        var date =  new Date().getMonth();
        selectMonth = date+1;
        showCalendar(selectMonth, currentYear,i);
    }

    
    
}






function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

function showCalendar(month, year,index) {
    var compromissos = JSON.parse($("#calendar-body"+index).attr('compromissos'));
    console.log(compromissos);
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let tbl = document.getElementById("calendar-body"+index); // body of the calendar

    // clearing all previous cells
    tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            let cell;
            let cellText;
            let sapn;
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                span = document.createElement("div");
                cellText = document.createTextNode("");
                cell.appendChild(span);
                span.appendChild(cellText);
                cell.style.border = "none";
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                cell = document.createElement("td");
                span = document.createElement("div");
                cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.classList.add("today");
                } // color today's date
                compromissos.forEach(function(value,i){
                    if(value.day == date)
                        cell.classList.add("compromisso");
                });
                cell.appendChild(span);
                span.appendChild(cellText);
                row.appendChild(cell);
                date++;
            }
            
            
            
            


        }

       
       
        tbl.appendChild(row); // appending each row into calendar body.
    }

}