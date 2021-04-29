function renderChart(params) {

  // exposed variables
  var attrs = {
    id: 'id' + Math.floor((Math.random() * 1000000)),
    svgWidth: 400,
    svgHeight: 400,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    container: 'body',
    responsive: false,
    minFontSize: 12,
    maxFontSize: 48,
    data: null
  };

  /*############### IF EXISTS OVERWRITE ATTRIBUTES FROM PASSED PARAM  #######  */

  var attrKeys = Object.keys(attrs);
  attrKeys.forEach(function (key) {
    if (params && params[key]) {
      attrs[key] = params[key];
    }
  })

  //innerFunctions which will update visuals
  var updateData;

  //main chart object
  var main = function (selection) {
    selection.each(function scope() {
      //get container
      var container = d3.select(this);

      if (attrs.responsive) {
        setDimensions();
      }
      //calculated properties
      var calc = {}
      calc.chartLeftMargin = attrs.marginLeft;
      calc.chartTopMargin = attrs.marginTop;
      calc.chartWidth = attrs.svgWidth - attrs.marginRight - calc.chartLeftMargin;
      calc.chartHeight = attrs.svgHeight - attrs.marginBottom - calc.chartTopMargin;
      calc.centerX = calc.chartWidth / 2;
      calc.centerY = calc.chartHeight / 2;
      calc.minMax = d3.extent(attrs.data.values, d => d.value);

      //drawing containers


      //#####################   SCALES  ###################
      var scales = {};
      scales.fontSize = d3.scaleSqrt()
        .range([attrs.minFontSize, attrs.maxFontSize])
        .domain(calc.minMax);

      scales.color = d3.scaleOrdinal(d3.schemeCategory20b);


      //######################  LAYOUTS  #################

      var layouts = {};
      layouts.cloud = d3.layout.cloud()
        .timeInterval(Infinity)
        .size([calc.chartWidth, calc.chartHeight])
        .fontSize(function (d) {
          return scales.fontSize(+d.value);
        })
        .text(function (d) {
          return d.key;
        })
        .font('impact')
        // .spiral('archimedean')
        .stop()
        .words(attrs.data.values)
        //TODO: text rotation
        .rotate(0)
        .on("end", function (bounds) {

          var index = bounds ? Math.min(
            calc.chartWidth / Math.abs(bounds[1].x - calc.centerX),
            calc.chartWidth / Math.abs(bounds[0].x - calc.centerX),
            calc.chartHeight / Math.abs(bounds[1].y - calc.centerY),
            calc.chartHeight / Math.abs(bounds[0].y - calc.centerY)) / 2 : 1;

          var texts = patternify({ container: centerPoint, selector: 'texts', elementTag: 'text', data: attrs.data.values })

					var wordColors = d3.scaleLinear().domain([attrs.minFontSize, attrs.maxFontSize]).range(["#4a1486", "#fa9fb5"]);

          texts.attr("text-anchor", "middle")
            .attr("transform", function (d) {
              return "translate(0,0)rotate( 0)";
            })
            .style("font-size", function (d) {
              return 2 + "px";
            })
            .style("opacity", 1e-6)
            .text(function (d) {
              return d.text;
            })
            .style("fill", function (d) {
              return wordColors(d.text.toLowerCase());
              // return scales.color(d.text.toLowerCase());
            })
      			.on("click", function(d) {
              //TODO: this is how you pass an argument to an element on the main html
              // then i can add an event listener for the element to fire a functions
              // when this is called
              //there should be a better way
      				console.log(d.text);
              // d3.select("#topicmapped").text(attrs.data.selectedtopic);
              // $("#topicDropdown").val(attrs.data.selectedtopic);
              // $("#topicDropdown option:contains(" + attrs.data.selectedtopic + ")").attr('selected', 'selected');
      			});

          texts.transition()
            .duration(1000)
            .attr("transform", function (d) {
              return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("font-size", function (d) {
              return d.size + "px";
            })
            .style("opacity", 1)
            .style("font-family", function (d) {
              return d.font;
            });

        });

        //this is from the old script
        // var viz = d3.select(divname).append("svg").attr("width", width_).attr("height", height_);
        // viz.append("g")
        // .attr(
        // 	"transform",
        // 	function(d) {
        // 		//this ratio aligns the word cloud according to the svg container
        // 		//0.5 is the middle
        // 		var ratio = width_ * 0.4;
        // 		return "translate(" + ratio + ","
        // 		+ ratio + ")";
        // 	})
        // 	.selectAll("text").data(words)
        // 	.enter().append("text")
        // 	.style(
        // 		"font-size",
        // 		function(d) {
        // 			return wmaxsize - 2
        // 			* (d.rank - 1)
        // 			+ "px";
        // 		})
        // 		.style("fill",
        // 		function(d, i) {
        // 			//return fill(i);
        // 			return wordColors(d.rank);
        // 		}).style("fill-opacity", 1)
        // 		.attr("text-anchor", "middle")
        // 		.attr(
        // 			"transform",
        // 			function(d) {
        // 				return "translate("
        // 				+ [ d.x, d.y ]
        // 				+ ")rotate("
        // 				+ d.rotate + ")";
        // 			}).text(function(d) {
        // 				return d.text;
        // 			}).on("click", function(d) {
        // 				console.log(d.text);
        // 				selectedtopic = seltopic;
        // 				resetMap();
        // 			}).style("fill-opacity", 1e-6).transition()
        // 			.duration(1000).style("fill-opacity", 1);

      //add svg
      var svg = patternify({ container: container, selector: 'svg-chart-container', elementTag: 'svg' })
      svg.attr('width', attrs.svgWidth)
        .attr('height', attrs.svgHeight)
      // .attr("viewBox", "0 0 " + attrs.svgWidth + " " + attrs.svgHeight)
      // .attr("preserveAspectRatio", "xMidYMid meet")

      //add container g element
      var chart = patternify({ container: svg, selector: 'chart', elementTag: 'g' })
      chart.attr('transform', 'translate(' + (calc.chartLeftMargin) + ',' + calc.chartTopMargin + ')');

      //add center point
      var centerPoint = patternify({ container: chart, selector: 'center-point', elementTag: 'g' })
        .attr('transform', `translate(${calc.centerX},${calc.centerY})`)


      layouts.cloud.start();


      // ##################   EVENT LISTENERS   ################
      d3.select(window).on('resize.' + attrs.id, function () {
        setDimensions();
        redraw();
      })

      // smoothly handle data updating
      updateData = function () {

      }




      //#########################################  UTIL FUNCS ##################################

      //enter exit update pattern principle
      function patternify(params) {
        var container = params.container;
        var selector = params.selector;
        var elementTag = params.elementTag;
        var data = params.data || [selector];
        if (!container) {
          debugger;
        }
        // pattern in action
        var selection = container.selectAll('.' + selector).data(data)
        selection.exit().remove();
        selection = selection.enter().append(elementTag).merge(selection)
        selection.attr('class', selector);
        return selection;
      }

      function setDimensions() {
        var width = container.node().getBoundingClientRect().width;
        main.svgWidth(width);
        // if width is too small, change attrs.fontSize too e.t.c
      }

      function redraw() {
        container.call(main);
      }

      function debug() {
        if (attrs.isDebug) {
          //stringify func
          var stringified = scope + "";

          // parse variable names
          var groupVariables = stringified
            //match var x-xx= {};
            .match(/var\s+([\w])+\s*=\s*{\s*}/gi)
            //match xxx
            .map(d => d.match(/\s+\w*/gi).filter(s => s.trim()))
            //get xxx
            .map(v => v[0].trim())

          //assign local variables to the scope
          groupVariables.forEach(v => {
            main['P_' + v] = eval(v)
          })
        }
      }

      debug();
    });
  };

  //dinamic functions
  Object.keys(attrs).forEach(key => {
    // Attach variables to main function
    return main[key] = function (_) {
      var string = `attrs['${key}'] = _`;
      if (!arguments.length) { return eval(` attrs['${key}'];`); }
      eval(string);
      return main;
    };
  });

  //set attrs as property
  main.attrs = attrs;

  //debugging visuals
  main.debug = function (isDebug) {
    attrs.isDebug = isDebug;
    if (isDebug) {
      if (!window.charts) window.charts = [];
      window.charts.push(main);
    }
    return main;
  }

  //exposed update functions
  main.data = function (value) {
    if (!arguments.length) return attrs.data;
    attrs.data = value;
    if (typeof updateData === 'function') {
      updateData();
    }
    return main;
  }

  // run  visual
  main.run = function () {
    d3.selectAll(attrs.container).call(main);
    return main;
  }

  return main;
}
