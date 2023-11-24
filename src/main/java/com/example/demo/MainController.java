package com.example.demo;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.json.JSONArray;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class MainController {
    @GetMapping("main")
    public String main() {
        return "main";
    }

	public ResponseEntity<String> getDenodo(String urlStr, HttpServletResponse response, JSONArray data){
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

    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/view", method = RequestMethod.GET)
    public ResponseEntity<String> getView(HttpServletResponse response,HttpServletRequest request){
        String searchWord = request.getParameter("searchWord");
        JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/catalog-search/elements?nameFilter=" + searchWord;
        return getDenodo(urlStr, response, data);
        }

	@ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/category", method = RequestMethod.GET)
    public ResponseEntity<String> getCategory(HttpServletResponse response,HttpServletRequest request){
        String categoryId = request.getParameter("categoryId");
        JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/browse/categories/"+ categoryId;
        return getDenodo(urlStr, response, data);
        }

	@ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/tag", method = RequestMethod.GET)
    public ResponseEntity<String> getTag(HttpServletResponse response,HttpServletRequest request){
        String searchWord = request.getParameter("searchWord");
        JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/catalog-search/elements?nameFilter=" + searchWord;
        return getDenodo(urlStr, response, data);
        }

    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "main/getRow", method = RequestMethod.GET)
    public ResponseEntity<String> getRow(HttpServletResponse response,HttpServletRequest request){
        String viewName = request.getParameter("viewName");
        JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/view-details?databaseName=admin&serverId=1&viewName="+viewName;
        return getDenodo(urlStr, response, data);
        }

	@ResponseBody
	@JsonProperty("data")
	@RequestMapping(value = "main/getDatamap", method = RequestMethod.GET)
	public ResponseEntity<String> getDatamap(HttpServletResponse response,HttpServletRequest request){
		String dbName = request.getParameter("dbName");
		String viewName = request.getParameter("viewName");
		JSONArray data = new JSONArray();
		String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/public/api/views/tree/lineage?databaseName="+dbName+"&serverId=1&viewName="+viewName;
		return getDenodo(urlStr, response, data);
	}

}

