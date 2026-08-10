import { Apple, Bot, Check, Clipboard, Heart, Zap } from 'lucide-react';
import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { ICON_SIZE } from '@/config/icons';

const swiftSnippet = `// iOS Native Code (Swift): ForgeRock IAM & Biometrics (FaceID/TouchID)
import LocalAuthentication
import FRAuth

@objc(CredHrAuthManager)
class CredHrAuthManager: NSObject {
  @objc func authenticateBiometric(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    let context = LAContext()
    var error: NSError?
    
    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
      context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Xác thực vân tay CredHR") { success, evalErr in
        if success {
          FRUser.currentUser?.getAccessToken { token, err in
            resolve(["status": "SUCCESS", "token": token?.value])
          }
        } else {
          reject("AUTH_FAILED", evalErr?.localizedDescription, evalErr)
        }
      }
    }
  }
}`;

const kotlinSnippet = `// Android Native Code (Kotlin): Goong Maps API Key Manager & Biometric Auth
package com.credhr.nativemodule

import androidx.biometric.BiometricPrompt
import com.goong.maps.GoongMap
import com.goong.maps.camera.CameraUpdateFactory

class CredHrGoongMapManager(private val context: Context) {
  fun initializeGoongMap(goongMap: GoongMap, apiKey: String) {
    GoongMap.setApiKey(apiKey) // Dynamic Goong Maps API Key injection
    goongMap.animateCamera(CameraUpdateFactory.newLatLngZoom(LatLng(21.0285, 105.8542), 15f))
  }
  
  fun promptBiometricCheckIn(activity: FragmentActivity, callback: (Boolean) -> Unit) {
    val promptInfo = BiometricPrompt.PromptInfo.Builder()
      .setTitle("Chấm công Vân Tay CredHR")
      .setNegativeButtonText("Hủy")
      .build()
    // Native Biometric logic...
  }
}`;

const flutterSnippet = `// Flutter + GetX: HR Web Controller Bridge
class CredHrWebController extends GetxController {
  late final WebViewController webViewController;
  var isLoading = true.obs;

  @override
  void onInit() {
    super.onInit();
    webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel('NativeBridge', onMessageReceived: (JavaScriptMessage msg) {
          // Cross-bridge communication between Embedded Web & Native
          Get.snackbar("CredHR IAM", "Đã nhận Token xác thực từ Web Controller");
      })
      ..loadRequest(Uri.parse("https://hr.enterprise.internal/dashboard"));
  }
}`;

export function NativeCodeShowcase() {
  const [activeTab, setActiveTab] = useState<'swift' | 'kotlin' | 'flutter'>('swift');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (activeTab) {
      case 'swift':
        return { code: swiftSnippet, lang: 'swift', title: 'iOS Native (Swift)' };
      case 'kotlin':
        return { code: kotlinSnippet, lang: 'kotlin', title: 'Android Native (Kotlin)' };
      case 'flutter':
        return { code: flutterSnippet, lang: 'dart', title: 'Flutter (GetX + Web Controller)' };
    }
  };

  const current = getCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="terminal-playground">
      <header className="terminal-playground__header">
        <div>
          <h3>
            <Zap size={ICON_SIZE.lg} aria-hidden="true" />
            Native Code Playground
          </h3>
          <p>
            Ví dụ thực chiến mã nguồn <strong>Swift</strong>, <strong>Kotlin</strong> & <strong>Flutter (GetX)</strong> xử lý xác thực <strong>ForgeRock IAM</strong>, <strong>Biometrics Vân tay</strong> và <strong>Goong Maps API</strong> trong ứng dụng CredHR.
          </p>
        </div>
      </header>

      <div className="terminal-window">
        {/* Terminal Window Header Bar */}
        <div className="terminal-window__bar">
          <div className="terminal-window__controls">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>

          <div className="terminal-window__tabs">
            <button
              type="button"
              className={`terminal-tab ${activeTab === 'swift' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('swift')}
            >
              <Apple size={ICON_SIZE.sm} aria-hidden="true" />
              iOS Swift (ForgeRock & FaceID)
            </button>
            <button
              type="button"
              className={`terminal-tab ${activeTab === 'kotlin' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('kotlin')}
            >
              <Bot size={ICON_SIZE.sm} aria-hidden="true" />
              Android Kotlin (Goong Maps & Vân tay)
            </button>
            <button
              type="button"
              className={`terminal-tab ${activeTab === 'flutter' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('flutter')}
            >
              <Heart size={ICON_SIZE.sm} aria-hidden="true" />
              Flutter GetX (Web Controller)
            </button>
          </div>

          <button type="button" className="terminal-window__copy-btn" onClick={handleCopy}>
            {copied ? (
              <Check size={ICON_SIZE.sm} aria-hidden="true" />
            ) : (
              <Clipboard size={ICON_SIZE.sm} aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        {/* Code Content Container */}
        <div className="terminal-window__body">
          <SyntaxHighlighter
            language={current.lang}
            style={oneDark}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: '16px',
              fontSize: '13px',
              lineHeight: '1.6',
              background: '#090d16',
              borderRadius: '0 0 14px 14px',
            }}
          >
            {current.code}
          </SyntaxHighlighter>
        </div>
      </div>
    </section>
  );
}
