/* global chrome */

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.set({state: undefined});
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({url: chrome.extension.getURL('index.html')});
});
