package com.example.demo;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
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
public class AIQueryController {
    @GetMapping("aiQuery")
    public String main() {
        return "aiQuery";
    }

    public ResponseEntity<String> postDenodo(HttpServletRequest request, BufferedReader bufferedReader, StringBuilder stringBuilder, 
    String bodystr, JSONArray data, HttpServletResponse response, String urlStr){
        try {
            request.setCharacterEncoding("utf-8");
            InputStream inputStream = request.getInputStream();
            if (inputStream != null) {
                bufferedReader = new BufferedReader(new InputStreamReader(inputStream ,"utf-8"));
                char[] charBuffer = new char[128];
                int bytesRead = -1;
                while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                    stringBuilder.append(charBuffer, 0, bytesRead);
                }
            }
            System.out.println("str"+stringBuilder.toString());
            bodystr = stringBuilder.toString();
            System.out.println("bodystr"+bodystr);
			URL url = new URL(urlStr);
			HttpURLConnection conn = (HttpURLConnection)url.openConnection();
            String userCredentials = "admin:admin";
            String basicAuth = "Basic " + new String(Base64.getEncoder().encode(userCredentials.getBytes()));
			response.setHeader("Access-Control-Allow-Origin", "*");
            response.setContentType("application/json;");
			conn.setRequestMethod("POST"); // http 메서드
			conn.setRequestProperty("Content-Type", "application/json; charset=utf-8"); // header Content-Type 정보
            conn.setRequestProperty("Access-Control-Allow-Origin", "*");
            //conn.setRequestProperty("Authorization", "Baisc YWRtaW46YWRtaW4");
            conn.setRequestProperty("Authorization", basicAuth);
			//conn.setRequestProperty("auth", "myAuth"); // header의 auth 정보
			conn.setDoOutput(true); // 서버로부터 받는 값이 있다면 true
            
            OutputStreamWriter writer = new OutputStreamWriter(conn.getOutputStream(), "UTF-8");
            writer.write(bodystr);
            writer.flush();
            writer.close();
			// 서버로부터 데이터 읽어오기
			BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
			StringBuilder sb = new StringBuilder();
			String line = null;
			while((line = br.readLine()) != null) { // 읽을 수 있을 때 까지 반복
				sb.append(line);
			}
			data = new JSONArray("["+sb.toString().trim()+"]"); // json으로 변경 (역직렬화)
            System.out.println("data"+ data);
			return ResponseEntity.status(HttpStatus.OK).body(data.toString());
		    } catch (Exception e) {
                e.printStackTrace();
		    }
        return ResponseEntity.status(HttpStatus.OK).body(data.toString());
    }

    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "aiQuery/genNatural", method = { RequestMethod.POST })
    public ResponseEntity<String> getData(HttpServletResponse response,HttpServletRequest request){
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        JSONArray data = new JSONArray();
        String bodystr="";
        String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/api/assisted-query/generate";
        return postDenodo(request, bufferedReader, stringBuilder, bodystr, data, response, urlStr);
        }


    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "aiQuery/checkVql" ,produces = "application/text; charset=utf8", method = { RequestMethod.POST })
    public ResponseEntity<String> getVql(HttpServletResponse response,HttpServletRequest request){
        StringBuilder stringBuilder = new StringBuilder();
        BufferedReader bufferedReader = null;
        JSONArray data = new JSONArray();
        String bodystr="";
        String urlStr = "http://127.0.0.1:9090/denodo-data-catalog/api/query/execute/vql";
        return postDenodo(request, bufferedReader, stringBuilder, bodystr, data, response, urlStr);
        }

    /* py 연결용 - unused
    @ResponseBody
    @JsonProperty("data")
    @RequestMapping(value = "aiQuery/genNatural/forPy", method = { RequestMethod.POST })
    public ResponseEntity<String> connPython(String prompt) {
        String line=null;
        JSONArray data = new JSONArray();
       try {
        String pythonScriptPath = "C:\\Users\\T490\\Desktop\\민지꺼\\back\\test.py";
        String functionName = "def_your_function_name()";  // 호출할 함수의 이름으로 변경
        ProcessBuilder processBuilder = new ProcessBuilder("python", pythonScriptPath, functionName);
        processBuilder.redirectErrorStream(true);
        Process process = processBuilder.start();

        // Python 스크립트의 출력을 읽어오기
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder sb = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            //System.out.println(line);
            sb.append(line);
        }
        data = new JSONArray("["+sb.toString().trim()+"]");
        // 프로세스 완료 대기
        int exitCode = process.waitFor();
        System.out.println("Python 스크립트 종료 코드: " + exitCode);
        return ResponseEntity.status(HttpStatus.OK).body(data.toString());
    } catch (IOException | InterruptedException e) {
        e.printStackTrace();
    }
    return ResponseEntity.status(HttpStatus.OK).body(data.toString());
   }
    */
}