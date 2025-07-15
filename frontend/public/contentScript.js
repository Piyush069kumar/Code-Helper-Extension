console.log("Content script loaded!");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.type === "GET_QUESTION") {
    let question = "";
    let langElem = "";

    // Naukri: Extract the main problem statement
    if(window.location.hostname.includes("naukri.com")) {
      let lang = document.querySelector('.zen-typo-caption-bold.lang-name');
      if(lang) {
        langElem = lang.innerText;
      }

      const mainStatementElem = document.querySelector('.problem-main-statement');
      if (mainStatementElem) {
        question = mainStatementElem.innerText;
      }
    }

    // Leetcode: Extract the main problem statement
    if (window.location.hostname.includes("leetcode.com")) {
      let lang= document.querySelector('button[aria-controls][aria-expanded][class*="inline-flex"]');
      console.log(lang);
      if(lang) {
        langElem = lang.innerText;
      }
      // Try the most specific selector first
      let leetcodeElem = document.querySelector('div.elfjS[data-track-load="description_content"]');
      // Fallback: just the class
      if (!leetcodeElem) {
        leetcodeElem = document.querySelector('.elfjS');
      }
      // Fallback: any element with the data attribute
      if (!leetcodeElem) {
        leetcodeElem = document.querySelector('[data-track-load="description_content"]');
      }
      if (leetcodeElem) {
        question = leetcodeElem.innerText;
      }
    }

    //hackerrank: Extract the main problem statement   

    //About Bug : in thiss language not fetch we need to fix it

    if (window.location.hostname.includes("hackerrank.com")) {
      let nodes= document .querySelectorAll('.breadcrumb-item-text');
      const lang = nodes[5];
      // console.log(lang);
      if(lang) {
        langElem = lang.innerText;
        // console.log(langElem);
      }
      let questionElem = document.querySelector('.hackdown-content');
      if(questionElem) {
        question = questionElem.innerText;
      }
    }

    //geeksforgeeks: Extract the main problem statement
    if (window.location.hostname.includes("geeksforgeeks.org")) {
      let lang= document.querySelector('.divider.text');
      // console.log(lang);
      if(lang) {
        langElem = lang.innerText;
        // console.log(langElem);
      }
      let nodes  = document.querySelectorAll('.undefined');
      const questionElem = nodes[2];  
      if(questionElem) {
        question = questionElem.innerText.trim();
      }
    }

    console.log(question);
    sendResponse({ question, langElem });
  }
  return true;
});