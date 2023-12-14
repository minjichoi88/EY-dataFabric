package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.demo.Service.IWordAnalysisService;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class MainController {

	@Resource(name="WordAnalysisService")
	private IWordAnalysisService wordAnalysisService;

    @GetMapping("main")
    public String main() {
        return "main";
    }

	public Map<String, Integer> analysis(String searchWord) throws Exception {
		Map<String, Integer> rMap = wordAnalysisService.doWordAnalysis(searchWord);
		if(rMap == null) {
			rMap = new HashMap<String, Integer>();
		}
		System.out.println("결과 : "+rMap);
		return rMap;
	}

	public JSONArray getDenodo(String urlStr, HttpServletResponse response, JSONArray data) throws UnsupportedEncodingException, IOException{
		//try{
			URL url = new URL(urlStr);
			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            String userCredentials = "admin:admin";
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			response.setHeader("Access-Control-Allow-Origin", "*");
            response.setContentType("application/json;");
			conn.setRequestMethod("GET"); // http 메서드
			conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setRequestProperty("Access-Control-Allow-Origin", "*");
            conn.setRequestProperty("Authorization", basicAuth);
			//conn.setRequestProperty("auth", "myAuth"); // header의 auth 정보
			conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

			// 서버로부터 데이터 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			StringBuilder sb = new StringBuilder();
			String line = null;
			while((line = br.readLine()) != null) { 
				sb.append(line);
			}
			if(sb.toString().trim().startsWith("[") == true){
				data = new JSONArray(sb.toString().trim()); 
			}else{
				data = new JSONArray("["+sb.toString().trim()+"]"); 
			}
		// 	System.out.println("data"+ data);
		// 	return ResponseEntity.status(HttpStatus.OK).body(data.toString());
		// }catch(Exception e){
		// 	e.printStackTrace();
		// }
		// return ResponseEntity.status(HttpStatus.OK).body(data.toString());
			return data;
	}

	public ResponseEntity<String> getHTTPDenodo(String urlStr, HttpServletResponse response, JSONArray data){
		try{
			URL url = new URL(urlStr);
			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            String userCredentials = "admin:admin";
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			response.setHeader("Access-Control-Allow-Origin", "*");
            response.setContentType("application/json;");
			conn.setRequestMethod("GET"); // http 메서드
			conn.setRequestProperty("Content-Type", "application/json"); // header Content-Type 정보
            conn.setRequestProperty("Access-Control-Allow-Origin", "*");
            conn.setRequestProperty("Authorization", basicAuth);
			//conn.setRequestProperty("auth", "myAuth"); // header의 auth 정보
			conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true

			// 서버로부터 데이터 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			StringBuilder sb = new StringBuilder();
			String line = null;
			while((line = br.readLine()) != null) { 
				sb.append(line);
			}
			if(sb.toString().trim().startsWith("[") == true){
				data = new JSONArray(sb.toString().trim()); 
			}else{
				data = new JSONArray("["+sb.toString().trim()+"]"); 
			}
			System.out.println("data"+ data);
			return ResponseEntity.status(HttpStatus.OK).body(data.toString());
		}catch(Exception e){
			e.printStackTrace();
		}
		return ResponseEntity.status(HttpStatus.OK).body(data.toString());
	}

	//카테고리 id 하드코딩
	public int getCategoryCode(String categoryStr){
		int catCode = 0;
		//urlstr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/category-management/categories?serverId=1";
		if(categoryStr.toUpperCase().equals("SALES")) {
			catCode = 1;
		}else if(categoryStr.toUpperCase().equals("AREA")){
			catCode = 106;
		}else if(categoryStr.toUpperCase().equals("INTELLIGENCE")){
			catCode = 109;
		}else if(categoryStr.toUpperCase().equals("TYPE")){
			catCode = 107;
		}else if(categoryStr.toUpperCase().equals("FINANCE")){
			catCode = 104;
		}else if(categoryStr.toUpperCase().equals("HR")){
			catCode = 105;
		}else if(categoryStr.toUpperCase().equals("MANAGEMENT")){
			catCode = 103;
		}else if(categoryStr.toUpperCase().equals("MARKETING")){
			catCode = 102;
		}else if(categoryStr.toUpperCase().equals("MASTER")){
			catCode = 203;
		}else if(categoryStr.toUpperCase().equals("OPERATION")){
			catCode = 108;
		}else if(categoryStr.toUpperCase().equals("PRODUCTION")){
			catCode = 101;
		}else if(categoryStr.toUpperCase().equals("MASTER")){
			catCode = 203;
		}else if(categoryStr.toUpperCase().equals("MASTER")){
			catCode = 203;
		}
		return catCode;
	}

	public int getTagCode(String tagStr){
		int tagCode = 0;
		if(tagStr.toUpperCase().contains("AUGMENT")) {
			tagCode = 102;
		}else if(tagStr.toUpperCase().contains("FOUNDATION")){
			tagCode = 2;
		}else if(tagStr.toUpperCase().equals("INTEGRATED")){
			tagCode = 101;
		}else if(tagStr.toUpperCase().equals("ODS")){
			tagCode = 1;
		}else if(tagStr.toUpperCase().equals("객수")){
			tagCode = 105;
		}else if(tagStr.toUpperCase().equals("매출")){
			tagCode = 208;
		}else if(tagStr.toUpperCase().equals("발주")){
			tagCode = 209;
		}else if(tagStr.toUpperCase().equals("상품")){
			tagCode = 206;
		}else if(tagStr.toUpperCase().equals("오프라인")){
			tagCode = 203;
		}else if(tagStr.toUpperCase().equals("온라인")){
			tagCode = 202;
		}else if(tagStr.toUpperCase().equals("재고")){
			tagCode = 103;
		}else if(tagStr.toUpperCase().equals("점간이동")){
			tagCode = 210;
		}else if(tagStr.toUpperCase().equals("점포")){
			tagCode = 207;
		}else if(tagStr.toUpperCase().equals("폐기") || tagStr.toUpperCase().equals("로스")){
			tagCode = 211;
		}else if(tagStr.toUpperCase().equals("행사")){
			tagCode = 104;
		}
		return tagCode;
	}

    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/view", method = RequestMethod.GET)
    public ResponseEntity<String> getView(HttpServletResponse response,HttpServletRequest request) throws Exception{
        String searchWord = request.getParameter("searchWord");
        JSONArray data = new JSONArray();
		JSONArray finData = new JSONArray();
		JSONArray finalData = new JSONArray();
		JSONArray wordData = new JSONArray();
		JSONArray jsonArr = new JSONArray();
		String urlStr;
		String urlStrdescrpt;
		Map<String, Integer> searchMap = analysis(searchWord);
		//finData.put(searchMap);
		for (Map.Entry<String, Integer> map : searchMap.entrySet()) {
			wordData.put(map.getValue(), map.getKey());
			urlStr ="http://127.0.0.1:9090/denodo-data-catalog/public/api/catalog-search/elements?nameFilter=" + map.getKey();
			try{
				data = getDenodo(urlStr, response, data);
				finData.put(data);
			}catch(Exception e){
				//e.printStackTrace();
			}
		}
		try {
			for(int i=0; i<((JSONArray) finData.get(0)).length(); i++){
			Object dbName = ((JSONArray) finData.get(0)).get(i);
			JSONObject jsonObject = new JSONObject(dbName.toString());
			String dbNameStr = jsonObject.getString("databaseName").replaceAll("\"", "");
			String viewNameStr =  jsonObject.getString("name").replaceAll("\"", "");
			System.out.println("dbName:"+dbNameStr+" viewName:"+viewNameStr);
			urlStrdescrpt = "http://127.0.0.1:9090/denodo-data-catalog/public/api/view-details?databaseName="+dbNameStr+"&serverId=1&viewName="+viewNameStr;
			try{
				data = getDenodo(urlStrdescrpt, response, data);
				String description = data.getJSONObject(0).getString("description");
				JSONArray tags = data.getJSONObject(0).getJSONArray("tags");
				//System.out.println("tags" + tags );
				JSONArray categories = data.getJSONObject(0).getJSONArray("categories");
				//System.out.println("tags" + tags + "categories" + categories);
				//JSONObject jsonObj1 = new JSONObject();
        		//jsonObj1.put("description", description);
				jsonObject.put("description", description);
				jsonObject.put("tags", tags);
				jsonObject.put("categories", categories);
				jsonArr.put(jsonObject);
				//System.out.println("jsonObject" + jsonObject);
				//System.out.println("finData" + finalData);
			}catch(Exception e){
				//e.printStackTrace();
			}
		}
		
		finalData.put(jsonArr);
		finalData.put(wordData);
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		//System.out.println("finData" + finData);
        return ResponseEntity.status(HttpStatus.OK).body(finalData.toString());
        }

	@ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/category", method = RequestMethod.GET)
    public ResponseEntity<String> getCategory(HttpServletResponse response,HttpServletRequest request) throws Exception{
        String categoryId = request.getParameter("categoryId");
        JSONArray data = new JSONArray();
		JSONArray finData = new JSONArray();
		String urlStr;
		int catInt =0;
		Map<String, Integer> searchMap = analysis(categoryId);
		for (Map.Entry<String, Integer> map : searchMap.entrySet()) {
			System.out.println("map.getKey()"+map.getKey().toString());
			catInt = getCategoryCode(map.getKey().toString());
			urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/browse/categories/" + catInt;
			try{
				data = getDenodo(urlStr, response, data);
				finData.put(data);
			}catch(Exception e){
				e.printStackTrace();
			}
		  }
		  System.out.println("finData category" + finData);
        return ResponseEntity.status(HttpStatus.OK).body(finData.toString());
        }

	@ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/tag", method = RequestMethod.GET)
    public ResponseEntity<String> getTag(HttpServletResponse response,HttpServletRequest request) throws Exception{
		System.out.println("Tag in");
        String tagId = request.getParameter("tagId");
        JSONArray data = new JSONArray();
		JSONArray finData = new JSONArray();
		JSONArray finalData = new JSONArray();
		JSONArray jsonArr = new JSONArray();
		String urlStr;
		String urlStrdescrpt;
		int catInt =0;
		Map<String, Integer> searchMap = analysis(tagId);
		for (Map.Entry<String, Integer> map : searchMap.entrySet()) {
			System.out.println("map.getKey()"+map.getKey().toString());
			catInt = getTagCode(map.getKey().toString());
			urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/tags/" + catInt + "/elements?serverId=1";
			try{
				data = getDenodo(urlStr, response, data);
				System.out.println("Tag Data1"+data +"********length :" + data.getJSONObject(0).getJSONArray("views").length());
				if( data.getJSONObject(0).getJSONArray("views").length()>3) finData.put(data);
			}catch(Exception e){
				//e.printStackTrace();
			}
		  }
		  System.out.println("Tag Data2"+finData);
		  System.out.println("xx"+((JSONArray) finData.get(0)).getJSONObject(0).getJSONArray("views"));
		for(int i=0; i<((JSONArray) finData.get(0)).getJSONObject(0).getJSONArray("views").length(); i++){
			Object dbName = ((JSONArray) finData.get(0)).getJSONObject(0).getJSONArray("views").get(i);
			JSONObject jsonObject = new JSONObject(dbName.toString());
			String dbNameStr = jsonObject.getString("databaseName").replaceAll("\"", "");
			String viewNameStr =  jsonObject.getString("name").replaceAll("\"", "");
			System.out.println("dbName:"+dbNameStr+" viewName:"+viewNameStr);
			urlStrdescrpt = "http://127.0.0.1:9090/denodo-data-catalog/public/api/view-details?databaseName="+dbNameStr+"&serverId=1&viewName="+viewNameStr;
			try{
				data = getDenodo(urlStrdescrpt, response, data);
				String description = data.getJSONObject(0).getString("description");
				JSONArray tags = data.getJSONObject(0).getJSONArray("tags");
				//System.out.println("tags" + tags );
				JSONArray categories = data.getJSONObject(0).getJSONArray("categories");
				//System.out.println("tags" + tags + "categories" + categories);
				//JSONObject jsonObj1 = new JSONObject();
        		//jsonObj1.put("description", description);
				jsonObject.put("description", description);
				jsonObject.put("tags", tags);
				jsonObject.put("categories", categories);
				jsonArr.put(jsonObject);
				//System.out.println("jsonObject" + jsonObject);
				//System.out.println("finData" + finalData);
			}catch(Exception e){
				//e.printStackTrace();
			}
		}
		finalData.put(jsonArr);
		System.out.println("TAG finalData"+finalData);
        return ResponseEntity.status(HttpStatus.OK).body(finalData.toString());
        }

    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/getRow", method = RequestMethod.GET)
    public ResponseEntity<String> getRow(HttpServletResponse response,HttpServletRequest request){
        String viewName = request.getParameter("viewName");
		String dbName = request.getParameter("dbName");
        JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/view-details?databaseName="+dbName+"&serverId=1&viewName="+viewName;
        return getHTTPDenodo(urlStr, response, data);
        }

	@ResponseBody
	@JsonProperty("data")
	@RequestMapping(value = "main/getDatamap", method = RequestMethod.GET)
	public ResponseEntity<String> getDatamap(HttpServletResponse response,HttpServletRequest request){
		String dbName = request.getParameter("dbName");
		String viewName = request.getParameter("viewName");
		JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/views/tree/lineage?databaseName="+dbName+"&serverId=1&viewName="+viewName;
		return getHTTPDenodo(urlStr, response, data);
	}

}

