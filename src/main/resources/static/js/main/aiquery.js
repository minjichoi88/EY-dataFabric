// 전역변수 선언
var defaultData;
var dom;
var vqlData;
// openai 연결용
function genNaturalBak(){
  var naturalWord = document.getElementById('naturalWord').value;
  if(naturalWord == ""){
    alert('자연어를 입력해주세요!')
  }else{
    var prompt = "테이블은 Books 이고 Header 는 Title, Author, Genre, Height, Publisher 이다. Rows 는 "+"[{'title':,'"+ naturalWord +"':,'Height':,'Publisher':}]"+"이다. 전체 데이터를 가져오는 SQL Query 를 만들어줘";
    //var prompt = naturalWord;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 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");
    var url = "https://api.openai.com/v1/chat/completions";
    var bearer = "Bearer " + "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";
    // Loading Start
    openLoading();
    fetch(url,{
      method: 'POST',
      headers: {
          'Authorization': bearer,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [
            {
                "role": "user",
                "content": prompt
            }
          ] 
      })
    }).then(function(res){
        // 서버의 응답이 json인 경우 아래의 코드를 통해서 js의 객체로 변환된 결과를 얻을 수 있습니다. 
        return res.json();
    }).then(function(data){
        // json으로 변환된 결과를 출력합니다. 
        closeLoading();
        console.log(data.choices[0].message.content);
        document.getElementById('sqlResult').innerText = data.choices[0].message.content; 
    });
  }
}

  function genNatural(){
    var naturalWord = document.getElementById('naturalWord').value;
    var viewNameStr = viewName;
    console.log('dbName', dbName)
    if(viewNameStr =="" || viewNameStr == null || viewNameStr ==undefined) viewNameStr = "cg_str";
    vqlData=null;
    if(naturalWord == ""){
      alert('자연어를 입력해주세요!')
    }else{
      openLoading();
      $.ajax({
      url : "aiQuery/genNatural",
      type : 'post',
      headers:{
        'Content-Type': 'application/json; charset=utf-8'
      },
      data : JSON.stringify({
        "databaseName": dbName,
        "execute": true, 
        "limit": 100,
        "naturalLanguageQuery": naturalWord,
        "offset": 0,
        "viewName": viewNameStr
      }),
      success : function(data) {
          closeLoading();
          console.log('data', data)
          //alert('성고옹')
          data = JSON.parse(data)
          vqlData = data
          console.log('data11', data)
          document.getElementById('sqlResult').innerText = data[0].query; 
          document.getElementById('sqlExplanation').innerText = data[0].explanation; 
        },
      error : function(data) {
        closeLoading();
        console.log('error; data', data)
        //data = data.toString() 
        var responseText = data.responseText;
        console.log('responseText', responseText)
        if(responseText.toString().includes('400'))alert('입력한 자연어를 다시 확인해주세요.')
        if(responseText.toString().includes('401'))alert('denodo 연결 권한이 없습니다.')
        if(responseText.toString().includes('50'))alert('denodo 서버 에러입니다.')
        }
      });
    }
  }
  
  function openLoading() {
      //화면 높이와 너비를 구합니다.
      let maskHeight = "160px";
      //$(document).height();
      let maskWidth = "320px";
      //window.document.body.clientWidth;
      //출력할 마스크를 설정해준다.
      let mask = "<div id=\"mask\" style=\"width: 320px; height: 160px; border: white; resize: none;\"></div>";
      //document.getElementById('sqlResult');
      // 로딩 이미지 주소 및 옵션
      let loadingImg ='';
      loadingImg += "<div id=\"loadingImg\" class=\"loading\">Loading&#8230;</div>"; 
      //레이어 추가
      $('#sqlResultDiv').append(mask).append(loadingImg)
      //마스크의 높이와 너비로 전체 화면을 채운다.
      $('#mask').css({
              'width' : maskWidth,
              'height': maskHeight,
              'opacity' :'0.3'
      });
      //마스크 표시
      $('#mask').show();  
      //로딩 이미지 표시
      $('#loadingImg').show();
  }


function closeLoading(){
  $('#mask, #loadingImg').hide();
  $('#mask, #loadingImg').empty();
}

function clearAll(){
  document.getElementById('naturalWord').value='';
}

function checkVql(){
  console.log('vql', vqlData)
  //var dbname = vqlData[0].databaseName;
  //var viewName = vqlData[0].viewName;
  
  if(vqlData == 'undefined'|| vqlData == null || vqlData == undefined){
    alert('조회할 쿼리가 없습니다.')
  }else{
    var vql = vqlData[0].query.toString()
    openLoading();
    $.ajax({
      url : "aiQuery/checkVql",
      type : 'post',
      headers:{
        'Content-Type': 'application/json; charset=utf-8'
      },
      data : JSON.stringify({
        "databaseName": "admin",
        "limit": 100,
        "offset": 0,
        "viewName": viewName,
        "vql": vql
      }),
      success : function(data) {
        //closeLoading();
        closeLoading();
        data = JSON.parse(data) 
        console.log('data', data)
        if(data[0].rows == null || data[0].rows.length ==0){
          defaultData="";
          document.getElementById('vqlResult').innerText="쿼리 실행 결과가 없습니다."
        }else{
          defaultData = data[0].rows[0].values;
          drawResultList();
          json2table(defaultData, dom.$table);
        }
      },
      error : function(data) {
        console.log('error; data', data)
        alert("error");
        }
      });
    }

  }

  function drawResultList(){
    var resultDiv = document.getElementById("vqlResult")
    var listDiv = document.createElement('div')
    listDiv.classList.add('col-md-6');
    listDiv.classList.add('listdiv');
    var tableDiv = document.createElement('table')
    tableDiv.classList.add('table');
    tableDiv.id = 'table'
    listDiv.style = ("width: -webkit-fill-available;");
    resultDiv.appendChild(listDiv)
    listDiv.appendChild(tableDiv)
    dom = {$table: $('#table')}
  }

  function json2table(json, $table) {
    var cols;
    if(json[0] == null || json[0] == '') cols = Object.keys('');
    cols = Object.keys(json[0]);
    var headerRow = '';
    var bodyRows = '';

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    $table.html('<thead><tr></tr></thead><tbody></tbody>');

    cols.map(function(col) {
      headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
    });

    json.map(function(row) {
      bodyRows += '<tr class="addRow" onclick="getRow()">';

      cols.map(function(colName) {
        bodyRows += '<td>' + row[colName] + '</td>';
      })

      bodyRows += '</tr>';
    });

    $table.find('thead tr').append(headerRow);
    $table.find('tbody').append(bodyRows);
  }