package com.example.demo.Service;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.HashSet;

import org.springframework.stereotype.Service;

import kr.co.shineware.nlp.komoran.constant.DEFAULT_MODEL;
import kr.co.shineware.nlp.komoran.core.Komoran;
import kr.co.shineware.nlp.komoran.model.KomoranResult;
//import com.example.demo.Service.IWordAnalysisService;

@Service("WordAnalysisService")
public class WordAnalysisService implements IWordAnalysisService {

	
	Komoran nlp = null;
	public WordAnalysisService() {
		this.nlp = new Komoran(DEFAULT_MODEL.LIGHT); // 학습데이터 경량화 버전( 웹 서비스에 적합합니다. )
		//this.nlp = new Komoran(DEFAULT_MODEL.FULL); // 학습데이터 전체 버전(일괄처리 : 배치 서비스에 적합합니다.)
	}
	
	@Override
	public List<String> doWordNouns(String text) throws Exception {
		String replace_text = text.replace("[^가-힣a-zA-Z0-9", " ");
		String trim_text = replace_text.trim();
		
		//형태소 분석 시작
		KomoranResult analyzeResultList = this.nlp.analyze(trim_text);
		//형태소 분석 결과 중 명삼나 가져오기
		List<String> rList = new ArrayList<String>();;
		rList = analyzeResultList.getNouns();
		String[] words = trim_text.split(" ");
		//영어단어 추가 customizing
		for(int i=0; i<words.length; i++){
			words[i] = words[i].replaceAll("[가-힣]", "").replaceAll("[.]","");
			if(Pattern.matches("[a-zA-Z]*$", words[i]) && words[i] != ""){
				rList.add(words[i]);
			}
		}
		if (rList == null) {
			rList = new ArrayList<String>();
		}
		
		return rList;
	}

	@Override
	public Map<String, Integer> doWordCount(List<String> pList) throws Exception {
		if (pList ==null) {
			pList = new ArrayList<String>();
		}
		//단어 빈도수(사과, 3) 결과를 저장하기 위해 Map객체 생성합니다.
		Map<String, Integer> rMap = new HashMap<>();
		//List에 존재하는 중복되는 단어들의 중복제거를 위해 set 데이터타입에 데이터를 저장합니다.
		//rSet 변수는 중복된 데이터가 저장되지 않기 떄문에 중복되지 않은 단어만 저장하고 나머지는 자동 삭제합니다.
		Set<String> rSet = new HashSet<String>(pList);
		
		//중복이 제거된 단어 모음에 빈도수를 구하기 위해 반복문을 사용합니다.
		Iterator<String> it = rSet.iterator();
		int i=0;
		while(it.hasNext()) {
			//중복 제거된 단어
			String word = it.next();
			
			//단어가 중복 저장되어 있는 pList로부터 단어의 빈도수 가져오기
			//int frequency = Collections.frequency(pList, word);
			i++;
			rMap.put(word, i);
		}
		return rMap;
	}

	@Override
	public Map<String, Integer> doWordAnalysis(String text) throws Exception {
		List<String> rList = this.doWordNouns(text);
		
		if(rList == null) {
			rList = new ArrayList<String>();
		}
		Map<String, Integer> rMap = this.doWordCount(rList);
		if(rMap == null) {
			rMap = new HashMap<String, Integer>();
		}
		return rMap;
	}

}
