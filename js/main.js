$(document).ready(function() {

    // hide loader after 1.1 seconds
    $(".spinner-row").delay(1000).fadeOut();

    // then show div waiting behind it
    $(".dynamic-input").delay(1000).fadeIn();

    // initalize text stat variables
    var lifeCountry, lifePast, lifePresent, lifeFacts = [];

    // toggle for "more info" carrot
    $(".collapse-info-pane-btn").click(function() {
        $(".info-content").toggle();
    });

    // Monitor year field to do stuff
    $("#born").change(function(){
        // Validate year input
        if ($("#born").val()<1950 || $("#born").val()>2011) {
            $(".bad-date").show();
            $(".bad-date").html('<p class="btn-error btn-inverse">Year must be between 1950 and 2011</p>');
        } else {
            $(".bad-date").hide();
        }

        // Trigger chart refresh if there's a country selected
        if ($("#countryMenu1").val().length > 0) {
            //console.log($("#countryMenu1").val().length > 0);
            changeCountry();
        } else {

        }
    });

/*
    $(".selectize-input.items").change(function(){
        if ($(".selectize-input.items.not-full")) {
            alert("Value ain't nothin'");
        };
    });
*/

    // Main d3 functions
    // using d3.js v3.5.17


    // bar chart configuration
    function drawGroupBarChart(data, container, groupby, chartTitle, xaxislabel, yaxislabel) {
        d3.select(container).select("svg").remove(); // d3 standard. start by selecting & clearing new element
        var chart = {}; // empty object

        // spinning up lots of object properties because d3 likes that, I guess
        chart.margin = { // positioning
                top: 24,
                right: 75,
                bottom: 60,
                left: -20
            },
            chart.width = 400 - chart.margin.left - chart.margin.right,
            chart.height = 350 - chart.margin.top - chart.margin.bottom;

        chart.containerName = container; // grab chart name from passed variable
        chart.data = data; // assign values from passed variable

        lifeFacts[0] = data; //saving info to display in text fact area
        $(".bottom-info").show(); // show text facts, now that theres data

        // conditionally hide the text facts when the charts have no data
        // When chart is available, grab year born and format values properly
        if (chartTitle == 'Income Per Person') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.income-holder').hide();
            }
            $('.income-holder').show();
            // formatting currency is annoying.
            $('.income-present').html("$" + parseFloat(lifeFacts[0][0]["Present"]).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
            $('.income-past').html("$" + parseFloat(lifeFacts[0][0][$('#born').val()]).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
        } else if (chartTitle == 'Birth Rate') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.birth-holder').hide();
            }
            $('.birth-holder').show();
            $('.birth-present').html(lifeFacts[0][0]["Present"]);
            $('.birth-past').html(lifeFacts[0][0][$('#born').val()]);
        } else if (chartTitle == 'Infant Mortality') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.infant-holder').hide();
            }
            $('.infant-holder').show();
            $('.infant-present').html(lifeFacts[0][0]["Present"]);
            $('.infant-past').html(lifeFacts[0][0][$('#born').val()]);
        } else if (chartTitle == 'Life Expectancy') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.life-holder').hide();
            }
            $('.life-holder').show();
            $('.life-present').html(lifeFacts[0][0]["Present"]);
            $('.life-past').html(lifeFacts[0][0][$('#born').val()]);
        } else if (chartTitle == 'School Completion') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.completion-holder').hide();
            }
            $('.completion-holder').show();
            $('.completion-present').html(lifeFacts[0][0]["Present"]);
            $('.completion-past').html(lifeFacts[0][0][$('#born').val()]);
        } else if (chartTitle == 'Adult Literacy') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.literacy-holder').hide();
            }
            $('.literacy-holder').show();
            $('.literacy-present').html(parseFloat(lifeFacts[0][0]["Present"]).toFixed(2));
            $('.literacy-past').html(parseFloat(lifeFacts[0][0][$('#born').val()]).toFixed(2));
        }

        chart.group = groupby; // grab group from passed variable. Always group by country

        chart.x0 = d3.scale.ordinal() // ordinal scale because this is a discrete values of strings
            .rangeRoundBands([-5, chart.width], .1); // interval, padding, outer padding http://d3-wiki.readthedocs.io/zh_CN/master/Ordinal-Scales/

        chart.x1 = d3.scale.ordinal();

        chart.y = d3.scale.linear()
            .range([chart.height, 0]);

        chart.color = d3.scale.ordinal()
            .range(['#5b9ec9', '#7eba98', '#2d82af', '#98d277', '#52af43', '#dc9a88']); // chart colors. Only using first two

        chart.xAxis = d3.svg.axis() // Create a new default axis.
            .scale(chart.x0) //use ordinal scale
            .orient("bottom");

        chart.yAxis = d3.svg.axis()
            .scale(chart.y) // use linear scale
            .orient("left")
            .tickFormat(d3.format(".2s")); // show two significant digits

        chart.tip = d3.tip() // initiate tool tips
            .attr('class', 'd3-tip') // apply class for formatting
            .offset([-10, 0]) // position
            .html(function(d) { // Tool tip output and format
                return "Year: " + d.name +
                    "<div>Value: " + Math.round(d.value * 100) / 100 + ' ' + yaxislabel + "</div>";
            });

        // define chart
        chart.svg = d3.select(chart.containerName).append("svg")
            .attr("width", chart.width + chart.margin.left + chart.margin.right)
            .attr("height", chart.height + chart.margin.top + chart.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");

        // attach tool tip
        chart.svg.call(chart.tip);

        // style chart labels
        // note: no longer using this
        chart.svg.append("text")
            .attr("x", (chart.width / 2))
            .attr("y", 2 - (chart.margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-direction", "underline")
            .style("fill", "#5e5e5e")
            .text(chartTitle);

        // I don't really know how or why this works.
        // This logic was copied from other examples
        chart.render = function() {

            // grabs the first entry in data array
            var dataKeys = d3.keys(data[0]).filter(function(key) {
                // returns an array containing all properties except group
                return key != chart.group;
            });

            // create a new key value pair for everything in the filtered results
            data.forEach(function(d) {
                d.ages = dataKeys.map(function(name) {
                    return {
                        name: name,
                        value: +d[name]
                    };
                });
            });

            // Set scale input to group value
            chart.x0.domain(data.map(function(d) {
                return d[chart.group];
            }));

            // Set scale in a fancier way than I understand
            chart.x1.domain(dataKeys).rangeRoundBands([20, chart.x0.rangeBand()]);
            chart.y.domain([0, d3.max(data, function(d) {
                return d3.max(d.ages, function(d) {
                    return d.value;
                });
            })]);

            // apply the magic on x axis
            chart.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(10," + chart.height + ")")
                .call(chart.xAxis)
                .selectAll(".tick text")
                .call(wrap, chart.x0.rangeBand())
                .on("click", function(d) {
                    /*  d3.select("#GroupChart2").select("svg").remove();
                    Call2ndChart(d);*/
                });

            /*Add the text label for the x axis
            chart.svg.append("text")
            .attr("transform", "translate(" + (chart.width / 2) + " ," + (chart.height + chart.margin.bottom) + ")")
            .style("text-anchor", "middle")
            .text(xaxislabel);
            */

            // apply the magic on y axis
            chart.svg.append("g")
                .attr("class", "y axis")
                //.call(chart.yAxis) // No y axis is necessary
                //.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                //.text(yaxislabel);

            var state = chart.svg.selectAll(".state")
                .data(chart.data)
                .enter().append("g")
                .attr("class", "state")
                .attr("transform", function(d) {
                    return "translate(" + (chart.x0(d[chart.group])) + ",0)";
                })
                .on("click", function(d) {
                    //d3.select("#GroupChart2").select("svg").remove();
                    //Call2ndChart(d.Category);
                    //console.log("clicking a bar");
                });

            state.selectAll("rect")
                .data(function(d) {
                    return d.ages;
                })
                .enter().append("rect")
                .attr("width", chart.x1.rangeBand())
                .attr("x", function(d) {
                    return chart.x1(d.name);
                })
                .attr("y", function(d) {
                    return chart.y(d.value);
                })
                .attr("height", function(d) {
                    return chart.height - chart.y(d.value);
                })
                .style("fill", function(d) {
                    return chart.color(d.name);
                })
                .on("mouseover", chart.tip.show) // show tooltip
                .on("mouseout", chart.tip.hide);

                console.log(dataKeys.slice().reverse());

/*          // Legend? I don't need no stinkin' legend
            // Instead I hard coded a single legend in the HTML because it looks cleaner

            var legend = chart.svg.selectAll(".legend")
            //var legend = d3.select("#legend-master")
            //var legend = chart.svg.select("#legend-master")
                //.text("laughing")
                //.data()
                .data(dataKeys.slice().reverse())
                .enter().append("g")
                .attr("class", "legenda")
                .attr("transform", function(d, i) {
                    return "translate(60," + i * 20 + ")";
                })
                console.log(legend,"this is the legend");
                .on("click", function(d) {

                });

            legend.append("rect")
                .attr("x", chart.width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", chart.color);

            legend.append("text")
                .attr("x", chart.width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                    return d;
                });
*/
        };


        // Wrap text, used in appending axis labels
        // More fancy boilerplate content
        function wrap(text, width) {
            text.each(function() {
                var text = d3.select(this),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0,
                    lineHeight = 1.1, //ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em").attr("fill","#176289");
                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });

        }

        return chart;
    }


    // Utility section

    // grab the correct row for the specified country
    function filterData(data, category, value) {
        var filterdata = data.filter(function(row) {
            return row[category] == value;
        });
        return filterdata;
    }

    // show values for relevant years
    function GetData(data, properties) {
        SubCategoryData = [];
        data.forEach(function(d) {
            // don't freak out if there's missing data
            if (d[properties[1]] == undefined){
                d[properties[1]] = "0";
            }
            if (d[properties[2]] == undefined){
                d[properties[2]] = "0";
            }
            var Obj = {};
            Obj["Countries"] = d[properties[0]]; // make array to hold country names
            Obj[properties[1].replace('_', '')] = d[properties[1]]; // cleaning the data. I could no it in FME if necessary
            Obj['Present'] = d[properties[2]]; // hold value for current year
            SubCategoryData.push(Obj);
        });
        return SubCategoryData;
    }

    // pull down the data
    function showCharts(container, apiEndpoint, countryList, title, yearArray, yaxislabel) {
        // set legend to year born field
        $(".legend-block.past .text-label").text($("#born").val());
        $(".legend-holder").show(); // show legend now that the charts are coming

        d3.json(apiEndpoint, function(error, data) {
            if (yearArray.length == 3){
                yearArray.shift(); // if there's a chart name defined, remove it
            }

            yearArray.unshift(container); // add new chart name with passed variable

            var filterdata = filterData(data, container, countryList[0]); // new var to hold json contents and dropdown selection
            if (countryList[1] != undefined && countryList[1] != "") { // if there is data
                filterdata.push(filterData(data, container, countryList[1])[0]); // add to the end of filterdata var
            }
            if (countryList[2] != undefined && countryList[2] != "") {
                filterdata.push(filterData(data, container, countryList[2])[0]);
            }
            if (countryList[3] != undefined && countryList[3] != "") {
                filterdata.push(filterData(data, container, countryList[3])[0]);
            }

            filterdata = GetData(filterdata, yearArray); // [container, '_1984', '_2015']); // fetch data for relevant years
            // console.log("filtered data is  coming...", filterdata);

            // if json contains blank entries in past and present years, don't chart it
            if (filterdata[0]["Present"] > 0 && filterdata[0][$('#born').val()] > 0) {
                console.log("This should be zero...");
                console.log(filterdata[0]["Present"]);
                console.log(filterdata[0][$('#born').val()]);
                var chart = drawGroupBarChart(filterdata, "#" + container, 'Countries', title, "Countries", yaxislabel);
                chart.render();
            }

        });
    };


    // d3 main

    // fill drop down with countries from json endpoint
    function populateMenu(data, dropdownName, keyvalue) {
        //var select = d3.select(dropdownName + " .menu-content ul")
        var select = d3.select(dropdownName)
            //.append("select"); // add new select element to current dropdown menu

        select.append("option") // add new option element inside the menu
            //.attr("class", "option")
            .attr("value", function() {
                return 'Select Country' // value for option
            })
            .text(function() {
                return 'Select Country' // set the text string
            });

        for (var d in data) { // remove global average from country list
            if (data[d] !== 'Global Avg') {
                select.append("option")
                    .attr("value", function() {
                        return data[d][keyvalue];
                    })
                    .text(function() {
                        return data[d][keyvalue];
                    });
            }
        }

        return select;
    }

    // set up menus
    var countryArray = ["Select Country", "Select Country", "Select Country", "Select Country"]; // do I need array values?

    // import country list from life expectancy dataset
    d3.json("https://gregor.demo.socrata.com/resource/7bwx-8zmz.json", function(error, data) {

        // set each menu into a variable and populate it with the country list
        //var select1 = populateDropdown(data, "#countryDD1", "life_expectancy");
        var select1 = populateMenu(data, "#countryMenu1", "life_expectancy");
        var select2 = populateMenu(data, "#countryMenu2", "life_expectancy");
        var select3 = populateMenu(data, "#countryMenu3", "life_expectancy");

        // initiate fancy menu
        $('#countryMenu1').selectize({
            // normal on change event isn't available for divs. This triggers changeCountry function
            onChange: function(r) {
                countryArray[0] = d3.select("#countryMenu1").property("value"); // on menu interaction, set country to selection
                changeCountry();
            }
        });

        $('#countryMenu2').selectize({
            onChange: function(r) {
                countryArray[1] = d3.select("#countryMenu2").property("value"); // on menu interaction, set country to selection
                changeCountry();
            }
        });

        $('#countryMenu3').selectize({
            onChange: function(r) {
                countryArray[2] = d3.select("#countryMenu3").property("value"); // on menu interaction, set country to selection
                changeCountry();
            }
        });
        // set var to later grab row for specified country
        var filterdata = filterData(data, "life_expectancy", "Abkhazia"); // JSON endpoint is setup with this as first entry


    });

    // trigger average when clicked
    $("#global-avg").click(function() {
        changeGlobalAvg();
        //console.log("clicked average");
    });

    // If selected, add global avg as 4th country to array
    function changeGlobalAvg() {
        if ($("#global-avg").prop('checked')) {
            countryArray[3] = "Canada"; // change this to "Global Average" once I build it in FME
            changeCountry(); // normal change country function
        } else {
            // set to default aka skip it
            countryArray[3] = "Select Country";
            changeCountry();
        }
    }

    function changeCountry() {
        //var birthYear = $("#born").text();
        var birthYear = +d3.select("#born").property("value"); // save user input for year born
        if (birthYear < 1950 || birthYear > 2011) { // validate
            $(".error").toggle();
            console.log(birthYear + " is out of range");
        } else {
            yearArray = ["_" + birthYear, "_2011"] // hold formatted birth year plus "current" year into array
            var countries = countryArray.filter(function(d) {
                return d != "Select Country"; // filter all countries except blank values (match array initial state above)
            });

            // Pass filtered countries into each dataset
            showCharts("life_expectancy", "https://gregor.demo.socrata.com/resource/7bwx-8zmz.json", countries, "Life Expectancy", yearArray, "years");
            showCharts("infant_mortality_rate", "https://gregor.demo.socrata.com/resource/mm5u-4tsq.json", countries, "Infant Mortality", yearArray, "deaths<br>(per 1,000 births)");
            showCharts("primary_completion_rate_total_of_relevant_age_group", "https://gregor.demo.socrata.com/resource/nx2u-97up.json", countries, "School Completion", yearArray, "percent");
            showCharts("adult_15_literacy_rate_total", "https://gregor.demo.socrata.com/resource/5dhh-qisz.json", countries, "Adult Literacy", yearArray, "%");
            showCharts("gdp_per_capita_ppp", "https://gregor.demo.socrata.com/resource/uzdz-shpf.json", countries, "Income Per Person", yearArray, "dollars");
            showCharts("birth_rate", "https://gregor.demo.socrata.com/resource/a9a5-mkyv.json", countries, "Birth Rate", yearArray, "births");
        }
    }

    //update text stats
    function textStats(yearArray) {
        d3.json("https://gregor.demo.socrata.com/resource/a9a5-mkyv.json", function(error, data) {
            // grab text stats straight from the endpoint
            // I should probably piggyback from what's already here
        });
    }

    // jquery modal
    // A year ago I would've needed a plug-in for this
    $(".about").click(function(){ // when about button is clicked, open modal file
        $.ajax({
            url: "about.html",
            success: function(result){
                $(".about-content").html(result);
                $(".about-content").addClass("modal-open");
                $(".about-content").fadeIn("fast");
            }});
    });
    $(".about-content").click(function(){ // close if click anywhere
        $(this).fadeOut("fast");
    });


}); // end document.ready
