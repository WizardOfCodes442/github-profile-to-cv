/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background.ts":
/*!***************************!*\
  !*** ./src/background.ts ***!
  \***************************/
/***/ (function() {

/* Simple small background script for integrity purposes

  Integrity stuff:
    - Ensure that the sync storage is up to date with the 0.1.9 scheme (store token username)
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Run whenever the extension is installed / updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('Running Integrity Tests');
    console.log('Testing that sync storage is up to date (0.1.9)');
    chrome.storage.sync.get(['personalAccessToken', 'personalAccessTokenOwner'], (result) => __awaiter(this, void 0, void 0, function* () {
        // Ensure that the owner is set if the token is set, or set it otherwise
        const personalAccessToken = result.personalAccessToken || '';
        const personalAccessTokenOwner = result.personalAccessTokenOwner || '';
        if (personalAccessTokenOwner === '' && personalAccessToken !== '') {
            console.log('Data found to not match the structure for 0.1.9. Fixing.');
            const headers = { Authorization: `token ${personalAccessToken}` };
            const url = 'https://api.github.com/user';
            let username = null;
            try {
                const response = yield fetch(url, { headers });
                if (response.ok) {
                    const data = yield response.json();
                    username = data.login;
                }
                // If not okay, we'll leave the username as null
            }
            catch (e) {
                // If there's an error then the token is likely invalid
            }
            // Store that back in the sync storage
            chrome.storage.sync.set({ personalAccessTokenOwner: username });
        }
    }));
});


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/background.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvYmFja2dyb3VuZC50cyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHlCQUF5QixvQkFBb0I7QUFDMUU7QUFDQTtBQUNBO0FBQ0EsbURBQW1ELFVBQVU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMscUNBQXFDO0FBQzFFO0FBQ0EsS0FBSztBQUNMLENBQUM7Ozs7Ozs7O1VDMUNEO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFNpbXBsZSBzbWFsbCBiYWNrZ3JvdW5kIHNjcmlwdCBmb3IgaW50ZWdyaXR5IHB1cnBvc2VzXG5cbiAgSW50ZWdyaXR5IHN0dWZmOlxuICAgIC0gRW5zdXJlIHRoYXQgdGhlIHN5bmMgc3RvcmFnZSBpcyB1cCB0byBkYXRlIHdpdGggdGhlIDAuMS45IHNjaGVtZSAoc3RvcmUgdG9rZW4gdXNlcm5hbWUpXG4qL1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG4vLyBSdW4gd2hlbmV2ZXIgdGhlIGV4dGVuc2lvbiBpcyBpbnN0YWxsZWQgLyB1cGRhdGVkXG5jaHJvbWUucnVudGltZS5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1J1bm5pbmcgSW50ZWdyaXR5IFRlc3RzJyk7XG4gICAgY29uc29sZS5sb2coJ1Rlc3RpbmcgdGhhdCBzeW5jIHN0b3JhZ2UgaXMgdXAgdG8gZGF0ZSAoMC4xLjkpJyk7XG4gICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydwZXJzb25hbEFjY2Vzc1Rva2VuJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciddLCAocmVzdWx0KSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBvd25lciBpcyBzZXQgaWYgdGhlIHRva2VuIGlzIHNldCwgb3Igc2V0IGl0IG90aGVyd2lzZVxuICAgICAgICBjb25zdCBwZXJzb25hbEFjY2Vzc1Rva2VuID0gcmVzdWx0LnBlcnNvbmFsQWNjZXNzVG9rZW4gfHwgJyc7XG4gICAgICAgIGNvbnN0IHBlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuT3duZXIgfHwgJyc7XG4gICAgICAgIGlmIChwZXJzb25hbEFjY2Vzc1Rva2VuT3duZXIgPT09ICcnICYmIHBlcnNvbmFsQWNjZXNzVG9rZW4gIT09ICcnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnRGF0YSBmb3VuZCB0byBub3QgbWF0Y2ggdGhlIHN0cnVjdHVyZSBmb3IgMC4xLjkuIEZpeGluZy4nKTtcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7IEF1dGhvcml6YXRpb246IGB0b2tlbiAke3BlcnNvbmFsQWNjZXNzVG9rZW59YCB9O1xuICAgICAgICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcic7XG4gICAgICAgICAgICBsZXQgdXNlcm5hbWUgPSBudWxsO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKHVybCwgeyBoZWFkZXJzIH0pO1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgICAgICB1c2VybmFtZSA9IGRhdGEubG9naW47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIElmIG5vdCBva2F5LCB3ZSdsbCBsZWF2ZSB0aGUgdXNlcm5hbWUgYXMgbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIGFuIGVycm9yIHRoZW4gdGhlIHRva2VuIGlzIGxpa2VseSBpbnZhbGlkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTdG9yZSB0aGF0IGJhY2sgaW4gdGhlIHN5bmMgc3RvcmFnZVxuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyBwZXJzb25hbEFjY2Vzc1Rva2VuT3duZXI6IHVzZXJuYW1lIH0pO1xuICAgICAgICB9XG4gICAgfSkpO1xufSk7XG4iLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuX193ZWJwYWNrX21vZHVsZXNfX1tcIi4vc3JjL2JhY2tncm91bmQudHNcIl0oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=