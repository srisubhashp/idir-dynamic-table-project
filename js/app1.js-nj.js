/*
List of all Global Variables and use
- domain: holds all the domains retrueved from the GET request. 
- radius: Defines the radius of the circle for nodes.
- types: unused here
- patialGraph: the variable holds the partialgraph that gets sent to the backend with the POST request
- rejectedGraph: the variable holds the rejected graph and gets updated everytime a node or an edge gets deleted. Also gets updated by unselected suggestions
- disconnectedGraph: The variable is true: if the graph is disconnected and false: if the the graph is connected.
- suggestionCounter: 
- suggestionPicked: Suggestion picked is set to true when the user has selected a suggestion from the suggested noodes(grey nodes).
- nextButtonClick: this variable is set to true everytime the user asks for the next set of suggestions by clicking the 'refresh suggestions' button. 
- defaultNodeColor: represents the color of an unselected node. 
- selectedNodeColer: represents the color the node is set to if selected.
- nodeclick: the variable captures a node click. Id set to true if a node is clicked. 
- selectedlinkColo: not implemented
- allowNodeCreation: the variable is set to true in a case when we want to allow node creation. It is set to false if the user clicks a link or a node, or of the shift key is held down
- newNode: The variable is set to true everytime a new variable gets created. 
- value: unused
- drawedge: set to true when the user is allowed to draw an edge. Set to false when the shift key is held down
- min_zoom, max_zoom: used to set limit to the zoom when feature was included. currently unused. 
- suggestions: set to true when suggested nodes(grey nodes) are still being displayed to the user. 
*/
var domain = [], radius = 15;
var types = [];
var partialGraph = [];
var rejectedGraph = [];
var linkTypes = [];
var returnObject = [];
var allReturnObject = [];
var disconnectedGraph = false;
var noOfSuggestions = 3;
var suggestionCounter = 0;
var noOfSuggestionsPicked = 0;
var suggestionsFinalized = false;
var suggestionPicked = false;
var nextButtonClick = false;
var subSuggestionsInProgressFlag = false;
var defaultNodeColor = "white", selectedNodeColor = "#FFCC99", nodeclick = false, selectedlinkColor = "red", allowNodeCreation = true, newNode = false, newEdge = false;
// set up SVG for D3
// var defaultNodeColor = "#FF8000", selectedNodeColor = "#FFCC99", nodeclick = false, selectedlinkColor = "red", allowNodeCreation = true, newNode = false, newEdge = false;
// var types = ["Select name","type1", "type2", "type3", "type4", "type5", "type6", "type7"];
// var domain = ["Select Name", "Domain1", "Domain2", "domain3", "Domain4", "Domain5", "Domain6"];
// var linkTypes = ["Select name", "name1", "name2", "name3", "name4", "name5",  "name6" , "name7"];
var value = [], selected_edge=null;
// var width  = jQuery("#app-body").width(),
//     height = jQuery("#app-body").height(),
var width  = jQuery("#app-body").width(),
    height = 600,
    colors = d3.scale.category10();
var drawEdge = false;
var min_zoom = 0.1;
var max_zoom = 7;
var zoom = d3.behavior.zoom().scaleExtent([min_zoom,max_zoom]);
var suggestions = false;
var entities = ["Select entity", "entity1", "entity2", "entity3", "entity4", "entity5", "entity6"];
var greyLinkSelectedFlag = 0;
var greyLinkSelected = null;
var greyLinkSuggestionsPicked = 0;
var SugPickdPerGreyLinkCount = 0;
var greyLinkPickdPerSubSuggestion = 0;
var linkSuggestionsFinalized = false;
var greyLinkDetails = [];
var exampleReverseRoleFlag = false;
var exampleLinkGraphId;
var exampleSource;
var exampleTarget;
var exampleLinkId;
var exampleLinkValue;
var response = []; // Example Query Response
var checkMove_x = 0;
var checkMove_y = 0;
var hideDragLineFlag = false;
jQuery("#lower-div-2").height(temp-296);
var addEdgeButtonEdgeAdded = false;


//This function adds the animation to the active help.
jQuery('#active-help').each(function() {
    jQuery(this).children().each(function(i) {
        jQuery(this).delay((i++) * 2000).animate({left:0, opacity:1});
    });
});

//Set the height of the svg graph.
// jQuery("#app-body").attr("height",(screen.height*.6));
jQuery("#svg-div").attr("height", "400");

jQuery(document).ready(function(){
  jQuery("#selectDiv").hide();
  //Initial GET request to get all Domain suggestions.
  getRequest("http://" + urlFull + "/viiq_app/greeting", domain);
  // Initial GET request to get all Entity suggestions.
  getAllEntities(entities);
  getAllTypes(types);

});

/*
Function for the 'x' button of the options pane. It deletes the node or the edge, if the 'x' is clicked instead of the 'save' button. 
*/
jQuery("#x-button").click(function(){
  if (selected_node) {
    nodes.splice(nodes.indexOf(selected_node), 1);
    jQuery("#show-instructions").attr("disabled", false);
    var graphDisconnect = checkConnected(nodes, links);
    if (graphDisconnect == true){
        jQuery("#button-g").hide();
    }else{
        jQuery("#button-g").show();
    }
  }else if (selected_link) {
    selected_link.source = selected_link.target;
    selected_link = null;
    allowNodeDrag = true;
    translateAllowed = true;
    drawEdge = false;
    allowNodeCreation = false;
  };
  checkKeywordStatus();

  restart();
});




jQuery("#Add-Edge-button").click(function(){
    if (addEdgeButtonEdgeAdded == false){
        addEdgeButtonEdgeAdded = true;
        var newNode = {id: ++lastNodeId, name: exampleTarget.name, flag : 2, greyflag: 1,  nodeID: exampleTarget.nodeID};
	var link = {source: exampleSource, target: newNode, value: exampleLinkValue, id: ++lastEdgeID, flag: 2 , linkID:exampleLinkId, linkNum: 1};
        nodes.push(newNode);
	links.push(link);
        var newNode = {id: ++lastNodeId, name: exampleSource.name, flag : 2, greyflag: 1,  nodeID: exampleSource.nodeID};
	var link = {source: newNode, target: exampleTarget, value: exampleLinkValue, id: ++lastEdgeID, flag: 2 , linkID:exampleLinkId, linkNum: 1};
        nodes.push(newNode);
	links.push(link);
        suggestions = true;
	suggestionPicked = false;
	restart();
    }
});



jQuery("#Reverse-button").click(function(){
     var tempObject;
     var tempSource;
     var tempExampleSource;
     var tempExampleObject;
     tempObject =  response[0].objectType;
     tempSource = response[0].sourceType;
     response[0].objectType = tempObject;
     response[0].sourceType = tempSource;
     for (var k = 0; k < response[0].examples.length; k++){
         tempExampleSource = response[0].examples[k].split(',')[0];
         tempExampleObject = response[0].examples[k].split(',')[1];
         response[0].examples[k] = tempExampleObject +','+tempExampleSource;
     }   
     animatedExamples();
     var linkNum = 1;
     for (var i = 0; i < links.length; i++){
         if (links[i].source.id == exampleTarget.id && links[i].target.id == exampleSource.id && links[i].source != links[i].target){
             if (linkNum > links[i].linkNum){}
	     else if (linkNum == links[i].linkNum){
	         linkNum++;}
	     else{
	         linkNum = links[i].linkNum++; 
             }					
         }      
     }
     for(var i = 0; i < links.length; i++){
         if (links[i].source === exampleSource && links[i].target === exampleTarget && links[i].linkID == exampleLinkId){
              var tempTarget = exampleTarget;
              var tempSource = exampleSource;
              links[i].source = tempTarget;
              links[i].target = tempSource;
	      exampleTarget = tempSource;
              exampleSource = tempTarget;
	      links[i].linkNum = linkNum;
         }
         
     }
     restart();
});





/*
THe method gets invoked whenever the 'Help' button is clicked on the suggestions pane. 
It displays suggestions based on the context. 
*/
jQuery("#show-instructions").click(function(){
  if (newNode && newEdge==false) {
    nodeNameText(selected_node, 1);  
  }else if(newNode==false && newEdge==false){
    nodeNameText(selected_node, 2);  
  }else{
    nodeNameText(selected_node, 3);
  }
  
});

//Adds the svg to the graph.
var svg = d3.select('#svg-div')
  .append('svg')
  .attr('width', jQuery('#svg-div').width())
  .attr('height', "800")
  .attr('id','queryConstructSVG');
  // .call(zoom);

//Sets the x location of the 'refresh suggestions' button.
var x = jQuery('#svg-div').width()-225;

//Creates the 'refresh suggestions' button.
var buttonG = svg.append('g')
                  .attr("transform", "translate("+x+",0)")
                  // .attr("x", 1000)
                  // .attr("y", 17)
                  .attr("width", 250)
                  .attr("height", 60)
                  // .attr('fill', "blue")
                  .attr("id", "button-g")
                  .on('mouseover', function(){
                     this.style.cursor='pointer';
                     nextButtonClick = true;
                  })
                  .on('mouseout', function(){
                    nextButtonClick = false;
                  })

                  buttonG.on("click", function(){
                    nextButtonClick = true;
                    console.log("g clicked");
                  });
                  // .on('click', function(){
                  //   nextButtonClick = true;
                  //   removeTempNodes();
                  //   nextButtonClick = false;
                  //   AddSuggestions();
                  // });

var buttonRect = buttonG.append("rect")
                    .attr("rx", 6)
                    .attr("ry", 6)
                    .attr("x", 25)
                    .attr("y", 10)
                    .attr("width", 200)
                    .attr("height", 38)
                    .attr('fill', "#428bca")
                    .on('click', function(){
                      nextButtonClick = true;
                    });

var refresh = buttonG.append('text')
                 .text('Refresh Suggestions').attr("y", 35).attr("x",31)
                  .attr("font-family", "sans-serif")
                  .attr("font-size", "20px")
                  .attr("fill", "white")
                  .on('click', function(){
                    nextButtonClick = true;
                  });

jQuery("#button-g").hide();

var g = svg.append('svg:g').attr('id','queryConstructG');
var nodes = [],
  lastNodeId = 2,
  links = [],
  lastEdgeID=2;
for (var i = 0; i < links.length; i++) {
    value[i] = links[i].value;
  };
var currentEdges = links.length;
// init D3 force layout
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(200)
    .charge(-1000)
    .on('tick', tick);

var justDragged=false;
//Setting up drag behavior on nodes. Calls respective functions on dragstart, drag and dragend.
var drag = d3.behavior.drag()
    .on("dragstart", dragstart)
    .on("drag", dragmove)
    .on("dragend", dragend);

var defs = g.append("svg:defs").selectAll("marker");
defs.attr("id", "defs-marker");

// line displayed when dragging new nodes
var drag_line = g.append('svg:path')
  .attr('class', 'link dragline hidden')
 // .attr('d', 'M0,0L0,0');
  .attr('d', 'M0,-5L10,0L0,5');

// handles to link and node element groups
var path = g.append('svg:g').attr("id","pathG").selectAll('path'),
    circle = g.append('svg:g').attr('id','circleG').selectAll('g');

var linkText = g.append('svg:g').attr('id',"linktextg")
                .selectAll('g.linkLabelHolder');


// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null, allowNodeDrag = true, link_click=false;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}
var translateAllowed = true;
// update force layout (called automatically each iteration)
function tick() {
  var width = jQuery("#queryConstructSVG").width();
  var height = jQuery("#queryConstructSVG").height();
  circle.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
       .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        //dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        dist = 300/d.linkNum;
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = 30,
        targetPadding = 30,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    //return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
      return 'M' + d.source.x + ',' + d.source.y + 'A' + dist + ',' + dist + ' 0 0,1 ' + d.target.x + ',' + d.target.y;

     // return 'M' + d.source.x + ',' + d.source.y + 'A' + dist + ',' + dist + ' 0 0,1 ' + targetX + ',' + targetY;
 });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
  // circle.attr("fill", "None");

}

// restart starts here
// update graph (called when needed)
function restart() {
  // console.log("inside restart function");
  // path (link) group
 
if(suggestionsFinalized == true)
{
   for(var i = 0; i < nodes.length; i++)
   {
  if (nodes[i].greyflag == 2){  nodes[i].greyflag = 0};
  } suggestionsFinalized = false;
}



for (var i = 0; i < links.length; i++) {
  var ID = "#edge"+(links[i].id);
  jQuery(ID).remove();
};
for (var i = 0; i < links.length; i++) {
 var id = "#linkLabelHolderId_"+(links[i].id);
 jQuery(id).remove();
};

value.length = 0;
for (var i = 0; i < links.length; i++) {
  value[i] = links[i].value;
  if ((links[i].flag == 3 || links[i].flag == 4) && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','6px');
  }
  if (links[i].flag == 10 && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','3px');
       jQuery("#linkId_"+links[i].id).css('stroke', '#CEF6F5');
  }
  if (links[i].flag == 9 && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','3px');
       jQuery("#linkId_"+links[i].id).css('stroke', '#F2F2F2');
  }
};


if (linkSuggestionsFinalized == true){
    for(var i =0; i < links.length; i++)
    {
          if(links[i].flag == 4){
              jQuery("#linkId_"+links[i].id).css('stroke', 'black'); 
              jQuery("#linkId_"+links[i].id).css('stroke-width','3px');
              links[i].flag = 2;  
          }
    }
    linkSuggestionsFinalized = false;
}

jQuery('#defs-marker').empty();
defs.data(value)
    .enter();

  path = path.data(links);

  path.enter().append("svg:path")
      .attr("class", function(d) {
         return ("link " + d.value); })
      .attr("id",function(d,i) { 
          return "linkId_" + d.id; })
      .attr("marker-end", function(d) { return "url(#" + d.value + ")"; })
      .style('stroke', function(d){
          return 'black';
        })
      .on('mousedown', function(d) {
          if (selected_link == null || selected_link != d) {
            if (selected_link){
                if (selected_link.flag != 2){
                    if (selected_link.flag == 3){
                    jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
                    else if (selected_link.flag == 4){
                    jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
                }
                else {jQuery("#linkId_"+selected_link.id).css('stroke', 'black');}
            }
            selected_link = d;
            if (selected_link.flag != 2){
               jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');
            }
            else{var i = 0;}
            //Orange removed //else{jQuery("#linkId_"+d.id).css('stroke', 'orange');}
            // d.style("fill", "green");
          }else if(selected_link == d){
            if (selected_link.flag == 3){
               jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
             else if (selected_link.flag == 4){
               jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
            else {jQuery("#linkId_"+selected_link.id).css('stroke', 'black');}
            selected_link = null
          }

          allowNodeCreation = false;

          jQuery("#edge-options").empty();
          for (var i = 0; i < linkTypes.length; i++) {
            jQuery("#edge-options").append('<option value="'+linkTypes[i]+'" id="add-value-1" onClick=changeName('+linkTypes[i]+')>'+linkTypes[i]+'</option>');
          };

          if(d3.event.ctrlKey) return;

          // select link
          mousedown_link = d;
          // if(mousedown_link === selected_link) selected_link = null;
          // else selected_link = mousedown_link;
          selected_node = null;
          console.log("link selected");
          // selectEgde();
          jQuery("#type-div").hide();
          jQuery("#entity-div").hide();
          jQuery("#domain-div").hide();
          jQuery("#keyword-div").hide();
          jQuery("#type-border").hide();
          jQuery("#entity-border").hide();
          jQuery("#type-keyword-div").hide();
          jQuery("#edge-div").show();
          link_click=true;
          restart();
        })
      .on('mouseup', function(d){
          if (selected_link) {
            if (selected_link.flag != 2){
               jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');
            }
            else{var i = 0;}
            // Orange removed //else{jQuery("#linkId_"+d.id).css('stroke', 'orange');}
          }else{
              if (d.flag == 3){
                 jQuery("#linkId_"+d.id).css('stroke', '#B0B0B0');}
              else  if (d.flag == 4){
                 jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');}
              else{jQuery("#linkId_"+d.id).css('stroke', 'black');}
          }
          allowNodeCreation = true;

          if (selected_link) {
            for (var i = 0, j=0; i < links.length; i++) {
              if (links[i].linkID != -1 && (links[i].source != links[i].target)) {
                partialGraph[j] = {source: links[i].source.nodeID, graphSource: links[i].source.id, edge: links[i].linkID, object: links[i].target.nodeID, graphObject: links[i].target.id};
                j++;
              }
            };

            var data = {
              partialGraph: partialGraph,
              mode: 0,
              rejectedGraph: rejectedGraph,
              activeEdgeEnds: {source: selected_link.source.nodeID, object: selected_link.target.nodeID},
              dataGraphInUse: 0,
              topk: noOfSuggestions
            };
            // postRequest(data, linkTypes, returnObject);
            postRequest(data,0);
         //   jQuery("#edge-options").empty();
         //   for (var i = 0; i < linkTypes.length; i++) {
         //     jQuery("#edge-options").append('<option value="'+linkTypes[i][0]+'" id="add-value-1" >'+linkTypes[i][1]+'</option>');
         //   };
          };

          restart();
        });



  // remove old links
  // path.exit().remove();

   

  linkText.data(force.links())
          .enter().append("g").attr("class", "linklabelholder")
          .attr("id", function(d,i) { return "linkLabelHolderId_" + d.id;})
         .append("text")
         .attr("class", "linklabel")
         .style("font-size", "18px")
         .attr('x', "20")
         .attr("y", "0")
         .attr("text-anchor", "start")
         .attr("textLength", "50px")
         //.attr("lengthAdjust","spacing")
         //.style("fill","#000")
         .style("fill",function(d,i){ if (d.flag == 10){return "#58FAF4"} else if (d.flag == 9){return "#D8D8D8"} else {return "#000"}
         })
         .append("textPath").attr('id', function(d,i) { return "textPath" + d.id;})
         // .attr("id", function(d,i) { return "#linkId_" + d.id;})

         //.append("title").text("xlink:href", function(d,i) { return "#linkId_" + d.id;})
         .attr("xlink:href",function(d,i) { 
          return "#linkId_" + d.id;
        })
         .text(function(d) { 
            return d.value; 
         }).on('mousedown', function(d) {
         /*if (greyLinkSelectedFlag >= 1 && greyLinkSelected == d)
         { 
             greyLinkSelectedFlag = 2;}*/
          if (selected_link == null || selected_link != d) {
            if(d.target.greyflag == 1 || d.source.greyflag == 1){
                  /*if (greyLinkSelectedFlag >= 1 && greyLinkSelected == d){
                     greyLinkSelectedFlag = 2;} else{*/
                     greyLinkSelectedFlag = 1;
                  // }
                  greyLinkSelected = d;
            }
            if (selected_link){
              if (selected_link.flag == 3){
                  jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
              else if (selected_link.flag == 4){
                  jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
              else{
                  jQuery("#linkId_"+selected_link.id).css('stroke', 'black');}
            }  
            selected_link = d;
            if (selected_link.flag != 2){
              
               for (var k = 0; k < links.length; k++)
               { 
                    if ( d === links[k])
                    {
                         if (d.flag == 3){
                           links[k].flag = 4;
                           selected_link.flag = 4;
                           greyLinkSuggestionsPicked++;
                           greyLinkPickdPerSubSuggestion++;
                         }
                         else if (d.flag == 4){
                            links[k].flag = 3;
                            selected_link.flag = 3;
                            greyLinkSuggestionsPicked--;
                            greyLinkPickdPerSubSuggestion--;
                            if (greyLinkSuggestionsPicked == 0 && noOfSuggestionsPicked == 0 && subSuggestionsInProgressFlag == false){
                                jQuery("#button-g").show();
                            }
                         }
                         break;
                     }
               }
               if (selected_link.flag == 4){
               jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');}
               else if (selected_link.flag == 3){
               jQuery("#linkId_"+d.id).css('stroke','#B0B0B0');}
               else {
               jQuery("#linkId_"+d.id).css('stroke','black');}
              
            }
            else { 
               //Orange removed// jQuery("#linkId_"+d.id).css('stroke', 'orange');
               if (selected_link.flag == 2 && selected_link.source != selected_link.target && selected_link.source.greyflag == 0 && selected_link.target.greyflag == 0 && suggestions == false && suggestionsFinalized == false && linkSuggestionsFinalized == false){
                         jQuery("#linkId_"+d.id).css('stroke', 'orange');
                         getExamples(selected_link);
               }
               else if (selected_link.flag == 2 && selected_link.source != selected_link.target && selected_link.source.greyflag == 0 && selected_link.target.greyflag == 0 && addEdgeButtonEdgeAdded == true && (exampleSource != selected_link.source || exampleTarget !=  selected_link.target || exampleLinkId != selected_link.linkID)){
                    jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black'); 
                    for(var y = 0; y < nodes.length; y++){
                        if (nodes[y].greyflag == 2 && nodes[y].flag == 1){
                             nodes[y].greyflag = 0;
                             nodes[y].flag = 1;
                         }
                    }
                    removeTempNodes();
                    suggestions = false;
                    suggestionPicked = false;
                    exampleSource = null;
                    exampleTarget = null;
                    exampleLinkId = -1;
                    exampleLinkGraphId = -1;
                    exampleReverseRoleFlag = false;
                    addEdgeButtonEdgeAdded = false;
                    jQuery("#Add-Edge-button").hide();
                    jQuery("#active-examples").empty();
                    jQuery("#Reverse-button").hide();
                    jQuery("#linkId_"+d.id).css('stroke', 'orange');
                    jQuery("#button-g").show();
                    getExamples(selected_link);
                }
            }
            // d.style("fill", "green");
          }else if(selected_link == d){
               if (d.flag != 2){ 
                  for (var k = 0; k < links.length; k++)
                  { 
                     if ( d === links[k])
                     {
                         if (d.flag == 3){
                            links[k].flag = 4;
                            selected_link.flag = 4;
                            greyLinkSuggestionsPicked++;
                            greyLinkPickdPerSubSuggestion++;
                         }
                         else if (d.flag == 4){
                             links[k].flag = 3; 
                             selected_link.flag = 3;
                             greyLinkSuggestionsPicked--;
                             greyLinkPickdPerSubSuggestion--;
                             if (greyLinkSuggestionsPicked == 0 && noOfSuggestionsPicked == 0 && subSuggestionsInProgressFlag == false){
                                 jQuery("#button-g").show();
                             }
                         }
                         break;
                     }
                  }
                }
                if (selected_link.flag == 3){
                    jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
                else if (selected_link.flag == 4){
                    jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
                else {
                    jQuery("#linkId_"+selected_link.id).css('stroke', 'black');
                    if ((exampleReverseRoleFlag == true && addEdgeButtonEdgeAdded == false) || (exampleReverseRoleFlag == true && addEdgeButtonEdgeAdded == true && exampleSource === selected_link.source && exampleTarget === selected_link.target && exampleLinkId == selected_link.linkID)){
                         jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black'); 
                         if (addEdgeButtonEdgeAdded == true){
                             for(var y = 0; y < nodes.length; y++){
                                 if (nodes[y].greyflag == 2 && nodes[y].flag == 1){
                                     nodes[y].greyflag = 0;
                                     nodes[y].flag = 1;
                                 }
                              }
                              removeTempNodes();
                              suggestions = false;
                              suggestionPicked = false;
                          }
                         exampleSource = null;
                         exampleTarget = null;
                         exampleLinkId = -1;
                         exampleLinkGraphId = -1;
                         exampleReverseRoleFlag = false;
                         addEdgeButtonEdgeAdded = false;
                         jQuery("#Add-Edge-button").hide();
                         jQuery("#active-examples").empty();
                         jQuery("#Reverse-button").hide();
                     }
                }
            selected_link = null
          }

          allowNodeCreation = false;

          jQuery("#edge-options").empty();
          for (var i = 0; i < linkTypes.length; i++) {
            jQuery("#edge-options").append('<option value="'+linkTypes[i]+'" id="add-value-1" onClick=changeName('+linkTypes[i]+')>'+linkTypes[i]+'</option>');
          };

          if(d3.event.ctrlKey) return;

          // select link
          mousedown_link = d;
          // if(mousedown_link === selected_link) selected_link = null;
          // else selected_link = mousedown_link;
          selected_node = null;
          console.log("link selected");
          // selectEgde();
          // jQuery("#type-div").hide();
          // jQuery("#entity-div").hide();
          // jQuery("#domain-div").hide();
          // jQuery("#edge-div").show();
          link_click=true;
          restart();
          if (greyLinkSelectedFlag == 1){
                   getSubSuggestions();
                   greyLinkSelectedFlag = 0;
                   
          }
        })
      .on('mouseup', function(d){
          if (selected_link) {
               if (selected_link.flag == 4){
                 jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');
               }
               else if (selected_link.flag == 3){
                 jQuery("#linkId_"+d.id).css('stroke', '#B0B0B0');
               }
        
               else {
                    //Orange removed //jQuery("#linkId_"+d.id).css('stroke', 'orange');
                    if (selected_link.source != selected_link.target && selected_link.source.greyflag == 0 && selected_link.target.greyflag == 0 && suggestions == false && suggestionsFinalized == false && linkSuggestionsFinalized == false){
                         jQuery("#linkId_"+d.id).css('stroke', 'orange');
                         getExamples(selected_link);
                    }
                    else if (selected_link.flag == 2 && selected_link.source != selected_link.target && selected_link.source.greyflag == 0 && selected_link.target.greyflag == 0 && addEdgeButtonEdgeAdded == true && (exampleSource != selected_link.source || exampleTarget !=  selected_link.target || exampleLinkId != selected_link.linkID)){
                    jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black');     
                    for(var y = 0; y < nodes.length; y++){
                        if (nodes[y].greyflag == 2 && nodes[y].flag == 1){
                             nodes[y].greyflag = 0;
                             nodes[y].flag = 1;                          
                         }
                    }
                    removeTempNodes();
                    suggestions = false;
                    suggestionPicked = false;
                    exampleSource = null;
                    exampleTarget = null;
                    exampleLinkId = -1;
                    exampleLinkGraphId = -1;
                    exampleReverseRoleFlag = false;
                    addEdgeButtonEdgeAdded = false;
                    jQuery("#Add-Edge-button").hide();
                    jQuery("#active-examples").empty();
                    jQuery("#Reverse-button").hide();
                    jQuery("#linkId_"+d.id).css('stroke', 'orange');
                    jQuery("#button-g").show();
                    getExamples(selected_link);
                }
             }
          }else{
             if (d.flag == 3){
                    jQuery("#linkId_"+d.id).css('stroke', '#B0B0B0');}
             else if (d.flag == 4){
                    jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');}
             else{ jQuery("#linkId_"+d.id).css('stroke', 'black');}
          }
          allowNodeCreation = true;

          if (selected_link) {
            // for (var i = 0, j=0; i < links.length; i++) {
            //   if (links[i].linkID != -1 && (links[i].source != links[i].target)) {
            //     partialGraph[j] = {source: links[i].source.nodeID, edge: links[i].linkID, object: links[i].target.nodeID};
            //     j++;
            //   }
            // };

            // var data = {
            //   partialGraph: partialGraph,
            //   mode: 0,
            //   rejectedGraph: rejectedGraph,
            //   activeEdgeEnds: {source: selected_link.source.nodeID, object: selected_link.target.nodeID},
            //   dataGraphInUse: 0
            // };
            // postRequest(data);
            selected_node = null;
            // jQuery("#myModal").modal('show');
            // jQuery("#type-div").hide();
            // jQuery("#entity-div").hide();
            // jQuery("#domain-div").hide();
            // jQuery("#edge-options").empty();
            // for (var i = 0; i < linkTypes.length; i++) {
            //   jQuery("#edge-options").append('<option value="'+linkTypes[i][0]+'" id="add-value-1" >'+linkTypes[i][1]+'</option>');
            // };
            // jQuery("#edge-div").show();
          };

              restart();
        }).on('mouseover', function(){
           this.style.cursor='pointer';
        });


  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    // .style('fill', function(d) { return (d === selected_node) ? d.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
    .style('fill', function(d) { 
      return ((d.flag == 10 && d.greyflag == 10) ? "#CEF6F5" : (d.flag == 9 && d.greyflag == 9) ? "#F2F2F2" :(exampleReverseRoleFlag == true && d === exampleTarget) ? "#B831AF" :(exampleReverseRoleFlag == true && d === exampleSource) ? "#FE2E64" : (d.flag == 1 && d == selected_node && d.greyflag == 0)? "#33CCFF" : (d.flag == 1 && d.greyflag == 2)? "#2EFEF7" : (d.flag == 2 && d.greyflag == 1) ? "#D0D0D0" : d3.rgb(defaultNodeColor))

      // return (d == selected_node && d.flag == 1) ? "None": (d.flag == 2)? "#D0D0D0": "None";
    })
    .style('stroke', function(d){ if (d.flag == 10 && d.greyflag == 10) {return "#CEF6F5"} else if (d.flag == 9 && d.greyflag == 9) {return "#F2F2F2"} else {return 'black'} 
    })
    .classed('reflexive', function(d) { return d.reflexive; });


   circle.selectAll('text')
        .style("fill",function(d) { if ((d.flag == 9 && d.greyflag == 9) || (d.flag == 10 && d.greyflag == 10)) {return "#BDBDBD"} else { return "#000000"}
      });

  // add new nodes
  var g1 = circle
           .on('mouseover', function(){
               this.style.cursor='pointer';
            }).enter().append('svg:g').attr('class','conceptG')
                .call(drag);

  g1.append('svg:circle')
    // .attr('class', 'node')
    .attr('r', 30)
    .style('fill', function(d) { 
      // return (d == selected_node && d.flag == 1) ? d3.rgb(defaultNodeColor).brighter(): (d.flag == 2)? "#D0D0D0": d3.rgb(defaultNodeColor)
      // return (d == selected_node && d.flag == 1) ? d3.rgb(defaultNodeColor).brighter(): (d.flag == 2)? "#D0D0D0": "None";
      return ((d.flag == 10 && d.greyflag == 10) ? "#CEF6F5" :(d.flag == 9 && d.greyflag == 9) ? "#F2F2F2" :(exampleReverseRoleFlag == true && d === exampleTarget) ? "#B831AF" :(exampleReverseRoleFlag == true && d === exampleSource) ? "#FE2E64" : (d == selected_node && d.flag == 1 && d.greyflag == 0) ? "#33CCFF": (d.flag == 1 && d.greyflag == 2)? "#2EFEF7" : (d.flag == 2 && d.greyflag == 1) ? "#D0D0D0": d3.rgb(defaultNodeColor))
    })
    .style('stroke', function(d){ if (d.flag == 10 && d.greyflag == 10) {return "#CEF6F5"} else if (d.flag == 9 && d.greyflag == 9) {return "#F2F2F2"} else {return 'black'} 
    })
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', function(d) {
          nodeclick = true;
          allowNodeCreation = false;
          // select node
          mousedown_node = d;

          if(drawEdge == false){
            checkMove_x = d.x;
            checkMove_y = d.y;
            if(mousedown_node === selected_node) {
                selected_node = null;
		if(mousedown_node.greyflag == 2 && mousedown_node.flag == 1){  
                   d.greyflag = 1; 
                   d.flag = 2; 
                   noOfSuggestionsPicked--;
                   if (subSuggestionsInProgressFlag == true){
                       SugPickdPerGreyLinkCount--;}
                   if (noOfSuggestionsPicked == 0) { suggestionPicked = false;
                       if (greyLinkSuggestionsPicked == 0 && subSuggestionsInProgressFlag == false){
                           jQuery("#button-g").show();}
                   }
                }
		console.log("node not selected")
               }
	    else if (mousedown_node.flag == 1 && mousedown_node.greyflag == 2){
	           selected_node = null; d.greyflag = 1; d.flag = 2; console.log("suggestion deselected");
                   noOfSuggestionsPicked--;
                   if (subSuggestionsInProgressFlag == true){
                       SugPickdPerGreyLinkCount--;}
                   if (noOfSuggestionsPicked == 0) { suggestionPicked = false;
                         if(greyLinkSuggestionsPicked == 0 && subSuggestionsInProgressFlag == false){   jQuery("#button-g").show();}
                   } 
            }
            else {
              selected_node = mousedown_node;
              console.log("node selected");
            }
          }

          // reposition drag line
          if (drawEdge) {

              console.log(drawEdge);
              hideDragLineFlag = false;
              for(var x = 0; x < links.length; x++){
                  if (links[x].source != links[x].target && ((links[x].source.greyflag != 0 || links[x].target.greyflag != 0) || (links[x].flag == 3 || links[x].flag == 4))){
                       hideDragLineFlag = true;
                       break;
                  }
              }             
              if (hideDragLineFlag == true){
                   console.log("Edge can not be drawn with graph containing grey nodes");
              }
              else{              
              drag_line
                  .style('marker-end', 'url(#end-arrow)')
                  .classed('hidden', false)
                  //.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
                  .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'A' + 0 + ',' + 0 + ' 0 0,1 ' + mousedown_node.x  + ',' + mousedown_node.y);
 
                  //.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'A' + mousedown_node.x  + ',' + mousedown_node.y + ' 0 0,1 ' + mousedown_node.x  + ',' + mousedown_node.y);
              }
          };
    })
    .on('mouseup', function(d) {
         if (drawEdge == false)
         {
            if (mousedown_node.x != checkMove_x || mousedown_node.y != checkMove_y)
	    {
	        nodeclick = false;
                allowNodeCreation = true;
	        if (mousedown_node.greyflag == 1 && mousedown_node.flag == 2 && selected_node == null){
		    d.greyflag = 2;
	            d.flag = 1;
	            noOfSuggestionsPicked++;
		    if (subSuggestionsInProgressFlag == true){
			SugPickdPerGreyLinkCount++;}
		    suggestionPicked = true;
		    jQuery("#button-g").hide();
		    selected_node = d;
	        }
	        else if ( selected_node === mousedown_node){
	            selected_node = null;
	        }
             }
             checkMove_x = 0;
             checkMove_y = 0;
         }   	
      if (selected_node != null && mousedown_node == d && d.flag == 2 && d.greyflag == 1 && drawEdge == false) {
        d.flag=1;
        noOfSuggestionsPicked++;
        if (subSuggestionsInProgressFlag == true){
              SugPickdPerGreyLinkCount++;}
        suggestionPicked = true;
        d.greyflag = 2;    
        jQuery("#button-g").hide();
      };
      if (selected_node == d) {
        // jQuery('#myModal').modal('show');
        // jQuery('#selectDiv').hide();
        // jQuery("#modal-text").empty();
        // jQuery("#modal-text").append("<h4>Node Values</h4>"+
        //                           "Domain: "+selected_node.domain+"<br>"+
        //                           "Type: "+selected_node.type+"<br>");
      };
      mouseup_node = d;
      // check for drag-to-self
      if (drawEdge) {
        if (hideDragLineFlag == true) { hideDragLineFlag = false; resetMouseVars(); return;}
        if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

         if (exampleReverseRoleFlag == true){
             jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black'); 
             exampleSource = null;
             exampleTarget = null;
             exampleLinkId = -1;
             exampleLinkGraphId = -1;
             exampleReverseRoleFlag = false;
             addEdgeButtonEdgeAdded = false;
             jQuery("#Add-Edge-button").hide();
             jQuery("#active-examples").empty();
             jQuery("#Reverse-button").hide();
        }
        // unenlarge target node
        d3.select(this).attr('transform', '');

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        var source, target, direction;

        source = mousedown_node;
        target = mouseup_node;
        {
          ++lastEdgeID;
          link = {source: source, target: target, value: "", id: lastEdgeID, linkNum: 1,  linkID : -1, flag: 2};
          for (var i = 0; i < links.length; i++){
               if (links[i].source.nodeID == link.source.nodeID && links[i].target.nodeID == link.target.nodeID && links[i].source != links[i].target)
                    link.linkNum++;
          } 
          selected_node = null;
          if (source != null && target != null && lastEdgeID!= null) {
            links.push(link);
            if (selected_link) {
              if (selected_link.flag != 2){
                 if (selected_link.flag == 3){
                 jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
                 else if (selected_link.flag == 4){
                 jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
              }
              else{jQuery("#linkId_"+selected_link.id).css('stroke', 'black');}
            }
            selected_link = link;
            jQuery("#type-div").hide();
            jQuery("#entity-div").hide();
            jQuery("#domain-div").hide();
            jQuery("#entity-border").hide();
            jQuery("#type-border").hide()
            jQuery("#type-keyword-div").hide();
            jQuery("#edge-div").show();
            jQuery("#keyword-div").hide();
            link_click=true;
          }
          else
            --lastEdgeID;
        }

        allowNodeCreation = true;
        nodeclick = false;

        for (var i = 0, j=0; i < links.length; i++) {
          if (links[i].linkID != -1 && (links[i].source != links[i].target)) {
            partialGraph[j] = {source: links[i].source.nodeID, graphSource: links[i].source.id,edge: links[i].linkID, object: links[i].target.nodeID, graphObject: links[i].target.id};
            j++;
          }
        };

        var data = {
          partialGraph: partialGraph,
          mode: 0,
          rejectedGraph: rejectedGraph,
          activeEdgeEnds: {source: selected_link.source.nodeID, object: selected_link.target.nodeID},
          dataGraphInUse: 0,
          topk: noOfSuggestions
        };

        // temp = postRequest(data, linkTypes, returnObject);
        // linkTypes= temp[0];
        // returnObject = temp[1];
        postRequest(data,1);
        //newEdge = true;
        //restart();
        if (selected_link.flag != 2){
           jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');
        }
        else {
             //Orange removed// jQuery("#linkId_"+selected_link.id).css('stroke', 'orange');
        }

        if (linkTypes.length != 0) {
          jQuery("#myModal").modal('show');
          jQuery("#type-div").hide();
          jQuery("#entity-div").hide();
          jQuery("#domain-div").hide();
          jQuery("#keyword-div").hide();
          jQuery("#type-keyword-div").hide();
          jQuery("#type-border").hide();
          jQuery("#entity-border").hide()
          jQuery("#edge-options").empty();
          jQuery("#modal-title").empty();
          jQuery("#modal-title").append("<h4>Select Edge Label</h4>");
          for (var i = 0; i < linkTypes.length; i++) {
            jQuery("#edge-options").append('<option value="'+linkTypes[i][0]+'" id="add-value-1" >'+linkTypes[i][1]+'</option>');
          };
          jQuery("#edge-div").show();
        }else{
          alert("The system was not able to find any suggestions for the edge.");
          selected_link.source = selected_link.target;
        }
      };
    });

  // show node IDs
  g1.append('svg:text')
      .attr("x", "0em")
      .attr("y", ".31em")
      .style("font-size", "15px")
      .style("text-anchor", "middle")
      .style("fill",function(d) { if ((d.flag == 9 && d.greyflag == 9) || (d.flag == 10 && d.greyflag == 10)) {return "#BDBDBD"} else { return "#000000"}
      })
      .attr('class', 'id')
      .attr('id',function(d){return 'node'+d.id})
      .text(function(d) {
       return d.name; });


/* Adds options to Select Type and Select Entity when a node is selected*/
  if (selected_node != null) {
      jQuery("#node"+selected_node.id).empty().append(selected_node.name);
  };

  if (selected_link != null) {
      jQuery("#textPath"+selected_link.id).empty().append(selected_link.value);
  };

  // remove old nodes
  circle.exit().remove();
  
  for(var i =0 ; i < links.length; i++)
  {
       if (links[i].flag == 4)
       {
                 jQuery("#linkId_"+links[i].id).css('stroke', '#2EFEF7');
       }
   }   
  // set the graph in motion
  force.start();
}



function getExamples(link)
{
    exampleReverseRoleFlag = true;
    exampleSource = link.source;
    exampleLinkId = link.linkID;
    exampleLinkValue = link.value;
    exampleLinkGraphId = link.id;
    exampleTarget = link.target;
    var sourceNodeId = link.source.nodeID;
    var targetNodeId = link.target.nodeID;
    var edgeId = link.linkID;
    setExamplesFlag();
    response.length = 0;
    getRequest("http://" + urlFull + "/viiq_app/getexamples?edge="+edgeId+"&source="+sourceNodeId+"&object="+targetNodeId, response);
    setExamplesFlag();
    animatedExamples();
    addEdgeButtonEdgeAdded = false;
    jQuery("#Add-Edge-button").show();
    if (response[0].isReversible == true){
           jQuery("#Reverse-button").show();}
    restart();
}


function animatedExamples(){
    jQuery("#active-examples").empty();
    var typeSource = response[0].sourceType.split(',')[1];
    var typeObject = response[0].objectType.split(',')[1];
    jQuery("#active-examples").append('<li class="li-animation" style="font-size: 15px; list-style-type:none;padding:0px; margin:0px"><span style="color:#FE2E64" id="sourceType"></span> <span style="color:black"> &#8594 </span><span id="targetType" style="color:#B831AF"></span></li>');
    var src = document.getElementById('sourceType');
    var tar = document.getElementById('targetType');
    src.innerText = '('+typeSource.toUpperCase()+')';
    tar.innerText = '('+typeObject.toUpperCase()+')';

    var textSource;
    var textTarget;
    for (var i = 0; i < response.length; i++)
    {
        for (var j = 0; j < response[i].examples.length; j++){
	   var srcid = "source"+j;
	   var tarid = "target"+j;
           var exampleSource = response[i].examples[j].split(',')[0];
           var exampleTarget = response[i].examples[j].split(',')[1];
           var listr = '<li class="li-animation" style="font-size: 20px; padding-left:20px;"><span style="color:#FE2E64" id='+srcid+'></span> <span style="color:black"> &#8594 </span><span id='+tarid+' style="color:#B831AF"></span></li>';
           jQuery("#active-examples").append(listr);
           //jQuery("#source").empty();
           //jQuery("#target").empty();
           var textSource = document.getElementById(srcid);
           var textTarget = document.getElementById(tarid);
           textSource.innerText = exampleSource;
           textTarget.innerText = exampleTarget;
         }
     }
     jQuery('#active-examples').each(function() {
          jQuery(this).children().animate({left:0, opacity:1});
     });
}


function getSubSuggestions()
{
  if (subSuggestionsInProgressFlag == true){
      if ((greyLinkSelected.source.greyflag == 1 && greyLinkSelected.source.flag == 2) || (greyLinkSelected.target.greyflag == 1 && greyLinkSelected.target.flag == 2)){
          var found = 0;
          var node;
          if (greyLinkSelected.source.greyflag == 0) { node = greyLinkSelected.target;}
          else if (greyLinkSelected.target.greyflag == 0){ node = greyLinkSelected.source;}
          for(var x = 0; x < nodes.length && found == 0; x++)
          {
              if (nodes[x] === node){
                  nodes[x].greyflag = 2;
                  nodes[x].flag = 1;
                  found = 1;
                  noOfSuggestionsPicked++;
                  SugPickdPerGreyLinkCount++;
                  suggestionPicked = true;
                  // button-g already hidden
              }
          }
          restart();
      }
  }
  else if (subSuggestionsInProgressFlag != true){
    var i = 0;
    var validCondition = false;
    var found = 0;
    if (addEdgeButtonEdgeAdded == true){
       validCondition = false;
    }
    else{
        for (i = 0; i < allReturnObject.length; i++)
        {
             var entry = allReturnObject[i];
             if (greyLinkSelected.linkID == entry.edge.split('|')[0])
             {
                found++;
                if (found > 1){
                    validCondition = true;
                    break;
                };
             }
        }
     }

     if (validCondition == false){
         if ((greyLinkSelected.source.greyflag == 1 && greyLinkSelected.source.flag == 2) || (greyLinkSelected.target.greyflag == 1 && greyLinkSelected.target.flag == 2)){
              var found = 0;
              var node;
              if (greyLinkSelected.source.greyflag == 0) { node = greyLinkSelected.target;}
              else if (greyLinkSelected.target.greyflag == 0){ node = greyLinkSelected.source;}
              for(var x = 0; x < nodes.length && found == 0; x++)
              {
                  if (nodes[x] === node){
                     nodes[x].greyflag = 2;
                     nodes[x].flag = 1;
                     found = 1;
                     noOfSuggestionsPicked++;
                     suggestionPicked = true;
                     jQuery("#button-g").hide();
                  }
              }
           }
     }
     else
     {
         validCondition = false;
         for (var j = 0; j < links.length; j++){
             if (links[j].source.greyflag == 0 && links[j].target.greyflag == 0 && links[j].flag == 4 && links[j].source.id != links[j].target.id){
                 links[j].flag = 10;
             }
             if (greyLinkSelected != links[j] && links[j].source.id != links[j].target.id){
                 if (links[j].source.greyflag != 0 || links[j].target.greyflag != 0){
                    if (links[j].source.greyflag == 0 && links[j].target.greyflag != 0){
                        if (links[j].target.greyflag == 1 && links[j].target.flag == 2){
                             for (var m = 0; m < nodes.length; m++){
                                 if (nodes[m] === links[j].target){
                                       nodes[m].flag = 9;
                                       nodes[m].greyflag = 9;
                                       break;
                                 }
                             }
                             links[j].target.greyflag = 9;
                             links[j].target.flag = 9;
                        }
                        else if (links[j].target.greyflag == 2 && links[j].target.flag == 1){
                             for (var m = 0; m < nodes.length; m++){
                                 if (nodes[m] === links[j].target){
                                       nodes[m].flag = 10;
                                       nodes[m].greyflag = 10;
                                       break;
                                 }
                             }
                             links[j].target.greyflag = 10;
                             links[j].target.flag = 10;
                        }
                        links[j].flag = 9;
                    }
                    else if (links[j].source.greyflag != 0 && links[j].target.greyflag == 0){
                        if (links[j].source.greyflag == 1 && links[j].source.flag == 2){
                             for (var m = 0; m < nodes.length; m++){
                                 if (nodes[m] === links[j].source){
                                       nodes[m].flag = 9;
                                       nodes[m].greyflag = 9;
                                       break;
                                 }
                             }
                             links[j].source.greyflag = 9;
                             links[j].source.flag = 9;
                        }
                        else if (links[j].source.greyflag == 2 && links[j].source.flag == 1){
                             for (var m = 0; m < nodes.length; m++){
                                 if (nodes[m] === links[j].source){
                                       nodes[m].flag = 10;
                                       nodes[m].greyflag = 10;
                                       break;
                                 }
                             }
                             links[j].source.greyflag = 10;
                             links[j].source.flag = 10;
                        }
                        links[j].flag = 9;
                    }else {}
                 }
            }
            else if (greyLinkSelected === links[j])
            {
                var sourceNodeId, targetNodeId;
                var srcId, trgId;
                srcId = greyLinkSelected.source.id;
                trgId = greyLinkSelected.target.id;
                sourceNodeId = greyLinkSelected.source.nodeID;
                targetNodeId = greyLinkSelected.target.nodeID;
                var sourceName = greyLinkSelected.source.name;
                var targetName = greyLinkSelected.target.name;
                var linkId = greyLinkSelected.linkID;
                var linkName = greyLinkSelected.value;
                var sourceGraphId = greyLinkSelected.source.id;
                var targetGraphId = greyLinkSelected.target.id;
                var sourceGreyFlag = greyLinkSelected.source.greyflag;
                var targetGreyFlag = greyLinkSelected.target.greyflag;
                greyLinkDetails.length = 0;
                var entry = {sourceNodeId: sourceNodeId, targetNodeId: targetNodeId, sourceName: sourceName, targetName: targetName, linkId: linkId, linkName: linkName, sourceGraphId: sourceGraphId, targetGraphId: targetGraphId, sourceGreyFlag: sourceGreyFlag, targetGreyFlag: targetGreyFlag, sourceId: srcId, targetId: trgId};
               greyLinkDetails.push(entry);
            }
        }
        if (suggestions == true && nodeclick == false) {
             for (i = 0; i< links.length; i++){
                 if (links[i].source != links[i].target && links[i].flag == 4){
                     links[i].source = links[i].target;
                 } 
             }
             nextButtonClick = false;
             jQuery("#button-g").hide();
             restart();
         }
         
         var entry = allReturnObject[0];
         var linkFound = 0; 
         var graphS;
         var graphO;
         if (targetGreyFlag == 0){
             graphS = -1;
             graphO = greyLinkDetails[0].targetId;
         }
         else if (sourceGreyFlag == 0){
             graphS = greyLinkDetails[0].sourceId;
             graphO = -1;
         }
         for (i = 0; i < allReturnObject.length; i++)
         { 
             if (greyLinkSelected.linkID == entry.edge.split('|')[0])
             {
                  linkFound = 1;
                  subSuggestionsInProgressFlag = true;
                  if (entry.graphSource == graphS && entry.graphObject == graphO && entry.source.split('|')[0] == greyLinkDetails[0].sourceNodeId && entry.object.split('|')[0] == greyLinkDetails[0].targetNodeId &&  entry.source.split('|')[1] == greyLinkDetails[0].sourceName &&entry.object.split('|')[1] == greyLinkDetails[0].targetName &&  entry.edge.split('|')[0] == greyLinkDetails[0].linkId && entry.edge.split('|')[1] == greyLinkDetails[0].linkName){
                    // Suggestion Already Exists
                  }
                  else{
                     addNewSubSuggestions(entry);
                  }
	     }
             if (i <= (allReturnObject.length - 2)){
                  var linkId = entry.edge.split('|')[0];
                  entry = allReturnObject[i+1];
                  if (linkId != entry.edge.split('|')[0] && linkFound == 1){
                      break;
	          } 
             } 
	 }
     
     }
     restart();
     var test = nodes.length;
     for(i = 0; i < links.length; i++)
     {
         if (links[i].flag == 3)
         {
            jQuery("#linkId_"+links[i].id).css('stroke','#B0B0B0');
            jQuery("#linkId_"+links[i].id).css('stroke-width','6px');
         }
     }
     restart();
   }
}


   
function addNewSubSuggestions(linkEntry)
{   
   SugPickdPerGreyLinkCount = 0;
   var foundEntry = 0;
   var link;
   for(var i = 0; i < nodes.length && foundEntry == 0; i++)
   {
       if (nodes[i].greyflag != 1 && nodes[i].greyflag != 2 && nodes[i].greyflag != 9 && nodes[i].greyfalg != 10 ){
             if (nodes[i].id == linkEntry.graphSource && nodes[i].nodeID == linkEntry.source.split('|')[0] && linkEntry.graphObject == -1){
                        var newNode = {id: ++lastNodeId, name: linkEntry.object.split('|')[1], flag : 2, greyflag: 1,  nodeID: linkEntry.object.split('|')[0]};
                        var link = {source: nodes[i], target: newNode, value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: linkEntry.edge.split('|')[0], linkNum: 1};
                        nodes.push(newNode);
                        links.push(link);
                        foundEntry = 1;
             }
             else if (nodes[i].id == linkEntry.graphObject && nodes[i].nodeID == linkEntry.object.split('|')[0] && linkEntry.graphSource == -1){
                        var newNode = {id: ++lastNodeId, name: linkEntry.source.split('|')[1], flag : 2, greyflag: 1,  nodeID: linkEntry.source.split('|')[0]};
                        var link = {source: newNode, target: nodes[i], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: linkEntry.edge.split('|')[0], linkNum: 1};
                        nodes.push(newNode);
                        links.push(link);
                        foundEntry = 1;
             }
             else if (nodes[i].id == linkEntry.graphSource && linkEntry.graphObject != -1)
             { 
                 for (var j = 0; j < nodes.length && foundEntry == 0; j++){
                     if (nodes[j].id == linkEntry.graphObject){
                        var link = {source: nodes[i], target: nodes[j], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 3 , linkID: linkEntry.edge.split('|')[0], linkNum: 1};
                        for (var k = 0; k < links.length; k++){
                             if (links[k].source.id == link.source.id && links[k].target.id == link.target.id && links[k].source != links[k].target)
                                   link.linkNum++;
                        } 
                        links.push(link);
                        foundEntry = 1;
                     }
                  }                
             }
             else if (nodes[i].id == linkEntry.graphObject && linkEntry.graphSource != -1)
             { 
                 for (var j = 0; j < nodes.length && foundEntry == 0; j++){
                     if (nodes[j].id == linkEntry.graphSource){
                        var link = {source: nodes[j], target: nodes[i], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 3 , linkID: linkEntry.edge.split('|')[0], linkNum: 1};
                        for (var k = 0; k < links.length; k++){
                             if (links[k].source.id == link.source.id && links[k].target.id == link.target.id && links[k].source != links[k].target)
                                   link.linkNum++;
                        } 
                        links.push(link);
                        foundEntry = 1;
                     }
                  }                
             }else{}
	 }
     }
}



/*jQuery('#myModal').keydown(function(e) {
 
    if (e.keyCode == 8) { // 8 is backspace
        e.preventDefault();
     }
 
});*/


jQuery('#domain-options').change(function() {
    
    var text = jQuery("#domain-options option:selected").text();
    var value = jQuery("#domain-options option:selected").val();
    selected_node.name = text;
    selected_node.nodeID = value;
    selected_node.domain = value;
    console.log(value + "\n" + selected_node.name);
    
    if (text != "Select Domain...")
    {
        checkKeywordStatus();
        addTypesAndEntities();}
    else{ checkKeywordStatus(); displayTypeOptions(types); displayEntityOptions(entities);
    }
    jQuery("#type-selected-value").attr('value',-1);
    jQuery("#type-selected").attr('value',"Select Type...");
    jQuery("#entity-selected-value").attr('value',-1);
    jQuery("#entity-selected").attr('value',"Select Entity...");
    jQuery("#type-selected").hide();
    jQuery("#type-x-button").hide();
    jQuery("#entity-x-button").hide();
    jQuery("#entity-selected").hide();
    restart();
});

function setNodeDetails(entity, type, domain)
{
	var text;
        var value;
        selected_node.entity = -1;
        selected_node.type = -1;
        selected_node.domain = -1;

        if (entity == 1){
              /*text = jQuery("#entity-options option:selected").text();
              value = jQuery("#entity-options option:selected").val();*/
              text = jQuery("#entity-selected").val();
              value = jQuery("#entity-selected-value").val();
              selected_node.entity = value;
              if (type == 1){
                  //selected_node.type = jQuery("#type-options option:selected").val();}
                  selected_node.type = jQuery("#type-selected-value").val();}
              if (domain == 1){
                  selected_node.domain = jQuery("#domain-options option:selected").val();}
         }
        else if (entity == 0 && type == 1){
              /*text = jQuery("#type-options option:selected").text();
              value = jQuery("#type-options option:selected").val();*/
              text = jQuery("#type-selected").val();
              value = jQuery("#type-selected-value").val();
              selected_node.type = value;
              if(domain == 1){
                  selected_node.domain = jQuery("#domain-options option:selected").val();}
         }
         
    selected_node.name = text;
    selected_node.nodeID = value;
}


jQuery('#type-options').change(function() {
    var text = jQuery("#type-options option:selected").text();
    var value = jQuery("#type-options option:selected").val();
    var text2 = jQuery("#domain-options option:Selected").text();
    // if (selected_node.name == "select Name")
    selected_node.name = text;
    selected_node.nodeID = value;
    selected_node.type = value;
    jQuery("#type-selected-value").attr('value',value);
    jQuery("#type-selected").attr('value',text);
    jQuery("#entity-selected-value").attr('value',-1);
    jQuery("#entity-selected").attr('value',"Select Entity...");
    // selected_node.domain = 
    jQuery("#entity-options").empty();
    console.log(value + "\n" + selected_node.name);
    jQuery("#entity-options").attr('size',1);
    if (text != "Select Type..."){
    addEntities();}
    else if (text2 != "Select Domain...")
    {
        addTypesAndEntities();}
    else { displayEntityOptions(entities);}
    checkKeywordStatus();
    jQuery("#type-selected").show();
    jQuery("#type-x-button").show();
    jQuery("#entity-selected").hide();
    jQuery("#entity-x-button").hide();
    restart();
});


jQuery('#entity-options').change(function() {
    var text = jQuery("#entity-options option:selected").text();
    var value = jQuery("#entity-options option:selected").val();
        selected_node.name = text;
        selected_node.nodeID = value;
        selected_node.entity = value;
        console.log(value + "\n" + selected_node.name);
    jQuery("#entity-selected-value").attr('value', value);
    jQuery("#entity-selected").attr('value', text);
    checkKeywordStatus();
    jQuery("#entity-selected").show();
    jQuery("#entity-x-button").show();
    restart();
});


jQuery('#edge-options').change(function() {
    var val = jQuery("#edge-options option:selected").text();
    var value = jQuery("#edge-options option:selected").val();

    if (val != null)
      selected_link.value = val;

    if (value != null) {
      selected_link.linkID = value;
    };

    console.log(val + "\n" + selected_link.value);
    restart();
});


jQuery("#clear-button").click(function(){
  nodes.length = 0;
  links.length = 0;
  lastNodeId = 2;
  lastEdgeID = 2;
  partialGraph.length = 0;
  rejectedGraph.length = 0;
  returnObject.length = 0;
  allReturnObject.length = 0;
  disconnectedGraph = false;
  suggestionCounter = 0;
  noOfSuggestionsPicked = 0;
  suggestionsFinalized = false;
  suggestionPicked = false;
  nextButtonClick = false;
  subSuggestionsInProgressFlag = false;
  nodeclick = false;
  allowNodeCreation = true;
  newNode = false;
  newEdge = false;
  drawEdge = false;
  suggestions = false;
  greyLinkSelectedFlag = 0;
  greyLinkSelected = null;
  greyLinkSuggestionsPicked = 0;
  SugPickdPerGreyLinkCount = 0;
  greyLinkPickdPerSubSuggestion = 0;
  linkSuggestionsFinalized = false;
  greyLinkDetails.length = 0;
  exampleReverseRoleFlag = false;
  addEdgeButtonEdgeAdded = false;
  exampleSource = null;
  exampleTarget = null;
  exampleLinkId = -1;
  exampleLinkGraphId = -1;
  jQuery("#active-examples").empty();
  jQuery("#Reverse-button").hide();
  jQuery("#Add-Edge-button").hide();
  response.length = 0;
  hideDragLineFlag = false;
  clearIndexGlobalVariables();
  jQuery('defs').empty();
  jQuery('#pathG').empty();
  jQuery('#circleG').empty();
  jQuery('#linktextg').empty();
  // jQuery("#queryConstructSVG").empty();
  // var refresh = svg.append("svg:foreignObject")
  //             .attr("width", 100)
  //             .attr("height", 100)
  //             .attr("y", "15")
  //             .attr("x", x)
  //             .append("xhtml:span")
  //             .attr("class", "control glyphicon glyphicon-zoom-in")
  //             .on('click',function(){
  //               alert("ASdasd");
  //             })== 3
  jQuery("#active-help").empty();
  jQuery("#active-help").append('<li class="li-animation">Click on the canvas to add a new node.</li>');
  jQuery('#active-help').each(function() {
      jQuery(this).children().animate({left:0, opacity:1});
   });
  restart();
});


function mousedown() {
  // prevent I-bar on drag
  //d3.event.preventDefault();
  
  // because :active only works in WebKit?
  svg.classed('active', true);
  if (nextButtonClick) {
    nextClick();
  }else{
    if (subSuggestionsInProgressFlag == true)
    {   
       if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;
       removeSubSuggestionsTempNodes();
       if (SugPickdPerGreyLinkCount == 0 && greyLinkPickdPerSubSuggestion == 0){
          addGreyLinkSelectedAgain();
       }
       if (greyLinkSuggestionsPicked == 0 && suggestionPicked == false){
          jQuery("#button-g").show();
       }
       SugPickdPerGreyLinkCount = 0;
       greyLinkPickdPerSubSuggestion = 0;
       subSuggestionsInProgressFlag = false;
       greyLinkSelectedFlag = 0;
       greyLinkSelected = null;
       greyLinkDetails.length = 0;
    }
    else
    {
        if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

        // insert new node at point
        if (!d3.event.shiftKey && allowNodeCreation) {

        jQuery("#selectDiv").show();
        var point = d3.mouse(this);
        disconnectedGraph = checkConnected(nodes, links);
        removeTempNodes();
        if (!disconnectedGraph && suggestionPicked) {
          restart();
        };
        if (exampleReverseRoleFlag == true){
             jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black'); 
             exampleSource = null;
             exampleTarget = null;
             exampleLinkId = -1;
             exampleLinkGraphId = -1;
             exampleReverseRoleFlag = false;
             addEdgeButtonEdgeAdded = false;
             jQuery("#Add-Edge-button").hide();
             jQuery("#active-examples").empty();
             jQuery("#Reverse-button").hide();
        }
        if (greyLinkSuggestionsPicked > 0){
             linkSuggestionsFinalized = true;
             greyLinkSuggestionsPicked = 0;
        }
        if (suggestionPicked == false && linkSuggestionsFinalized == false && !disconnectedGraph) 
           createNewNode();
        if ((suggestionPicked == true || linkSuggestionsFinalized == true) && !nodeclick) {
           suggestionsFinalized = true; 
           suggestionCounter = 0;
           restart();
           addSuggestions(0);
       };

       }
   
    }

       restart();
 }
  // animatedHelp();
}


function addGreyLinkSelectedAgain(){

     for (var j = 0; j < nodes.length; j++)
     {
         if (nodes[j].nodeID == greyLinkDetails[0].sourceNodeId && greyLinkDetails[0].sourceGreyFlag == 0 && nodes[j].id == greyLinkDetails[0].sourceGraphId && nodes[j].greyflag == 0)
         { 
                var newNode = {id: ++lastNodeId, name: greyLinkDetails[0].targetName, flag : 2, greyflag: 1,  nodeID: greyLinkDetails[0].targetNodeId};
                var link = {source: nodes[j], target: newNode, value: greyLinkDetails[0].linkName, id: ++lastEdgeID, flag: 2 , linkID: greyLinkDetails[0].linkId, linkNum: 1};
                nodes.push(newNode);
                links.push(link);

         }
         else if (nodes[j].nodeID == greyLinkDetails[0].targetNodeId && greyLinkDetails[0].targetGreyFlag == 0 && nodes[j].id == greyLinkDetails[0].targetGraphId && nodes[j].greyflag == 0)
         { 
                var newNode = {id: ++lastNodeId, name: greyLinkDetails[0].sourceName, flag : 2, greyflag: 1,  nodeID: greyLinkDetails[0].sourceNodeId};
                var link = {source: newNode, target: nodes[j], value: greyLinkDetails[0].linkName, id: ++lastEdgeID, flag: 2 , linkID: greyLinkDetails[0].linkId, linkNum: 1};
                nodes.push(newNode);
                links.push(link);

         }
    }

}



function removeSubSuggestionsTempNodes()
{
    if (suggestions == true && nodeclick == false){
       for (var i = 0; i < nodes.length; i++){
          if (nodes[i].greyflag == 1 && nodes[i].flag == 2){
                var suggestFlagTemp = suggestionPicked;
                var nxtBtnClkTemp = nextButtonClick;
                suggestionPicked = false;
                nextButtonClick = false;
                spliceLinksForNode(nodes[i]);
                nodes.splice(nodes.indexOf(nodes[i]), 1);
                suggestionPicked = suggestFlagTemp;
                nextButtonClick = nxtBtnClkTemp;
                i--;
          };
       };
    }
    for (var k =0 ;  k < nodes.length; k++){
       if (nodes[k].flag == 9 && nodes[k].greyflag == 9){
            nodes[k].greyflag = 1;
            nodes[k].flag = 2;
       }
       else if (nodes[k].flag == 10 && nodes[k].greyflag == 10){
            nodes[k].greyflag = 2;
            nodes[k].flag = 1;
       }
    }
    selected_node = null;  
    for (var i =0; i < links.length; i++){
        if (links[i].flag == 9){
              if (links[i].target.greyflag == 0 && links[i].source.greyflag == 9 && links[i].source.flag == 9){
                  links[i].source.greyflag = 1;
                  links[i].source.flag = 2;
              }
              else if (links[i].target.greyflag == 0 && links[i].source.greyflag == 10 && links[i].source.flag == 10){
                  links[i].source.greyflag = 2;
                  links[i].source.flag = 1;
              }
              else if (links[i].source.greyflag == 0 && links[i].target.greyflag == 9 && links[i].target.flag == 9){
                  links[i].target.greyflag = 1;
                  links[i].target.flag = 2;
              }
              else if (links[i].source.greyflag == 0 && links[i].target.greyflag == 10 && links[i].target.flag == 10){
                  links[i].target.greyflag = 2;
                  links[i].target.flag = 1;
              }
 
	      links[i].flag = 2;
              jQuery("#linkId_"+links[i].id).css('stroke','black');
        }
        else if (links[i].flag == 10){
              links[i].flag = 4;
        }
        if (links[i].flag == 3 && links[i].source.greyflag == 0 && links[i].target.greyflag == 0)
        {
               /*var srcNodeId = links[i].source.nodeID;
               var tarNodeId = links[i].target.nodeID;
               var graphSrc = links[i].source.id;
               var graphTarget = links[i].target.id;
               rejectedGraph.push({source: srcNodeId, graphSource: graphSrc,  edge: links[i].linkID, object: tarNodeId, graphObject: graphTarget});*/
               links[i].source = links[i].target;
               links[i].flag = 2;
        } 
    }
    restart() 
}




function mousemove() {
  if(!mousedown_node) return;

  // update drag line
   //  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
    drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'A' + 0  + ',' + 0 + ' 0 0,1 ' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
  restart();
}

function createNewNode(){
  if (disconnectedGraph == false) {
    node = {id: ++lastNodeId, reflexive: false, name: " ", flag: 1, greyflag: 0, nodeID: -1, domain:"", type:"", entity:""};
    selected_node = node;
    newNode = true;
    nodes.push(node);
    selected_node = node;
    var graphDisconnect = checkConnected(nodes, links);
    if (graphDisconnect == true){
        jQuery("#button-g").hide();
    }
    jQuery("#type-selected-value").attr('value',-1);
    jQuery("#type-selected").attr('value',"Select Type...");
    jQuery("#entity-selected-value").attr('value',-1);
    jQuery("#entity-selected").attr('value',"Select Entity...");
    jQuery("#type-selected").hide();
    jQuery("#type-x-button").hide();
    jQuery("#entity-x-button").hide();
    jQuery("#entity-selected").hide();
    displayDomainOptions(domain);
    displayTypeOptions(types);
    displayEntityOptions(entities);
    jQuery("#modal-title").empty();
    jQuery("#modal-title").append("<h4>Select Node Label</h4>");
    jQuery("#domain-options").prop('disabled', false);
    jQuery("#entity-options").prop('disabled',false);
    jQuery("#modal-text").empty();
    jQuery('#myModal').modal('show');
  }
}



function displayAllTheTypeOptions()
{    displayTypeOptions(types);
}
 
function displayAllTheEntityOptions()
{    displayEntityOptions(entities);
}

function mouseup() {

  allowNodeCreation = true;
  if(mousedown_node) {
    // hide drag line
    drag_line
      .classed('hidden', true)
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars();
  // removeTempNodes();
  // if (selected_node && nodeclick==false) {
  //   selected_node=null;
  // };

  if (selected_link && link_click==false) {
    if (selected_link.flag != 2){
       if (selected_link.flag == 3){
       jQuery("#linkId_"+selected_link.id).css('stroke', '#B0B0B0');}
       else if (selected_link.flag == 4){
       jQuery("#linkId_"+selected_link.id).css('stroke', '#2EFEF7');}
    }
    else{jQuery("#linkId_"+selected_link.id).css('stroke', 'black');}
    selected_link = null;
  };
  link_click = false;
  nodeclick = false;
  animatedHelp();
  restart();
}

function removeTempNodes(){
  if (suggestions == true && nodeclick == false) {
    for (var k = 0; k < links.length; k++){
           if (links[k].flag == 4 && links[k].source != links[k].target){
               updateRejectedGraphForSelectedGreyLink(links[k]);
           }
    }
    for (var i = 0; i < nodes.length; i++) {
      if(nodes[i].flag == 1 && nodes[i].greyflag == 2){
         removeAllInstancesOfEdge(nodes[i]);
      }
      if (nodes[i].flag == 2) {
        removeAllInstancesOfEdge(nodes[i]);
        spliceLinksForNode(nodes[i]);
        nodes.splice(nodes.indexOf(nodes[i]), 1);
        i--;
      };
    };
    suggestions = false;
    // createNewNode();
    // suggestionPicked = false;
    // addSuggestions(); 
  }
  for (var n = 0; n < links.length; n++){
     if (links[n].flag == 3 && links[n].source != links[n].target){
         links[n].source = links[n].target;
     }
  }
  selected_node = null;
}


function updateRejectedGraphForSelectedGreyLink(link){
     var linkFound = 0;
     var entry = allReturnObject[0];
     for (var i =0; i < allReturnObject.length; i++){
          if (link.linkID == entry.edge.split('|')[0] && link.source.id == entry.graphSource && link.target.id == entry.graphObject && link.source.nodeID == entry.source.split('|')[0] && link.target.nodeID == entry.object.split('|')[0]){
                linkFound = 1;
          }
          else if (link.linkID == entry.edge. split('|')[0]){ 
                rejectedGraph.push({source: entry.source.split('|')[0], graphSource: entry.graphSource, edge: link.linkID, object: entry.object.split('|')[0], graphObject: entry.graphObject});
                linkFound = 1;
          }    
          if (i <= (allReturnObject.length - 2)){
                var prevLinkId = entry.edge.split('|')[0];
                entry = allReturnObject[i+1];
                if (prevLinkId != entry.edge.split('|')[0] && linkFound == 1){
                    break;
	        } 
          }
     } 
}



function removeAllInstancesOfEdge(node){
    if (suggestionPicked || nextButtonClick){
        var spliceAll = links.filter(function(l){
            return (l.source === node || l.target === node);
        });
        spliceAll.map(function(l){
            var linkFound = 0;
            var entry = allReturnObject[0];
            var idSource;
            var idTarget;
            if (l.source.greyflag == 0 && l.target.greyflag == 0){
                  idSource = l.source.id;
                  idTarget = l.target.id;
            }
            else if (l.source.greyflag == 0){
                    idSource = l.source.id;
                    idTarget = -1;
            }
            else { idSource = -1; idTarget = l.target.id;
            }
       
            for ( var i =0; i < allReturnObject.length; i++){
                if (l.linkID == entry.edge.split('|')[0] && idSource == entry.graphSource && idTarget == entry.graphObject && l.source.nodeID == entry.source.split('|')[0] && l.target.nodeID == entry.object.split('|')[0]){
                    linkFound = 1;
                }
                else if (l.linkID == entry.edge. split('|')[0]){ 
                    rejectedGraph.push({source: entry.source.split('|')[0], graphSource: entry.graphSource, edge: l.linkID, object: entry.object.split('|')[0], graphObject: entry.graphObject});
                    linkFound = 1;
                }    
                if (i <= (allReturnObject.length - 2)){
                        var prevLinkId = entry.edge.split('|')[0];
                        entry = allReturnObject[i+1];
                        if (prevLinkId != entry.edge.split('|')[0] && linkFound == 1){
                            break;
	                } 
                    } 
            }
        });
    }
}



function spliceLinksForNode(node) {
  var toSplice = links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    if (suggestionPicked || nextButtonClick){
        var graphSrcId;
        var graphTargetId;
        if (l.source.greyflag == 0 && l.target.greyflag == 0){
           graphSrcId = l.source.id;
           graphTargetId = l.target.id;
        }
        else if (l.source.greyflag == 0) {
           graphSrcId = l.source.id;
           graphTargetId = -1;
        }
        else {
             graphSrcId = -1;
             graphTargetId = l.target.id;
        }
        rejectedGraph.push({source: l.source.nodeID, graphSource: graphSrcId, edge: l.linkID, object: l.target.nodeID, graphObject: graphTargetId});
    }
    l.source = l.target;
  });
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown(){
  // console.log("keyCode: "+ d3.event.keyCode);
  //d3.event.preventDefault();


  if (d3.event.keyCode === 8){
     if( event.target == document.body) {
                  // stop this event from propagating further which prevents                      
                  // the browser from doing the 'back' action
           d3.event.preventDefault();}
   }

   else if (d3.event.keyCode == 13 || d3.event.keyCode == 16) {
    drawEdge = true;
    allowNodeDrag = false;
    translateAllowed = false;
    allowNodeCreation = true;
  }

   else if ( d3.event.keyCode == 46) {
      if(selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
        var graphDisconnect = checkConnected(nodes, links);
        if (graphDisconnect == true){
           jQuery("#button-g").hide();
        }else{
           jQuery("#button-g").show();
        }
      } else if(selected_link) {
        jQuery("#edge"+selected_link.id.toString()).remove();
        jQuery("#linkId_"+selected_link.id.toString()).remove();
        jQuery("#linkLabelHolderId_"+selected_link.id.toString()).remove();
        selected_link.source = selected_link.target;
        // links.splice(links.indexOf(selected_link), 1);
      }
      selected_link = null;
      selected_node = null;
      restart();
  }
  else
  { 
   // if(d3.event.target == 



  }
}

function keyup(){
  if (d3.event.keyCode == 13 || d3.event.keyCode == 16) {
    allowNodeDrag = true;
    translateAllowed = true;
    drawEdge = false;
    allowNodeCreation = false;
  }
}

zoom.on("zoom", function() {
      // d3.select("#"+gID).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
      if (translateAllowed == true && nodeclick == false) 
        g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    });
// svg.call(zoom);

function dragstart(d){
  if (translateAllowed && nodeclick) {
    force.stop();
    d.fixed = true;
    // d3.select(this).classed("fixed", d.fixed = true);
    // console.log("node drag");
  };
}

function dragmove(d){
  if (translateAllowed && nodeclick) {
    d.x += d3.event.dx;
    d.y +=  d3.event.dy;
    d.px += d3.event.dx;
    d.py += d3.event.dy;  
    tick();
    // restart();
  }
}

function dragend(d){
  if (translateAllowed && nodeclick) {
    // d.fixed = true;
    tick();
    force.resume();
  }
}

function temp(){
  console.log("mouse move");
}

function nextClick(){
  if (exampleReverseRoleFlag == true){
     jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black'); 
     exampleSource = null;
     exampleTarget = null;
     exampleLinkId = -1;
     exampleLinkGraphId = -1;
     exampleReverseRoleFlag = false;
     addEdgeButtonEdgeAdded = false;
     jQuery("#Add-Edge-button").hide();
     jQuery("#active-examples").empty();
     jQuery("#Reverse-button").hide();
  }
  nextButtonClick = true;
  removeTempNodes();
  nextButtonClick = false;
  addSuggestions(0);
}

function addSuggestions(singleNode){

  jQuery("#button-g").show();
  if(singleNode == 1) {
	// The passive edge suggestion call made after the very first node is added. The value of edge and object node is -1 and 0
	// respectively.
	partialGraph[0] = {source: nodes[0].nodeID, graphSource: nodes[0].id, edge: -1, object: 0, graphObject: -1};
  }
  else {
    for (var i = 0, j=0; i < links.length; i++) {
      if (links[i].linkID != -1 && (links[i].source != links[i].target)) {
        partialGraph[j] = {source: links[i].source.nodeID, graphSource: links[i].source.id, edge: links[i].linkID, object: links[i].target.nodeID, graphObject: links[i].target.id};
        j++;
      }
    };
  }

  var data = {
    partialGraph: partialGraph,
    mode: 1,
    rejectedGraph: rejectedGraph,
    dataGraphInUse: 0,
    topk: 3
  };

  // if (suggestionCounter == 0) {
    postRequest(data,2);
  // };
  // var i,j;
/*  var i = 0;
  for (i = 0; (i < noOfSuggestions) && (i < returnObject.length) ; i++) {
      var entry = returnObject[i];
      for (var j = 0; j < nodes.length; j++)
      {
           if (nodes[j].nodeID == entry.source.split('|')[0] && nodes[j].id == entry.graphSource){
              var newNode = {id: ++lastNodeId, name: entry.object.split('|')[1], flag : 2, greyflag: 1,  nodeID: entry.object.split('|')[0]};
              var link = {source: nodes[j], target: newNode, value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: entry.edge.split('|')[0], linkNum: 1};
              nodes.push(newNode);
              links.push(link);
              break;
           }else if (nodes[j].nodeID == entry.object.split('|')[0] && nodes[j].id == entry.graphObject){
              var newNode = {id: ++lastNodeId, reflexive: false, name: entry.source.split('|')[1], flag : 2, greyflag: 1, nodeID: entry.source.split('|')[0]};
              nodes.push(newNode);
              var link = {source: newNode, target: nodes[j], value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2,linkID: entry.edge.split('|')[0], linkNum: 1};
              links.push(link);
              break;
              // links.push({source: node, target: newNode, value: entry.edge.split('1')[1], id: ++lastEdgeID, flag: 2,  linkID: entry.edge.split('1')[0]});
           }
       };
  };
  suggestionCounter += i;
  suggestions = true;
  suggestionPicked = false;
  noOfSuggestionsPicked = 0;
  // suggestionCounter = i+j;
  restart();*/
}

function checkLinks(link){
  for (var i = 0; i < links.length; i++) {
    if ((links[i].source.name == link.source.name || links[i].source.name == link.target.name) && (links[i].target.name == link.target.name || links[i].target.name == link.source.name)) {
      return false;
    }
  }
  return true;
}

/*
Functions controls the active help. 
adds suggestions based on certain conditions. 
*/
function animatedHelp(){
  if (nodes.length == 1 && links.length == 0) {
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation">Click on the canvas to add a new node.</li>');
  }else if (checkConnected(nodes, links)) {
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation">Add an edge between the newly added node and another node in the graph by clicking on one node and dragging the mouse pointer to the other.</li>');
  }else if(suggestions && !suggestionPicked){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation">Click on the grey nodes or edges you want to add to the query graph, OR</li>');
    jQuery("#active-help").append('<li class="li-animation">Click on the empty canvas to ignore the automatic suggestions and add a new node, OR</li>');
    jQuery("#active-help").append('<li class="li-animation">Click on New Suggestions button to get a new set of edge recommendations.</li>');
  }else if(suggestions && suggestionPicked){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation">Click on other grey nodes or edges you want to add to the query graph, OR</li>');
    jQuery("#active-help").append('<li class="li-animation">Click on the empty canvas to save the selected nodes and delete the unselected grey nodes.</li>');
  }
  jQuery('#active-help').each(function() {
    // jQuery(this).children().each(function(i) {
    //     jQuery(this).delay((i++) * 1500).animate({left:0, opacity:1});
    // });
    jQuery(this).children().animate({left:0, opacity:1});
  });
}

function getGraphString(graph) {
   var src = "\"source\":";
   var graphSrc = "\"graphSource\":";
   var prop = "\"edge\":";
   var obj = "\"object\":";
   var graphObj = "\"graphObject\":";
   var str = "[";
   var i=0;
   for(i=0; i<graph.length-1; i++) {
      str += "{" + src + graph[i].source + ",";
      str += graphSrc + graph[i].graphSource + ",";
      str += prop + graph[i].edge + ",";
      str += graphObj + graph[i].graphObject + ",";
      str += obj + graph[i].object + "},";
   }
   if(graph.length > 0){
      str += "{" + src + graph[i].source + ",";
      str += graphSrc + graph[i].graphSource + ",";
      str += prop + graph[i].edge + ",";
      str += graphObj + graph[i].graphObject + ",";
      str += obj + graph[i].object + "}";
   }
   str += "]";
   return str;
}

function myStringify(data) {
   var jsonstr = "{";
   jsonstr += "\"partialGraph\":" + getGraphString(data.partialGraph);
   jsonstr += ",\"mode\":" + data.mode;
   if(data.mode == 0) {
	// This is active mode. must include another element called activeEdgeEnds;
	jsonstr += ",\"activeEdgeEnds\":{\"source\":" + data.activeEdgeEnds.source + ",\"object\":" + data.activeEdgeEnds.object + "}";
   }
   jsonstr += ",\"rejectedGraph\":" + getGraphString(data.rejectedGraph);
   jsonstr += ",\"dataGraphInUse\":" + data.dataGraphInUse;
   jsonstr += ",\"topk\":" + data.topk;
   jsonstr += "}";
   return jsonstr;
}



function postRequest(data){
  var jsonstr = myStringify(data);
  jQuery.ajax({
      type:"POST",
      beforeSend: function (request)
      {
          
          request.setRequestHeader("Content-type", "application/json");
          // request.setRequestHeader("Access-Control-Request-Method","POST");
          // request.setRequestHeader("Access-Control-Request-Headers","access-control-allow-origin, accept, content-type");
      },
      url: "http://" + urlFull + "/viiq_app/greeting",
      data: jsonstr,
      //data: JSON.stringify(data),
      async: false,
      processData: false,
      // dataType: "json",
	error: function(xhr, status, error) {
	var err = eval("(" + xhr.responseText + ")");
        alert(err.Message);
        },      
	success: function(msg) {
        linkTypes = [];
        linkTypes[0] = "0| Select Edge".split("|");
        for (var i = 0; i < msg.rankedUniqueEdges.length; i++) {
          linkTypes[i+1] = msg.rankedUniqueEdges[i].edge.split("|");
        };

        returnObject = msg.rankedUniqueEdges;
        allReturnObject = msg.rankedEdges;
        //for (var i = 0; i < msg.rankedEdges.length; i++) {
         // linkTypes[i] = msg.rankedEdges[i].edge.split("|");
        //};
        //returnObject = msg.rankedEdges;
        // returnObject = msg;
          // jQuery("#results").append("The result =" + StringifyPretty(msg));
      }
    });
}

function postRequest(data, mode){
  var jsonstr = myStringify(data);
  jQuery.ajax({
      type:"POST",
      beforeSend: function (request)
      {
          
          request.setRequestHeader("Content-type", "application/json");
          // request.setRequestHeader("Access-Control-Request-Method","POST");
          // request.setRequestHeader("Access-Control-Request-Headers","access-control-allow-origin, accept, content-type");
      },
      url: "http://" + urlFull + "/viiq_app/greeting",
      data: jsonstr,
      //data: JSON.stringify(data),
      async: true,
      processData: false,
      // dataType: "json",
	error: function(xhr, status, error) {
	var err = eval("(" + xhr.responseText + ")");
        alert(err.Message);
        },      
	success: function(msg) {
        linkTypes = [];
        linkTypes[0] = "0| Select Edge".split("|");
        for (var i = 0; i < msg.rankedUniqueEdges.length; i++) {
          linkTypes[i+1] = msg.rankedUniqueEdges[i].edge.split("|");
        };

        returnObject = msg.rankedUniqueEdges;
        allReturnObject = msg.rankedEdges;
	processSuggestions(mode);
        //for (var i = 0; i < msg.rankedEdges.length; i++) {
         // linkTypes[i] = msg.rankedEdges[i].edge.split("|");
        //};
        //returnObject = msg.rankedEdges;
        // returnObject = msg;
          // jQuery("#results").append("The result =" + StringifyPretty(msg));
      }
    });
}
function processSuggestions(mode) {
   if(mode == 0) {
	// postReq was called from the first mouse up.
	jQuery("#edge-options").empty();
	for (var i = 0; i < linkTypes.length; i++) {
		jQuery("#edge-options").append('<option value="'+linkTypes[i][0]+'" id="add-value-1" >'+linkTypes[i][1]+'</option>');
	};
   } else if(mode == 1) {
   // postReq was called from the second mouse up.
	newEdge = true;
   } else if(mode == 2) {
	// postReq was called from addSuggestions
	for (i = 0; (i < noOfSuggestions) && (i < returnObject.length) ; i++) {
	var entry = returnObject[i];
	for (var j = 0; j < nodes.length; j++){
          if (nodes[j].nodeID == entry.source.split('|')[0] && nodes[j].id == entry.graphSource){
            var newNode = {id: ++lastNodeId, name: entry.object.split('|')[1], flag : 2, greyflag: 1,  nodeID: entry.object.split('|')[0]};
            var link = {source: nodes[j], target: newNode, value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: entry.edge.split('|')[0], linkNum: 1};
            nodes.push(newNode);
            links.push(link);
            break;
          }else if (nodes[j].nodeID == entry.object.split('|')[0] && nodes[j].id == entry.graphObject){
            var newNode = {id: ++lastNodeId, reflexive: false, name: entry.source.split('|')[1], flag : 2, greyflag: 1, nodeID: entry.source.split('|')[0]};
            nodes.push(newNode);
            var link = {source: newNode, target: nodes[j], value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2,linkID: entry.edge.split('|')[0], linkNum: 1};
            links.push(link);
            break;
          }
        };
      };
   }
   restart();
}

function keywordUpdate(valueKeyword)
{
    
      selected_node.name = valueKeyword[1];
      selected_node.nodeID = valueKeyword[0];
      console.log(valueKeyword[1] + "\n" + selected_node.name);
      SetKeywordFlag();

    /*if (keywordCategory == 3)
    {
          var textEntity = jQuery("#entity-options option:selected").text();
          var valueEntity = jQuery("#entity-options option:selected").val();
          var valueType = jQuery("#type-options option:selected").val();
          var valueDomain = jQuery("#domain-options option:selected").val();
          if (textEntity!= "Select Type...")
          {
            selected_node.name = textEntity;
            selected_node.nodeID = valueEntity;
            selected_node.entity = valueEntity;
            selected_node.type = valueType;
            selected_node.domain = valueDomain;
            console.log(valueEntity + "\n" + selected_node.name);
         }
         else{
           jQuery("#modal-text").append("<p>Please Select valid Entity</p>");
        }
    }
    else if (keywordCategory == 2)
    { 
          var textType = jQuery("#type-options option:selected").text();
          var valueType = jQuery("#type-options option:selected").val();
          var valueDomain = jQuery("#domain-options option:selected").val();
          if (textType!= "Select Type...")
          {
            selected_node.name = textType;
            selected_node.nodeID = valueType;
            selected_node.type = valueType;
            selected_node.domain = valueDomain;
            console.log(valueType + "\n" + selected_node.name);
         }    
     }*/
     restart();
}


// app starts here
svg.on('mousedown', mousedown)
    .on('mousemove', function(){
      if(!mousedown_node) return;
        // update drag line

        //drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
        drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'A' + 0 + ',' + 0  + ' 0 0,1 ' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);
        restart();
    })
    .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);


restart();





