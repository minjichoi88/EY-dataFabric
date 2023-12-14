var data = mapDatajson
console.log('erd data : ', data)
var links = [
      // {"source":  1, "target":  0},
      // {"source":  1, "target":  2}
    ];


var w = 500,
    h = 500;
var svg = d3.select("#spyDiv").append("svg").attr("width",w).attr("height",h);

var link = svg.selectAll(".link").data(links).enter().append("line").attr("class", "link");

var force = d3.layout.force().nodes(data).links(links).size([w, h]).charge(-50).gravity(0.005).linkDistance(200).start();

// force.on("tick", function(e) {
//   var k = 6 * e.alpha;
//   data.forEach(function(o, i) {
//     o.y += i & 1 ? k : -k;
//     o.x += i & 2 ? k : -k;
//   });
//   tableGroup.attr("x", function(d) { return d.x; })
//             .attr("y", function(d) { return d.y; });
//   tick();
// });

var drag = force.drag().on("dragstart", dragstart);
function dragstart(d) {d3.select(this).classed("fixed", d.fixed = true);}

resize();
d3.select(window).on("resize", resize);

function resize() {
    width = window.innerWidth*0.5, height = window.innerHeight*0.5;
    //width = 900, height = 500;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
  }

var tableGroup = svg.selectAll("svg.tableGroup")
                 .data(data)
                 .enter()
                 .append("svg")
                 .attr("id",function(d,i){return "tableGroup" + i;})
                 .attr("x",0)
                 .attr("y",function(d,i){return (i+1) * 150})
                 .call(force.drag);

var tableContainer = 
    tableGroup.append("rect")
              .attr("x",0)
              .attr("y",0)
              .attr("width",
                    function(d){
                      var maxColName = d.tableColumns.reduce(
                        function (a, b) { 
                          return a.colName.length > b.colName.length ? a : b; 
                        }).colName.length;
                      var maxDataType = d.tableColumns.reduce(
                        function (a,b){
                          return a.dataType.length > b.dataType.length ? a : b;
                        }).dataType.length
                      var width = (maxColName + maxDataType) * 8;
                      console.log(d.tableName + ":" + width);
                      return width;})
              .attr("height",function(d){return d.tableColumns.length * 20 + 20;})
              .attr("class","table");

var dtLine = tableGroup.append("line")
                       .attr("x1",
                             function(d){
                               var maxColName = d.tableColumns.reduce(
                                 function (a, b) { 
                                   return a.colName.length > b.colName.length ? a : b; 
                                 }).colName.length * 7;
                               return maxColName;})
                       .attr("x2",
                             function(d){
                               var maxColName = d.tableColumns.reduce(
                                 function (a, b) { 
                                   return a.colName.length > b.colName.length ? a : b; 
                                 }).colName.length * 7;
                               return maxColName;})
                       .attr("y1",20)
                       .attr("y2",function(d){return d.tableColumns.length * 20 + 20;})

var tableHeader = tableGroup.append("g")
                            .attr("id",function(d,i){return "t" + i + "Header";});
tableHeader.append("rect")
           .attr("class","tableHeader")
           .attr("width",function(d){return getTableWidth(d);})
           .attr("height",20)
           .attr("x",0)
           .attr("y",0);

tableHeader.append("text")
           .attr("class","tableHeader")
           .attr("width",function(d){return getTableWidth(d);})
           .attr("height",20)
           .attr("x",5)
           .attr("y",15)
           .text(function(d){return d.tableName;});

var tableColumns = tableGroup.selectAll("g.tableColumn")
                             .data(function(d){return d.tableColumns;})
                             .enter()
                             .append("g")
                             .attr("class","tableColumn");
tableColumns.append("text")
            .text(function(d){return d.colName;})
            .attr("x",5)
            .attr("y",function(d,i){return 35 + (i*20);})
            .attr("class",function(d){
              return d.nullable == 0 ? "nonNullable" : "nullable"
            });
tableColumns.append("text")
            .text(function(d){return d.dataType;})
            .attr("x",120)
            .attr("y",function(d,i){return 35 + (i*20);})
            .attr("class",function(d){
              return d.nullable == 0 ? "nonNullable" : "nullable"
            });
tableColumns.append("line")
            .attr("x1",0)
            .attr("x2",function(d){return getTableWidth(d);})
            .attr("y1",function(d,i){return 40 + (i*20);})
            .attr("y2",function(d,i){return 40 + (i*20);});

function tick() {
  link.attr("x1", function(d) { return d.source.x + 100; })
      .attr("y1", function(d) { return d.source.y + ((d.source.tableColumns.length * 20 + 20) / 2); })
      .attr("x2", function(d) { return d.target.x + 100; })
      .attr("y2", function(d) { return d.target.y + ((d.target.tableColumns.length * 20 + 20) / 2); });
}

function getTableWidth(table){
  return 250;
}

// function getData(mapDatajson){
//   return mapData;
// }