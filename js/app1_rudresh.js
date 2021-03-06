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
var urlFull = "idir.uta.edu";
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
var defaultNodeColor = "#FF6600", selectedNodeColor = "#FFCC99", nodeclick = false, selectedlinkColor = "red", allowNodeCreation = true, newNode = false, newEdge = false;
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
var exampleActualSourceType;
var exampleActualTargetType;
var response = []; // Example Query Response
var checkMove_x = 0;
var checkMove_y = 0;
var hideDragLineFlag = false;
var addEdgeButtonEdgeAdded = false;
var waitForJsonResultFlag = 0;
var windowSize = 100;
var nodeEditList = [];
var nodeEditEdges = [];
var nodeEditWindowNo = 0;
var nodeToBeEdited;
var editNodeKeyword;
var editList = [];
var selectNodeModalClosed = false;
var mouseOverFlag = false;
var mouseOverEdgeFlag = false;
var showInstructionsFlag = 0;
var refreshSelectedNode = 0;
var usefulTipsFlag = 0;
var settingsFlag = 0;
var edgeTypesFlag = 0;
var clearButtonFlag = 0;
var no_Of_Iterations = 0;
var timeInitialisationFlag = 0;
jQuery("#lower-div-2").height(temp-296);
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
  getRequest("https://" + urlFull + "/viiq_app/greeting", domain);
  // Initial GET request to get all Entity suggestions.
  getAllEntities(entities);
  getAllTypes(types);


  jQuery("#wrap1").toggleClass('active');
  jQuery("#possible-actions").toggleClass('active');

  jQuery("#wrap2").toggleClass('active');
  jQuery("#useful-tips").toggleClass('active');
  usefulTipsFlag = 1;


});

/*
Function for the 'x' button of the options pane. It deletes the node or the edge, if the 'x' is clicked instead of the 'save' button.
*/
jQuery("#x-button").click(function(){

  if (selected_node) {
    nodes.splice(nodes.indexOf(selected_node), 1);
    jQuery("#show-instructions").attr("disabled", false);
    var graphDisconnect = checkConnected(nodes, links);
    if (graphDisconnect == true || nodes.length == 0){
        jQuery("#button-g").hide();
    }else{
        jQuery("#button-g").show();
    }
    selectNodeModalClosed = true;
    animatedHelp();
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


jQuery("#node-edit-x-button").click(function(){
      jQuery("#node-edit-border").hide();
      jQuery("#node-edit-entity").hide();
      jQuery("#node-edit-entity-search").hide();
      jQuery("#node-edit-type").hide();
      nodeToBeEdited = null;
      checkKeywordStatus();
      restart();
});


jQuery("#useful-tips-hide").click(function(){
  if (usefulTipsFlag == 1){
     usefulTipsFlag = 0;
     jQuery("#useful-tips-list").hide();
  }
  else
  {
     usefulTipsFlag = 1;
     jQuery("#useful-tips-list").show();
  }
});


jQuery('#suggestion-options').change(function() {
      noOfSuggestions = jQuery("#suggestion-options option:selected").val();
});

jQuery("#node-edit-selectDiv").click(function(){
   jQuery("#node-edit-entity-options").attr('size', 1);
});


jQuery("#Add-Edge-button").click(function(){
    if (addEdgeButtonEdgeAdded == false){
        addEdgeButtonEdgeAdded = true;
        var newNode = {id: ++lastNodeId, name: exampleTarget.name, flag : 2, greyflag: 1,  nodeID: exampleTarget.nodeID, tempName: exampleTarget.name};
	var link = {source: exampleSource, target: newNode, value: exampleLinkValue, id: ++lastEdgeID, flag: 2 , linkID:exampleLinkId, linkNum: 1, actualSourceType: exampleActualSourceType, actualTargetType: exampleActualTargetType};
        nodes.push(newNode);
	links.push(link);
        var newNode = {id: ++lastNodeId, name: exampleSource.name, flag : 2, greyflag: 1,  nodeID: exampleSource.nodeID, tempName: exampleSource.name};
	var link = {source: newNode, target: exampleTarget, value: exampleLinkValue, id: ++lastEdgeID, flag: 2 , linkID:exampleLinkId, linkNum: 1, actualSourceType: exampleActualSourceType, actualTargetType: exampleActualTargetType};
        nodes.push(newNode);
	links.push(link);
        suggestions = true;
	suggestionPicked = false;
        jQuery("#button-g").hide();
        animatedHelp();
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
 if (showInstructionsFlag == 0){
  showInstructionsFlag = 1;
  if (newNode && newEdge==false) {
    nodeNameText(selected_node, 1);
  }else if(newNode==false && newEdge==false){
    nodeNameText(selected_node, 2);
  }else{
    nodeNameText(selected_node, 3);
  }
}
else{
   jQuery("#modal-text").empty();
   showInstructionsFlag = 0;
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
                  .attr("width", 200)
                  .attr("height", 45)
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
                    .attr("width", 175)
                    .attr("height", 38)
                    .attr("border-radius", "20px")
                    .attr('fill', "#00B8B8")
                    .on('click', function(){
                      nextButtonClick = true;
                    });

var refresh = buttonG.append('text')
                 .text('Refresh Suggestions').attr("y", 35).attr("x",32)
                  .attr("font-family", "Segoe UI")
                  .attr("font-size", "18px")
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
    .linkDistance(300)
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
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "#E6EBFA")
    .style("border-radius" , "8px")
    .style("font-weight" , "bold")
    .style("font-family" , "Segoe UI")
    .style("opacity", "0.9")
    .style("border-width", "3px")
    .style("padding", "8px")
    .style("border-color", "#B2C2F0")
    .style("border-style", "ridge")
    .text("a simple tooltip");

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
  if (links[i].flag == 2 && links[i].source.flag == 1 && links[i].source.greyflag == 0 && links[i].target.flag == 1 && links[i].target.greyflag == 0  && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke', 'black');
  }
  else if ((links[i].flag == 2 && links[i].source.flag == 2 && links[i].source.greyflag == 1 && links[i].target.flag == 1 && links[i].target.greyflag == 0) || (links[i].flag == 2 && links[i].target.flag == 2 && links[i].target.greyflag == 1 && links[i].source.flag == 1 && links[i].source.greyflag == 0 && links[i].source != links[i].target)){
       jQuery("#linkId_"+links[i].id).css('stroke', '#9E9E9E');
  }
  else if ((links[i].flag == 2 && links[i].source.flag == 1 && links[i].source.greyflag == 2 && links[i].target.flag == 1 && links[i].target.greyflag == 0) || (links[i].flag == 2 && links[i].target.flag == 1 && links[i].target.greyflag == 2 && links[i].source.flag == 1 && links[i].source.greyflag == 0 && links[i].source != links[i].target)){
       jQuery("#linkId_"+links[i].id).css('stroke', '#9E9E9E');
  }
  else if ((links[i].flag == 3 || links[i].flag == 4) && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','6px');
  }
  else if (links[i].flag == 10 && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','3px');
       jQuery("#linkId_"+links[i].id).css('stroke', '#96FEFB');
  }
  else if (links[i].flag == 9 && links[i].source != links[i].target){
       jQuery("#linkId_"+links[i].id).css('stroke-width','3px');
       jQuery("#linkId_"+links[i].id).css('stroke', '#D0D0D0');
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
          if ((d.flag == 2 && d.source.flag == 2 && d.source.greyflag == 1 && d.target.flag == 1 && d.target.greyflag == 0) || (d.flag == 2 && d.target.flag == 2 && d.target.greyflag == 1 && d.source.flag == 1 && d.source.greyflag == 0))
                return "#9E9E9E";
          else if (d.flag == 3)
                return "#B0B0B0";
          else if (d.flag == 4)
                return "#2EFEF7";
          else if (d.flag == 10)
                return "#96FEFB";
          else if (d.flag == 9)
                return "#D0D0D0";
          else
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
           restart();

           if (selected_link) {
               partialGraph.length = 0;
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
                   topk: noOfSuggestions,
                   refreshGraphNode: 0
                };
                // postRequest(data, linkTypes, returnObject);
                var edgeMode = 3;
                postRequest(data, edgeMode);
             };
        });



  // remove old links
  // path.exit().remove();



  linkText.data(force.links())
          .enter().append("g").attr("class", "linklabelholder")
          .attr("id", function(d,i) { return "linkLabelHolderId_" + d.id;})
         .append("text")
         .attr("class", "linklabel")
         .style("font-size", "18px")
         .attr('x', "35")
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
                           if (greyLinkPickdPerSubSuggestion == 1 && SugPickdPerGreyLinkCount == 0){
                               displayFlag = 1;
                           }
                           animatedHelp();
                         }
                         else if (d.flag == 4){
                            links[k].flag = 3;
                            selected_link.flag = 3;
                            greyLinkSuggestionsPicked--;
                            greyLinkPickdPerSubSuggestion--;
                            animatedHelp();
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
                    animatedHelp();
                    exampleActualSourceType = null;
                    exampleActualTargetType = null;
                    addEdgeButtonEdgeAdded = false;
                    jQuery("#Add-Edge-button").hide();
                    jQuery("#example-text").show();
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
                           if (greyLinkPickdPerSubSuggestion == 1 && SugPickdPerGreyLinkCount == 0){
                               displayFlag = 1;
                           }
                            animatedHelp();
                         }
                         else if (d.flag == 4){
                             links[k].flag = 3;
                             selected_link.flag = 3;
                             greyLinkSuggestionsPicked--;
                             greyLinkPickdPerSubSuggestion--;
                             animatedHelp();
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
                         animatedHelp();
                         exampleActualSourceType = null;
                         exampleActualTargetType = null;
                         addEdgeButtonEdgeAdded = false;
                         jQuery("#Add-Edge-button").hide();
                         jQuery("#example-text").show();
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
                    animatedHelp();
                    exampleActualSourceType = null;
                    exampleActualTargetType = null;
                    addEdgeButtonEdgeAdded = false;
                    jQuery("#example-text").show();
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
        })
        .on("mousemove", function(d){
            if (mouseOverEdgeFlag == true){}
         })
	.on("mouseout", function(d){
            if (mouseOverEdgeFlag == true){
                mouseOverEdgeFlag = false;
                jQuery("#linkId_"+d.id).css('stroke','#9E9E9E');
            }
         })
         .on('mouseover', function(d){
            this.style.cursor='pointer';
            if (subSuggestionsInProgressFlag != true){
                var i = 0;
                var found = 0;
                if (addEdgeButtonEdgeAdded == true){
                     mouseOverEdgeFlag = false;
                }
                else{
                    if((d.source.greyflag == 2 && d.source.flag == 1) || (d.target.greyflag == 2 && d.target.flag == 1)){
                        mouseOverEdgeFlag = false;
                    }
                    else
                    {
                        for (i = 0; i < allReturnObject.length; i++)
                        {
                            var entry = allReturnObject[i];
                            if (d.linkID == entry.edge.split('|')[0] && (d.source.greyflag != 0 || d.target.greyflag != 0))
                            {
                                found++;
                                if (found > 1){
                                     mouseOverEdgeFlag = true;
                                     jQuery("#linkId_"+d.id).css('stroke','red');
                                     break;
                               };
                            }
                        }
                    }
                }
            }
        });


  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    // .style('fill', function(d) { return (d === selected_node) ? d.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
    .style('fill', function(d) {
      return ((d.flag == 10 && d.greyflag == 10) ? "#96FEFB" : (d.flag == 9 && d.greyflag == 9) ? "#D0D0D0" :(exampleReverseRoleFlag == true && d === exampleTarget) ? "#5bfe29" :(exampleReverseRoleFlag == true && d === exampleSource) ? "#FF6699" : (d.flag == 1 && d == selected_node && d.greyflag == 0)? "#33CCFF" : (d.flag == 1 && d.greyflag == 2)? "#2EFEF7" : (d.flag == 2 && d.greyflag == 1) ? "#EFEFEF" : d3.rgb(defaultNodeColor))

      // return (d == selected_node && d.flag == 1) ? "None": (d.flag == 2)? "#EFEFEF": "None";
    })
    .style('stroke', function(d){ if (d.flag == 10 && d.greyflag == 10) {return "#96FEFB"} else if (d.flag == 9 && d.greyflag == 9) {return "#D0D0D0"} else {return 'black'}
    })
    .classed('reflexive', function(d) { return d.reflexive; });


   circle.selectAll('text')
        .style("fill",function(d) {
             if ((d.flag == 9 && d.greyflag == 9) || (d.flag == 10 && d.greyflag == 10)) {return "#AAAAAA"} else { return "#000000"}
      })
      .style("font-family", "Segoe UI")
      .style("font-weight", function(d) {
            if (d.greyflag == 0){
                return "bold";}
            else
                return "normal";
      })
      .style("font-size", function(d) {
          var validCondition = false;
          var count = 0;
          var previousLinkType;
          for (var v = 0; v < links.length; v++)
          {
              if(links[v].source === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].source.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualSourceType == previousLinkType){
                         count--;}
                  }
                  previousLinkType = links[v].actualSourceType;
              }
              else if (links[v].target === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].target.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualTargetType == previousLinkType){
                         count--;}
                  }
                  previousLinkType =links[v].actualTargetType;
              }
              if (count >= 2){
                  validCondition = true;
                  break;
              }
          }
          if (validCondition == true){
             return "25px";
          }
          else {
             return "15px";
          }
      })
      .text(function(d) {
          var validCondition = false;
          var count = 0;
          var previousLinkType;
          for (var v = 0; v < links.length; v++)
          {
              if(links[v].source === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].source.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualSourceType == previousLinkType){
                         count--;}
                  }
                  previousLinkType = links[v].actualSourceType;
              }
              else if (links[v].target === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].target.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualTargetType == previousLinkType){
                         count--;}
                  }
                  previousLinkType =links[v].actualTargetType;
              }
              if (count >= 2){
                  validCondition = true;
                  break;
              }
          }
          if (validCondition == true){
             d.name = "?";
          } else {
             d.name = d.tempName;
          }
	  if(d.entity == -1) {
		d.name = (d.name).toUpperCase();
	  }
             return d.name;
      });

  // add new nodes
  var g1 = circle
           .on("mousemove", function(){
                    if (mouseOverFlag == true){
                    return tooltip.style("top", (event.pageY-20)+"px").style("left",(event.pageX+20)+"px");}
           })
	   .on("mouseout", function(){
                    if (mouseOverFlag == true){
                       mouseOverFlag = false;
                       return tooltip.style("visibility", "hidden");}
           })
           .on('mouseover', function(d){
             this.style.cursor='pointer';
             if (d.greyflag == 0 && d.flag == 1){
               var resultData = [];
               var nodeMouseOver = d;
               var nodeEdgesMouseOver;
               var count = 0;
               var totalCount = 0;
               for(var k = 0; k < links.length; k++){
                   if (links[k].source != links[k].target && links[k].source === nodeMouseOver && links[k].target.greyflag == 0 && links[k].target.flag == 1 && links[k].flag == 2 && nodeMouseOver.entity == -1){

                        if (count == 0){
                             count++;
                             totalCount++;
                             nodeEdgesMouseOver = links[k].linkID+","+"0";
                        }
                        else {
                             nodeEdgesMouseOver = nodeEdgesMouseOver +"|"+links[k].linkID +","+"0";
                             totalCount++;
                        }
                   }
                   else if (links[k].source != links[k].target && links[k].target === nodeMouseOver && links[k].source.greyflag == 0 && links[k].source.flag == 1 && links[k].flag == 2 && nodeMouseOver.entity == -1){
                        if (count == 0){
                             count++;
                             nodeEdgesMouseOver = links[k].linkID+","+"1";
                             totalCount++;
                        }
                        else {
                             nodeEdgesMouseOver = nodeEdgesMouseOver +"|"+links[k].linkID +","+"1";
                             totalCount++;
                        }
                   }

               }
               if (totalCount > 1){
                   setMouseOverFlagOfIndex();
                   resultData.length = 0;
                   getRequest("https://" + urlFull + "/viiq_app/getnodetypevalues?node="+nodeMouseOver.nodeID+"&edges="+nodeEdgesMouseOver, resultData);
                   reSetMouseOverFlagOfIndex();
                   if (resultData.length > 1){
                      mouseOverFlag = true;
                      tooltip.style("visibility", "visible");
                      var tooltipString;
                      for(var t = 0; t < resultData.length; t++){
                           if (t == 0){
                               tooltipString = resultData[t][1];}
                           else{
                               tooltipString = tooltipString + ", " + resultData[t][1];
                           }
                      }
                      tooltip.text(tooltipString);
                   }
                }
             }
            }).enter().append('svg:g').attr('class','conceptG')
                .call(drag);

  g1.append('svg:circle')
    // .attr('class', 'node')
    .attr('r', 30)
    .style('fill', function(d) {
      // return (d == selected_node && d.flag == 1) ? d3.rgb(defaultNodeColor).brighter(): (d.flag == 2)? "#EFEFEF": d3.rgb(defaultNodeColor)
      // return (d == selected_node && d.flag == 1) ? d3.rgb(defaultNodeColor).brighter(): (d.flag == 2)? "#EFEFEF": "None";
      return ((d.flag == 10 && d.greyflag == 10) ? "#96FEFB" :(d.flag == 9 && d.greyflag == 9) ? "#D0D0D0" :(exampleReverseRoleFlag == true && d === exampleTarget) ? "#5bfe29" :(exampleReverseRoleFlag == true && d === exampleSource) ? "#FF6699" : (d == selected_node && d.flag == 1 && d.greyflag == 0) ? "#33CCFF": (d.flag == 1 && d.greyflag == 2)? "#2EFEF7" : (d.flag == 2 && d.greyflag == 1) ? "#EFEFEF": d3.rgb(defaultNodeColor))
    })
    .style('stroke', function(d){ if (d.flag == 10 && d.greyflag == 10) {return "#96FEFB"} else if (d.flag == 9 && d.greyflag == 9) {return "#D0D0D0"} else {return 'black'}
    })
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('dblclick', function(d){
         var dblClickValid = true;
         if (exampleReverseRoleFlag == true){
              dblClickValid = false;
         }
         else {
             for(var x = 0; x < links.length; x++){
                 if (links[x].source != links[x].target && ((links[x].source.greyflag != 0 || links[x].target.greyflag != 0) || (links[x].flag == 3 || links[x].flag == 4))){
                     dblClickValid = false;
                     break;
                 }
             }
         }
         if (dblClickValid == true){
             nodeToBeEdited = d;
             editNodeKeyword = "";
             nodeEditList.length = 0;
             nodeEditEdges.length = 0;
             nodeEditWindowNo = 0;
             var count = 0;
             for(var k = 0; k < links.length; k++){
                 if (links[k].source != links[k].target && links[k].source === nodeToBeEdited){
                      if (count == 0){
                           count++;
                           nodeEditEdges = links[k].linkID+","+"0";
                      }
                      else {
                           nodeEditEdges = nodeEditEdges+"|"+links[k].linkID +","+"0";
                      }
                 }
                 else if (links[k].source != links[k].target && links[k].target === nodeToBeEdited){
                      if (count == 0){
                           count++;
                           nodeEditEdges = links[k].linkID+","+"1";
                      }
                      else {
                           nodeEditEdges = nodeEditEdges+"|"+links[k].linkID +","+"1";
                      }
                 }

             }
             getRequestWithLoader("https://" + urlFull + "/viiq_app/geteditnode?node="+nodeToBeEdited.nodeID+"&windownum="+0+"&windowsize="+windowSize+"&edges="+nodeEditEdges+"&keyword="+editNodeKeyword);
         }
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
                       SugPickdPerGreyLinkCount--;
                       animatedHelp();
                       }
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
                       SugPickdPerGreyLinkCount--;
                       animatedHelp();
                       }
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
                       if (noOfSuggestionsPicked == 0 || noOfSuggestionsPicked == 1){
                               displayFlag = 1;
                       }
		       if (subSuggestionsInProgressFlag == true){
		       	  SugPickdPerGreyLinkCount++;
                            if (SugPickdPerGreyLinkCount == 1 && greyLinkPickdPerSubSuggestion == 0 && noOfSuggestionsPicked > 1){
                               displayFlag = 1;
                            }
                         // animatedHelp();
                          }
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
               if (noOfSuggestionsPicked == 0 || noOfSuggestionsPicked == 1){
                  displayFlag = 1;
               }
               if (subSuggestionsInProgressFlag == true){
                   SugPickdPerGreyLinkCount++; //animatedHelp();
                            if (SugPickdPerGreyLinkCount == 1 && greyLinkPickdPerSubSuggestion == 0 && noOfSuggestionsPicked > 1){
                               displayFlag = 1;
                            }
               }
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
                        animatedHelp();
                        exampleActualSourceType = null;
                        exampleActualTargetType = null;
                        addEdgeButtonEdgeAdded = false;
                        jQuery("#Add-Edge-button").hide();
                        jQuery("#example-text").show();
                        jQuery("#active-examples").empty();
                        jQuery("#Reverse-button").hide();
                   }
                   // unenlarge target node
                 //  d3.select(this).attr('transform', '');

                   // add link to graph (update if exists)
                   // NB: links are strictly source < target; arrows separately specified by booleans
                   var source, target, direction;

                   source = mousedown_node;
                   target = mouseup_node;
                   {
                       ++lastEdgeID;
                       var actualSourceType;
                       var actualTargetType;
                       if (source.entity == -1){
                           actualSourceType = source.nodeID;
                       }
                       else{
                           actualSourceType = source.type;
                       }
                       if (target.entity == -1){
                           actualTargetType = target.nodeID;
                       }
                       else{
                           actualTargetType = target.type;
                       }

                       link = {source: source, target: target, value: "", id: lastEdgeID, linkNum: 1,  linkID : -1, flag: 2, actualSourceType: actualSourceType, actualTargetType: actualTargetType};
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
                         partialGraph.length = 0;
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
                               topk: noOfSuggestions,
                               refreshGraphNode: 0
                           };

                           // temp = postRequest(data, linkTypes, returnObject);
                           // linkTypes= temp[0];
                           // returnObject = temp[1];
                           var edgeMode2 = 4;
                           postRequest(data,edgeMode2);
               };
       });

  // show node IDs
  g1.append('svg:text')
      .attr("x", "0em")
      .attr("y", ".31em")
      //.style("font-size", "15px")
      .style("text-anchor", "middle")
      .style("fill",function(d) { if ((d.flag == 9 && d.greyflag == 9) || (d.flag == 10 && d.greyflag == 10)) {return "#AAAAAA"} else { return "#000000"}
      })
      .attr('class', 'id')
      .attr('id',function(d){return 'node'+d.id})
      .style("font-size", function(d) {
          var validCondition = false;
          var count = 0;
          var previousLinkType;
          for (var v = 0; v < links.length; v++)
          {

              if(links[v].source === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].source.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualSourceType == previousLinkType){
                         count--;}
                  }
                  previousLinkType = links[v].actualSourceType;
              }
              else if (links[v].target === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].target.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualTargetType == previousLinkType){
                         count--;}
                  }
                  previousLinkType =links[v].actualTargetType;
              }
              if (count >= 2){
                  validCondition = true;
                  break;
              }
          }
          if (validCondition == true){
             return "25px";
          }
          else {
             return "15px";
          }
      })
      .text(function(d) {
          var validCondition = false;
          var count = 0;
          var previousLinkType;
          for (var v = 0; v < links.length; v++)
          {
              if(links[v].source === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].source.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualSourceType == previousLinkType){
                         count--;}
                  }
                  previousLinkType = links[v].actualSourceType;
              }
              else if (links[v].target === d && links[v].target.greyflag == 0 && links[v].source.greyflag == 0 && links[v].source != links[v].target && links[v].flag == 2 && links[v].target.entity == -1){
                  count++;
                  if (count != 1){
                     if (links[v].actualTargetType == previousLinkType){
                         count--;}
                  }
                  previousLinkType =links[v].actualTargetType;
              }
              if (count >= 2){
                  validCondition = true;
                  break;
              }
          }
          if (validCondition == true){
             d.name = "?";
          } else {
             d.name = d.tempName;
          }
	  if(d.entity == -1) {
		d.name = (d.name).toUpperCase();
	  }
          return d.name;
      });


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
    animatedHelp();
    exampleSource = link.source;
    exampleLinkId = link.linkID;
    exampleLinkValue = link.value;
    exampleLinkGraphId = link.id;
    exampleTarget = link.target;
    exampleActualSourceType = link.actualSourceType;
    exampleActualTargetType = link.actualTargetType;
    var sourceNodeId = link.source.nodeID;
    var targetNodeId = link.target.nodeID;
    var edgeId = link.linkID;
    jQuery("#example-text").hide();
    setExamplesFlag();
    response.length = 0;
    getRequest("https://" + urlFull + "/viiq_app/getexamples?edge="+edgeId+"&source="+sourceNodeId+"&object="+targetNodeId, response);
    setExamplesFlag();
    animatedExamples();
    addEdgeButtonEdgeAdded = false;
    jQuery("#Add-Edge-button").show();
    if (response[0].isReversible == true){
           jQuery("#Reverse-button").show();}
    restart();
   if (edgeTypesFlag == 0){
      CheckOtherWraps();
      edgeTypesFlag = 1;
   }
   else{
      edgeTypesFlag = 0;
   }
   jQuery("#wrap4").toggleClass('active');

   jQuery("#edge-types").toggleClass('active');
}


function animatedExamples(){
    jQuery("#active-examples").empty();
    var typeSource;
    var typeObject;
    if (response[0].sourceType == null && response[0].objectType == null){
        typeSource = exampleSource.name;
        typeObject = exampleTarget.name;}
    else if (response[0].sourceType == null){
        typeSource = exampleSource.name;
        typeObject = response[0].objectType.split(',')[1];}
    else if (response[0].objectType == null){
        typeObject = exampleTarget.name;
        typeSource = response[0].sourceType.split(',')[1];}
    else{
    typeSource = response[0].sourceType.split(',')[1];
    typeObject = response[0].objectType.split(',')[1];}
    jQuery("#active-examples").append('<li class="li-animation" style="font-size: 15px; list-style-type:none;padding:0px; margin:0px"><span style="color:#E65C8A" id="sourceType"></span> <span style="color:#063145;"> &#8594 </span><span id="targetType" style="color:#00CC00;"></span></li>');
    var src = document.getElementById('sourceType');
    var tar = document.getElementById('targetType');
    if (response[0].sourceType == null){
        src.innerText = '('+typeSource+')';}
    else{
        src.innerText = '('+typeSource.toUpperCase()+')';}
    if (response[0].objectType == null){
        tar.innerText = '('+typeObject+')';}
    else {
        tar.innerText = '('+typeObject.toUpperCase()+')';}

    var textSource;
    var textTarget;
    for (var i = 0; i < response.length; i++)
    {
        for (var j = 0; j < response[i].examples.length; j++){
	   var srcid = "source"+j;
	   var tarid = "target"+j;
           var exmSource = response[i].examples[j].split(',')[0];
           var exmTarget = response[i].examples[j].split(',')[1];
           var listr = '<li class="li-animation" style="font-size: 19px; padding:0px; margin: 0px; list-style-type: none;"><span style="color:#E65C8A" id='+srcid+'></span> <span style="color:063145"> &#8594 </span><span id='+tarid+' style="color:#00CC00;"></span></li>';
           jQuery("#active-examples").append(listr);
           //jQuery("#source").empty();
           //jQuery("#target").empty();
           var textSource = document.getElementById(srcid);
           var textTarget = document.getElementById(tarid);
           textSource.innerText = exmSource;
           textTarget.innerText = exmTarget;
         }
     }

     jQuery("#active-examples").append('<li class="li-animation"><b>Click</b> on Add Edge button to add other instances of the selected edge, connected to the nodes at the two ends of the selected edge.</li>');
     jQuery("#active-examples").append('<li class="li-animation"><b>Click</b> on Reverse Role button (displayed only when applicable) to reverse the role of source and destination of the edge.</li>');
     jQuery("#active-examples").append('<li class="li-animation"><b>Close</b> this dialog box and press delete to remove the selected edge.</li>');

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
                  if (noOfSuggestionsPicked == 0 || noOfSuggestionsPicked == 1){
                      displayFlag = 1;
                  }
                  SugPickdPerGreyLinkCount++;
                            if (SugPickdPerGreyLinkCount == 1 && greyLinkPickdPerSubSuggestion == 0 && noOfSuggestionsPicked > 1){
                               displayFlag = 1;
                            }
                  animatedHelp();
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
             if (greyLinkSelected.linkID == entry.edge.split('|')[0]  && (greyLinkSelected.source.greyflag != 0 || greyLinkSelected.target.greyflag != 0))
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
                     if (noOfSuggestionsPicked == 0 || noOfSuggestionsPicked == 1){
                        displayFlag = 1;
                     }
                     suggestionPicked = true;
                     jQuery("#button-g").hide();
                  }
              }
           }
     }
     else
     {
         displayFlag = 1;
         animatedHelp();
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
                var actualSourceType = greyLinkSelected.actualSourceType;
                var actualTargetType = greyLinkSelected.actualTargetType;
                var entityValue;
               if ( greyLinkSelected.source.greyflag == 0){
                     entityValue = greyLinkSelected.target.entity;
                  }
                  else{
                      entityValue = greyLinkSelected.source.entity;
                             }
                greyLinkDetails.length = 0;
                var entry = {sourceNodeId: sourceNodeId, targetNodeId: targetNodeId, sourceName: sourceName, targetName: targetName, linkId: linkId, linkName: linkName, sourceGraphId: sourceGraphId, targetGraphId: targetGraphId, sourceGreyFlag: sourceGreyFlag, targetGreyFlag: targetGreyFlag, sourceId: srcId, targetId: trgId, actualSourceType: actualSourceType, actualTargetType: actualTargetType, entity: entityValue};
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
   var entityValue = 0;
   var entityVal;
if (greyLinkDetails[0].entity == -1){
    entityValue = -1;
    entityVal = -1;
}
   for(var i = 0; i < nodes.length && foundEntry == 0; i++)
   {
       if (nodes[i].greyflag != 1 && nodes[i].greyflag != 2 && nodes[i].greyflag != 9 && nodes[i].greyfalg != 10 ){
             if (nodes[i].id == linkEntry.graphSource && nodes[i].nodeID == linkEntry.source.split('|')[0] && linkEntry.graphObject == -1){
                        if (entityValue != -1){
                                     entityVal = linkEntry.object.split('|')[0];
                         }
                        var newNode = {id: ++lastNodeId, name: linkEntry.object.split('|')[1], flag : 2, greyflag: 1,  nodeID: linkEntry.object.split('|')[0], tempName: linkEntry.object.split('|')[1], entity: entityVal};
                        var link = {source: nodes[i], target: newNode, value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: linkEntry.edge.split('|')[0], linkNum: 1, actualSourceType: linkEntry.actualSourceType, actualTargetType: linkEntry.actualObjectType};
                        nodes.push(newNode);
                        links.push(link);
                        foundEntry = 1;
             }
             else if (nodes[i].id == linkEntry.graphObject && nodes[i].nodeID == linkEntry.object.split('|')[0] && linkEntry.graphSource == -1){
                        if (entityValue != -1){
                                     entityVal = linkEntry.object.split('|')[0];
                         }
                        var newNode = {id: ++lastNodeId, name: linkEntry.source.split('|')[1], flag : 2, greyflag: 1,  nodeID: linkEntry.source.split('|')[0], tempName: linkEntry.source.split('|')[1], entity: entityVal};
                        var link = {source: newNode, target: nodes[i], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: linkEntry.edge.split('|')[0], linkNum: 1, actualSourceType: linkEntry.actualSourceType, actualTargetType: linkEntry.actualObjectType};
                        nodes.push(newNode);
                        links.push(link);
                        foundEntry = 1;
             }
             else if (nodes[i].id == linkEntry.graphSource && linkEntry.graphObject != -1)
             {
                 for (var j = 0; j < nodes.length && foundEntry == 0; j++){
                     if (nodes[j].id == linkEntry.graphObject){
                        var link = {source: nodes[i], target: nodes[j], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 3 , linkID: linkEntry.edge.split('|')[0], linkNum: 1, actualSourceType: linkEntry.actualSourceType, actualTargetType: linkEntry.actualObjectType};
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
                        var link = {source: nodes[j], target: nodes[i], value: linkEntry.edge.split('|')[1], id: ++lastEdgeID, flag: 3 , linkID: linkEntry.edge.split('|')[0], linkNum: 1, actualSourceType: linkEntry.actualSourceType, actualTargetType: linkEntry.actualObjectType};
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
    selected_node.tempName = text;
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
    selected_node.tempName = text;
    selected_node.nodeID = value;
}


jQuery('#type-options').change(function() {
    var text = jQuery("#type-options option:selected").text();
    var value = jQuery("#type-options option:selected").val();
    var text2 = jQuery("#domain-options option:Selected").text();
    // if (selected_node.name == "select Name")
    selected_node.name = text;
    selected_node.tempName = text;
    selected_node.nodeID = value;
    selected_node.type = value;
    var ele = document.getElementById('type-selected');
    ele.size = text.length;
    if (text.length > 50)
    { ele.size = 50;}
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
        selected_node.tempName = text;
        selected_node.nodeID = value;
        selected_node.entity = value;
        console.log(value + "\n" + selected_node.name);
    var ele = document.getElementById('entity-selected');
    ele.size = text.length;
    if (text.length > 50)
    { ele.size = 50;}
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
  jQuery("#wrap5").toggleClass('active');
  if (clearButtonFlag == 1){
     clearButtonFlag = 0;}
  else{
     clearButtonFlag = 1;
  }
  if (usefulTipsFlag == 1){
       jQuery("#wrap2").toggleClass('active');
       jQuery("#useful-tips").toggleClass('active');
       usefulTipsFlag = 0;
  }
  if (settingsFlag == 1){
       jQuery("#wrap3").toggleClass('active');
       jQuery("#settings").toggleClass('active');
       settingsFlag = 0;
  }
  if (edgeTypesFlag == 1){
       jQuery("#wrap4").toggleClass('active');
       jQuery("#edge-types").toggleClass('active');
       edgeTypesFlag = 0;
  }
});



jQuery("#cancel-clear").click(function(){
  jQuery("#wrap5").toggleClass('active');
  clearButtonFlag = 0
});

jQuery("#clear-graph").click(function(){
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
  jQuery("#useful-tips-list").show();
  jQuery("#modal-text").empty();
  showInstructionsFlag = 0;
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
  exampleActualSourceType = null;
  exampleActualTargetType = null;
  addEdgeButtonEdgeAdded = false;
  exampleSource = null;
  exampleTarget = null;
  exampleLinkId = -1;
  exampleLinkGraphId = -1;
  jQuery("#active-examples").empty();
  jQuery("#button-g").hide();
  jQuery("#example-text").show();
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
  jQuery("#wrap5").toggleClass('active');
  clearButtonFlag = 0
  animatedHelp();
});


function mousedown() {
   if (clearButtonFlag == 1 || usefulTipsFlag == 1 || settingsFlag == 1 || edgeTypesFlag == 1){
      if (usefulTipsFlag == 1){
          usefulTipsFlag = 0;
          if(timeInitialisationFlag == 0){
          startDateVar = new Date();
          startTimeVar = startDateVar.getTime();
          if (partialGraph.length<=0 && rejectedGraph.length<=0){
           document.getElementById('entry_914362311').value = startTimeVar;
          }
            timeInitialisationFlag = 1;
        }
          jQuery("#wrap2").toggleClass('active');
          jQuery("#useful-tips").toggleClass('active');
      }
      if (clearButtonFlag == 1){
          clearButtonFlag = 0;
          jQuery("#wrap5").toggleClass('active');
      }
      if (settingsFlag == 1){
          settingsFlag = 0;
          jQuery("#wrap3").toggleClass('active');
          jQuery("#settings").toggleClass('active');
      }
      if (edgeTypesFlag == 1){
          edgeTypesFlag = 0;
          jQuery("#wrap4").toggleClass('active');
          jQuery("#edge-types").toggleClass('active');

          if (exampleReverseRoleFlag == true && addEdgeButtonEdgeAdded == false){
             jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black');
             exampleSource = null;
             exampleTarget = null;
             exampleLinkId = -1;
             exampleLinkGraphId = -1;
             exampleReverseRoleFlag = false;
             animatedHelp();
             ExampleActualSourceType = null;
             exampleActualTargetType = null;
             addEdgeButtonEdgeAdded = false;
             jQuery("#example-text").show();
             jQuery("#Add-Edge-button").hide();
             jQuery("#active-examples").empty();
             jQuery("#Reverse-button").hide();
             restart();
          }
      }
  }
  else{
  // prevent I-bar on drag
  //d3.event.preventDefault();

  // because :active only works in WebKit?
  svg.classed('active', true);
  if(timeInitialisationFlag == 0){
  startDateVar = new Date();
  startTimeVar = startDateVar.getTime();
  if (partialGraph.length<=0 && rejectedGraph.length<=0){
   document.getElementById('entry_914362311').value = startTimeVar;
  }
    timeInitialisationFlag = 1;
}
  if (nextButtonClick) {
    var nextClickMode = 1;
    nextClick(nextClickMode);
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
      /* if (((noOfSuggestionsPicked > 1) && SugPickdPerGreyLinkCount == 0)|| SugPickdPerGreyLinkCount == 1){
            DisplayAnimatedHelp();
       }*/
       SugPickdPerGreyLinkCount = 0;
       greyLinkPickdPerSubSuggestion = 0;
       subSuggestionsInProgressFlag = false;
       animatedHelp();
       greyLinkSelectedFlag = 0;
       greyLinkSelected = null;
       greyLinkDetails.length = 0;
       restart();
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
          restart();
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
             animatedHelp();
             ExampleActualSourceType = null;
             exampleActualTargetType = null;
             addEdgeButtonEdgeAdded = false;
             jQuery("#example-text").show();
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
             var mouseDownMode = 2;
             addSuggestions(0, mouseDownMode);
         };
      }

    }
 }
  // animatedHelp();
 }

}


function addGreyLinkSelectedAgain(){

     for (var j = 0; j < nodes.length; j++)
     {
         if (nodes[j].nodeID == greyLinkDetails[0].sourceNodeId && greyLinkDetails[0].sourceGreyFlag == 0 && nodes[j].id == greyLinkDetails[0].sourceGraphId && nodes[j].greyflag == 0)
         {
                var newNode = {id: ++lastNodeId, name: greyLinkDetails[0].targetName, flag : 2, greyflag: 1,  nodeID: greyLinkDetails[0].targetNodeId, tempName: greyLinkDetails[0].targetName, entity: greyLinkDetails[0].entity};
                var link = {source: nodes[j], target: newNode, value: greyLinkDetails[0].linkName, id: ++lastEdgeID, flag: 2 , linkID: greyLinkDetails[0].linkId, linkNum: 1, actualSourceType: greyLinkDetails[0].actualSourceType, actualTargetType: greyLinkDetails[0].actualTargetType};
                nodes.push(newNode);
                links.push(link);

         }
         else if (nodes[j].nodeID == greyLinkDetails[0].targetNodeId && greyLinkDetails[0].targetGreyFlag == 0 && nodes[j].id == greyLinkDetails[0].targetGraphId && nodes[j].greyflag == 0)
         {
                var newNode = {id: ++lastNodeId, name: greyLinkDetails[0].sourceName, flag : 2, greyflag: 1,  nodeID: greyLinkDetails[0].sourceNodeId, tempName: greyLinkDetails[0].sourceName, entity: greyLinkDetails[0].entity};
                var link = {source: newNode, target: nodes[j], value: greyLinkDetails[0].linkName, id: ++lastEdgeID, flag: 2 , linkID: greyLinkDetails[0].linkId, linkNum: 1, actualSourceType: greyLinkDetails[0].actualSourceType, actualTargetType: greyLinkDetails[0].actualTargetType};
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
    node = {id: ++lastNodeId, reflexive: false, name: " ", flag: 1, greyflag: 0, nodeID: -1, domain:"", type:"", entity:"", tempName: " "};
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


function getNodeToBeEdited(){
    return nodeToBeEdited;
}

function getNodeEditEdges(){
    return nodeEditEdges;
}

function setNodeEditKeywordValue(search){
    editNodeKeyword = search;
}

function setWindowNoOfNodeEdit(windowNo){
    nodeEditWindowNo = windowNo;
}

function setPreviousNodeEditValues(){

    jQuery("#node-edit-entity-options").attr('size',1);
    jQuery("#node-edit-entity-options").empty();
    for (var i = 0; i < nodeEditList.length; i++) {
        jQuery("#node-edit-entity-options").append('<option value="'+nodeEditList[i][0]+'" id="add-value-1" >'+nodeEditList[i][1]+'</option>');
    };
    nodeEditWindowNo = 0;
    jQuery("#node-edit-entity-back").attr("disabled",true);
    jQuery("#node-edit-entity-next").attr("disabled",false);
    if (nodeEditList.length <= windowSize){
         jQuery("#node-edit-entity-next").attr("disabled",true);
    }
}


jQuery("#node-edit-entity-back").click(function(){
    event.stopPropagation();
    jQuery("#node-edit-entity-next").attr("disabled",false);
    // jQuery('#loading').modal('show');
    // setTimeout(function(){
    //   jQuery('#loading-indicator').show();
      nodeEditWindowNo--;
      editList.length = 0;
      getRequest("https://" + urlFull + "/viiq_app/geteditnode?node="+nodeToBeEdited.nodeID+"&windownum="+nodeEditWindowNo+"&windowsize="+windowSize+"&edges="+nodeEditEdges+"&keyword="+editNodeKeyword, editList);
      if(editList.length < 19){
          jQuery("#node-edit-entities-options").attr('size',editList.length);}
      else{
          jQuery("#node-edit-entity-options").attr('size',19);
      }
      if (editList.length <= windowSize){
         jQuery("#node-edit-entity-next").attr("disabled", true);}
      jQuery("#node-edit-entity-options").empty();
      for (var i = 0; i < editList.length; i++) {
          jQuery("#node-edit-entity-options").append('<option value="'+editList[i][0]+'" id="entity-value-1">'+editList[i][1]+'</option>');
    };
     if(nodeEditWindowNo == 0){
        jQuery("#node-edit-entity-back").attr("disabled",true);}
    //     jQuery('#loading-indicator').hide();
    //     jQuery('#loading').modal('hide');
    // },1000);



});


jQuery("#node-edit-entity-next").click(function(){
    event.stopPropagation();
    // jQuery('#loading').modal('show');
    // jQuery('#loading-indicator').show();
    // setTimeout(function(){
      nodeEditWindowNo++;
      if (nodeEditWindowNo != 0){
          jQuery("#node-edit-entity-back").attr("disabled",false);}
      editList.length = 0;
      getRequest("https://" + urlFull + "/viiq_app/geteditnode?node="+nodeToBeEdited.nodeID+"&windownum="+nodeEditWindowNo+"&windowsize="+windowSize+"&edges="+nodeEditEdges+"&keyword="+editNodeKeyword, editList);
      if(editList.length < 19){
          jQuery("#node-edit-entities-options").attr('size',editList.length);}
      else{
          jQuery("#node-edit-entity-options").attr('size',19);
      }
      if (editList.length <= windowSize){
         jQuery("#node-edit-entity-next").attr("disabled", true);}
      jQuery("#node-edit-entity-options").empty();
      for (var i = 0; i < editList.length; i++) {
          jQuery("#node-edit-entity-options").append('<option value="'+editList[i][0]+'" id="entity-value-1">'+editList[i][1]+'</option>');
      };
    //   jQuery('#loading-indicator').hide();
    //   jQuery('#loading').modal('hide');
    // },1000);

      });



jQuery("#node-edit-save-changes").click(function(){
    var text;
    var value;
    if (nodeToBeEdited.entity == -1){
        text = jQuery("#node-edit-entity-options option:selected").text();
        value = jQuery("#node-edit-entity-options option:selected").val();
	if (text != "Select Entity..." && text != ""){
            for(var k = 0; k < nodes.length; k++){
                if (nodeToBeEdited === nodes[k]){
		     nodes[k].entity = value;
		     nodes[k].nodeID = value;
		     nodes[k].name = text;
                     nodes[k].tempName = text;
		}
	    }
	 }
	 else{
             // Do not change the node details
        }
     }
     else{
         text = jQuery("#node-edit-type-options option:selected").text();
         value = jQuery("#node-edit-type-options option:selected").val();
         if (text != "Select Type..." && text != ""){
             for(var k = 0; k < nodes.length; k++){
                 if (nodeToBeEdited === nodes[k]){
                     nodes[k].entity = -1;
                     nodes[k].nodeID = value;
                     nodes[k].name = text;
                     nodes[k].tempName = text;
                 }
             }
          }
          else{
              // Do not change the node details
          }
      }
      jQuery("#node-edit-border").hide();
      jQuery("#node-edit-entity").hide();
      jQuery("#node-edit-entity-search").hide();
      jQuery("#node-edit-type").hide();
      jQuery("#nodeEditModal").modal('hide');
      nodeToBeEdited = null;
      checkKeywordStatus();
      restart();
});


function displayAllTheTypeOptions()
{    displayTypeOptions(types);
}

function displayAllTheEntityOptions()
{    displayEntityOptions(entities);
}

function mouseup() {
if (waitForJsonResultFlag == 0){
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
        for (var x = 0; x < links.length; x++){
             if (links[x].source === selected_node && (links[x].target.greyflag == 1 || links[x].target.greyflag == 2)){
                   nodes.splice(nodes.indexOf(links[x].target),1);
             }
             else if (links[x].target === selected_node && (links[x].source.greyflag == 1 || links[x].source.greyflag == 2)){
                   nodes.splice(nodes.indexOf(links[x].source),1);
             }
        }
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
        var graphDisconnect = checkConnected(nodes, links);
        if (graphDisconnect == true){
            jQuery("#button-g").hide();
        }else{
           jQuery("#button-g").show();
        }
      } 
      else if(selected_link) {
        jQuery("#edge"+selected_link.id.toString()).remove();
        jQuery("#linkId_"+selected_link.id.toString()).remove();
        jQuery("#linkLabelHolderId_"+selected_link.id.toString()).remove();
        selected_link.source = selected_link.target;
        if (edgeTypesFlag == 1){
          jQuery("#wrap4").toggleClass('active');
          jQuery("#edge-types").toggleClass('active');
          edgeTypesFlag = 0;
        }
        if (exampleReverseRoleFlag == true){
           exampleSource = null;
           exampleTarget = null;
           exampleLinkId = -1;
           exampleLinkGraphId = -1;
           exampleReverseRoleFlag = false;
           exampleActualSourceType = null;
           exampleActualTargetType = null;
           addEdgeButtonEdgeAdded = false;
           jQuery("#Add-Edge-button").hide();
           jQuery("#example-text").show();
           jQuery("#active-examples").empty();
           jQuery("#Reverse-button").hide();
        }
        // links.splice(links.indexOf(selected_link), 1);
        var graphDisconnect = checkConnected(nodes, links);
        if (graphDisconnect == true){
            jQuery("#button-g").hide();
        }else{
           jQuery("#button-g").show();
        }
      }
      selected_link = null;
      selected_node = null;
      animatedHelp();
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

function nextClick(mode){
  if (exampleReverseRoleFlag == true){
     jQuery("#linkId_"+exampleLinkGraphId).css('stroke', 'black');
     exampleSource = null;
     exampleTarget = null;
     exampleLinkId = -1;
     exampleLinkGraphId = -1;
     exampleReverseRoleFlag = false;
     animatedHelp();
     exampleActualSourceType = null;
     exampleActualTargetType = null;
     addEdgeButtonEdgeAdded = false;
     jQuery("#example-text").show();
     jQuery("#Add-Edge-button").hide();
     jQuery("#active-examples").empty();
     jQuery("#Reverse-button").hide();
  }
  nextButtonClick = true;
  if (selected_node != null){
      if (selected_node.nodeID != -1){
          refreshSelectedNode = selected_node.id;
      }
      else {
          refreshSelectedNode = 0;
      }
  }
  else { refreshSelectedNode = 0;}
  removeTempNodes();
  nextButtonClick = false;
  restart();
  var singleNode = 0;
  if (nodes.length == 1){
      singleNode = 1;
  }
  addSuggestions(singleNode, mode);
}

function addSuggestions(singleNode, mode){

  var modeValue = 1;
  var refreshGraphNode = 0;
  if (mode == 1){
     if (refreshSelectedNode != 0){
          modeValue = 2;
     }
     refreshGraphNode = refreshSelectedNode;
  }
  jQuery("#button-g").show();
  if(singleNode == 1) {
	// The passive edge suggestion call made after the very first node is added. The value of edge and object node is -1 and 0
	// respectively.
	partialGraph[0] = {source: nodes[0].nodeID, graphSource: nodes[0].id, edge: -1, object: 0, graphObject: -1};
  }
  else {
    partialGraph.length = 0;
    for (var i = 0, j=0; i < links.length; i++) {
      if (links[i].linkID != -1 && (links[i].source != links[i].target)) {
        partialGraph[j] = {source: links[i].source.nodeID, graphSource: links[i].source.id, edge: links[i].linkID, object: links[i].target.nodeID, graphObject: links[i].target.id};
        j++;
      }
    };
  }

  var data = {
    partialGraph: partialGraph,
    mode: modeValue,
    rejectedGraph: rejectedGraph,
    dataGraphInUse: 0,
    topk: noOfSuggestions,
    refreshGraphNode: refreshGraphNode
  };
  refreshSelectedNode = 0;

  // if (suggestionCounter == 0) {
    postRequest(data, mode);
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
  jQuery("#wrap1").toggleClass('active');
  jQuery("#possible-actions").toggleClass('active');
  if (nodes.length == 0 && links.length == 0) {
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top:10px;"><b>Click</b> on the canvas to add a new node.</li>');
  }else if (checkConnected(nodes, links)) {
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Add</b> an edge between the newly added node and an existing node in the graph, by holding down the Shift key, clicking on one node and dragging the mouse pointer to the other.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Delete</b> the unconnected node.</li>');
  }else if(suggestions && !suggestionPicked && subSuggestionsInProgressFlag == false && exampleReverseRoleFlag == false){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on a grey node to add it and its incident edge to the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the grey edge to select it and its corresponding grey node, or display the other occurrences of the grey edge, if any.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to ignore the suggestions and add a new node.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on Refresh Suggestions to get new edge suggestions.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on an orange node, and then click on Refresh Suggestions to get new edge suggestions incident on the orange node.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas, close the new node dialog box, and click on a black edge to view its source and destination types.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas, close the new node dialog box, and double click on an orange node to edit its value.</li>');
  }else if(suggestions && suggestionPicked && subSuggestionsInProgressFlag == false && exampleReverseRoleFlag == false){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on other grey nodes to be included in the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the grey edge to select it, or click on a grey edge to display the other occurrences of the grey edgei, if any.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to add the selected nodes and edges to the query graph while ignoring the unselected grey nodes, and display new suggestions.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on selected nodes (in blue) to unselect them.</li>');
  }else if(suggestions && SugPickdPerGreyLinkCount == 0 && greyLinkPickdPerSubSuggestion == 0  && subSuggestionsInProgressFlag == true){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on a grey node to add it and its incident edge to the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on a grey edge to add it to the query graph, or on a grey node to add the node and its incident edge to the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to ignore the various unselected occurrences nodes and edges in grey, and go back to original set of suggestions.</li>');
  }else if(suggestions && (SugPickdPerGreyLinkCount > 0 || greyLinkPickdPerSubSuggestion > 0)  && subSuggestionsInProgressFlag == true){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on other grey nodes to be included in the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on a grey edge to add it to the query graph, or on a grey node to add the node and its incident edge to the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to display original unselected suggestions in grey and the selected suggestions in blue.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on selected nodes to unselect them. Click on selected edge (in blue) between two orange nodes to unselect it.</li>');
  }
  else if ((selectNodeModalClosed == true && !suggestions) || (!suggestions && exampleReverseRoleFlag == false && subSuggestionsInProgressFlag == false)){
    selectNodeModalClosed = false;
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Double</b> click on an orange node to edit its value.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on an edge to view its source type, object type.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on Refresh Suggestions to get new edge suggestions.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on an orange node, and then click on Refresh Suggestions to get new edge suggestions incident on the orange node.</li>');
  }
  else if (exampleReverseRoleFlag == true && !suggestions && addEdgeButtonEdgeAdded == false){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on Add Edge button to add other instances of the selected edge, connected to the nodes at the two ends of the selected edge.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on Reverse Role button to reverse the role of source and destination of the edge.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the selected edge to remove souce type and destination type of edge.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on Refresh Suggestions to remove source type and destination type of edge and display new suggestions.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on an orange node, and then click on Refresh Suggestions to remove source type and destination type of edge and display new suggestions incident on the selected orange node.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on empty canvas to remove source type and destination type of edge.</li>');
  }
  else if (suggestions && !suggestionPicked && exampleReverseRoleFlag == true && addEdgeButtonEdgeAdded == true){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on a grey node to add it and its incident edge to the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to ignore the automatic edge suggestions and add a new node.</li>');
  }
  else if (suggestions && suggestionPicked && exampleReverseRoleFlag == true && addEdgeButtonEdgeAdded == true){
    jQuery("#active-help").empty();
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on other grey nodes to be included in the query graph.</li>');
    jQuery("#active-help").append('<li class="li-animation" style="padding-top: 10px;"><b>Click</b> on the empty canvas to add the selected nodes and edges to the query graph while ignoring the unselected grey nodes, and display new suggestions.</li>');
  }
  jQuery('#active-help').each(function() {
    // jQuery(this).children().each(function(i) {
    //     jQuery(this).delay((i++) * 1500).animate({left:0, opacity:1});
    // });
    jQuery(this).children().animate({left:0, opacity:1});
  });
  jQuery("#wrap1").toggleClass('active');
  jQuery("#possible-actions").toggleClass('active');
}


function getGraphStringUserStudy(graph) {
   var str = "";
   var i=0;
   for(i=0; i<graph.length; i++) {
      str += graph[i].source + "," + graph[i].edge + "," + graph[i].object + ";";
   }
   return str;
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
   jsonstr += ",\"refreshGraphNode\":" + data.refreshGraphNode;
   jsonstr += "}";
   return jsonstr;
}




function getRequestWithLoader(URL){
     jQuery('#loading').modal('show');
     jQuery('#loading-indicator').show();
     var returnVar = [];
     var data;
     jQuery.ajax({
         type:"GET",
         beforeSend: function (request)
         {
              request.setRequestHeader("Content-type", "application/json");
         },
        url: URL,
        processData: false,
        dataType: "json",
        async:   true,
        success: function(data) {
                 for (var i = 0; i < data.length; i++) {
                     var temp = data[i].split(",");
                     nodeEditList[i] = temp;
                 };
                 processGetRequest();
        },
        error: function(){
            nodeEditList.length = 0;
            data = ["123|Select Name", "234|Domain1", "4345|Domain2", "141|domain3", "3455|Domain4", "2134|Domain5", "7575|Domain6", "7575s|Domain7", "73275|Domain8", "75115|Domain9"];
            for (var i = 0; i < data.length; i++) {
                var temp = data[i].split("|");
                nodeEditList[i] = temp;
            }
            processGetRequest();
        }
    });
}


function processGetRequest(){

    jQuery('#loading-indicator').hide();
    jQuery('#loading').modal('hide');
    jQuery("#nodeEditModal").modal('show');
    jQuery("#node-edit-border").show();
    jQuery("#node-edit-type-options").empty();
    jQuery("#node-edit-entity-options").empty();
    jQuery("#node-edit-entity-options").attr('size',1);
    if (nodeToBeEdited.entity == -1){
        for (var i = 0; i < nodeEditList.length; i++) {
            jQuery("#node-edit-entity-options").append('<option value="'+nodeEditList[i][0]+'" id="add-value-1" >'+nodeEditList[i][1]+'</option>');
        };
        jQuery("#node-edit-entity").show();
        jQuery("#node-edit-entity-search").show();
        jQuery("#node-edit-entity-back").attr("disabled",true);
        jQuery("#node-edit-entity-next").attr("disabled",false);
        if (nodeEditList.length <= windowSize){
            jQuery("#node-edit-entity-next").attr("disabled",true);
        }
        jQuery("#node-edit-type").hide();
    }
    else{
        for (var i = 0; i < nodeEditList.length; i++) {
            jQuery("#node-edit-type-options").append('<option value="'+nodeEditList[i][0]+'" id="add-value-1" >'+nodeEditList[i][1]+'</option>');
        };
        jQuery("#node-edit-type").show();
        jQuery("#node-edit-entity").hide();
        jQuery("#node-edit-entity-search").hide();
   }
}






function postRequest(data, mode){
        //if (mode != 4){
           jQuery('#loading').modal('show');
           jQuery('#loading-indicator').show();
        //}
        waitForJsonResultFlag = 1;
        no_Of_Iterations++;
        var jsonstr = myStringify(data);
        jQuery.ajax({
        type:"POST",
        beforeSend: function (request)
        {
            request.setRequestHeader("Content-type", "application/json");
            // request.setRequestHeader("Access-Control-Request-Method","POST");
            // request.setRequestHeader("Access-Control-Request-Headers","access-control-allow-origin, accept, content-type");
        },
        url: "https://" + urlFull + "/viiq_app/greeting",
        data: jsonstr,
        //data: JSON.stringify(data),
        async: true,
        processData: false,
        // dataType: "json",
	error: function(xhr, status, error) {
	var err = eval("(" + xhr.responseText + ")");
        processErrorPostRequest();
        // alert("No candidates");
        jQuery("#myModal3").modal("show");
        },
	success: function(msg) {
            linkTypes = [];
            linkTypes[0] = "0| Select Edge".split("|");
            for (var i = 0; i < msg.rankedUniqueEdges.length; i++) {
            linkTypes[i+1] = msg.rankedUniqueEdges[i].edge.split("|");
        };
        returnObject = msg.rankedUniqueEdges;
        allReturnObject = msg.rankedEdges;
        processSuccessPostRequest(mode);


      }
    });
    if (mode == 4){
      if(mousedown_node) {
      // hide drag line
         drag_line
            .classed('hidden', true)
            .style('marker-end', '');
      }
    }
}


function processSuccessPostRequest(mode){
   var errorFlag = 0;
   if (mode == 1 || mode == 2){
      var i = 0;
      for (i = 0; (i < noOfSuggestions) && (i < returnObject.length) ; i++) {
          var entry = returnObject[i];
          for (var j = 0; j < nodes.length; j++)
          {
              if (nodes[j].nodeID == entry.source.split('|')[0] && nodes[j].id == entry.graphSource){
                  var entityValue;
                  if (entry.isObjectType == true){
                      entityValue = -1;
                  }
                  else{
                      entityValue = entry.object.split('|')[0];
                  }
                  var newNode = {id: ++lastNodeId, name: entry.object.split('|')[1], flag : 2, greyflag: 1,  nodeID: entry.object.split('|')[0], entity: entityValue, tempName: entry.object.split('|')[1]};
                  var link = {source: nodes[j], target: newNode, value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2 , linkID: entry.edge.split('|')[0], linkNum: 1, actualSourceType: entry.actualSourceType, actualTargetType: entry.actualObjectType};
                  nodes.push(newNode);
                  links.push(link);
                  break;
              }else if (nodes[j].nodeID == entry.object.split('|')[0] && nodes[j].id == entry.graphObject){
                  var entityValue;
                  if (entry.isSourceType == true){
                      entityValue = -1;
                  }
                  else{
                      entityValue = entry.source.split('|')[0];
                  }
                  var newNode = {id: ++lastNodeId, reflexive: false, name: entry.source.split('|')[1], flag : 2, greyflag: 1, nodeID: entry.source.split('|')[0], entity: entityValue, tempName: entry.source.split('|')[1]};
                  nodes.push(newNode);
                  var link = {source: newNode, target: nodes[j], value: entry.edge.split('|')[1], id: ++lastEdgeID, flag: 2,linkID: entry.edge.split('|')[0], linkNum: 1, actualSourceType: entry.actualSourceType, actualTargetType: entry.actualObjectType};
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

      restart();
  }
  else if (mode == 3){
     if (linkTypes.length != 1){
         jQuery("#edge-options").empty();
         for (var i = 0; i < linkTypes.length; i++) {
             jQuery("#edge-options").append('<option value="'+linkTypes[i][0]+'" id="add-value-1" >'+linkTypes[i][1]+'</option>');
         };
     }
     else {
         errorFlag = 1;
     }

     restart();
  }
  else if (mode == 4){
       newEdge = true;
       restart();
       if (selected_link.flag != 2){
             jQuery("#linkId_"+d.id).css('stroke', '#2EFEF7');
       }
       else {
             //Orange removed// jQuery("#linkId_"+selected_link.id).css('stroke', 'orange');
       }
       if (linkTypes.length != 1) {
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
             errorFlag = 1;
             selected_link.source = selected_link.target;
         }
  }
  //if (mode != 4){
    jQuery('#loading-indicator').hide();
    jQuery('#loading').modal('hide');
  //}
  if ( mode != 4){
     displayFlag = 1;
  }
  waitForJsonResultFlag = 0;
  mouseup();
  if (errorFlag == 1){
      allowNodeDrag = true;
      translateAllowed = true;
      drawEdge = false;
      allowNodeCreation = false;
      //alert("The system was not able to find any suggestions for the edge.");
      jQuery("#myModal2").modal("show");
  }
}


function processErrorPostRequest()
{
  jQuery('#loading-indicator').hide();
  jQuery('#loading').modal('hide');
  waitForJsonResultFlag = 0;
  mouseup();
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




jQuery("#useful-tips-div").on('click', function(){
  if (usefulTipsFlag == 0){
      CheckOtherWraps();
      usefulTipsFlag = 1;
  }
  else{
      usefulTipsFlag = 0;
  }
  jQuery("#wrap2").toggleClass('active');

  jQuery("#useful-tips").toggleClass('active');
  return false;
});



jQuery("#useful-tips").on('click', function(){
  if (usefulTipsFlag == 0){
      CheckOtherWraps();
      usefulTipsFlag = 1;
  }
  else{
      usefulTipsFlag = 0;
  }
  jQuery("#wrap2").toggleClass('active');

  jQuery("#useful-tips").toggleClass('active');
  return false;
});




jQuery("#settings-div").on('click', function(){
  if (settingsFlag == 0){
      CheckOtherWraps();
      settingsFlag = 1;
  }
  else{
      settingsFlag = 0;
  }
  jQuery("#wrap3").toggleClass('active');

  jQuery("#settings").toggleClass('active');
  return false;
});




jQuery("#settings").on('click', function(){
  if (settingsFlag == 0){
      CheckOtherWraps();
      settingsFlag = 1;
  }
  else{
      settingsFlag = 0;
  }
  jQuery("#wrap3").toggleClass('active');

  jQuery("#settings").toggleClass('active');
  return false;
});




jQuery("#edge-types-div").on('click', function(){
  if (edgeTypesFlag == 0){
      CheckOtherWraps();
      edgeTypesFlag = 1;
  }
  else{
      edgeTypesFlag = 0;
  }
  jQuery("#wrap4").toggleClass('active');

  jQuery("#edge-types").toggleClass('active');
  return false;
});


jQuery("#edge-types").on('click', function(){
  if (edgeTypesFlag == 0){
      CheckOtherWraps();
      edgeTypesFlag = 1;
  }
  else{
      edgeTypesFlag = 0;
  }
  jQuery("#wrap4").toggleClass('active');

  jQuery("#edge-types").toggleClass('active');
  return false;
});


/*jQuery("#submit-clear").on('click', function(){
  jQuery("#wrap5").toggleClass('active');

  jQuery("#submit-clear").toggleClass('active');
  return false;
});*/




jQuery("#wrap2-x-button").click(function(){
  if (usefulTipsFlag == 0){
      usefulTipsFlag = 1;
  }
  else{
      usefulTipsFlag = 0;
  }
  jQuery("#wrap2").toggleClass('active');
  jQuery("#useful-tips").toggleClass('active');
});


jQuery("#wrap3-x-button").click(function(){
  if (settingsFlag == 0){
      settingsFlag = 1;
  }
  else{
      settingsFlag = 0;
  }
  jQuery("#wrap3").toggleClass('active');
  jQuery("#settings").toggleClass('active');
});


jQuery("#wrap4-x-button").click(function(){
  if (edgeTypesFlag == 0){
      edgeTypesFlag = 1;
  }
  else{
      edgeTypesFlag = 0;
  }
  jQuery("#wrap4").toggleClass('active');
  jQuery("#edge-types").toggleClass('active');
});

function CheckOtherWraps(){
   if (usefulTipsFlag == 1){
       jQuery("#wrap2").toggleClass('active');
       jQuery("#useful-tips").toggleClass('active');
       usefulTipsFlag = 0;
   }
   if (settingsFlag == 1){
       jQuery("#wrap3").toggleClass('active');
       jQuery("#settings").toggleClass('active');
       settingsFlag = 0;
   }
   if (edgeTypesFlag == 1){
       jQuery("#wrap4").toggleClass('active');
       jQuery("#edge-types").toggleClass('active');
       edgeTypesFlag = 0;
   }
   if (clearButtonFlag == 1){
       jQuery("#wrap5").toggleClass('active');
       clearButtonFlag = 0;
   }
}

function collectDumpVariables (){
  document.getElementById("entry_425796398").value = getGraphStringUserStudy(partialGraph);
  document.getElementById("entry_2022483379").value = getGraphStringUserStudy(rejectedGraph);
  document.getElementById("entry_1515945795").value = no_Of_Iterations;
  console.log("test");
  console.log( document.getElementById("entry_1515945795").value);
}
