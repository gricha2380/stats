$(document).ready(function() {
    // text stat vars
    var lifeCountry, lifePast, lifePresent, lifeFacts = [];

    // toggle "more info" button
    $(".collapse-info-pane-btn").click(function() {
        $(".info-content").toggle();
    });

    // fake menu function. I don't understand this.
    // https://tympanus.net/codrops/2012/10/04/custom-drop-down-list-styling/
    // I should rebuild this as a normal function without prototyping
    var menuContent;
    $(".country-menu").click(function() {
        menuContent = new makeDropdown($(this));
        $(this).toggleClass('active');
        return false;
    });

    function makeDropdown(element) {
        this.menuContent = element;
        this.placeholder = this.menuContent.children('span');
        this.options = this.menuContent.find('ul.dropdown > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }
    makeDropdown.prototype = {
        initEvents: function() {
            var obj = this;
            obj.options.on('click', function() {
                var opt = $(this);
                obj.val = opt.text();
                obj.index = opt.index();
                obj.placeholder.text(obj.val);

                //change text stat value
                if (opt.text !== "None") {
                    $(".life-country").text(opt.text());
                };

            });
        },
        getValue: function() {
            return this.val;
        },
        getIndex: function() {
            return this.index;
        }
    }

    // d3 functions
    // d3 v3.5.17


    // I don't know what the fuck is happening in here.

    // bar chart configuration
    function drawGroupBarChart(data, container, groupby, chartTitle, xaxislabel, yaxislabel) {
        d3.select(container).select("svg").remove(); // d3 standard. start by selecting & clearing new element
        var chart = {}; // empty object
        chart.margin = { // positioning
                top: 24,
                right: 75,
                bottom: 60,
                left: -20
            },
            chart.width = 400 - chart.margin.left - chart.margin.right,
            chart.height = 350 - chart.margin.top - chart.margin.bottom;

        chart.containerName = container; // passed variable
        chart.data = data; // passed variable
        //console.log("present coming");
        //console.log(data[0]["Present"]);

        lifeFacts[0] = data; //saving info to display in text fact area
        console.log("here's what life facts show");
        console.log(lifeFacts[0]);
        $(".bottom-info").show();

        if (chartTitle == 'Income per person') {
            if (lifeFacts[0][0]["Present"] <= 0 && lifeFacts[0][0][$('#born').val()] <= 0) {
                $('.income-holder').hide();
            }
            $('.income-holder').show();
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
            $('.literacy-present').html(lifeFacts[0][0]["Present"]);
            $('.literacy-past').html(lifeFacts[0][0][$('#born').val()]);
        }

        chart.group = groupby; // passed variable

        chart.x0 = d3.scale.ordinal() // ordinal scale for discrete values of strings
            .rangeRoundBands([-5, chart.width], .1);

        chart.x1 = d3.scale.ordinal();

        chart.y = d3.scale.linear()
            .range([chart.height, 0]);

        chart.color = d3.scale.ordinal()
            .range(['#5b9ec9', '#7eba98', '#2d82af', '#98d277', '#52af43', '#dc9a88']); // chart colors

        chart.xAxis = d3.svg.axis()
            .scale(chart.x0)
            .orient("bottom");

        chart.yAxis = d3.svg.axis()
            .scale(chart.y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        chart.tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) { // I can clean up this CSS
                return "<strong>Year:</strong> <span  style='color:white; font: 19px;'>" + d.name + "</span></br></br>" +
                    "<strong>Value:</strong> <span style='color:white'>" + d.value + ' ' + yaxislabel + "</span>";
            });

        chart.svg = d3.select(chart.containerName).append("svg")
            .attr("width", chart.width + chart.margin.left + chart.margin.right)
            .attr("height", chart.height + chart.margin.top + chart.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");

        chart.svg.call(chart.tip);

        chart.svg.append("text")
            .attr("x", (chart.width / 2))
            .attr("y", 2 - (chart.margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-direction", "underline")
            .style("fill", "#5e5e5e")
            .text(chartTitle);

        chart.render = function() {
            var dataKeys = d3.keys(data[0]).filter(function(key) {
                return key != chart.group;
            });

            data.forEach(function(d) {
                d.ages = dataKeys.map(function(name) {
                    return {
                        name: name,
                        value: +d[name]
                    };
                });
            });

            chart.x0.domain(data.map(function(d) {
                return d[chart.group];
            }));

            chart.x1.domain(dataKeys).rangeRoundBands([20, chart.x0.rangeBand()]);
            chart.y.domain([0, d3.max(data, function(d) {
                return d3.max(d.ages, function(d) {
                    return d.value;
                });
            })]);

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
                    d3.select("#GroupChart2").select("svg").remove();
                    Call2ndChart(d.Category);
                    console.log("clicking a bar");
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

            var legend = chart.svg.selectAll(".legend")
                .data(dataKeys.slice().reverse())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                    return "translate(60," + i * 20 + ")";
                })
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
        };

        // Wrap text
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


    // Utility
    function filterData(data, category, value) {
        var filterdata = data.filter(function(row) {
            return row[category] == value;
        });
        return filterdata;
    }

    // group the bars
    function GetData(data, properties) {
        SubCategoryData = [];
        data.forEach(function(d) {
            if (d[properties[1]] == undefined){
                d[properties[1]] = "0";
            }
            if (d[properties[2]] == undefined){
                d[properties[2]] = "0";
            }
            var Obj = {};
            Obj["Countries"] = d[properties[0]];
            Obj[properties[1].replace('_', '')] = d[properties[1]];
            Obj['Present'] = d[properties[2]];
            SubCategoryData.push(Obj);
            console.log("This is the content of SubCategoryData",SubCategoryData);
        });
        return SubCategoryData;
    }

    function showCharts(container, apiEndpoint, countryList, title, yearArray, yaxislabel) {
        var avgQueryPast = apiEndpoint + '?$select=avg(' + yearArray[0] + ')';
        var avgQueryPresent = apiEndpoint + '?$select=avg(' + yearArray[1] + ')';
        var avgArray = [];
        var yearPast = yearArray[0];
        var avgResultsPast = '', avgResultsPresent = '';

        // alert(avgQuery);
        d3.json(apiEndpoint, function(error, data) {
            if (yearArray.length == 3)
                yearArray.shift();

            yearArray.unshift(container);

            var filterdata = filterData(data, container, countryList[0]); // new var to hold json contents and dropdown selection
            if (countryList[1] != undefined) { // if 1 dropdown menu is filled
                filterdata.push(filterData(data, container, countryList[1])[0]);
            }
            if (countryList[2] != undefined) { // if 2 dropdown menus are filled
                filterdata.push(filterData(data, container, countryList[2])[0]);
            }
            if (countryList[3] != undefined) { // if 3 dropdown menu are filled
                filterdata.push(filterData(data, container, countryList[3])[0]);
            }

            filterdata = GetData(filterdata, yearArray); // [container, '_1984', '_2015']);
            console.log("filtered data coming");
            console.log(filterdata);

            console.log(avgArray[0]);


            // if json contains blank entries in past and present years, don't chart it
            if (filterdata[0]["Present"] > 0 && filterdata[0][$('#born').val()] > 0) {
                //console.log("This should be zero...");
                //console.log(filterdata[0]["Present"]);
                //console.log(filterdata[0][$('#born').val()]);
                var chart = drawGroupBarChart(filterdata, "#" + container, 'Countries', title, "Countries", yaxislabel);
                chart.render();
            }

            if ($("#global-avg").prop('checke')) {
                //if (document.getElementById('global-avg').checked) {
                countryArray[3] = "Global Average"; // change this to "Global Average" once I build it in FME
                var chart = drawGroupBarChartMini(filterdata, "#" + container, 'Countries', title, "Countries", yaxislabel);
                chart.render();
            }

        });
    };


    // not actually using this
    function showAvg(container, apiEndpoint, countryList, title, yearArray, yaxislabel) {
        var avgQueryPast = apiEndpoint + '?$select=avg(' + yearArray[0] + ')';
        var avgQueryPresent = apiEndpoint + '?$select=avg(' + yearArray[1] + ')';
        var avgArray = [];
        var yearPast = yearArray[0];
        var avgResultsPast = '', avgResultsPresent = '';

        var avgQuery = apiEndpoint+"?select=avg("+yearArray[0]+")"
      // insert: if global avg checkbox turned
            if ($("#global-avg").prop('checked')) {
                d3.json(avgQueryPast, function(error, data) {
                    //console.log(data,"this is avgQueryPast");
                    avgResultsPast = data;
                })

                d3.json(avgQueryPresent, function(error, data) {
                    avgResultsPresent = data;
                })

                avgArray[0] = [{
                    yearPast: avgResultsPast, // this is old year value
                    Countries: "Global Average",
                    Present: avgResultsPresent // this nees to be current
                }];
            };
            console.log(avgArray[0]);
            countryArray[3] = "Global Average"; // change this to "Global Average" once I build it in FME
            var chart = drawGroupBarChart(avgArray[0], "#" + container, 'Countries', title, "Countries", yaxislabel);
            chart.render();
    };


    // d3 main
    function populateDropdown(data, dropdownName, keyvalue) {
        var select = d3.select(dropdownName)
            .append("select"); // add new select element to current dropdown menu

        select.append("option") // add new option element inside the menu
            .attr("value", function() {
                return 'Select Country' // value for option
            })
            .text(function() {
                return 'Select Country' // text string
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
        var select1 = populateDropdown(data, "#countryDD1", "life_expectancy");
        var select2 = populateDropdown(data, "#countryDD2", "life_expectancy");
        var select3 = populateDropdown(data, "#countryDD3", "life_expectancy");

        // set var to later grab row for specified country
        var filterdata = filterData(data, "life_expectancy", "Abkhazia"); // do I need to pass Abk value??

        select1.on("change", function(d) {
            countryArray[0] = d3.select(this).property("value"); // on menu interaction, set country to selection
            changeCountry();
        });
        select2.on("change", function(d) {
            countryArray[1] = d3.select(this).property("value");
            changeCountry();
        });
        select3.on("change", function(d) {
            countryArray[2] = d3.select(this).property("value");
            //console.log(countryArray[2], "value of 3rd menu");
            changeCountry();
        });
    });

    $("#global-avg").click(function() {
        changeGlobalAvg();
        console.log("clicked average");
    });

    function changeGlobalAvg() {
        if ($("#global-avg").prop('checked')) {
            //if (document.getElementById('global-avg').checked) {
            countryArray[3] = "Canada"; // change this to "Global Average" once I build it in FME
            // changeCountry();
            //showAvg();
            var birthYear = +d3.select("#born").property("value");
            yearArray = ["_" + birthYear, "_2011"] // hold formatted birth year plus "current" year into array
            showAvg("life_expectancy", "https://gregor.demo.socrata.com/resource/7bwx-8zmz.json", "Global Avg", "Life Expectancy", yearArray, "years");
            showAvg("infant_mortality_rate", "https://gregor.demo.socrata.com/resource/mm5u-4tsq.json", "Global Avg", "Infant Mortality", yearArray, "infants");
            showAvg("primary_completion_rate_total_of_relevant_age_group", "https://gregor.demo.socrata.com/resource/nx2u-97up.json", "Global Avg", "School Completion", yearArray, "years");
            showAvg("adult_15_literacy_rate_total", "https://gregor.demo.socrata.com/resource/5dhh-qisz.json", "Global Avg", "Adult Literacy", yearArray, "%");
            showAvg("gdp_per_capita_ppp", "https://gregor.demo.socrata.com/resource/uzdz-shpf.json", "Global Avg", "Income per person", yearArray, "dollars");
            showAvg("birth_rate", "https://gregor.demo.socrata.com/resource/a9a5-mkyv.json", "Global Avg", "Birth Rate", yearArray, "births");
            //https://gregor.demo.socrata.com/resource/qpzx-d9up.json?$select=avg(_1984)
        } else {
            // don't think I need this
            countryArray[3] = "Select Country";
            changeCountry();
        }
    }

    function changeCountry() {
        //var birthYear = $("#born").text();
        var birthYear = +d3.select("#born").property("value");
        if (birthYear < 1950 || birthYear > 2015) {
            $(".error").toggle();
            console.log(birthYear + " is out of range");
        } else {
            // where is yearArray declared??
            yearArray = ["_" + birthYear, "_2015"] // hold formatted birth year plus "current" year into array
            var countries = countryArray.filter(function(d) {
                return d != "Select Country"; // filter all countries except blank values (match array initial state above)
            });

            // Pass filtered countries into each dataset
            showCharts("life_expectancy", "https://gregor.demo.socrata.com/resource/7bwx-8zmz.json", countries, "Life Expectancy", yearArray, "years");
            showCharts("infant_mortality_rate", "https://gregor.demo.socrata.com/resource/mm5u-4tsq.json", countries, "Infant Mortality", yearArray, "infants");
            showCharts("primary_completion_rate_total_of_relevant_age_group", "https://gregor.demo.socrata.com/resource/nx2u-97up.json", countries, "School Completion", yearArray, "years");
            showCharts("adult_15_literacy_rate_total", "https://gregor.demo.socrata.com/resource/5dhh-qisz.json", countries, "Adult Literacy", yearArray, "%");
            showCharts("gdp_per_capita_ppp", "https://gregor.demo.socrata.com/resource/uzdz-shpf.json", countries, "Income per person", yearArray, "dollars");
            showCharts("birth_rate", "https://gregor.demo.socrata.com/resource/a9a5-mkyv.json", countries, "Birth Rate", yearArray, "births");
        }
    }

    //update text stats
    function textStats(yearArray) {
        d3.json("https://gregor.demo.socrata.com/resource/a9a5-mkyv.json", function(error, data) {
            console.log(data, "textStats data");
        });
    }
}); // end document.ready
