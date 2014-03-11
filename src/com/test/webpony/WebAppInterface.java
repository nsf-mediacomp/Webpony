package com.test.webpony;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebAppInterface {
	Context mContext;
	
	WebAppInterface(Context c){
		mContext = c;
	}
	
	@JavascriptInterface
	public void showToast(String toast){
		Toast.makeText(mContext, toast, Toast.LENGTH_SHORT).show();
	}
	
	@JavascriptInterface
	public String loadJSON(String url){
		String result = "";
		try{
			HttpClient httpc = new DefaultHttpClient();
			HttpResponse httpr = httpc.execute(new HttpGet(url));
			InputStream inputStream = httpr.getEntity().getContent();
			
			if(inputStream != null){
				result = convertInputStreamToString(inputStream);
			}
		}catch(Exception e) {
            Log.d("chromium", "aaaaaaAAAAAAAAAAA (" + url + ")" + e.getMessage());
        }
		return result;
	}
	
	private static String convertInputStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;
 
        inputStream.close();
        return result;
 
    }
}
