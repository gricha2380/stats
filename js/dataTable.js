$(document).ready(function() {

    /*
    $('.data-table').DataTable({
    	    ajax: 'https://gregor.demo.socrata.com/resource/68np-55g5.json'
    });
    */
    //generateColumns();
    $('.data-table').DataTable();
    //generateColumns();

    // look to selection menu and determine which table should be rendered
    var metricType = $("#metric").val();
    var colTitle = "life_expectancy";
    console.log("this is metric Type",metricType);

    fillTable();

    // prepare data endpoint
    //var url = 'https://gregor.demo.socrata.com/resource/68np-55g5.json'; //?$limit=10


    //generate data table columns
    function generateColumns() {
        var table = $(".data-table thead tr");
        for (var i = 1950; i < 2012; i++) {
            $(table).append("<th>_" + i + "</th>");
            // console.log("I'm adding a header");
        };
    }


    // look for menu selection change. Trigger table function
    $("#metric").on("change", function() {
        metricType = $("#metric").val();
        console.log("Metric type is",metricType);
        fillTable(metricType);
    });


    // table function
    function fillTable(metrictype) {
        // select generic table by class. change id of the table to match drop down, then populate table with ajax
/*
        if (metricType == 'https://gregor.demo.socrata.com/resource/68np-55g5.json') {
            colTitle = "life_expectancy";
            //$(".data-table").attr("id", "tableTwo");
            console.log("some ajax call goes here for metric Two");
        } else if (metricType == 'https://gregor.demo.socrata.com/resource/26t6-aicm.json') {
        	colTitle = "infant_mortality_rate";
            //$(".data-table").attr("id", "tableThree");
            console.log("some ajax call goes here for metric Three");
        } else {
            console.log("I don't know what you just set that to");
        }
*/

    $.getJSON(metricType, function(data, textstatus) {
        // console.log(data);

// I'M SORRY THIS IS SO STUPID.
// I WANT TO DYNAMICALLY CHANGE "column.life_expectancy" INTO THE NAME OF THE PROPER TABLE,
// BUT I DUN KNO HAOW.

if (metricType == 'https://gregor.demo.socrata.com/resource/68np-55g5.json') {

        // Loop over result set
        $.each(data, function(i, column) {
            //console.log(data[i]);
            for (var x = 1950; x <= 2012; x++) {

                // if current year is blank, set the text to "-"
                if (data[i]["_" + x] == undefined) {
                    data[i]["_" + x] = '-';
                    //console.log(data[i]["_" + x]);
                };
            }; // end for x

            // for each json record, add a row to the HTML table
            // why does this need one more than the html table?
            $('.data-table').dataTable().fnAddData([
                column.life_expectancy,
                column._1950,
                column._1951,
                column._1952,
                column._1953,
                column._1954,
                column._1955,
                column._1956,
                column._1957,
                column._1958,
                column._1959,
                column._1960,
                column._1961,
                column._1962,
                column._1963,
                column._1964,
                column._1965,
                column._1966,
                column._1967,
                column._1968,
                column._1969,
                column._1970,
                column._1971,
                column._1972,
                column._1973,
                column._1974,
                column._1975,
                column._1976,
                column._1977,
                column._1978,
                column._1979,
                column._1980,
                column._1981,
                column._1982,
                column._1983,
                column._1984,
                column._1985,
                column._1986,
                column._1987,
                column._1988,
                column._1989,
                column._1990,
                column._1991,
                column._1992,
                column._1993,
                column._1994,
                column._1995,
                column._1996,
                column._1997,
                column._1998,
                column._1999,
                column._2000,
                column._2001,
                column._2002,
                column._2003,
                column._2004,
                column._2005,
                column._2006,
                column._2007,
                column._2008,
                column._2009,
                column._2010,
                column._2011,
                column._2012
            ]);
        }); // end $.each loop
} // end stupid metricType loop
else if (metricType == 'https://gregor.demo.socrata.com/resource/26t6-aicm.json') {

        // Loop over result set
        $.each(data, function(i, column) {
            //console.log(data[i]);
            for (var x = 1950; x <= 2012; x++) {

                // if current year is blank, set the text to "-"
                if (data[i]["_" + x] == undefined) {
                    data[i]["_" + x] = '-';
                    //console.log(data[i]["_" + x]);
                };
            }; // end for x

            // for each json record, add a row to the HTML table
            // why does this need one more than the html table?
            $('.data-table').dataTable().fnClearTable();
            $('.data-table').dataTable().fnAddData([
                column.infant_mortality_rate,
                column._1950,
                column._1951,
                column._1952,
                column._1953,
                column._1954,
                column._1955,
                column._1956,
                column._1957,
                column._1958,
                column._1959,
                column._1960,
                column._1961,
                column._1962,
                column._1963,
                column._1964,
                column._1965,
                column._1966,
                column._1967,
                column._1968,
                column._1969,
                column._1970,
                column._1971,
                column._1972,
                column._1973,
                column._1974,
                column._1975,
                column._1976,
                column._1977,
                column._1978,
                column._1979,
                column._1980,
                column._1981,
                column._1982,
                column._1983,
                column._1984,
                column._1985,
                column._1986,
                column._1987,
                column._1988,
                column._1989,
                column._1990,
                column._1991,
                column._1992,
                column._1993,
                column._1994,
                column._1995,
                column._1996,
                column._1997,
                column._1998,
                column._1999,
                column._2000,
                column._2001,
                column._2002,
                column._2003,
                column._2004,
                column._2005,
                column._2006,
                column._2007,
                column._2008,
                column._2009,
                column._2010,
                column._2011,
                column._2012
            ]);
        }); // end $.each loop
} // end stupid metricType loop



    }); // end $.getJSON
    }



}); // end document ready
