// 검색 인풋 태그
const search_input = document.getElementById("searchWord");
// 자동완성 목록
const suggestions_pannel = document.querySelector(".suggestions_pannel");
//검색 버튼 
const search_btn = document.getElementById("searchBtn");


//자동완성 데이터 초기 설정 
let s_jsonArray = new Array();
let s_json1 = new Object();
let s_json2 = new Object();

s_json1.name = "테스트";
s_json1.count = 1;

s_jsonArray.push(s_json1);

s_json2.name = "테스트2";
s_json2.count = 1;

s_jsonArray.push(s_json2);



// input 태그 이벤트 리스너 
search_input.addEventListener('keyup', function(){

    // 엔터키 입력 처리
    if (window.event.keyCode === 13) {
        // Cancel the default action, if needed
        // preventDefault() 를 사용해서 올바르지 않은 텍스트가 입력란에 입력되는것을 막습니다.
        window.event.preventDefault();
        // 검색어 버튼 클릭
        search_btn.click();
    }

    // suggestions_pannel 자동완성 패널 비우기
    suggestions_pannel.innerHTML='';
    // 입력된 검색어 변수 input
    let input = search_input.value;

    // filter() 각 요소를 시험할 함수
    // startsWith 메소드로 어떤 문자열이 다른 문자열로 시작하는지 확인 할 수 있습니다. 대소문자를 구분합니다.
    // suggestions 에는 현재검색어(input)가 s_jsonArray리스트의 name에 포함된 경우의 값들이 리스트로 반환됩니다.
    let suggestions = s_jsonArray.filter(function(exam){
        // console.log(exam.name, input);
        return exam.name.toLowerCase().startsWith(input);
    });
    // console.log('suggestions', suggestions);

    // suggestions 리스트 만큼 반복하여 자동완성될 태그를 만들어줍니다. 
    suggestions.forEach(function(suggested){
        let div = document.createElement('div');
        div.innerHTML = suggested.name;
        suggestions_pannel.appendChild(div);
        // 클릭처리 
        div.onclick= () =>{
            search_input.value = div.innerHTML; 
            suggestions_pannel.innerHTML='';
        }
    });
    if(input == ''){
        suggestions_pannel.innerHTML='';
    }
})


// 검색 처리
search_btn.onclick =() => {

    // 현재 검색어 : input_value
    let input_value =  search_input.value.trim()

    if(input_value.length == 0) {
        alert("검색어를 입력해주세요.")
    }else {
        // 현재까지 검색한 것 중 일치하는게 있는지 확인
        for (i=0; i < s_jsonArray.length; i++) {
            if(s_jsonArray[i].name == input_value) {
                s_jsonArray[i].count += 1;
                break;
            }
            // 마지막까지 일치하는 검색어를 찾지못하면 새로운 검색어로 추가
            if (i == s_jsonArray.length -1) {
                let s_json = new Object();
                s_json.name = input_value;
                s_json.count = 1;
                s_jsonArray.push(s_json)
            }
        }
    }
    search_input.value = "";
    suggestions_pannel.innerHTML='';
}
