package com.test.webpony;

import android.os.Bundle;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.view.Menu;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends Activity {
	
	//http://developer.android.com/guide/webapps/webview.html
	//https://developers.google.com/chrome/mobile/docs/webview/gettingstarted
	//http://www.tutorialspoint.com/android/android_webview_layout.htm

	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		WebView mainWebView = (WebView) findViewById(R.id.main_webview);
		WebSettings webSettings = mainWebView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		
		mainWebView.addJavascriptInterface(new WebAppInterface(this), "Android");
		mainWebView.loadUrl("file:///android_asset/www/index.html");
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
