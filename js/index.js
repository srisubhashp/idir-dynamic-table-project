var entitiesList = [];
var typesList = [];
var entityWindowSize = 100;
var typeWindowSize = 100;
var keywordFlag = 0;
var entityCount = 0;
var typeCount = 0;
var entitiesThruTypesFlag = 0;
var entitiesThruDomainFlag = 0;
var typesThruDomainFlag = 0;
var searchLength = 3;
var entityKeywordSearchFlag = 0;
var typeKeywordSearchFlag = 0;
var entityEditSearch = 0;
var typeEditSearch = 0;
var entityKeywordSearch;
var typeKeywordSearch;
var t5; // TextboxList object created for entity
var t6; // TextboxList object created for type
var t7; // TextboxList object created for node edit entity
var t8; // TextboxList object created for node edit types
var getExamplesFlag = 0;
var nodeEditFlag = 0;
var mouseOverFlagOfIndex = false;
var entityDefaultSize = 20;
var typesDefaultSize = 20;

function clearIndexGlobalVariables() {
    keywordFlag = 0;
    entityCount = 0;
    typeCount = 0;
    entitiesThruTypesFlag = 0;
    entitiesThruDomainFlag = 0;
    typesThruDomainFlag = 0;
    entityKeywordSearchFlag = 0;
    typeKeywordSearchFlag = 0;
    getExamplesFlag = 0;
}

window.onunload = function() {
    jQuery.ajax({
        url: "https://" + urlFull + "/viiq_app/clearcanvas",
        type: 'get',
        async: false,
        success: function(response) {}
    });
};


function resetKeywordFlag() {
    keywordFlag = 0;
}


function nodeNameText(selected_node, context) {
    if (context == 1) {
        jQuery("#modal-text").empty();
        jQuery('#modal-text').append("<h4>Instructions</h4>" +
            "<ul>" +
            "<li>Click on the Close button to delete the newly added node.</li>" +
            "<li>Select a domain value from the <b>Domain</b> dropdown box, followed by a type from the <b>Type</b> dropdown box.</li>" +
            "<li>Select an exact entity as the node label from the <b>Entity</b> dropdown box.</li>" +
            "<li>You can select type and entity value for a node or just type or just entity value for a node. Domain value for a node is optional.</li>" +
            "<li>You can also search for type and entity values using the search box provided for each.</li>" +
            "<li>You can use keyword search with filters. Select a domain value, and search for a type of the selected domain by entering a keyword into the <b>Type Search</b> box.</li>" +
            "<li>You can use keyword search with filters. Select a domain value, and search for an entity of the selected domain by entering a keyword into the <b>Entity Search</b> box.</li>" +
            "<li>You can use keyword search with filters. Select a type value, and search for entities of the selected type using the <b> Entity Search</b> box.</li>" +
            "<li>Click the Select button to apply the selected node label.</li>" +
            "</ul>");
    } else if (context == 2) {
        jQuery('#modal-text').append("<h4>Instructions</h4>" +
            "<ul>" +
            "<li>Click the Close button to delete the created node.</li>" +
            "<li>Click the Select button to exit the window.</li>" +
            "</ul>");
    } else if (context == 3) {
        jQuery('#modal-text').append("<h4>Instructions</h4>" +
            "<ul>" +
            "<li>Edge labels are ranked by their relevance in the <b>Edge Label</b> dropdown box. Choose the appropriate label to use from the list.</li>" +
            "<li>Click the Save button to apply the selected edge label.</li>" +
            "</ul>");
    }
    //jQuery("#show-instructions").attr("disabled", true);
}

function SetKeywordFlag() {
    keywordFlag = 1;
}




jQuery("#type-back").click(function() {
    event.stopPropagation()
    jQuery("#type-next").attr("disabled", false);
    var domainValue;
    var keywordValue;
    typeCount = typeCount - 1;
    var windowNo = typeCount - 1;
    typesList.length = 0;
    var typeValue = -1;
    if (typeKeywordSearchFlag == 1) {
        keywordValue = typeKeywordSearch;
        if (typesThruDomainFlag == 1) {
            domainValue = jQuery("#domain-options option:selected").val();
        } else { //get all types  with keyword
            domainValue = -1;
        }
    } else if (typesThruDomainFlag == 1) {
        domainValue = jQuery("#domain-options option:selected").val();
        keywordValue = "";
    } else { //get all types
        domainValue = -1;
        keywordValue = "";
    }
    if (typeCount == 1) {
        jQuery("#type-back").attr("disabled", true);
    }


    if(nodeToBeEdited == undefined) {
      getRequest("https://" + urlFull + "/viiq_app/gettypes?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + typeWindowSize + "&keyword=" + keywordValue, typesList);
      // if (typesList.length < 19) {
      //     jQuery("#types-options").attr('size', typesDefaultSize);
      // } else {
      //     jQuery("#type-options").attr('size', typesDefaultSize);
      // }
      // if (typesList.length <= typeWindowSize) {
      //     jQuery("#type-next").attr("disabled", true);
      // }
      // jQuery("#type-options").empty();
      // for (var i = 0; i < typesList.length; i++) {
      //     jQuery("#type-options").append('<option value="' + typesList[i][0] + '" id="type-value-1">' + typesList[i][1] + '</option>');
      // };
      // jQuery('#tooltip_container').remove();
      // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    } else {
      updateDomainsTypesEntities("", "");
      typesList = generatedTypes.slice();
    }
    displayTypeOptions(typesList);
});




jQuery("#entity-back").click(function() {
    event.stopPropagation()
    jQuery("#entity-next").attr("disabled", false);
    var domainValue;
    var typeValue;
    var keywordValue;
    entityCount = entityCount - 1;
    var windowNo = entityCount - 1;
    entitiesList.length = 0;
    if (entityKeywordSearchFlag == 1) {

        keywordValue = entityKeywordSearch;
        if (entitiesThruTypesFlag == 1) {
            //typeValue = jQuery("#type-options option:selected").val();
            typeValue = jQuery("#type-selected-value").val();
            domainValue = -1;
        } else if (entitiesThruDomainFlag == 1) {
            domainValue = jQuery("#domain-options option:selected").val();
            typeValue = -1;
        } else { //get all entities with keyword
            domainValue = -1;
            typeValue = -1;
        }
    } else if (entitiesThruTypesFlag == 1) {
        keywordValue = "";
        //typeValue = jQuery("#type-options option:selected").val();
        typeValue = jQuery("#type-selected-value").val();
        domainValue = -1;
    } else if (entitiesThruDomainFlag == 1) {
        keywordValue = "";
        typeValue = -1;
        domainValue = jQuery("#domain-options option:selected").val();
    } else { //get all entities
        keywordValue = "";
        domainValue = -1;
        typeValue = -1;
    }

    if(curTypeList.concat(curEndTypeList).length == 0) {
      getRequest("https://" + urlFull + "/viiq_app/getentities?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + entityWindowSize + "&type=" + typeValue + "&keyword=" + keywordValue, entitiesList);

      if (entitiesList.length < 19) {
          jQuery("#entities-options").attr('size', entityDeaultSize);
      } else {
          jQuery("#entity-options").attr('size', 20);
      }
      if (entitiesList.length <= entityWindowSize) {
          jQuery("#entity-next").attr("disabled", true);
      }
      jQuery("#entity-options").empty();
      for (var i = 0; i < entitiesList.length; i++) {
          if (entitiesList[i][entitiesList[i].length - 1] == "preview") {
              jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
          } else {

              jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" >' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
          }
      };
      jQuery('#tooltip_container').remove();
      jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    } else {
      updateDomainsTypesEntities("", keywordValue);
      entitiesList = generatedEntities.slice();
    }
    if (entityCount == 1) {
        jQuery("#entity-back").attr("disabled", true);
    }
    displayEntityOptions(entitiesList);
});


//type next starts here!


jQuery("#type-next").click(function() {
    event.stopPropagation();
    var domainValue;
    var typeValue = -1;
    var keywordValue;
    if (typeCount == 1) {
        jQuery("#type-back").attr("disabled", false);
    }
    typeCount = typeCount + 1;
    var windowNo = typeCount - 1;


    if (typeKeywordSearchFlag == 1) {
        keywordValue = typeKeywordSearch;
        if (typesThruDomainFlag == 1) {
            domainValue = jQuery("#domain-options option:selected").val();
        } else { //get all types with keyword
            domainValue = -1;
        }
    } else if (typesThruDomainFlag == 1) {
        keywordValue = "";
        domainValue = jQuery("#domain-options option:selected").val();
    } else {
        keywordValue = "";
        domainValue = -1;
    }

    typesList.length = 0;
    if(nodeToBeEdited == undefined) {
      getRequest("https://" + urlFull + "/viiq_app/gettypes?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + typeWindowSize + "&keyword=" + keywordValue, typesList);
      // if (typesList.length < 19) {
      //     jQuery("#type-options").attr('size', typesDefaultSize);
      // } else {
      //     jQuery("#type-options").attr('size', typesDefaultSize);
      // }
      // if (typesList.length <= typeWindowSize) {
      //     jQuery("#type-next").attr("disabled", true);
      // }
      // jQuery("#type-options").empty();
      // for (var i = 0; i < typesList.length; i++) {
      //     jQuery("#type-options").append('<option value="' + typesList[i][0] + '" id="type-value-1">' + typesList[i][1] + '</option>');
      // };
      // jQuery('#tooltip_container').remove();
      // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    }
    else {
      updateDomainsTypesEntities("", "");
      typesList = generatedTypes.slice();
    }
    displayTypeOptions(typesList);
});



jQuery("#entity-next").click(function() {
    event.stopPropagation();
    var domainValue;
    var typeValue;
    var keywordValue;
    if (entityCount == 1) {
        jQuery("#entity-back").attr("disabled", false);
    }
    entityCount = entityCount + 1;
    var windowNo = entityCount - 1;


    if (entityKeywordSearchFlag == 1) {
        keywordValue = entityKeywordSearch;
        if (entitiesThruTypesFlag == 1) {
            domainValue = -1;
            //typeValue = jQuery("#type-options option:selected").val();
            typeValue = jQuery("#type-selected-value").val();
        } else if (entitiesThruDomainFlag == 1) {
            typeValue = -1;
            domainValue = jQuery("#domain-options option:selected").val();
        } else { //get all entities with keyword
            typeValue = -1;
            domainValue = -1;
        }
    } else if (entitiesThruTypesFlag == 1) {
        //typeValue = jQuery("#type-options option:selected").val();
        typeValue = jQuery("#type-selected-value").val();
        domainValue = -1;
        keywordValue = "";
    } else if (entitiesThruDomainFlag == 1) {
        domainValue = jQuery("#domain-options option:selected").val();
        typeValue = -1;
        keywordValue = "";
    } else {
        domainValue = -1;
        typeValue = -1;
        keywordValue = "";
    }

    entitiesList.length = 0;
    if(curTypeList.concat(curEndTypeList).length == 0) {
      getRequest("https://" + urlFull + "/viiq_app/getentities?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + entityWindowSize + "&type=" + typeValue + "&keyword=" + keywordValue, entitiesList);
      // if (entitiesList.length < 19) {
      //     jQuery("#entities-options").attr('size', entityDefaultSize);
      // } else {
      //     jQuery("#entity-options").attr('size', entityDefaultSize);
      // }
      // if (entitiesList.length <= entityWindowSize) {
      //     jQuery("#entity-next").attr("disabled", true);
      // }
      // jQuery("#entity-options").empty();
      //
      // for (var i = 0; i < entitiesList.length; i++) {
      //     if (entitiesList[i][entitiesList[i].length - 1] == "preview") {
      //         jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
      //     } else {
      //
      //         jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" >' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
      //     }
      // };
      // jQuery('#tooltip_container').remove();
      // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
      // if (entityCount == 1) {
      //     jQuery("#entity-back").attr("disabled", true);
      // }
    } else {
      updateDomainsTypesEntities("", keywordValue);
      entitiesList = generatedEntities.slice();
    }
    displayEntityOptions(entitiesList);
});




jQuery("#selectDiv").click(function() {
    jQuery("#entity-options").attr('size', entityDefaultSize);
    jQuery("#type-options").attr('size', typesDefaultSize);
});







jQuery("#save-changes").click(function() {
    if(nodeToBeEdited == null) { //if we are creating a new node
      if (jQuery("#save-changes").css("background-color") == "rgb(130, 139, 143)") {
          return;
      }
      jQuery("#modal-text").empty();
      if (selected_node && newNode) {
          /*var text2 = jQuery("#entity-options option:selected").text();
          var text1 = jQuery("#type-options option:selected").text();*/

          var text2 = jQuery("#entity-selected").val();
          var text1 = jQuery("#type-selected").val();

          if (text2 != "Select Entity..." || text1 != "Select Type..." || curTypeList.length != 0) {
              jQuery("#myModal").modal('hide');
              var entity = 0;
              var type = 0;
              var domain = 0;
              if (curTypeList.length != 0 || text1 != "Select Type...") type = 1;
              if (text2 != "Select Entity...") entity = 1;
              var text3 = jQuery("#domain-options option:selected").text();
              if (text3 != "Select Domain...") domain = 1;
              text = jQuery("#type-selected").val();
              value = jQuery("#type-selected-value").val();
              selected_node.typeList = curTypeList;
              if(value != -1) {
                var domainType = value+":"+getDomainForType(value)[1]+":"+text;
                domainType = domainType.toLowerCase();
                if(curTypeList.includes(domainType) == false) {
                  selected_node.typeList.push(domainType);
                }
              }
              setNodeDetails(entity, type, domain);
              selected_node = null;
              jQuery("#show-instructions").attr("disabled", false);
              newNode = false;
              // jQuery("#modal-text").empty();
              restart();
              animatedHelp();
              suggestionCounter = 0;
              if (nodes.length == 1) {
                  var mousedownMode = 2;
                  addSuggestions(1, mousedownMode);
              } else {

                  removeTempNodes();
                  refreshAllSuggestion();
              }
          } else {
              jQuery("#modal-text").append("<p>Please Select Type or Entity to continue</p>");
          }
      } else {
          var text = jQuery("#edge-options option:selected").text();
          if (text == " Select Edge") {
              jQuery("#modal-text").append("<p>Please Select Edge to continue</p>");
          } else {
              for (var i = 0; i < returnObject.length; i++) {
                  if (returnObject[i].edge.split("|")[0] == jQuery("#edge-options option:selected").val()) {
                      selected_link.actualSourceType = returnObject[i].actualSourceType;
                      selected_link.actualTargetType = returnObject[i].actualObjectType;
                      if (selected_link.source.nodeID != returnObject[i].source.split("|")[0]) {
                          var temp = selected_link.source;
                          selected_link.source = selected_link.target;
                          selected_link.target = temp;
                          /*var temp2 = selected_link.actualSourceType;
                          selected_link.actualSourceType = selected_link.actualTargetType;
                          selected_link.actualTargetType = temp2;*/
                      }
                      for (var k = 0; k < links.length; k++) {
                          if (links[k].source.id == selected_link.source.id && links[k].target.id == selected_link.target.id && links[k].source != links[k].target)
                              selected_link.linkNum++;
                      }
                  }
              }
              jQuery("#myModal").modal('hide');
              var mousedownMode = 2;
              jQuery("#linkId_" + selected_link.id).css('stroke', 'black');
              removeTempNodes();
              addSuggestions(0, mousedownMode);

              selected_link = null;
              selected_node = null;
              jQuery("#show-instructions").attr("disabled", false);
              newNode = false;
              newEdge = false;
              // jQuery("#modal-text").empty();
              restart();
              animatedHelp();
              suggestionCounter = 0;
          }
          // jQuery("#myModal").modal('hide');
      }
      /*selected_node = null;
      if (selected_link) {
      jQuery("#linkId_"+selected_link.id).css('stroke', 'black');
      selected_link = null;
      };*/
      checkKeywordStatus();

      restart();
      animatedHelp();
      jQuery("#save-changes").css("background-color", "#828b8f");
    } else { //if we are editing a node
      var text;
      var value;
      if (jQuery("#save-changes").css("background-color") == "rgb(130, 139, 143)") {
          return;
      }
      nodeToBeEdited.typeList = curTypeList.slice();
      text = jQuery("#type-options option:selected").text().toLowerCase();
      value = jQuery("#type-options option:selected").val();
      if(value != -1 && value != undefined) {
        var selectedType = value+":"+getDomainForType(value)[1]+":"+text;

        if(nodeToBeEdited.typeList.includes(selectedType) == false) {
          nodeToBeEdited.typeList.push(selectedType);
        }
      }

      if (nodeToBeEdited.entity == -1) {
          text = jQuery("#entity-options option:selected").text();
          if (text[0] == "") {
              text = text.substring(2);
          }
          value = jQuery("#entity-options option:selected").val();
          if (text != "Select Entity..." && text != "") {
              for (var k = 0; k < nodes.length; k++) {
                  if (nodeToBeEdited === nodes[k]) {
                      nodes[k].entity = value;
                      nodes[k].nodeID = value;
                      nodes[k].name = text;
                      nodes[k].tempName = text;
                  }
              }
          } else {
              // text = jQuery("#node-edit-type-options option:selected").text();
              // value = jQuery("#node-edit-type-options option:selected").val();

              for (var k = 0; k < nodes.length; k++) {
                  if (nodeToBeEdited === nodes[k]) {

                      nodes[k].nodeID = parseInt(nodeToBeEdited.typeList.concat(curEndTypeList)[0].split(':')[0]);

                      var typeLabels = [];
                      //only adding user added types to the label, because restart() will add the edge types later
                      for(var elem of nodeToBeEdited.typeList) {
                        typeLabels.push(elem.split(':')[2]);
                      }
                      nodes[k].name = typeLabels.join(' & ');
                      nodes[k].tempName = typeLabels.join(' & ');
                      nodes[k].entity = -1;
                  }
              }

              for (var k = 0; k < links.length; k++) {
                  if (links[k].source != links[k].target && links[k].flag == 2) {
                      if (links[k].source == nodeToBeEdited) {
                          links[k].actualSourceType = parseInt(value);

                      }
                      if (links[k].target == nodeToBeEdited) {
                          links[k].actualTargetType = parseInt(value);
                      }
                  }
              }
          }
      } else {
          text = jQuery("#entity-options option:selected").text();
          if (text[0] == "") {
              text = text.substring(2);
          }
          value = jQuery("#entity-options option:selected").val();
          if (text != "Select Entity..." && text != "") {
              for (var k = 0; k < nodes.length; k++) {
                  if (nodeToBeEdited === nodes[k]) {
                      nodes[k].entity = value;
                      nodes[k].nodeID = value;
                      nodes[k].name = text;
                      nodes[k].tempName = text;
                  }
              }
          } else {
              // text = jQuery("#node-edit-type-options option:selected").text();
              // value = jQuery("#node-edit-type-options option:selected").val();
              // if (text.toLowerCase() != "select type..." && text != "") {
                  for (var k = 0; k < nodes.length; k++) {
                      if (nodeToBeEdited === nodes[k]) {

                          nodes[k].nodeID = parseInt(nodeToBeEdited.typeList.concat(curEndTypeList)[0].split(':')[0]);

                          var typeLabels = [];
                          //only adding user added types to the label, because restart() will add the edge types later
                          for(var elem of nodeToBeEdited.typeList) {
                            typeLabels.push(elem.split(':')[2]);
                          }
                          nodes[k].name = typeLabels.join(' & ');
                          nodes[k].tempName = typeLabels.join(' & ');
                          //nodes[k].tempName = text;
                          nodes[k].entity = -1;
                      }
                  }

                  for (var k = 0; k < links.length; k++) {
                      if (links[k].source != links[k].target && links[k].flag == 2) {
                          if (links[k].source == nodeToBeEdited) {
                              links[k].actualSourceType = parseInt(value);

                          }
                          if (links[k].target == nodeToBeEdited) {
                              links[k].actualTargetType = parseInt(value);
                          }
                      }
                  }
              //}


          }

      }
      // jQuery("#node-edit-border").hide();
      // jQuery("#node-edit-entity").hide();
      // jQuery("#node-edit-entity-search").hide();
      // jQuery("#node-edit-type").hide();

      jQuery("#myModal").modal('hide');
      nodeToBeEdited = null;
      checkKeywordStatus();

      restart();
      refreshAllSuggestion();

    }
});

function setExamplesFlag() {
    if (getExamplesFlag == 0) {
        getExamplesFlag = 1;
    } else {
        getExamplesFlag = 0;
    }
}


function setMouseOverFlagOfIndex() {
    mouseOverFlagOfIndex = true;
}

function reSetMouseOverFlagOfIndex() {
    mouseOverFlagOfIndex = false;
}



function getRequest(URL, container) {

    var returnVar = [];
    var data;
    jQuery.ajax({
        type: "GET",
        beforeSend: function(request) {
            request.setRequestHeader("Content-type", "application/json");

            // request.setRequestHeader("Access-Control-Request-Method","GET");
            // request.setRequestHeader("Access-Control-Request-Headers","access-control-allow-origin, accept, content-type");
        },
        url: URL,
        processData: false,
        dataType: "json",
        async: false,
        success: function(data) {
            if (getExamplesFlag == 0 || mouseOverFlagOfIndex == true) {
                for (var i = 0; i < data.length; i++) {
                    var temp = data[i].split(",");
                    container[i] = temp;
                    var k = 0;
                };
            } else {
                var exampleData = {
                    examples: data.examples,
                    isReversible: data.isReversible,
                    objectType: data.objectType,
                    sourceType: data.sourceType
                };
                container.push(exampleData);
            }
        },
        error: function() {
            data = ["0|No data found"];
            var temp = data[0].split("|");
            container[0] = temp;
            //container[0]="No data found";

            jQuery("#myModal5").modal("show");
            jQuery("#type-options").hide();
            jQuery("#type-keyword-div").hide();
            jQuery("#keyword-div").hide();
            jQuery("#entity-options").hide();
        }

    });


}


function addTypesAndEntities() {
    var domainValue = jQuery("#domain-options option:selected").val();
    // Get all types for the domain
    typeCount = 1;
    var typeValue = -1;
    var keywordValue = "";
    typesThruDomainFlag = 1;
    entitiesThruTypesFlag = 0;
    jQuery("#type-next").attr("disabled", false);
    jQuery("#type-back").attr("disabled", true);
    jQuery("#type-options").attr('size', typesDefaultSize);
    var windowNo = typeCount - 1;
    displayedTypes.length = 0;

    if (displayedTypes.length <= typeWindowSize) {
        jQuery("#type-next").attr("disabled", true);
    }
    jQuery("#type-options").prop('disabled', false);
    jQuery("#type-options").empty();
    for (var i = 0; i < typesList.length; i++) {
        jQuery("#type-options").append('<option value="' + typesList[i][0] + '" id="type-value-1">' + typesList[i][1] + '</option>');
    };
    jQuery('#tooltip_container').remove();
    jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    // Get all entities for the domain
    entityCount = 1;
    entitiesThruDomainFlag = 1;
    jQuery("#entity-next").attr("disabled", false);
    jQuery("#entity-back").attr("disabled", true);
    jQuery("#entity-options").attr('size', entityDefaultSize);
    windowNo = entityCount - 1;
    entitiesList.length = 0;
    getRequest("https://" + urlFull + "/viiq_app/getentities?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + entityWindowSize + "&type=" + typeValue + "&keyword=" + keywordValue, entitiesList);
    if (entitiesList.length <= entityWindowSize) {
        jQuery("#entity-next").attr("disabled", true);
    }
    jQuery("#entity-options").prop('disabled', false);
    jQuery("#entity-options").empty();

    for (var i = 0; i < entitiesList.length; i++) {
        if (entitiesList[i][entitiesList[i].length - 1] == "preview") {
            jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
        } else {

            jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" >' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
        }
    };
    jQuery('#tooltip_container').remove();
    jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
}



function addEntities() {
    //var typeValue = jQuery("#type-options option:selected").val();
    var typeValue = jQuery("#type-selected-value").val();
    var domainValue = -1;
    var keywordValue = "";
    entityCount = 1;
    entitiesThruTypesFlag = 1;
    entitiesThruDomainFlag = 0;
    jQuery("#entity-next").attr("disabled", false);
    jQuery("#entity-back").attr("disabled", true);
    // jQuery("#entity-back").style("background-color","red");
    jQuery("#entity-options").attr('size', entityDefaultSize);
    var windowNo = entityCount - 1;
    entitiesThroughType.length = 0;
    getRequest("https://" + urlFull + "/viiq_app/getentities?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + entityWindowSize + "&type=" + typeValue + "&keyword=" + keywordValue, entitiesThroughType);
    // if (entitiesList.length <= entityWindowSize) {
    //     jQuery("#entity-next").attr("disabled", true);
    // }
    // jQuery("#entity-options").empty();
    //
    // for (var i = 0; i < entitiesList.length; i++) {
    //     if (entitiesList[i][entitiesList[i].length - 1] == "preview") {
    //         jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
    //     } else {
    //
    //         jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" >' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
    //     }
    //
    // };
    // jQuery('#tooltip_container').remove();
    // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
}

function getAllDomains(domain) {
  getRequest("https://" + urlFull + "/viiq_app/greeting", domain);
}

function getAllTypes(types) {
    typeCount = 1;
    // jQuery("#type-next").attr("disabled", false);
    // jQuery("#type-back").attr("disabled", true);
    // jQuery("#type-options").attr('size', typesDefaultSize);
    var windowNo = typeCount - 1;
    // types.length = 0;
    var domainValue = -1;
    var keywordValue = "";
    // var typeValue = -1;
    getRequest("https://" + urlFull + "/viiq_app/gettypes?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + typeWindowSize + "&keyword=" + keywordValue, types);
    // if (types.length <= typeWindowSize) {
    //     jQuery("#type-next").attr("disabled", true);
    // }
    // jQuery("#type-options").empty();
    // for (var i = 0; i < types.length; i++) {
    //     jQuery("#type-options").append('<option value="' + types[i][0] + '" id="type-value-1">' + types[i][1] + '</option>');
    // };
    // jQuery('#tooltip_container').remove();
    // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
}



function getAllEntities(entities) {
    entityCount = 1;
    var keywordValue = "";
    var typeValue = -1;
    var domainValue = -1;
    // jQuery("#entity-next").attr("disabled", false);
    // jQuery("#entity-back").attr("disabled", true);
    // jQuery("#entity-options").attr('size', entityDefaultSize);
    var windowNo = entityCount - 1;
    // entities.length = 0;




    getRequest("https://" + urlFull + "/viiq_app/getentities?domain=" + domainValue + "&windownum=" + windowNo + "&windowsize=" + entityWindowSize + "&type=" + typeValue + "&keyword=" + keywordValue, entities);


    //
    // if (entities.length <= entityWindowSize) {
    //     jQuery("#entity-next").attr("disabled", true);
    // }
    // jQuery("#entity-options").empty();
    //
    // for (var i = 0; i < entities.length; i++) {
    //     if (entities[i][entities[i].length - 1] == "preview") {
    //         jQuery("#entity-options").append('<option value="' + entities[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entities[i].slice(1, entities[i].length - 1).join() + '</option>'); //Changed by Heet
    //     } else {
    //
    //         jQuery("#entity-options").append('<option value="' + entities[i][0] + '" id="entity-value-1" >' + entities[i].slice(1, entities[i].length - 1).join() + '</option>'); //Changed by Heet
    //     }
    //
    // };
    // jQuery('#tooltip_container').remove();
    //
    // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
}

function displayDomainOptions(domain) {
    jQuery("#edge-div").hide();
    jQuery("#domain-div").show();
    jQuery("#type-options").empty();
    jQuery("#domain-options").empty();
    jQuery("#keyword-div").show();
    jQuery("#type-keyword-div").show();
    for (var i = 0; i < domain.length; i++) {
        jQuery("#domain-options").append('<option class="domainlist" value="' + domain[i][0] + '" id="add-value-1" >' + '<i>'+domain[i][1].replace("_", " ")+'</i>' + '</option>');
    };

}



function displayTypeOptions(types) {
    jQuery("#edge-div").hide();
    jQuery("#type-border").show();
    jQuery("#type-div").show();
    jQuery("#type-options").empty()
    for (var i = 0; i < types.length; i++) {
        jQuery("#type-options").append('<option value="' + types[i][0] + '" id="add-value-1" >' + types[i][1] + '</option>');
        //jQuery("#type-options").append('<option value="'+types[i][0]+'" id="add-value-1" data-toggle="tooltip" data-html="true" data-container="#tooltip_container">'+types[i][1]+'</option>');
    };
    // jQuery('#tooltip_container').remove();
    // jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    // typeCount = 1;
    // jQuery("#type-next").attr("disabled", false);
    // jQuery("#type-back").attr("disabled", true);
    jQuery("#type-options").attr('size', 20);
    if (types.length <= typeWindowSize) {
        jQuery("#type-next").attr("disabled", true);
    } else {
        jQuery("#type-next").attr("disabled", false);
    }
}




function displayEntityOptions(entities) {
    // entitiesThruTypesFlag = 0;
    // entitiesThruDomainFlag = 0;
    var entityDefaultSize = 20;
    jQuery("#edge-div").hide();
    jQuery("#entity-border").show();
    jQuery("#entity-div").show();
    jQuery("#selected-div").show();
    jQuery("#entity-options").empty()
    //for (var i = 0; i < entities.length && i < windowSize; i++) {
    for (var i = 0; i < entities.length; i++) {
        if (entities[i][entities[i].length - 1] == "preview") {
            jQuery("#entity-options").append('<option value="' + entities[i][0] + '" id="add-value-1" data-toggle="tooltip" data-html="true" data-container="#tooltip_container">' + entities[i].slice(1, entities[i].length - 1).join() + '</option>'); //Changed by Heet
        } else {

            jQuery("#entity-options").append('<option value="' + entities[i][0] + '" id="add-value-1" >' + entities[i].slice(1, entities[i].length - 1).join() + '</option>'); //Changed by Heet
        }
    };
    jQuery('#tooltip_container').remove();
    jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
    // entityCount = 1;
    // jQuery("#entity-next").attr("disabled", false);
    // jQuery("#entity-back").attr("disabled", true);
    jQuery("#entity-options").attr('size', entityDefaultSize);
    if (entities.length <= entityWindowSize) {
        jQuery("#entity-next").attr("disabled", true);
    } else {
        jQuery("#entity-next").attr("disabled", false);
    }
}



function getDomainStatusForTypeKeyword() {
    return typesThruDomainFlag;
}

function getDomainStatusForEntityKeyword() {
    return entitiesThruDomainFlag;
}


function getTypeStatusForEntityKeyword() {
    return entitiesThruTypesFlag;

}

function checkConnected(nodes, links) {
    if (nodes.length == 1 || nodes.length == 0) {
        return false;
    };
    /*if (nodes.length == 0) {
      return false;
    };
    if (nodes.length == 1) {
      return true;
    };*/

    if (nodes.length == 2 && links.length == 0) {
        return true;
    };
    checkedNodes = [];

    var nodeFound = false;

    for (var i = 0; i < nodes.length; i++) {
        for (var j = 0; j < links.length; j++) {
            var link = links[j];
            if (link.source != link.target)
                if (nodes[i] == link.source || nodes[i] == link.target) {
                    nodeFound = true;
                };
        };
        if (!nodeFound) {
            return true;
        } else {
            nodeFound = false;
        }
    };


    return false;



    // for (ele in links){
    // for (var i = 0; i < links.length; i++) {
    //   var ele = links[i];
    //   if (ele.source != ele.target) {
    //     var exist1 = nodes.indexOf(ele.source);
    //     var exist2 = nodes.indexOf(ele.target);
    //     if (exist1 < 0) {
    //       checkedNodes[checkedNodes.length] = ele.source.nodeID;
    //     }
    //     if (exist2 < 0) {
    //       checkedNodes[checkedNodes.length] = ele.target.nodeID;
    //     }
    //   }
    // }

    // if (checkedNodes.length==0) {
    //   return false;
    // }else{
    //   return true;
    // }
}


function createEntityTextboxList() {

    t6 = new TextboxList('form_tags_input_5', {
        unique: true,
        plugins: {
            autocomplete: {
                minLength: 3,
                queryRemote: true,
                remote: {
                    url: 'https://' + urlFull + '/viiq_app/greeting'
                }
            }
        }
    });
    t5 = new TextboxList('form_tags_input_4', {
        unique: true,
        plugins: {
            autocomplete: {
                minLength: 3,
                queryRemote: true,
                remote: {
                    url: 'https://' + urlFull + '/viiq_app/greeting'
                }
            }
        }
    });
    t7 = new TextboxList('form_tags_input_6', {
        unique: true,
        plugins: {
            autocomplete: {
                minLength: 3,
                queryRemote: true,
                remote: {
                    url: 'https://' + urlFull + '/viiq_app/greeting'
                }
            }
        }
    });
    t8 = new TextboxList('form_tags_input_7', {
        unique: true,
        plugins: {
            autocomplete: {
                minLength: 3,
                queryRemote: true,
                remote: {
                    url: 'https://' + urlFull + '/viiq_app/greeting'
                }
            }
        }
    });

}



function setNodeEditEntitySearchFlag(entitySearch, entitySearchLength) {
    if (entitySearchLength >= searchLength) {
        nodeEditFlag = 1;
        entityEditSearch = 1;
        setNodeEditKeywordValue(entitySearch);
    } else {
        nodeEditFlag = 0;
        entityEditSearch = 0;
        setNodeEditKeywordValue("");
        setPreviousNodeEditValues();
    }
}

function setNodeEditTypeSearchFlag(typeSearch, typeSearchLength) {
    if (typeSearchLength >= searchLength) {
        nodeEditFlag = 1;
        typeEditSearch = 1;
        setNodeEditKeywordValue(typeSearch);
    } else {
        nodeEditFlag = 0;
        typeEditSearch = 0;
        setNodeEditKeywordValue("");
        setPreviousNodeEditTypeValues();
    }
}

function setNodeEditWindowNo(windowNo) {
    setWindowNoOfNodeEdit(windowNo);
}


function setTypeSearch(typeSearch, typeSearchLength) {
    if (typeSearchLength >= searchLength) {
        typeKeywordSearchFlag = 1;
        typeKeywordSearch = typeSearch;
    } else {
        typeKeywordSearchFlag = 0;
        typeKeywordSearch = null;
        if(typesThruDomainFlag) {
          displayTypeOptions(typesThroughDomain);
        } else {
          displayTypeOptions(types);
        }
        // if (typesThruDomainFlag == 0) {
        //     //displayAllTheTypeOptions();
        // } else if (typesThruDomainFlag == 1) {
        //     jQuery("#type-options").empty();
        //     jQuery("#type-next").attr("disabled", false);
        //     jQuery("#type-back").attr("disabled", true);
        //     jQuery("#type-options").attr('size', typesDefaultSize);
        //     if (typesList.length <= typeWindowSize) {
        //         jQuery("#type-next").attr("disabled", true);
        //     }
        //     for (var i = 0; i < typesList.length; i++) {
        //         jQuery("#type-options").append('<option value="' + typesList[i][0] + '" id="type-value-1">' + typesList[i][1] + '</option>');
        //         //jQuery("#type-options").vai = -1;
        //     };
        //     jQuery('#tooltip_container').remove();
        //     jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
        //
        // }
    }
}


function setEntitySearch(entitySearch, entitySearchLength) {
    if (entitySearchLength >= searchLength) {
        entityKeywordSearchFlag = 1;
        entityKeywordSearch = entitySearch;
    } else {
        entityKeywordSearchFlag = 0;
        entityKeywordSearch = null;
        if(entitiesThruTypesFlag) {
          displayEntityOptions(entitiesThroughType);
        } else if(entitiesThruDomainFlag) {
          displayEntityOptions(entitiesThroughDomain);
        } else {
          displayEntityOptions(entities);
        }
        // if (entitiesThruTypesFlag != 1 && entitiesThruDomainFlag != 1) {
        //     //displayAllTheEntityOptions();
        // } else  {
        //     jQuery("#entity-options").empty();
        //     jQuery("#entity-next").attr("disabled", false);
        //     jQuery("#entity-back").attr("disabled", true);
        //     jQuery("#entity-options").attr('size', entityDefaultSize);
        //     if (entitiesList.length <= entityWindowSize) {
        //         jQuery("#entity-next").attr("disabled", true);
        //     }
        //     for (var i = 0; i < entitiesList.length; i++) {
        //         if (entitiesList[i][entitiesList[i].length - 1] == "preview") {
        //             jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" data-html="true" data-toggle="tooltip" data-container="#tooltip_container">' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
        //         } else {
        //
        //             jQuery("#entity-options").append('<option value="' + entitiesList[i][0] + '" id="entity-value-1" >' + entitiesList[i].slice(1, entitiesList[i].length - 1).join() + '</option>'); //Changed by Heet
        //         }
        //     };
        //     jQuery('#tooltip_container').remove();
        //     jQuery('<div id="tooltip_container"></div>').insertAfter("#entity-options");
        //     //             for (var i = 0; i < entitiesList.length; i++) {
        //     //                 jQuery("#entity-options").append('<option value="'+entitiesList[i][0]+'" id="entity-value-1">'+entitiesList[i][1]+'</option>');
        //     //              };
        // }
    }
}


function checkKeywordStatus() {
    if (entityEditSearch == 1) {

        nodeEditFlag = 0;
        entityEditSearch = 0;
        t7.list.remove(t7.list.innerText);
        t7 = new TextboxList('form_tags_input_6', {
            unique: true,
            plugins: {
                autocomplete: {
                    minLength: 3,
                    queryRemote: true,
                    remote: {
                        url: 'https://' + urlFull + '/viiq_app/greeting'
                    }
                }
            }
        });
        resetEditNodeFlag();
    } else if (typeEditSearch == 1) {
        typeEditSearch = 0;
        t8.list.remove(t8.list.innerText);
        t8 = new TextboxList('form_tags_input_7', {
            unique: true,
            plugins: {
                autocomplete: {
                    minLength: 3,
                    queryRemote: true,
                    remote: {
                        url: 'https://' + urlFull + '/viiq_app/greeting'
                    }
                }
            }
        });
        resetTypeEditNodeFlag();
    } else {
        if (typeKeywordSearchFlag == 1) {
            typeKeywordSearchFlag = 0;
            t6.list.remove(t6.list.innerText);
            t6 = new TextboxList('form_tags_input_5', {
                unique: true,
                plugins: {
                    autocomplete: {
                        minLength: 3,
                        queryRemote: true,
                        remote: {
                            url: 'https://' + urlFull + '/viiq_app/greeting'
                        }
                    }
                }
            });
            resetTypeOrEntitySearchFlag();

        }
        if (entityKeywordSearchFlag == 1) {
            entityKeywordSearchFlag = 0;
            t5.list.remove(t5.list.innerText);
            t5 = new TextboxList('form_tags_input_4', {
                unique: true,
                plugins: {
                    autocomplete: {
                        minLength: 3,
                        queryRemote: true,
                        remote: {
                            url: 'https://' + urlFull + '/viiq_app/greeting'
                        }
                    }
                }
            });
            resetTypeOrEntitySearchFlag();

        }

    }
}



function setKeywordTypeCount(count) {
    typeCount = count;
}


function setKeywordEntityCount(count) {
    entityCount = count;
}

var box = $('#termsCondition');

$('#agreeButton').on('click', function() {

    if (box.hasClass('hidden')) {

        box.removeClass('hidden');
        setTimeout(function() {
            box.removeClass('visuallyhidden');
        }, 20);

    } else {

        box.addClass('visuallyhidden');

        box.one('transitionend', function(e) {

            box.addClass('hidden');

        });

    }

});


function fetchWiki(target) {
    let tooltipText = "d";

    jQuery.ajax({
        url: "https://idir.uta.edu/viiq_app/getwikisummary?nodeid=" + target.value,
        type: 'get',
        async: false,
        success: function(response) {
            jQuery(target).attr('data-original-title', response);
        }
    });
    return tooltipText;
}



jQuery('body').tooltip({
    delay: 500,
    placement: "bottom",
    title: "default",
    html: true,
    selector: "[data-toggle='tooltip']"
});



jQuery(document).on("show.bs.tooltip", "[data-toggle='tooltip']", function(el) {

    fetchWiki(el.target);
});



// $('.survey_Modal').on('click' , function(){
//  endDateVar = new Date();
//  endTimeVar = endDateVar.getTime();
// var diff = (endTimeVar - startTimeVar)/1000;
// document.getElementById('entry_978148691').value = endTimeVar;
// document.getElementById('entry_1404241487').value = diff;
// });

// var modalHandle = $('#svg-div');
// modalHandle.on('click',function(){
// alert("Hello World");
// var timeP = time();
// document.getElementById('entry_1964390093').value = timeS.toString;
//
// });
// $('#start_session_id').on('click ', function(){
//   alert("Hello World " + startTimeVar);
// });
