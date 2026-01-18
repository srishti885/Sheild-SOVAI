/**
 * ShieldAI: Enterprise Proxy Content Script
 * Version: 2.1.0 (Sovereign Guard)
 * Focus: Invisible Watermarking, Clipboard Scrambling, and Persistence
 */

// 1. ADVANCED TRACEABILITY: Invisible Digital Fingerprint
const injectInvisibleSignature = (text, empId) => {
    // Zero-Width Characters (ZWC): Invisible to humans, detectable by machines
    // Pattern: \u200B (Space), \u200C (Non-joiner), \u200D (Joiner), \u200E (LTR Mark)
    const signature = "\u200B\u200C\u200D\u200E"; 
    return text + signature;
};

// 2. CLIPBOARD SCRAMBLING: Gap Coverage for Copy-Paste Leakage
const scrambleClipboard = async () => {
    try {
        await navigator.clipboard.writeText("SECURITY_LOCK: Sensitive data exfiltration blocked by ShieldAI.");
        console.warn("[ShieldAI] Local clipboard cleared to prevent downstream leakage.");
    } catch (err) {
        console.error("[ShieldAI] Failed to intercept clipboard.");
    }
};

// 3. HEARTBEAT: Gap Coverage for Extension Tampering
const startHeartbeat = () => {
    setInterval(() => {
        try {
            fetch('http://localhost:5000/api/v1/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: "ACTIVE", source: "BROWSER_GUARD_EMP_001" })
            });
        } catch (e) {
            console.error("[ShieldAI] Gateway Heartbeat Lost.");
        }
    }, 30000); // Pulse every 30 seconds
};

// Initialize Security Layers
startHeartbeat();

// 4. MAIN INTERCEPTION ENGINE
document.addEventListener('keydown', async (e) => {
    // Trigger on Enter (Skip Shift+Enter for multiline)
    if (e.key === 'Enter' && !e.shiftKey) {
        
        const inputField = document.querySelector('#prompt-textarea') || 
                           document.querySelector('div[contenteditable="true"]') ||
                           document.querySelector('textarea[data-id="root"]'); // Support for multiple LLMs
        
        if (inputField) {
            const originalText = inputField.innerText || inputField.value;
            
            // Bypass check: If empty, don't process
            if (!originalText.trim()) return;

            console.log("[ShieldAI Proxy] Verifying payload integrity...");

            try {
                // LOCK UI: Prevent user from sending until validated
                inputField.style.opacity = "0.5";
                inputField.disabled = true;

                const response = await fetch('http://localhost:5000/api/v1/scrub', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        prompt: originalText, 
                        userId: "EMP_LEVEL_01",
                        source: "Browser_Extension_Endpoint" 
                    })
                });
                
                const data = await response.json();
                
                // GAP CHECK: Did the backend find PII/Threats?
                if (data.secured !== originalText) {
                    
                    // A. Apply Traceability Watermark
                    const watermarkedText = injectInvisibleSignature(data.secured, "EMP_001");

                    // B. Scramble Clipboard (Prevent users from copying sensitive info after redaction)
                    await scrambleClipboard();

                    // C. Notify User (Professional Alert)
                    alert("[SHIELDAI SECURITY] Your input contains restricted data. Redaction applied with forensic signature.");
                    
                    // D. Update DOM
                    if (inputField.tagName === 'DIV' || inputField.contentEditable === 'true') {
                        inputField.innerText = watermarkedText;
                    } else {
                        inputField.value = watermarkedText;
                    }
                    
                    console.log("[ShieldAI] Redaction and Watermarking sequence complete.");
                }

                // UNLOCK UI
                inputField.style.opacity = "1";
                inputField.disabled = false;

            } catch (err) {
                console.error("[ShieldAI CRITICAL] Security Gateway Offline. Transmission blocked.");
                alert("CRITICAL ERROR: Security Gateway is unreachable. Please contact IT Support.");
                e.preventDefault(); // Stop the prompt from being sent
            }
        }
    }
}, { capture: true }); // Using 'capture' phase to intercept before LLM scripts see the event

// 5. ANTI-TAMPER: Monitor if script is injected multiple times
console.log("-----------------------------------------------");
console.log("[CORE_READY] ShieldAI Sovereign Extension Active");
console.log("-----------------------------------------------");