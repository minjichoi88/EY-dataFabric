// 전역변수 선언
var searchCondition = 'view';
var defData;
var defaultDataV;
var defaultDataC;
var defaultDataT;
var dom;
var mapDatajson;
var viewName;
var dbName;
var defE;

function search() {
  var searchWord = document.getElementById('searchWord').value.toLowerCase()
  if(searchWord == "" ){
    alert('검색어를 입력해주세요!')
  }else{
    document.getElementById('spyDiv').style="display: block;"
    for(i=0; i<spyDiv.childNodes.length; i++){ 
      spyDiv.childNodes[i].style="display:block;color:black;"
    }
    mainDiv = '';
    mainDiv += '<h4 id="view" style="color: black;text-align: left;">View</h4>'
    mainDiv += '<div id="viewDiv" style="color: black;"></div>'
    mainDiv += '<hr class="hr" style="color: black;">'
    mainDiv += '<h4 id="category" style="color: black;text-align: left;">category</h4>'
    mainDiv += '<div id="categoryDiv" style="color: black;"></div>'
    mainDiv += '<hr class="hr"  style="color: black;">'
    mainDiv += '<h4 id="tag" style="color: black;text-align: left;">tag</h4>'
    mainDiv += '<div id="tagDiv" style="color: black;"></div>'
    spyDiv.innerHTML = mainDiv
    //-------api call
    connDenondo();
  }
}  

async function connDenondo(){
  var searchWord = document.getElementById('searchWord').value
  searchWord = searchWord.toString()
  console.log("searchWord", searchWord)
  await getView(searchWord);
  await getCat(searchWord);
  await getTag(searchWord);
}

function getView(searchWord){
  return new Promise(function(resolve, reject){
    try {
      $.ajax({
        url : "main/view?searchWord="+searchWord,
        //url : "main/test?searchWord="+searchWord,
        type : 'get',
        headers:{
          'Content-Type': 'application/json'
        },
        searchWord:searchWord, 
        success : function(data) {
          defaultDataV= JSON.parse(data)
          defData = defaultDataV
          console.log('defaultData VIEW', defaultDataV)
          if(defaultDataV.length == 0){
            document.getElementById('viewDiv').innerText =' 검색결과가 없습니다.'
          }else{
            viewResultList(defaultDataV);
            // json2table(defaultData, dom.$table);
          }
          resolve(data);
          console.log('view 끝')
          },
        // error : function(error) {
        //   alert("error");
        //   resolve(error);
        // }
      });
    } catch (error) {
      resolve(error)
    }finally{

    }
    
  })
}

function getCat(searchWord){
  return new Promise(function(resolve, reject){
    try {
      $.ajax({
        url : "main/category?categoryId="+searchWord,
        type : 'get',
        headers:{
          'Content-Type': 'application/json'
        },
        success : function(data) {
            defaultDataC = JSON.parse(data);
            console.log('category CAT', defaultDataC)
            if(defaultDataC.length == 0){
              document.getElementById('categoryDiv').innerText =' 검색결과가 없습니다.'
            }else{
              catResultList(defaultDataC);
            }
            resolve(data);
            console.log('cat 끝')
          },
        // error : function(error) {
        //   alert("error");
        //   resolve(error);
        // }
      });
    } catch (error) {
      console.log(error)
    }finally{
      
    }
    
  })
}

function getTag(searchWord){
  return new Promise(function(resolve, reject){
    try {
      $.ajax({
        url : "main/tag?tagId="+searchWord,
        type : 'get',
        headers:{
          'Content-Type': 'application/json'
        },
        success : function(data) {
            defaultDataT = JSON.parse(data);
            console.log('category TAG', defaultDataT)
            if(defaultDataT.length == 0){
              document.getElementById('tagDiv').innerText =' 검색결과가 없습니다.'
            }else{
              tagResultList(defaultDataT);
            }
            resolve(data);
            console.log('tag 끝')
          },
        // error : function(error) {
        //   alert("error");
        //   resolve(error);
        // }
      });
    } catch (error) {
      console.log(error)
    }finally{
      
    }
    
  })
}

function viewResultList(defaultDataV){
  var viewDiv='<div class="row row-cols-1 row-cols-md-3 g-4">';
  for(i=0; i<defaultDataV.length-1; i++){
    viewDiv += '<h6 style="width: -webkit-fill-available; text-align:left;">' + JSON.stringify(defaultDataV[defaultDataV.length-1][i+1]).replace('"', '').replace('"', '') + '에 대한 검색결과입니다.</h6>'
    for(j=0; j<defaultDataV[i].length; j++){
      viewDiv += '<div class="col"><div class="card"><div class="card-body">';
      viewDiv += '<h5 class="card-title" style="font-weight: 600;text-align: left;cursor:pointer;" onclick="getRow(this);">' + JSON.stringify(defaultDataV[i][j].name).replace('"', '').replace('"', '') + '</h5>';
      viewDiv += '<p class="card-text" style="display:none;">' + 'ElementType : ' + JSON.stringify(defaultDataV[i][j].elementType).replace('"', '').replace('"', '') + '</p>';
      viewDiv += '<p class="card-text" style="display:none;">' + 'Id : ' + JSON.stringify(defaultDataV[i][j].id) + '</p>';
      viewDiv += '<p class="card-text" style="display:none;">' + 'databaseName : ' + JSON.stringify(defaultDataV[i][j].databaseName).replace('"', '').replace('"', '') + '</p>';
      viewDiv += '<p class="card-text">' + 'Description : ' + JSON.stringify(defaultDataV[i][j].description).replace('"', '').replace('"', '') + '</p>';
      //console.log('응응', defaultDataV[i][j].tags)
      viewDiv += '<p class="card-text">' + 'tags : '
      for(k=0; k<defaultDataV[i][j].tags.length; k++){
        viewDiv += JSON.stringify(defaultDataV[i][j].tags[k].name).replace('"', '').replace('"', '');
        if( k != defaultDataV[i][j].tags.length-1){
          viewDiv += ', ';
        }
      }
      viewDiv += '</p>'
      viewDiv += '<p class="card-text">' + 'categories : ';
      for(k=0; k<defaultDataV[i][j].categories.length; k++){
        viewDiv += JSON.stringify(defaultDataV[i][j].categories[k].name).replace('"', '').replace('"', '');
        if( k != defaultDataV[i][j].categories.length-1){
          viewDiv += ', ';
        }
      }
      viewDiv += '</p>';
      viewDiv += '</div></div></div>'
    }
  }
  viewDiv += '</div>';
  document.getElementById('viewDiv').innerHTML = viewDiv;
}

function catResultList(defaultDataC){
  var catDiv='<div class="row row-cols-1 row-cols-md-3 g-4">';
  for(i=0; i<defaultDataC.length; i++){
    for(j=0; j<defaultDataC[i].length; j++){
      catDiv += '<div class="col"><div class="card"><div class="card-body">';
      catDiv += '<h5 class="card-title" style="font-weight: 600;text-align: left;">' + JSON.stringify(defaultDataC[i][j].name).replace('"', '').replace('"', '') + '</h5>';
      catDiv += '<p class="card-text" style="display:none;">' + 'Id : ' + JSON.stringify(defaultDataC[i][j].id) + '</p>';
      catDiv += '<p class="card-text">' + 'Description : ' + JSON.stringify(defaultDataC[i][j].description).replace('"', '').replace('"', '') + '</p>';
      catDiv += '</div></div></div>';
    }
  }
  catDiv += '</div>';
  document.getElementById('categoryDiv').innerHTML = catDiv;
}

function tagResultList(defaultDataT){
  var tagDiv='<div class="row row-cols-1 row-cols-md-3 g-4">';
  for(i=0; i<defaultDataT.length; i++){
    for(j=0; j<defaultDataT[0].length; j++){
      tagDiv += '<div class="col"><div class="card"><div class="card-body">';
      tagDiv += '<h5 class="card-title" style="font-weight: 600;text-align: left;" onclick="getRow(this);">' + JSON.stringify(defaultDataT[0][j].name).replace('"', '').replace('"', '') + '</h5>';
      tagDiv += '<p class="card-text" style="display:none;">' + 'Id : ' + JSON.stringify(defaultDataT[0][j].id) + '</p>';
      
      tagDiv += '<p class="card-text" style="display:none;">' + 'Element Type : ' + JSON.stringify(defaultDataT[0][j].elementType).replace('"', '').replace('"', '') + '</p>';
      tagDiv += '<p class="card-text" style="display:none;">' + 'databaseName : ' + JSON.stringify(defaultDataT[0][j].databaseName).replace('"', '').replace('"', '') + '</p>';
      tagDiv += '<p class="card-text">' + 'Description : ' + JSON.stringify(defaultDataT[0][j].description).replace('"', '').replace('"', '') + '</p>';
      tagDiv += '<p class="card-text">' + 'tags : '
      for(k=0; k<defaultDataT[0][j].tags.length; k++){
        tagDiv += JSON.stringify(defaultDataT[0][j].tags[k].name).replace('"', '').replace('"', '');
        if( k != defaultDataT[0][j].tags.length-1){
          tagDiv += ', ';
        }
      }
      tagDiv += '</p>'
      tagDiv += '<p class="card-text">' + 'categories : ';
      for(k=0; k<defaultDataT[0][j].categories.length; k++){
        tagDiv += JSON.stringify(defaultDataT[0][j].categories[k].name).replace('"', '').replace('"', '');
        if( k != defaultDataT[0][j].categories.length-1){
          tagDiv += ', ';
        }
      }
      tagDiv += '</p>';
      tagDiv += '</div></div></div>';
    }
  }
  tagDiv += '</div>';
  document.getElementById('tagDiv').innerHTML = tagDiv;
}

function json2table(json, $table) {
  var cols;
  console.log('Object', Object)
  console.log('json[0]', json[0])
  if(json[0] == null || json[0] == '' || json[0] == undefined || json[0] == 'undefined')json[0]=''
  if(Object.keys(json[0])== null ||Object.keys(json[0]) == undefined)  Object.keys(json[0]) ='';
  cols = Object.keys(json[0]);
    var headerRow = '';
    var bodyRows = '';

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    $table.html('<table class="table"><thead><tr></tr></thead><tbody></tbody></table>');
    cols.map(function(col) {
      headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
    });
    json.map(function(row) {
      bodyRows += '<tr class="addRow" onclick="getRow(this)">';
      cols.map(function(colName) {
        bodyRows += '<td>' + row[colName] + '</td>';
      })
      bodyRows += '</tr>';
    });

    $table.find('thead tr').append(headerRow);
    $table.find('tbody').append(bodyRows);
}

function getRow(e){
  console.log('eeeee', e.parentNode.childNodes)
  defE = e;
  viewName = e.innerText;
  dbName;
  console.log
  // if(e.parentNode.childNodes.length <4){
  //   dbName= e.parentNode.childNodes[2].innerText;
  //   dbName = dbName.replace("databaseName : ","")
  // }else{
    dbName= e.parentNode.childNodes[3].innerText;
    dbName = dbName.replace("databaseName : ","")
  // }
  console.log('dbName', dbName)
  console.log('viewName', viewName)
  //상세정보 get
  $.ajax({
      url : "main/getRow?dbName="+dbName+"&viewName="+viewName,
      type : 'get',
      headers:{
        'Content-Type': 'application/json;charset=UTF-8'
      },
      searchWord:searchWord, 
      success : function(data) {
          data = JSON.parse(data);
          console.log('getrow data:', data)
          makeSummary(data);
        },
      error : function() {
        alert("error");
      }
  });
}

function makeInnerMenu(){
  var listDiv = document.getElementsByClassName('listdiv');
  var spyDiv = document.getElementById('spyDiv');
  var resultDiv = document.getElementById('resultDiv');
  var menuDiv = "";
  menuDiv = '<ul class="nav nav-tabs">';
  menuDiv += '<li class="nav-item"><a class="nav-link active" aria-current="page" id="summary" onclick="getRow(defE);">Summary</a></li>';
  //menuDiv += '<li class="nav-item"><a class="nav-link active" aria-current="page" id="datamap" onclick="makeDataMap();">DataMap</a></li>';
  menuDiv += '<li class="nav-item"><a class="nav-link active" aria-current="page" id="nl" onclick="makeNL();">NL(Natural Language) Query</a></li>';
  menuDiv += '</ul>'
  for(i=0; i<spyDiv.childNodes.length; i++){
    spyDiv.childNodes[i].style="display:none;"
  }
  spyDiv.innerHTML = menuDiv;
}

function makeSummary(data){
  makeInnerMenu();
  console.log('make summary data :', data)
  viewName = data[0].name;
  var sumDiv = "";
  sumDiv += '<div id="viewName" class="col">'
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-text" viewBox="0 0 16 16" style="float:left; margin-top: 10px; margin-right:13px">'
  sumDiv += '<path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>'
  sumDiv += '<path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>'
  sumDiv += '<path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>'
  sumDiv += '</svg>'
  sumDiv += data[0].name;
  //sumDiv += '<button type="button" class="btn btn-secondary" style="float:right" onclick="javascript:history.back();">'
  //sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-backspace" viewBox="0 0 16 16"><path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/><path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"/></svg>'
  sumDiv += '</div></div>';
  sumDiv += '<div class="row"><div class="col-4">';
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-database" viewBox="0 0 16 16" style="float: left;margin-right: 10px;">';
  sumDiv += '<path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z"/>';
  sumDiv += '</svg>';
  sumDiv += 'DataBase</div>';
  sumDiv += '<div id="database" class="col-4"></div></div>';
  sumDiv += '<div class="row"><div class="col-4">'
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder2" viewBox="0 0 16 16" style="float: left;margin-right: 10px;"><path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/></svg>'
  sumDiv += 'Categories</div>';
  sumDiv += '<div id="categories" class="col-4"></div></div>';
  sumDiv += '<div class="row"><div class="col-4">'
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-tags" viewBox="0 0 16 16" style="float: left;margin-right: 10px;"><path d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"/><path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"/></svg>'
  sumDiv +='Tags</div>';
  sumDiv += '<div id="tags" class="col-4"></div></div>';
  sumDiv += '<div class="row"><div class="col-4">'
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16" style="float: left;margin-right: 10px;"><path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/><path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/></svg>'
  sumDiv += 'Description</div>';
  sumDiv += '<div id="description" class="col-4"></div></div>';
  sumDiv += '<div class="col-4">'
  sumDiv += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16" style="float: left;margin-right: 10px;"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/></svg>'
  sumDiv += 'Schema</div>';
  sumDiv += '<div id="schema" class="col-4"></div>';
  var spyDiv = document.getElementById('spyDiv')
  spyDiv.innerHTML += sumDiv;
  for(i=0; i<spyDiv.childNodes.length; i++){
    spyDiv.childNodes[i].style ="color:black;text-align:left;padding=top:6px;"
  }
  document.getElementById('viewName').style="padding: 20px;color: black;text-align: left;font-size: larger;vertical-align: middle;font-weight: 700;"
  dom = {$table: $('#schema')}
  //data 뿌려주기
  document.getElementById('database').innerText = data[0].databaseName;
  var categoriesBadge ='';
  for(i=0; i<data[0].categories.length;i++){
    categoriesBadge +='<span class="badge badge-secondary" style="color:black;">';
    categoriesBadge += JSON.stringify(data[0].categories[i].name).replace("\"", "").replace("\"", "");
    categoriesBadge += '</span>';
  }
  document.getElementById('categories').innerHTML += categoriesBadge;

  var tagsBadge ='';
  for(i=0; i<data[0].tags.length;i++){
    tagsBadge +='<span class="badge badge-secondary" style="color:black;">';
    tagsBadge += JSON.stringify(data[0].tags[i].name).replace("\"", "").replace("\"", "");
    tagsBadge += '</span>';
  }
  document.getElementById('tags').innerHTML = tagsBadge;
  document.getElementById('description').innerText = data[0].description;
  console.log('스킼ㅋㅋ카', data[0].schema) 
  console.log('json2table(data[0].schema', json2table(data[0].schema, dom.$table))
  //defaultData = data[0].schema[0]
  //document.getElementById('schema').innerHTML = json2table(defaultData, dom.$table);
}

function makeDataMap(){
  makeInnerMenu();
  //var dbName = "admin";
  console.log('데이터맵 dbName', dbName)
  $.ajax({
      url : "main/getDatamap?dbName="+dbName+"&viewName="+viewName,
      type : 'get',
      headers:{
        'Content-Type': 'application/json'
      },
      searchWord:searchWord, 
      success : function(data) {
        data = JSON.parse(data);
        console.log('mapData:', data)
        if(data.length == 0){
          document.getElementById('spyDiv').innerText="표시할 Data가 없습니다."
        }else{
          mapData(data);
          console.log('mapDatajson:', mapDatajson)
        }
      },
      error : function() {
        alert("error");
      }
  });
}

function mapData(data){
  mapDatajson = [];
  var tableId;
  var tableName;
  var tableColumns;
  var element;
  for(i=0; i<data.length; i++){
    tableId = i;
    tableName = data[i].name.toString()
    element = {
      //"tableId": tableId, 
      "tableName":tableName, 
      "tableColumns": 
        [  
          {"colName":"CustomerId","dataType":"int","nullable":0},
          {"colName":"Name","dataType":"varchar(50)","nullable":0},
          {"colName":"LastModified","dataType":"datetime(7)","nullable":0}
        ]
      };
    mapDatajson.push(element)
  }
  const script = document.createElement("script");
  script.src = "js/erd.js";
  document.getElementById('spyDiv').appendChild(script);
}

function makeNL(){
  console.log('viewname : ', viewName)
  makeInnerMenu();
  var nlDiv = "";
  nlDiv += '<div style="float: left; padding:30px; text-align:left; background-color: rgba(var(--bs-tertiary-bg-rgb),var(--bs-bg-opacity))!important;"><div style="margin: 5px;"><label>자연어 쿼리 입력</label>';
  nlDiv += '<button type="button" class="btn btn-search" style="height: 24px; font-size: 14px; float: right;" onclick="genNatural();">생성</button>';
  nlDiv += '<button type="button" class="btn btn-search" style="height: 24px; font-size: 14px; float: right; margin-right: 5px;" onclick="clearAll();">모두 지우기</button></div>';
  nlDiv += '<div class="form-control flex-item" style="width: 1220px; height: 60px;">';
  nlDiv += '<textarea class="textarea" spellcheck="false" id="naturalWord" style="width: 990px; height: 50px; border: white; resize: none;"></textarea></div>';
  nlDiv += '<div style="float: left; padding:15px; width: 610px;"><div style="display: flex; justify-content: space-between; margin: 5px;">';
  nlDiv += '<label>자동으로 생성된 쿼리</label><button type="button" class="btn btn-search" style="height: 24px; font-size: 14px;" onclick="checkVql()">조회</button></div>';
  nlDiv += '<div id="sqlResultDiv" class="form-control flex-item loadingImg" style="height: 90px;">';
  nlDiv += '<textarea class="textarea" spellcheck="false" id="sqlResult" style="width:400px; height: 80px; border: white; resize: none;"></textarea>';
  nlDiv += '</div></div><div style="float: left; padding:15px; width: 610px;">';
  nlDiv += '<div style="display: flex; justify-content: space-between; margin: 5px;"><label>쿼리 설명</label></div>';
  nlDiv += '<div id="sqlResultDiv" class="form-control flex-item loadingImg" style="height: 90px;">';
  nlDiv += '<textarea class="textarea" spellcheck="false" id="sqlExplanation" style="width:400px; height: 80px; border: white; resize: none;"></textarea>';
  nlDiv += '</div></div><div style="float: left; padding:15px;padding-bottom: 50px;width:1220px">';
  nlDiv += '<label>SQL 실행 결과</label><div id="vqlResult" class="form-control flex-item" style="width: 1220px; height: 400px; overflow: scroll;"></div></div>';
  document.getElementById('spyDiv').innerHTML += nlDiv;
}