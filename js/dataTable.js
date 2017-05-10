$(document).ready(function() {

	/*
	$('.data-table').DataTable({
		    ajax: 'https://gregor.demo.socrata.com/resource/68np-55g5.json'
	});
	*/
	//generateColumns();
	$('.data-table').DataTable();
	generateColumns();

// look to selection menu and determine which table should be rendered
var metricType = $("#metric").val();
console.log(metricType);

// prepare data endpoint
var url = 'https://gregor.demo.socrata.com/resource/68np-55g5.json?$limit=10';
//var url = 'http://data.ny.gov/resource/farmersmarkets.json?$limit=30';
$.getJSON(url, function(data, textstatus) {
// console.log(data);
      // Loop over result set
      $.each(data, function(i, column) {
console.log(data[i]);
      //if (data[i]["_2010"] !== undefined && data[i]["_2011"]!== undefined) {
      	if (data[i]["_2010"] == undefined) {
      		data[i]["_2010"] = '-';
      	}
      	if (data[i]["_2011"] == undefined) {
      		data[i]["_2011"] = '-';
      	}

      	 // for each json record, add a row to the HTML table
         $('.data-table').dataTable().fnAddData( [
	       column.life_expectancy,
	       column._2010,
	       column._2011
	       ]);

     // }; //end if



      }); // end $.each
}); // end $.getJSON

/*
var url = 'http://data.ny.gov/resource/farmersmarkets.json?$limit=30';
$.getJSON(url, function(data, textstatus) {
      // Loop over result set
      $.each(data, function(i, column) {
         // for each json record, add a row to the HTML table
         $('.data-table').dataTable().fnAddData( [
	       column.contact ,
	       column.city,
	       column.county ]
         );
      }); // end $.each
}); // end $.getJSON
*/

//generate data table columns
function generateColumns() {
	var table = $(".data-table thead tr");
	for (var i = 1950; i < 2012; i++) {
		$(table).append("<th>_"+i+"</th>");
		// console.log("I'm adding a header");
	};
}


// look for menu selection change. Trigger table function
$("#metric").on("change", function(){
	metricType = $("#metric").val();
	fillTable(metricType);
});


// table function
function fillTable(metrictype) {
	// select generic table by class. change id of the table to match drop down, then populate table with ajax
	if (metrictype == 'Two') {
		$(".data-table").attr("id","tableTwo");
		console.log("some ajax call goes here for metric Two");
	} else if (metrictype == 'Three') {
		$(".data-table").attr("id","tableThree");
		console.log("some ajax call goes here for metric Three");
	} else {
		console.log("I don't know what you just set that to");
	}

}



}); // end document ready