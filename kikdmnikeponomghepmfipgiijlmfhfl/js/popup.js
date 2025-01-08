/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/popup.ts":
/*!**********************!*\
  !*** ./src/popup.ts ***!
  \**********************/
/***/ (function() {

// Add listeners to the elements in popup.html to update the sync storage when changes are made
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Helper methods
function getUsernameForToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        // If there's no token, the username has to be null
        if (token === '') {
            return null;
        }
        const headers = { Authorization: `token ${token}` };
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
        return username;
    });
}
// Get the old data of both of these values
chrome.storage.sync.get(['showLegend', 'personalAccessToken', 'personalAccessTokenOwner'], (result) => {
    setup(result);
});
function setup(result) {
    return __awaiter(this, void 0, void 0, function* () {
        const chartLegendCheck = document.getElementById('show-legend');
        const personalTokenInput = document.getElementById('personal-access-token');
        const showLegend = result.showLegend || false;
        const personalAccessToken = result.personalAccessToken || '';
        const personalAccessTokenOwner = result.personalAccessTokenOwner || '';
        // Set up the initial values of the inputs based on the storage read values
        chartLegendCheck.checked = showLegend;
        personalTokenInput.value = personalAccessToken;
        // Add event listeners to get the values when they change
        chartLegendCheck.addEventListener('click', () => {
            // Store the new value of the checkbox in sync storage
            chrome.storage.sync.set({ showLegend: chartLegendCheck.checked });
        }, false);
        personalTokenInput.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
            // Get the username for the Token as well, this will allow private repos to be included on the user's own page
            const token = personalTokenInput.value;
            const username = yield getUsernameForToken(token);
            const storedData = {
                personalAccessToken: token,
                personalAccessTokenOwner: username,
            };
            chrome.storage.sync.set(storedData);
        }), false);
        // Now enable the inputs for user input
        chartLegendCheck.disabled = false;
        personalTokenInput.disabled = false;
    });
}
// Set up a listener for a click on the link to open a tab to generate a token
const tokenUrl = 'https://github.com/settings/tokens/new?description=GitHub%20User%20Languages&scopes=repo';
document.getElementById('get-token').addEventListener('click', () => {
    chrome.tabs.create({ url: tokenUrl });
}, false);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/popup.ts"]();
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvcG9wdXAudHMiLCJ3ZWJwYWNrOi8vZ2l0aHViLXVzZXItbGFuZ3VhZ2VzL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHlCQUF5QixNQUFNO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLCtDQUErQyxVQUFVO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHVDQUF1QztBQUM1RSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnQkFBZ0I7QUFDeEMsQ0FBQzs7Ozs7Ozs7VUN4RUQ7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJwb3B1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEFkZCBsaXN0ZW5lcnMgdG8gdGhlIGVsZW1lbnRzIGluIHBvcHVwLmh0bWwgdG8gdXBkYXRlIHRoZSBzeW5jIHN0b3JhZ2Ugd2hlbiBjaGFuZ2VzIGFyZSBtYWRlXG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbi8vIEhlbHBlciBtZXRob2RzXG5mdW5jdGlvbiBnZXRVc2VybmFtZUZvclRva2VuKHRva2VuKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyB0b2tlbiwgdGhlIHVzZXJuYW1lIGhhcyB0byBiZSBudWxsXG4gICAgICAgIGlmICh0b2tlbiA9PT0gJycpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7IEF1dGhvcml6YXRpb246IGB0b2tlbiAke3Rva2VufWAgfTtcbiAgICAgICAgY29uc3QgdXJsID0gJ2h0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcic7XG4gICAgICAgIGxldCB1c2VybmFtZSA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKHVybCwgeyBoZWFkZXJzIH0pO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IHlpZWxkIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgICAgICB1c2VybmFtZSA9IGRhdGEubG9naW47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBJZiBub3Qgb2theSwgd2UnbGwgbGVhdmUgdGhlIHVzZXJuYW1lIGFzIG51bGxcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBhbiBlcnJvciB0aGVuIHRoZSB0b2tlbiBpcyBsaWtlbHkgaW52YWxpZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1c2VybmFtZTtcbiAgICB9KTtcbn1cbi8vIEdldCB0aGUgb2xkIGRhdGEgb2YgYm90aCBvZiB0aGVzZSB2YWx1ZXNcbmNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KFsnc2hvd0xlZ2VuZCcsICdwZXJzb25hbEFjY2Vzc1Rva2VuJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciddLCAocmVzdWx0KSA9PiB7XG4gICAgc2V0dXAocmVzdWx0KTtcbn0pO1xuZnVuY3Rpb24gc2V0dXAocmVzdWx0KSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc3QgY2hhcnRMZWdlbmRDaGVjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaG93LWxlZ2VuZCcpO1xuICAgICAgICBjb25zdCBwZXJzb25hbFRva2VuSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGVyc29uYWwtYWNjZXNzLXRva2VuJyk7XG4gICAgICAgIGNvbnN0IHNob3dMZWdlbmQgPSByZXN1bHQuc2hvd0xlZ2VuZCB8fCBmYWxzZTtcbiAgICAgICAgY29uc3QgcGVyc29uYWxBY2Nlc3NUb2tlbiA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnO1xuICAgICAgICBjb25zdCBwZXJzb25hbEFjY2Vzc1Rva2VuT3duZXIgPSByZXN1bHQucGVyc29uYWxBY2Nlc3NUb2tlbk93bmVyIHx8ICcnO1xuICAgICAgICAvLyBTZXQgdXAgdGhlIGluaXRpYWwgdmFsdWVzIG9mIHRoZSBpbnB1dHMgYmFzZWQgb24gdGhlIHN0b3JhZ2UgcmVhZCB2YWx1ZXNcbiAgICAgICAgY2hhcnRMZWdlbmRDaGVjay5jaGVja2VkID0gc2hvd0xlZ2VuZDtcbiAgICAgICAgcGVyc29uYWxUb2tlbklucHV0LnZhbHVlID0gcGVyc29uYWxBY2Nlc3NUb2tlbjtcbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byBnZXQgdGhlIHZhbHVlcyB3aGVuIHRoZXkgY2hhbmdlXG4gICAgICAgIGNoYXJ0TGVnZW5kQ2hlY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAvLyBTdG9yZSB0aGUgbmV3IHZhbHVlIG9mIHRoZSBjaGVja2JveCBpbiBzeW5jIHN0b3JhZ2VcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgc2hvd0xlZ2VuZDogY2hhcnRMZWdlbmRDaGVjay5jaGVja2VkIH0pO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIHBlcnNvbmFsVG9rZW5JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHVzZXJuYW1lIGZvciB0aGUgVG9rZW4gYXMgd2VsbCwgdGhpcyB3aWxsIGFsbG93IHByaXZhdGUgcmVwb3MgdG8gYmUgaW5jbHVkZWQgb24gdGhlIHVzZXIncyBvd24gcGFnZVxuICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBwZXJzb25hbFRva2VuSW5wdXQudmFsdWU7XG4gICAgICAgICAgICBjb25zdCB1c2VybmFtZSA9IHlpZWxkIGdldFVzZXJuYW1lRm9yVG9rZW4odG9rZW4pO1xuICAgICAgICAgICAgY29uc3Qgc3RvcmVkRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwZXJzb25hbEFjY2Vzc1Rva2VuOiB0b2tlbixcbiAgICAgICAgICAgICAgICBwZXJzb25hbEFjY2Vzc1Rva2VuT3duZXI6IHVzZXJuYW1lLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHN0b3JlZERhdGEpO1xuICAgICAgICB9KSwgZmFsc2UpO1xuICAgICAgICAvLyBOb3cgZW5hYmxlIHRoZSBpbnB1dHMgZm9yIHVzZXIgaW5wdXRcbiAgICAgICAgY2hhcnRMZWdlbmRDaGVjay5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICBwZXJzb25hbFRva2VuSW5wdXQuZGlzYWJsZWQgPSBmYWxzZTtcbiAgICB9KTtcbn1cbi8vIFNldCB1cCBhIGxpc3RlbmVyIGZvciBhIGNsaWNrIG9uIHRoZSBsaW5rIHRvIG9wZW4gYSB0YWIgdG8gZ2VuZXJhdGUgYSB0b2tlblxuY29uc3QgdG9rZW5VcmwgPSAnaHR0cHM6Ly9naXRodWIuY29tL3NldHRpbmdzL3Rva2Vucy9uZXc/ZGVzY3JpcHRpb249R2l0SHViJTIwVXNlciUyMExhbmd1YWdlcyZzY29wZXM9cmVwbyc7XG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2V0LXRva2VuJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgY2hyb21lLnRhYnMuY3JlYXRlKHsgdXJsOiB0b2tlblVybCB9KTtcbn0sIGZhbHNlKTtcbiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9zcmMvcG9wdXAudHNcIl0oKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=