/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * =========================================================================
 * MAETHA HOSPITAL (โรงพยาบาลแม่ทา) - MEDICAL RADIOLOGY DEPARTMENT
 * Quarterly (3-6 Months) Radiology QC & Mechanical Inspection System
 * =========================================================================
 * 
 * Google Apps Script Backend (Code.gs)
 * Decoupled from the frontend view, handling secure database inserts and file storage.
 * 
 * DATABASE & STORAGE TARGETS:
 * 1. Target Spreadsheet ID: "1bu01SnlWZ4GQ8odSMPyGrvEIIER6FFGZr8nZsBPHWiI"
 *    - Target Sheet Name: 'แผ่นที่1'
 * 2. Target Google Drive Folder ID for Images: "1-jMcwLoDKHTFF0pF8F251bL4yEYJ1Nk6"
 * 
 * -------------------------------------------------------------------------
 * GITHUB ACTIONS & CLASP DEPLOYMENT COMPATIBILITY DETAILS:
 * -------------------------------------------------------------------------
 * To automate the deployment of this file alongside Index.html to Google apps script using Clasp,
 * set up a GitHub Actions workflow in `.github/workflows/deploy.yml`:
 * 
 * 1. Store your CLASP_CREDENTIALS as a GitHub Repository Secret.
 *    See CLASP documentation to extract credentials from your local ~/.clasprc.json
 * 2. Configure .clasp.json with the Script ID:
 *    { "scriptId": "YOUR_APPS_SCRIPT_ID", "rootDir": "./" }
 * 3. Use standard GitHub Actions runner with Node, install @google/clasp globally,
 *    write clasp token/credentials to local environment, and execute 'clasp push'.
 */

// Global Constants
var SPREADSHEET_ID = "1bu01SnlWZ4GQ8odSMPyGrvEIIER6FFGZr8nZsBPHWiI";
var SHEET_NAME = "แผ่นที่1";
var DRIVE_FOLDER_ID = "1-jMcwLoDKHTFF0pF8F251bL4yEYJ1Nk6";

/**
 * Serves the HTML frontend on web app request. Safe for embedding in iframe.
 */
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('ระบบตรวจเครื่องเอกซเรย์คัดกรองและอุปกรณ์ป้องกันรังสี - โรงพยาบาลแม่ทา')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Allows running in iframe overlays comfortably
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Receives the inspection record payload from the frontend, uploads signature images
 * and protection gear images to Google Drive, and appends the complete record to Google Sheets.
 * 
 * @param {Object} payload The complete parsed inspection form payload.
 * @return {Object} An object containing the success status and generated links.
 */
function saveDataToSheet(payload) {
  try {
    var timestamp = new Date();
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Create sheet if missing to avoid failure
      var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      sheet = ss.insertSheet(SHEET_NAME);
      // Append default headers
      sheet.appendRow([
        "วันที่บันทึก", "พนักงานรังสีเทคนิคผู้ตรวจ", "หัวหน้าแผนกรังสีตรวจทาน", "หมายเลขเครื่องเอกซเรย์", 
        "สภาพเชิงกลทั่วไป", "ระบบล็อคเบรกมุมหมุน", "ระบบเลเซอร์คอลลิเมเตอร์", "สายเคเบิลกำลังไฟฟ้า", 
        "หน้าจอดิจิตอลและการสื่อสาร", "ระยะ SID (cm)", "ค่าเบี่ยงเบนแนวแกน X (cm)", "ค่าเบี่ยงเบนแนวแกน Y (cm)", 
        "ผลตรวจ Beam Alignment", "รายละเอียดอุปกรณ์ป้องกันรังสี (JSON)", "ลายเซ็นผู้ตรวจสอบ", "ลายเซ็นหัวหน้าแผนก", "ข้อเสนอแนะเพิ่มเติม"
      ]);
    }

    // Process Base64 Signatures
    var operatorSignUrl = "";
    if (payload.operatorSignature && payload.operatorSignature.indexOf("data:image") === 0) {
      operatorSignUrl = uploadBase64Image(
        payload.operatorSignature, 
        "Sign_Operator_" + payload.machineId + "_" + Utilities.formatDate(timestamp, "GMT+7", "yyyyMMdd_HHmmss") + ".png"
      );
    } else {
      operatorSignUrl = payload.operatorSignature || "";
    }

    var reviewerSignUrl = "";
    if (payload.reviewerSignature && payload.reviewerSignature.indexOf("data:image") === 0) {
      reviewerSignUrl = uploadBase64Image(
        payload.reviewerSignature, 
        "Sign_Reviewer_" + payload.machineId + "_" + Utilities.formatDate(timestamp, "GMT+7", "yyyyMMdd_HHmmss") + ".png"
      );
    } else {
      reviewerSignUrl = payload.reviewerSignature || "";
    }

    // Process Protection Equipment Array Images
    var itemsProcessed = [];
    if (payload.protectionGear && payload.protectionGear.length > 0) {
      for (var i = 0; i < payload.protectionGear.length; i++) {
        var gear = payload.protectionGear[i];
        var gearImageUrl = "";
        
        // Check if there is an uploaded base64 file
        if (gear.base64File && gear.base64File.indexOf("data:") === 0) {
          var fileExt = "png";
          if (gear.base64File.indexOf("data:image/jpeg") === 0) fileExt = "jpg";
          else if (gear.base64File.indexOf("data:image/svg") === 0) fileExt = "svg";
          
          gearImageUrl = uploadBase64Image(
            gear.base64File,
            "Gear_" + gear.equipmentId.replace(/[^a-zA-Z0-9_-]/g, "_") + "_" + Utilities.formatDate(timestamp, "GMT+7", "yyyyMMdd_HHmmss") + "." + fileExt
          );
        } else {
          // Fall back to alternative URL input if no Base64 file was uploaded
          gearImageUrl = gear.driveLink || "";
        }
        
        itemsProcessed.push({
          id: gear.id,
          equipmentId: gear.equipmentId,
          visualStatus: gear.visualStatus,
          crackStatus: gear.crackStatus,
          imageUrl: gearImageUrl
        });
      }
    }

    var gearDataJsonString = JSON.stringify(itemsProcessed);

    // Prepare data block
    var rowData = [
      timestamp,                            // วันที่บันทึก
      payload.operatorName || "",           // พนักงานรังสีเทคนิคผู้ตรวจ
      payload.reviewerName || "",           // หัวหน้าแผนกรังสีตรวจทาน
      payload.machineId || "",               // หมายเลขเครื่องเอกซเรย์
      payload.mechanicalStability || "N/A",  // สภาพเชิงกลและหน้ากากควบคุม
      payload.lockingBraking || "N/A",       // ระบบล็อคเบรกมุมหมุน
      payload.collimatorIndicator || "N/A",  // ระบบไฟคอลลิเมเตอร์
      payload.powerCables || "N/A",          // สภาพสายเคเบิลพาวเวอร์
      payload.displayStatus || "N/A",        // หน้าจอดิจิตอลและการสื่อสาร
      payload.sid || 100,                    // ระยะ SID
      payload.errorX || 0,                 // ค่าเบี่ยงเบนแกน X
      payload.errorY || 0,                 // ค่าเบี่ยงเบนแกน Y
      payload.alignmentResult || "FAIL",     // ผลตรวจสอบ Beam Alignment
      gearDataJsonString,                    // รายละเอียดอุปกรณ์ป้องกันรังสี (JSON)
      operatorSignUrl,                       // ลายเซ็นผู้ตรวจ
      reviewerSignUrl,                       // ลายเซ็นหัวหน้า
      payload.suggestions || ""             // ข้อเสนอแนะเพิ่มเติม
    ];

    // Append to sheet
    sheet.appendRow(rowData);
    
    return {
      status: "success",
      message: "บันทึกข้อมูลเรียบร้อยแล้ว",
      timestamp: timestamp.toLocaleString("th-TH"),
      operatorSignUrl: operatorSignUrl,
      reviewerSignUrl: reviewerSignUrl,
      gearCount: itemsProcessed.length
    };

  } catch (error) {
    Logger.log("Error saved data to sheet: " + error.toString());
    return {
      status: "error",
      message: error.toString()
    };
  }
}

/**
 * Uploads a base64 encoded image string to the specified Google Drive folder,
 * updates permissions to anyone with link, and returns its public URL.
 * 
 * @param {string} base64Data Header-augmented base64 data string (e.g., "data:image/png;base64,...")
 * @param {string} filename Output name for the uploaded file
 * @return {string} Publicly viewable link to the uploaded image file in Google Drive
 */
function uploadBase64Image(base64Data, filename) {
  try {
    var parts = base64Data.split(',');
    var metadata = parts[0];
    var base64Content = parts[1];
    
    // Extract mimetype from metadata string (e.g. "data:image/png;base64")
    var mimeType = "image/png";
    var mimeMatch = metadata.match(/data:([^;]+);/);
    if (mimeMatch && mimeMatch[1]) {
      mimeType = mimeMatch[1];
    }
    
    var decodedBlob = Utilities.newBlob(Utilities.base64Decode(base64Content), mimeType, filename);
    
    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var file = folder.createFile(decodedBlob);
    
    // Set view approvals so sheet users can check attached links easily
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    return file.getUrl();
  } catch (err) {
    Logger.log("Failed to upload base64 image: " + err.toString());
    // Fallback if uploading fails, return empty
    return "";
  }
}

/**
 * Fetches recent historical entries to simulate or share data on the index.html reporting view.
 * 
 * @return {Array} Array of formatted history entries from Google Sheet
 */
function getInspectionHistory() {
  try {
    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return [];
    }
    
    var range = sheet.getDataRange();
    var values = range.getValues();
    if (values.length <= 1) {
      return []; // Headers only
    }
    
    var history = [];
    var headers = values[0];
    
    // Read up to last 30 rows in descending order
    var lastRow = values.length - 1;
    var startRow = Math.max(1, lastRow - 30);
    
    for (var i = lastRow; i >= startRow; i--) {
      var row = values[i];
      var entry = {
        timestamp: row[0] ? row[0].toLocaleString("th-TH") : "",
        operatorName: row[1] || "",
        reviewerName: row[2] || "",
        machineId: row[3] || "",
        mechanicalStability: row[4] || "N/A",
        lockingBraking: row[5] || "N/A",
        collimatorIndicator: row[6] || "N/A",
        powerCables: row[7] || "N/A",
        displayStatus: row[8] || "N/A",
        sid: row[9] || 100,
        errorX: row[10] || 0,
        errorY: row[11] || 0,
        alignmentResult: row[12] || "FAIL",
        protectionGearRaw: row[13] || "[]",
        operatorSignUrl: row[14] || "",
        reviewerSignUrl: row[15] || "",
        suggestions: row[16] || ""
      };
      
      try {
        entry.protectionGear = JSON.parse(entry.protectionGearRaw);
      } catch (e) {
        entry.protectionGear = [];
      }
      
      history.push(entry);
    }
    
    return history;
  } catch (err) {
    Logger.log("Failed to fetch history: " + err.toString());
    return [];
  }
}
