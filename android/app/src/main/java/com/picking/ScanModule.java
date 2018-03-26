package com.picking;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContext;
import android.support.annotation.Nullable;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.content.Context;
import static com.picking.datawedge.EXTRA_PARAMETER;
import android.widget.Toast;



public class ScanModule extends ReactContextBaseJavaModule {

	private IntentFilter intentFilter = new IntentFilter("DATA_SCAN");
	private BarcodeDataBroadcastReceiver intentBarcodeDataReceiver = new BarcodeDataBroadcastReceiver();

	ScanModule(ReactApplicationContext reactContext) {
		super(reactContext);
	}

	private class BarcodeDataBroadcastReceiver extends BroadcastReceiver {
		@Override
		public void onReceive(Context arg0, Intent arg1) {
			String Barcode = arg1.getStringExtra(datawedge.DATA_STRING);
			int type = arg1.getIntExtra(datawedge.DATA_TYPE, 0);
			int length = arg1.getIntExtra(datawedge.DATA_LENGTH, 0);
			//Toast.makeText(getReactApplicationContext(), Barcode, Toast.LENGTH_SHORT).show();
			sendEvent(getReactApplicationContext(), "onScanBarcode", Barcode);
		}
	}

	@ReactMethod
	public void setLog(String str) {
		sendEvent(getReactApplicationContext(), "onRefreshMessage", str);
	}

	protected void sendEvent(
		ReactContext reactContext,
		String eventName,
		@Nullable String str) {
    	reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, str);
	}

	@ReactMethod
	public void enabledScan() {
		getReactApplicationContext().registerReceiver(intentBarcodeDataReceiver, intentFilter);
		EnableDecoder(datawedge.ENABLE_CODE39);
		EnableScanner();
		sendEvent(getReactApplicationContext(), "onRefreshMessage", "開啟掃描功能");
	}

	@ReactMethod
	public void disabledScan() {
		//getReactApplicationContext().unregisterReceiver(intentBarcodeDataReceiver);
		DisableScanner();
		sendEvent(getReactApplicationContext(), "onRefreshMessage", "關閉掃描功能");
	}

	public void DisableScanner() {
		Intent TriggerButtonIntent = new Intent();
		TriggerButtonIntent.setAction(datawedge.SOFTSCANTRIGGER);
		TriggerButtonIntent.putExtra(EXTRA_PARAMETER, datawedge.DISABLE_TRIGGERBUTTON);
		getReactApplicationContext().sendBroadcast(TriggerButtonIntent);

		Intent i = new Intent();
		i.setAction(datawedge.SCANNERINPUTPLUGIN);
		i.putExtra(EXTRA_PARAMETER, datawedge.DISABLE_PLUGIN);
		getReactApplicationContext().sendBroadcast(i);
	}

	public void EnableScanner() {
		Intent i = new Intent();
		i.setAction(datawedge.SCANNERINPUTPLUGIN);
		i.putExtra(EXTRA_PARAMETER, datawedge.ENABLE_PLUGIN);
		getReactApplicationContext().sendBroadcast(i);

		Intent TriggerButtonIntent = new Intent();
		TriggerButtonIntent.setAction(datawedge.SOFTSCANTRIGGER);
		TriggerButtonIntent.putExtra(EXTRA_PARAMETER,datawedge.ENABLE_TRIGGERBUTTON);
		getReactApplicationContext().sendBroadcast(TriggerButtonIntent);
	}

	public void EnableDecoder(String code_enable){
        Intent i = new Intent();
        i.setAction(datawedge.SCANNERINPUTPLUGIN);
        i.putExtra(datawedge.EXTRA_PARAMETER, code_enable);
        getReactApplicationContext().sendBroadcast(i);
    }

	@Override
    public boolean canOverrideExistingModule() {
        return true;
    }

    @Override
	public String getName() {
		return "ScanModule";
	}
}