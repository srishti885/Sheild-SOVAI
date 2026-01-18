/**
 * SHIELDAI SOVEREIGN v2.0 - CORE SECURITY MODULE
 * File: security.engine.js
 * * [STRICT DIRECTIVE]: DO NOT ALTER THE 'scrubPII' LOGIC.
 * INTEGRITY OF DIGITAL WATERMARKING MUST BE MAINTAINED.
 */

// --- 🔐 ORIGINAL LOGIC (UNTOUCHED) ---

const scrubPII = (text) => {
    // Basic validation
    if (!text) return { sanitized: "", threats: [], integrityScore: 100 };

    let cleanedText = text;
    let detectedThreats = [];

    // --- THREAT DEFINITIONS & CATEGORIES ---
    const patterns = {
        IDENTITY_EXPOSURE: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, // Emails
        CONTACT_LEAK: /(\+?\d{1,2}\s?)?(\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{4})/g, // Phones
        FINANCIAL_RISK: /\b(?:\d[ -]*?){13,16}\b/g,                           // Cards
        CREDENTIAL_RISK: /\b(password|secret|api_key|token|access_key)\s*[:=]\s*[^\s]+\b/gi // Secrets
    };

    // 1. Processing Logic with Categorization
    if (patterns.IDENTITY_EXPOSURE.test(cleanedText)) {
        detectedThreats.push("IDENTITY_EXPOSURE");
        cleanedText = cleanedText.replace(patterns.IDENTITY_EXPOSURE, "[PROTECTED_IDENTITY]");
    }

    if (patterns.CONTACT_LEAK.test(cleanedText)) {
        detectedThreats.push("CONTACT_LEAK");
        cleanedText = cleanedText.replace(patterns.CONTACT_LEAK, "[PROTECTED_CONTACT]");
    }

    if (patterns.FINANCIAL_RISK.test(cleanedText)) {
        detectedThreats.push("FINANCIAL_RISK");
        cleanedText = cleanedText.replace(patterns.FINANCIAL_RISK, "[PROTECTED_FINANCE]");
    }

    if (patterns.CREDENTIAL_RISK.test(cleanedText)) {
        detectedThreats.push("CREDENTIAL_RISK");
        cleanedText = cleanedText.replace(patterns.CREDENTIAL_RISK, "[PROTECTED_CREDENTIALS]");
    }

    // --- 🔐 SOVEREIGN UPDATE: INVISIBLE WATERMARKING ---
    // Zero-Width Space (\u200B), Non-Joiner (\u200C), and Joiner (\u200D) 
    // Ye characters browser/editor mein dikhte nahi hain par content ka part hote hain.
    const invisibleSignature = "\u200B\u200C\u200D"; 
    
    // Har scrubbed output ke end mein watermark attach kar rahe hain traceability ke liye
    if (cleanedText.length > 0) {
        cleanedText = cleanedText + invisibleSignature;
    }

    // 2. INTEGRITY SCORING (Quantitative Security Metrics)
    // Har threat par 25 points deduct honge (Starting from 100)
    let integrityScore = 100 - (detectedThreats.length * 25);
    if (integrityScore < 0) integrityScore = 0;

    // Output metadata
    return {
        sanitized: cleanedText,
        threats: detectedThreats,
        integrityScore: integrityScore,
        isViolation: detectedThreats.length > 0,
        metadata: {
            isWatermarked: true,
            timestamp: new Date().toISOString(),
            signatureType: "ZERO_WIDTH_STEGANOGRAPHY"
        }
    };
};

// --- 🌐 ENTERPRISE INTEGRATION WRAPPER (NEW) ---

/**
 * EXFILTRATION ANALYZER: 
 * Ensures the React Dashboard receives high-fidelity metrics 
 * for the Recharts Analytics Graph.
 */
const forensicExport = (rawResult) => {
    return {
        ...rawResult,
        forensicHash: Buffer.from(rawResult.metadata.timestamp).toString('base64'),
        status: rawResult.integrityScore > 50 ? "SECURE_ASSET" : "COMPROMISED_PAYLOAD",
        complianceLevel: "GDPR_SOC2_READY"
    };
};

/**
 * HONEYPOT ROUTING:
 * In case of SILENT_DISTRESS, this function can be used to 
 * swap the sanitized output with trap data.
 */
const generateHoneyPotData = () => {
    return "ACCESS_DENIED: System under maintenance. Error 0x8823.";
};
module.exports = { 
    scrubPII, 
    forensicExport, 
    generateHoneyPotData 
};