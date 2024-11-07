/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// jsc://JS-ParseResponseAndConstructResponse.js
var content = JSON.parse(context.getVariable('modelArmorResponse.content'));
var modelArmorCheckFailed = false;
var modelArmorLogPayload = {
        "raiFilterTypeResults": [],
        "csamFilterFilterResult": []
    };
if(content !== null && content.sanitizationResult !== null && 
        content.sanitizationResult.filterMatchState !== null && 
            content.sanitizationResult.filterMatchState == "MATCH_FOUND"){
    var raiFilterMatchFound = [], csamFilterMatchFound = [], filterTypesFound = []; 
    modelArmorCheckFailed = true;
    //iterate through the json response to get the matchState == "MATCH_FOUND"
    var filterResults = content.sanitizationResult.filterResults;
    if(filterResults !== null && filterResults.length >0){
        for(var i=0; i< filterResults.length; i++){
           var  filterResult = filterResults[i];
           //raiFilterResult
           if(filterResult !== null && typeof filterResult.raiFilterResult != "undefined"){
               var raiFilterResult = filterResult.raiFilterResult;
               if(raiFilterResult !== null && raiFilterResult.matchState !== null && raiFilterResult.matchState == "MATCH_FOUND"){
                    var raiFilterTypeResults = raiFilterResult.raiFilterTypeResults;
                    for(var j=0; j< raiFilterTypeResults.length; j++){
                        var raiFilterTypeResult = raiFilterTypeResults[j];
                        if(raiFilterTypeResult !== null && raiFilterTypeResult.matchState !== null && raiFilterTypeResult.matchState == "MATCH_FOUND"){
                            raiFilterMatchFound.push(raiFilterTypeResult);
                            filterTypesFound.push(raiFilterTypeResult.filterType);
                        }
                    }
                }
           }
           //csamFilterFilterResult
           if(filterResult !== null && typeof filterResult.csamFilterFilterResult != 'undefined'){
               var csamFilterFilterResult = filterResult.csamFilterFilterResult;
               if(csamFilterFilterResult !== null && csamFilterFilterResult.matchState !== null && csamFilterFilterResult.matchState == "MATCH_FOUND"){
                    var csamFilterTypeResults = csamFilterFilterResult.csamFilterTypeResults;
                    for(var k=0; k< csamFilterTypeResults.length; k++){
                        var csamFilterTypeResult = csamFilterTypeResults[k];
                        if(csamFilterTypeResult !== null && csamFilterTypeResult.matchState !== null && csamFilterTypeResult.matchState == "MATCH_FOUND"){
                            csamFilterMatchFound.push(csamFilterTypeResult);
                            filterTypesFound.push(csamFilterMatchFound.filterType);
                        }
                    }
                }
           }
           //piAndJailbreakFilterResult
           if(filterResult !== null && typeof filterResult.piAndJailbreakFilterResult != 'undefined'){
               var piAndJailbreakFilterResult = filterResult.piAndJailbreakFilterResult;
               if(piAndJailbreakFilterResult !== null && piAndJailbreakFilterResult.matchState !== null && piAndJailbreakFilterResult.matchState == "MATCH_FOUND"){
                    filterTypesFound.push("Prompt Injection and Jailbreak");
               }    
           }
           //maliciousUriFilterResult
           if(filterResult !== null && typeof filterResult.maliciousUriFilterResult != 'undefined'){
               var maliciousUriFilterResult = filterResult.maliciousUriFilterResult;
               if(maliciousUriFilterResult !== null && maliciousUriFilterResult.matchState !== null && maliciousUriFilterResult.matchState == "MATCH_FOUND"){
                    filterTypesFound.push("Malicious URL");
               }    
           }
           //sdpFilterResult
           if(filterResult !== null && typeof filterResult.sdpFilterResult != 'undefined'){
               var sdpFilterResult = filterResult.sdpFilterResult;
               if(sdpFilterResult !== null && typeof sdpFilterResult.inspectResult != 'undefined'){
                   var inspectResult = sdpFilterResult.inspectResult;
                   if(inspectResult !== null && inspectResult.matchState !== null && inspectResult.matchState == "MATCH_FOUND"){
                       filterTypesFound.push("Sensitive Data");
                   }
               }
               if(sdpFilterResult !== null && typeof sdpFilterResult.deidentifyResult != 'undefined'){
                   var deidentifyResult = sdpFilterResult.deidentifyResult;
                   if(deidentifyResult !== null && deidentifyResult.matchState !== null && deidentifyResult.matchState == "MATCH_FOUND"){
                       filterTypesFound.push("Sensitive Data");
                   }
               }
           }
        }
    }
    modelArmorLogPayload = {
        "raiFilterTypeResults": raiFilterMatchFound,
        "csamFilterFilterResults": csamFilterMatchFound
    }
    context.setVariable("filterTypesFound", JSON.stringify(filterTypesFound));
}
context.setVariable('modelArmorCheckFailed', modelArmorCheckFailed);
context.setVariable("modelArmorLogPayload", JSON.stringify(modelArmorLogPayload));
