/**
 * FutureBet.lol waitlist collector.
 *
 * Receives email signups from the landing page and appends them to the
 * spreadsheet this script is bound to. See README.md for the deploy steps.
 */

const SHEET_NAME = 'Signups';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // Serialise writes so two signups can't claim the same row.

  try {
    const payload = JSON.parse(e.postData.contents);
    const email = String(payload.email || '').trim();

    if (!email || email.indexOf('@') === -1) {
      return json({ ok: false, error: 'invalid email' });
    }

    const sheet = getSheet();
    if (isDuplicate(sheet, email)) {
      return json({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      payload.ts || new Date().toISOString(),
      email,
      payload.source || 'unknown',
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Email', 'Source']);
    sheet.getRange('A1:C1').setFontWeight('bold').setBackground('#ff00ff');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function isDuplicate(sheet, email) {
  const rows = sheet.getLastRow();
  if (rows < 2) return false;

  const existing = sheet.getRange(2, 2, rows - 1, 1).getValues();
  const needle = email.toLowerCase();
  return existing.some(function (row) {
    return String(row[0]).trim().toLowerCase() === needle;
  });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
