/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/content.ts":
/*!************************!*\
  !*** ./src/content.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// This script is excuted directly from inside the page
const chart_js_1 = __webpack_require__(/*! chart.js */ "./node_modules/chart.js/dist/chart.esm.js");
const data_1 = __webpack_require__(/*! ./data */ "./src/data.ts");
const errors_1 = __webpack_require__(/*! ./errors */ "./src/errors.ts");
// Register the parts of Chart.js I need
chart_js_1.Chart.register(chart_js_1.PieController, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.ArcElement, chart_js_1.LineElement);
// Set an XPath syntax to find User and Organisation containers for storing the graph
const ORG_XPATH = '//*[text() = "Top languages"]';
const USER_CONTAINER_SELECTOR = 'div[itemtype="http://schema.org/Person"]';
class LanguageDisplay {
    constructor(username) {
        this.username = username;
        this.parent = document.querySelector(USER_CONTAINER_SELECTOR);
        // Maintain a flag to find out of the page is an organisation one or not
        let isOrg = false;
        // Handling for orgs
        if (this.parent === null) {
            // Org page, use the XPATH to find the correct node and set flag
            isOrg = true;
            const orgLanguagesHeader = document.evaluate(ORG_XPATH, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            this.parent = orgLanguagesHeader.parentElement.parentElement.parentElement;
        }
        this.canvas = null;
        this.container = null;
        // Get the personal access token from sync storage and fetch data
        chrome.storage.sync.get(['personalAccessToken', 'personalAccessTokenOwner'], (result) => {
            const token = result.personalAccessToken || '';
            const tokenOwner = result.personalAccessTokenOwner || null;
            const tokenData = {
                token,
                username: tokenOwner,
            };
            // Fetch the lang data now
            this.data = new data_1.Data(username, isOrg, tokenData);
            this.getData();
        });
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the color data from the json file
            // Use the promise provided by the Data class to get all necessary data
            try {
                const values = yield this.data.getData();
                // 0 -> color data, 1 -> repo data
                const colorData = values[0];
                const repoData = values[1];
                // If the repoData is empty, don't go any further
                if (this.data.emptyAccount) {
                    return;
                }
                // Cache the repoData we just got, if we need to
                if (!this.data.repoDataFromCache) {
                    this.cacheData(repoData);
                }
                // Build the graph
                this.build(colorData, repoData);
            }
            catch (e) {
                console.error(`gh-user-langs: Error creating graph: ${e}`);
                // This is where we need to add the error display
                // Create the container, add it to the page and then add an error message to it
                this.container = this.createContainer();
                // If the error is an api error, just get the message out of it, otherwise insert generic message
                let message = 'An error occurred when fetching data from the GitHub API. This could be due to rate-limiting.' +
                    ' Please try again later or add a personal access token for increase API usage, or see console for more info.';
                if (e instanceof errors_1.GHULError) {
                    message = e.message;
                }
                this.parent.appendChild(document.createTextNode(message));
            }
        });
    }
    cacheData(data) {
        // Store the repo data in the cache for the username
        const cachedAt = new Date().valueOf();
        const value = {
            cachedAt,
            data,
        };
        const cacheData = {};
        cacheData[this.username] = value;
        chrome.storage.local.set(cacheData);
    }
    createContainer() {
        const div = document.createElement('div');
        const header = document.createElement('h4');
        const headerText = document.createTextNode('Languages');
        header.appendChild(headerText);
        div.classList.add('border-top', 'color-border-secondary', 'pt-3', 'mt-3', 'clearfix', 'hide-sm', 'hide-md');
        header.classList.add('mb-2', 'h4');
        div.appendChild(header);
        // Append the container to the parent
        this.parent.appendChild(div);
        return div;
    }
    createCanvas(width) {
        // Round width down to the nearest 50
        width = Math.floor(width / 50) * 50;
        // Create the canvas to put the chart in
        const canvas = document.createElement('canvas');
        // Before creating the Charts.js thing ensure that we set the
        // width and height to be the computed width of the containing div
        canvas.id = 'github-user-languages-language-chart';
        canvas.width = width;
        canvas.height = width;
        // Save the canvas
        return canvas;
    }
    build(colorData, repoData) {
        this.container = this.createContainer();
        // Get the width and height of the container and use it to build the canvas
        const width = +(window.getComputedStyle(this.container).width.split('px')[0]);
        this.canvas = this.createCanvas(width);
        this.container.appendChild(this.canvas);
        // Get whether or not we should draw the legend from the sync storage and draw the chart
        chrome.storage.sync.get(['showLegend'], (result) => {
            const showLegend = result.showLegend || false;
            this.draw(colorData, repoData, showLegend);
        });
    }
    draw(colorData, repoData, showLegend) {
        // Create the pie chart and populate it with the repo data
        const counts = [];
        const colors = [];
        const langs = [];
        for (const prop of Object.keys(repoData).sort()) {
            if (repoData.hasOwnProperty(prop)) {
                // Prop is one of the languages
                langs.push(prop);
                counts.push(repoData[prop]);
                colors.push((colorData[prop] || {}).color || '#ededed');
            }
        }
        // Update the canvas height based on the number of languages
        this.canvas.height += (20 * Math.ceil(langs.length / 2));
        const chart = new chart_js_1.Chart(this.canvas, {
            data: {
                datasets: [{
                        backgroundColor: colors,
                        data: counts,
                        label: 'Repo Count',
                    }],
                labels: langs,
            },
            options: {
                plugins: {
                    legend: {
                        display: showLegend,
                    },
                },
            },
            type: 'pie',
        });
        // Add event listeners to get the slice that was clicked on
        // Will redirect to a list of the user's repos of that language
        this.canvas.onclick = (e) => {
            const slice = chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true)[0];
            if (slice === undefined) {
                return;
            }
            // Have to encode it in case of C++ and C#
            const language = encodeURIComponent(langs[slice.index].toLowerCase());
            // Redirect to the user's list of that language
            window.location.href = `https://github.com/${this.username}?tab=repositories&language=${language}`;
        };
        // Set up a listener for changes to the `showLegend` key of storage
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if ('showLegend' in changes) {
                // Update the chart to set the legend display to the newValue of the storage
                chart.options.plugins.legend.display = changes.showLegend.newValue;
                chart.update();
            }
        });
    }
}
// Get the profile name for the current page, if the current page is an account page
// The profile name will get retrieved from location.pathname
let profileName = null;
let path = window.location.pathname.substr(1);
// Trim the trailing slash if there is one
if (path[path.length - 1] === '/') {
    path = path.slice(0, -1);
}
// The page is correct if the length of path.split is 1 and the first item isn't the empty string
const splitPath = path.split('/');
if (splitPath.length === 1 && splitPath[0].length !== 0) {
    profileName = splitPath[0];
}
// If profileName is not null, draw the chart
if (profileName !== null) {
    const graph = new LanguageDisplay(profileName);
}


/***/ }),

/***/ "./src/data.ts":
/*!*********************!*\
  !*** ./src/data.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Data = void 0;
// Class for handling the fetch of repo and color data, be it from cache or the API
// Allows the content script to be agnostic as to where the data is coming from as this class will use promises
const errors_1 = __webpack_require__(/*! ./errors */ "./src/errors.ts");
const REPO_CACHE_THRESHOLD = 36e5; // 1 hour
// The repo I pull from now is updated weekly so this makes sense
const COLOR_CACHE_THRESHOLD = REPO_CACHE_THRESHOLD * 24 * 7; // 7 days
const COLOR_CACHE_KEY = 'GHUL_COLORS';
const COLOR_URL = 'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';
class Data {
    constructor(username, isOrg, token) {
        this.repoDataFromCache = false;
        this.emptyAccount = true;
        this.username = username;
        this.isOrg = isOrg;
        this.personalToken = token;
    }
    getData() {
        // Gets both the color data and repo data and returns a Promise that will resolve to get both of them
        // Calling .then on this should get back an array of two values color and repo data respectively
        return Promise.all([this.getColorData(), this.getRepoData()]);
    }
    // Fetches color data from local storage, or downloads it again if it's more than a week old
    getColorData() {
        return __awaiter(this, void 0, void 0, function* () {
            let colorData;
            try {
                // Check the cache
                const cachedData = yield this.checkColorCache();
                colorData = cachedData.data;
            }
            catch (e) {
                colorData = yield this.fetchColorData();
                // Cache the data
                const cachedAt = new Date().valueOf();
                const value = {
                    cachedAt,
                    data: colorData,
                };
                const cacheData = {};
                cacheData[COLOR_CACHE_KEY] = value;
                chrome.storage.local.set(cacheData);
            }
            // Return the found data, regardless of source
            return colorData;
        });
    }
    checkColorCache() {
        // Create a promise to retrieve the key from cache, or reject if it's not there
        return new Promise((resolve, reject) => {
            // return reject() // Uncomment this to turn off cache reads when in development
            chrome.storage.local.get([COLOR_CACHE_KEY], (result) => {
                // If the data isn't there, result will be an empty object
                if (Object.keys(result).length < 1) {
                    // If we get to this point, there was nothing in cache or the cache was invalid
                    return reject();
                }
                // We have a cached object, so check time of cache
                const cachedData = result[COLOR_CACHE_KEY];
                if (new Date().valueOf() - cachedData.cachedAt < COLOR_CACHE_THRESHOLD) {
                    // We can use the cached version
                    // Set emptyAccount flag to false here too
                    this.emptyAccount = false;
                    return resolve(cachedData);
                }
                return reject();
            });
        });
    }
    // Fetch the new color data
    fetchColorData() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(COLOR_URL);
            return response.json();
        });
    }
    // Fetches the repo data either from cache or from the API and returns a Promise for the data
    getRepoData() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Check if the user's data is in the cache
                const cachedData = yield this.checkRepoCache();
                this.repoDataFromCache = true;
                return Promise.resolve(cachedData.data);
            }
            catch (e) {
                // Data wasn't in cache so get new data
                return this.fetchRepoData();
            }
        });
    }
    checkRepoCache() {
        // Create a promise to retrieve the key from cache, or reject if it's not there
        return new Promise((resolve, reject) => {
            // return reject() // Uncomment this to turn off cache reads when in development
            chrome.storage.local.get([this.username], (result) => {
                // If the data isn't there, result will be an empty object
                if (Object.keys(result).length < 1) {
                    // If we get to this point, there was nothing in cache or the cache was invalid
                    return reject();
                }
                // We have a cached object, so check time of cache
                const cachedData = result[this.username];
                if (new Date().valueOf() - cachedData.cachedAt < REPO_CACHE_THRESHOLD) {
                    // We can use the cached version
                    // Set emptyAccount flag to false here too
                    this.emptyAccount = false;
                    return resolve(cachedData);
                }
                return reject();
            });
        });
    }
    // Fetch repository data from the API
    fetchRepoData() {
        return __awaiter(this, void 0, void 0, function* () {
            let url = this.generateAPIURL();
            let linkHeader;
            let repoData = {};
            const headers = {};
            if (this.personalToken !== null && this.personalToken.username !== null) {
                headers.Authorization = `token ${this.personalToken.token}`;
            }
            // Use Promise.resolve to wait for the result
            let response = yield fetch(url, { headers });
            linkHeader = response.headers.get('link');
            // Stumbled across this little error tonight
            if (response.status !== 200) {
                console.error(response);
                throw new errors_1.GHULError(`Incorrect status received from GitHub API. Expected 200, received; ${response.status}. ` +
                    'See console for more details.');
            }
            let data = yield response.json();
            // From this JSON response, compile repoData (to reduce memory usage) and then see if there's more to fetch
            repoData = this.updateRepoData(repoData, data);
            // Now loop through the link headers, fetching more data and updating the repos dict
            url = this.getNextUrlFromHeader(linkHeader);
            while (url !== null) {
                // Send a request and update the repo data again
                response = yield fetch(url, { headers });
                linkHeader = response.headers.get('link');
                data = yield response.json();
                repoData = this.updateRepoData(repoData, data);
                url = this.getNextUrlFromHeader(linkHeader);
            }
            // Still gonna return a promise
            return Promise.resolve(repoData);
        });
    }
    updateRepoData(repoData, json) {
        for (const repo of json) {
            if (repo.language === null) {
                continue;
            }
            let count = repoData[repo.language] || 0;
            count++;
            repoData[repo.language] = count;
            this.emptyAccount = false;
        }
        return repoData;
    }
    generateAPIURL() {
        // Generate the correct API URL request given the circumstances of the request
        // Circumstances: Org or User page, and if User page, is it the User using the extension
        const urlBase = 'https://api.github.com';
        const query = 'page=1&per_page=50';
        let url;
        if (this.isOrg) {
            url = `${urlBase}/orgs/${this.username}/repos?${query}`;
        }
        else if (this.username === this.personalToken.username) {
            // Send the request to list the user's own repos
            url = `${urlBase}/user/repos?${query}&affiliation=owner`;
        }
        else {
            // Send the request to the normal users endpoint
            url = `${urlBase}/users/${this.username}/repos?${query}`;
        }
        return url;
    }
    // Helper method to get the next url to go to
    getNextUrlFromHeader(header) {
        if (header === null) {
            return null;
        }
        const regex = /\<(.*)\>/;
        // The header can contain many URLs, separated by commas, each with a rel
        // We want only the one that contains rel="next"
        for (const url of header.split(', ')) {
            if (url.includes('rel="next"')) {
                // We need to retrive the actual URL part using regex
                return regex.exec(url)[1];
            }
        }
        return null;
    }
}
exports.Data = Data;


/***/ }),

/***/ "./src/errors.ts":
/*!***********************!*\
  !*** ./src/errors.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GHULError = void 0;
class GHULError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GHULError';
    }
}
exports.GHULError = GHULError;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					result = fn();
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"content_script": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) var result = runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgithub_user_languages"] = self["webpackChunkgithub_user_languages"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendor"], () => (__webpack_require__("./src/content.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvY29udGVudC50cyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvZGF0YS50cyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvLi9zcmMvZXJyb3JzLnRzIiwid2VicGFjazovL2dpdGh1Yi11c2VyLWxhbmd1YWdlcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2dpdGh1Yi11c2VyLWxhbmd1YWdlcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2dpdGh1Yi11c2VyLWxhbmd1YWdlcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2dpdGh1Yi11c2VyLWxhbmd1YWdlcy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9naXRodWItdXNlci1sYW5ndWFnZXMvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0EsMkJBQTJCLCtEQUErRCxnQkFBZ0IsRUFBRSxFQUFFO0FBQzlHO0FBQ0EsbUNBQW1DLE1BQU0sNkJBQTZCLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDakcsa0NBQWtDLE1BQU0saUNBQWlDLEVBQUUsWUFBWSxXQUFXLEVBQUU7QUFDcEcsK0JBQStCLHFGQUFxRjtBQUNwSDtBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RDtBQUNBLG1CQUFtQixtQkFBTyxDQUFD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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7Ozs7V0N6QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSw4QkFBOEIsd0NBQXdDO1dBQ3RFO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsZ0JBQWdCLHFCQUFxQjtXQUNyQztXQUNBO1dBQ0EsaUJBQWlCLHFCQUFxQjtXQUN0QztXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRTs7Ozs7V0MxQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLE1BQU0sb0JBQW9CO1dBQzFCO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLDRHOzs7OztVQzlDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImNvbnRlbnRfc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIFRoaXMgc2NyaXB0IGlzIGV4Y3V0ZWQgZGlyZWN0bHkgZnJvbSBpbnNpZGUgdGhlIHBhZ2VcbmNvbnN0IGNoYXJ0X2pzXzEgPSByZXF1aXJlKFwiY2hhcnQuanNcIik7XG5jb25zdCBkYXRhXzEgPSByZXF1aXJlKFwiLi9kYXRhXCIpO1xuY29uc3QgZXJyb3JzXzEgPSByZXF1aXJlKFwiLi9lcnJvcnNcIik7XG4vLyBSZWdpc3RlciB0aGUgcGFydHMgb2YgQ2hhcnQuanMgSSBuZWVkXG5jaGFydF9qc18xLkNoYXJ0LnJlZ2lzdGVyKGNoYXJ0X2pzXzEuUGllQ29udHJvbGxlciwgY2hhcnRfanNfMS5Ub29sdGlwLCBjaGFydF9qc18xLkxlZ2VuZCwgY2hhcnRfanNfMS5BcmNFbGVtZW50LCBjaGFydF9qc18xLkxpbmVFbGVtZW50KTtcbi8vIFNldCBhbiBYUGF0aCBzeW50YXggdG8gZmluZCBVc2VyIGFuZCBPcmdhbmlzYXRpb24gY29udGFpbmVycyBmb3Igc3RvcmluZyB0aGUgZ3JhcGhcbmNvbnN0IE9SR19YUEFUSCA9ICcvLypbdGV4dCgpID0gXCJUb3AgbGFuZ3VhZ2VzXCJdJztcbmNvbnN0IFVTRVJfQ09OVEFJTkVSX1NFTEVDVE9SID0gJ2RpdltpdGVtdHlwZT1cImh0dHA6Ly9zY2hlbWEub3JnL1BlcnNvblwiXSc7XG5jbGFzcyBMYW5ndWFnZURpc3BsYXkge1xuICAgIGNvbnN0cnVjdG9yKHVzZXJuYW1lKSB7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgdGhpcy5wYXJlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFVTRVJfQ09OVEFJTkVSX1NFTEVDVE9SKTtcbiAgICAgICAgLy8gTWFpbnRhaW4gYSBmbGFnIHRvIGZpbmQgb3V0IG9mIHRoZSBwYWdlIGlzIGFuIG9yZ2FuaXNhdGlvbiBvbmUgb3Igbm90XG4gICAgICAgIGxldCBpc09yZyA9IGZhbHNlO1xuICAgICAgICAvLyBIYW5kbGluZyBmb3Igb3Jnc1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIE9yZyBwYWdlLCB1c2UgdGhlIFhQQVRIIHRvIGZpbmQgdGhlIGNvcnJlY3Qgbm9kZSBhbmQgc2V0IGZsYWdcbiAgICAgICAgICAgIGlzT3JnID0gdHJ1ZTtcbiAgICAgICAgICAgIGNvbnN0IG9yZ0xhbmd1YWdlc0hlYWRlciA9IGRvY3VtZW50LmV2YWx1YXRlKE9SR19YUEFUSCwgZG9jdW1lbnQsIG51bGwsIFhQYXRoUmVzdWx0LkZJUlNUX09SREVSRURfTk9ERV9UWVBFLCBudWxsKS5zaW5nbGVOb2RlVmFsdWU7XG4gICAgICAgICAgICB0aGlzLnBhcmVudCA9IG9yZ0xhbmd1YWdlc0hlYWRlci5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGw7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgLy8gR2V0IHRoZSBwZXJzb25hbCBhY2Nlc3MgdG9rZW4gZnJvbSBzeW5jIHN0b3JhZ2UgYW5kIGZldGNoIGRhdGFcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydwZXJzb25hbEFjY2Vzc1Rva2VuJywgJ3BlcnNvbmFsQWNjZXNzVG9rZW5Pd25lciddLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgdG9rZW5Pd25lciA9IHJlc3VsdC5wZXJzb25hbEFjY2Vzc1Rva2VuT3duZXIgfHwgbnVsbDtcbiAgICAgICAgICAgIGNvbnN0IHRva2VuRGF0YSA9IHtcbiAgICAgICAgICAgICAgICB0b2tlbixcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdG9rZW5Pd25lcixcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLyBGZXRjaCB0aGUgbGFuZyBkYXRhIG5vd1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3IGRhdGFfMS5EYXRhKHVzZXJuYW1lLCBpc09yZywgdG9rZW5EYXRhKTtcbiAgICAgICAgICAgIHRoaXMuZ2V0RGF0YSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIEZldGNoIHRoZSBjb2xvciBkYXRhIGZyb20gdGhlIGpzb24gZmlsZVxuICAgICAgICAgICAgLy8gVXNlIHRoZSBwcm9taXNlIHByb3ZpZGVkIGJ5IHRoZSBEYXRhIGNsYXNzIHRvIGdldCBhbGwgbmVjZXNzYXJ5IGRhdGFcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0geWllbGQgdGhpcy5kYXRhLmdldERhdGEoKTtcbiAgICAgICAgICAgICAgICAvLyAwIC0+IGNvbG9yIGRhdGEsIDEgLT4gcmVwbyBkYXRhXG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3JEYXRhID0gdmFsdWVzWzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcG9EYXRhID0gdmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSByZXBvRGF0YSBpcyBlbXB0eSwgZG9uJ3QgZ28gYW55IGZ1cnRoZXJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYXRhLmVtcHR5QWNjb3VudCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIENhY2hlIHRoZSByZXBvRGF0YSB3ZSBqdXN0IGdvdCwgaWYgd2UgbmVlZCB0b1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5kYXRhLnJlcG9EYXRhRnJvbUNhY2hlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGVEYXRhKHJlcG9EYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gQnVpbGQgdGhlIGdyYXBoXG4gICAgICAgICAgICAgICAgdGhpcy5idWlsZChjb2xvckRhdGEsIHJlcG9EYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgZ2gtdXNlci1sYW5nczogRXJyb3IgY3JlYXRpbmcgZ3JhcGg6ICR7ZX1gKTtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIHdoZXJlIHdlIG5lZWQgdG8gYWRkIHRoZSBlcnJvciBkaXNwbGF5XG4gICAgICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBjb250YWluZXIsIGFkZCBpdCB0byB0aGUgcGFnZSBhbmQgdGhlbiBhZGQgYW4gZXJyb3IgbWVzc2FnZSB0byBpdFxuICAgICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID0gdGhpcy5jcmVhdGVDb250YWluZXIoKTtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZXJyb3IgaXMgYW4gYXBpIGVycm9yLCBqdXN0IGdldCB0aGUgbWVzc2FnZSBvdXQgb2YgaXQsIG90aGVyd2lzZSBpbnNlcnQgZ2VuZXJpYyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgbGV0IG1lc3NhZ2UgPSAnQW4gZXJyb3Igb2NjdXJyZWQgd2hlbiBmZXRjaGluZyBkYXRhIGZyb20gdGhlIEdpdEh1YiBBUEkuIFRoaXMgY291bGQgYmUgZHVlIHRvIHJhdGUtbGltaXRpbmcuJyArXG4gICAgICAgICAgICAgICAgICAgICcgUGxlYXNlIHRyeSBhZ2FpbiBsYXRlciBvciBhZGQgYSBwZXJzb25hbCBhY2Nlc3MgdG9rZW4gZm9yIGluY3JlYXNlIEFQSSB1c2FnZSwgb3Igc2VlIGNvbnNvbGUgZm9yIG1vcmUgaW5mby4nO1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgZXJyb3JzXzEuR0hVTEVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhY2hlRGF0YShkYXRhKSB7XG4gICAgICAgIC8vIFN0b3JlIHRoZSByZXBvIGRhdGEgaW4gdGhlIGNhY2hlIGZvciB0aGUgdXNlcm5hbWVcbiAgICAgICAgY29uc3QgY2FjaGVkQXQgPSBuZXcgRGF0ZSgpLnZhbHVlT2YoKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB7XG4gICAgICAgICAgICBjYWNoZWRBdCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNhY2hlRGF0YSA9IHt9O1xuICAgICAgICBjYWNoZURhdGFbdGhpcy51c2VybmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KGNhY2hlRGF0YSk7XG4gICAgfVxuICAgIGNyZWF0ZUNvbnRhaW5lcigpIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XG4gICAgICAgIGNvbnN0IGhlYWRlclRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnTGFuZ3VhZ2VzJyk7XG4gICAgICAgIGhlYWRlci5hcHBlbmRDaGlsZChoZWFkZXJUZXh0KTtcbiAgICAgICAgZGl2LmNsYXNzTGlzdC5hZGQoJ2JvcmRlci10b3AnLCAnY29sb3ItYm9yZGVyLXNlY29uZGFyeScsICdwdC0zJywgJ210LTMnLCAnY2xlYXJmaXgnLCAnaGlkZS1zbScsICdoaWRlLW1kJyk7XG4gICAgICAgIGhlYWRlci5jbGFzc0xpc3QuYWRkKCdtYi0yJywgJ2g0Jyk7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChoZWFkZXIpO1xuICAgICAgICAvLyBBcHBlbmQgdGhlIGNvbnRhaW5lciB0byB0aGUgcGFyZW50XG4gICAgICAgIHRoaXMucGFyZW50LmFwcGVuZENoaWxkKGRpdik7XG4gICAgICAgIHJldHVybiBkaXY7XG4gICAgfVxuICAgIGNyZWF0ZUNhbnZhcyh3aWR0aCkge1xuICAgICAgICAvLyBSb3VuZCB3aWR0aCBkb3duIHRvIHRoZSBuZWFyZXN0IDUwXG4gICAgICAgIHdpZHRoID0gTWF0aC5mbG9vcih3aWR0aCAvIDUwKSAqIDUwO1xuICAgICAgICAvLyBDcmVhdGUgdGhlIGNhbnZhcyB0byBwdXQgdGhlIGNoYXJ0IGluXG4gICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgICAgICAvLyBCZWZvcmUgY3JlYXRpbmcgdGhlIENoYXJ0cy5qcyB0aGluZyBlbnN1cmUgdGhhdCB3ZSBzZXQgdGhlXG4gICAgICAgIC8vIHdpZHRoIGFuZCBoZWlnaHQgdG8gYmUgdGhlIGNvbXB1dGVkIHdpZHRoIG9mIHRoZSBjb250YWluaW5nIGRpdlxuICAgICAgICBjYW52YXMuaWQgPSAnZ2l0aHViLXVzZXItbGFuZ3VhZ2VzLWxhbmd1YWdlLWNoYXJ0JztcbiAgICAgICAgY2FudmFzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSB3aWR0aDtcbiAgICAgICAgLy8gU2F2ZSB0aGUgY2FudmFzXG4gICAgICAgIHJldHVybiBjYW52YXM7XG4gICAgfVxuICAgIGJ1aWxkKGNvbG9yRGF0YSwgcmVwb0RhdGEpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmNyZWF0ZUNvbnRhaW5lcigpO1xuICAgICAgICAvLyBHZXQgdGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNvbnRhaW5lciBhbmQgdXNlIGl0IHRvIGJ1aWxkIHRoZSBjYW52YXNcbiAgICAgICAgY29uc3Qgd2lkdGggPSArKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGFpbmVyKS53aWR0aC5zcGxpdCgncHgnKVswXSk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMod2lkdGgpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG4gICAgICAgIC8vIEdldCB3aGV0aGVyIG9yIG5vdCB3ZSBzaG91bGQgZHJhdyB0aGUgbGVnZW5kIGZyb20gdGhlIHN5bmMgc3RvcmFnZSBhbmQgZHJhdyB0aGUgY2hhcnRcbiAgICAgICAgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoWydzaG93TGVnZW5kJ10sIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNob3dMZWdlbmQgPSByZXN1bHQuc2hvd0xlZ2VuZCB8fCBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuZHJhdyhjb2xvckRhdGEsIHJlcG9EYXRhLCBzaG93TGVnZW5kKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRyYXcoY29sb3JEYXRhLCByZXBvRGF0YSwgc2hvd0xlZ2VuZCkge1xuICAgICAgICAvLyBDcmVhdGUgdGhlIHBpZSBjaGFydCBhbmQgcG9wdWxhdGUgaXQgd2l0aCB0aGUgcmVwbyBkYXRhXG4gICAgICAgIGNvbnN0IGNvdW50cyA9IFtdO1xuICAgICAgICBjb25zdCBjb2xvcnMgPSBbXTtcbiAgICAgICAgY29uc3QgbGFuZ3MgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIG9mIE9iamVjdC5rZXlzKHJlcG9EYXRhKS5zb3J0KCkpIHtcbiAgICAgICAgICAgIGlmIChyZXBvRGF0YS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgICAgIC8vIFByb3AgaXMgb25lIG9mIHRoZSBsYW5ndWFnZXNcbiAgICAgICAgICAgICAgICBsYW5ncy5wdXNoKHByb3ApO1xuICAgICAgICAgICAgICAgIGNvdW50cy5wdXNoKHJlcG9EYXRhW3Byb3BdKTtcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaCgoY29sb3JEYXRhW3Byb3BdIHx8IHt9KS5jb2xvciB8fCAnI2VkZWRlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSB0aGUgY2FudmFzIGhlaWdodCBiYXNlZCBvbiB0aGUgbnVtYmVyIG9mIGxhbmd1YWdlc1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgKz0gKDIwICogTWF0aC5jZWlsKGxhbmdzLmxlbmd0aCAvIDIpKTtcbiAgICAgICAgY29uc3QgY2hhcnQgPSBuZXcgY2hhcnRfanNfMS5DaGFydCh0aGlzLmNhbnZhcywge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIGRhdGFzZXRzOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBjb2xvcnMsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBjb3VudHMsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogJ1JlcG8gQ291bnQnLFxuICAgICAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgICBsYWJlbHM6IGxhbmdzLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBwbHVnaW5zOiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc2hvd0xlZ2VuZCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHR5cGU6ICdwaWUnLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVycyB0byBnZXQgdGhlIHNsaWNlIHRoYXQgd2FzIGNsaWNrZWQgb25cbiAgICAgICAgLy8gV2lsbCByZWRpcmVjdCB0byBhIGxpc3Qgb2YgdGhlIHVzZXIncyByZXBvcyBvZiB0aGF0IGxhbmd1YWdlXG4gICAgICAgIHRoaXMuY2FudmFzLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2xpY2UgPSBjaGFydC5nZXRFbGVtZW50c0F0RXZlbnRGb3JNb2RlKGUsICduZWFyZXN0JywgeyBpbnRlcnNlY3Q6IHRydWUgfSwgdHJ1ZSlbMF07XG4gICAgICAgICAgICBpZiAoc2xpY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEhhdmUgdG8gZW5jb2RlIGl0IGluIGNhc2Ugb2YgQysrIGFuZCBDI1xuICAgICAgICAgICAgY29uc3QgbGFuZ3VhZ2UgPSBlbmNvZGVVUklDb21wb25lbnQobGFuZ3Nbc2xpY2UuaW5kZXhdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICAgICAgLy8gUmVkaXJlY3QgdG8gdGhlIHVzZXIncyBsaXN0IG9mIHRoYXQgbGFuZ3VhZ2VcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYGh0dHBzOi8vZ2l0aHViLmNvbS8ke3RoaXMudXNlcm5hbWV9P3RhYj1yZXBvc2l0b3JpZXMmbGFuZ3VhZ2U9JHtsYW5ndWFnZX1gO1xuICAgICAgICB9O1xuICAgICAgICAvLyBTZXQgdXAgYSBsaXN0ZW5lciBmb3IgY2hhbmdlcyB0byB0aGUgYHNob3dMZWdlbmRgIGtleSBvZiBzdG9yYWdlXG4gICAgICAgIGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5hZGRMaXN0ZW5lcigoY2hhbmdlcywgbmFtZXNwYWNlKSA9PiB7XG4gICAgICAgICAgICBpZiAoJ3Nob3dMZWdlbmQnIGluIGNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGNoYXJ0IHRvIHNldCB0aGUgbGVnZW5kIGRpc3BsYXkgdG8gdGhlIG5ld1ZhbHVlIG9mIHRoZSBzdG9yYWdlXG4gICAgICAgICAgICAgICAgY2hhcnQub3B0aW9ucy5wbHVnaW5zLmxlZ2VuZC5kaXNwbGF5ID0gY2hhbmdlcy5zaG93TGVnZW5kLm5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgIGNoYXJ0LnVwZGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG4vLyBHZXQgdGhlIHByb2ZpbGUgbmFtZSBmb3IgdGhlIGN1cnJlbnQgcGFnZSwgaWYgdGhlIGN1cnJlbnQgcGFnZSBpcyBhbiBhY2NvdW50IHBhZ2Vcbi8vIFRoZSBwcm9maWxlIG5hbWUgd2lsbCBnZXQgcmV0cmlldmVkIGZyb20gbG9jYXRpb24ucGF0aG5hbWVcbmxldCBwcm9maWxlTmFtZSA9IG51bGw7XG5sZXQgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zdWJzdHIoMSk7XG4vLyBUcmltIHRoZSB0cmFpbGluZyBzbGFzaCBpZiB0aGVyZSBpcyBvbmVcbmlmIChwYXRoW3BhdGgubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgIHBhdGggPSBwYXRoLnNsaWNlKDAsIC0xKTtcbn1cbi8vIFRoZSBwYWdlIGlzIGNvcnJlY3QgaWYgdGhlIGxlbmd0aCBvZiBwYXRoLnNwbGl0IGlzIDEgYW5kIHRoZSBmaXJzdCBpdGVtIGlzbid0IHRoZSBlbXB0eSBzdHJpbmdcbmNvbnN0IHNwbGl0UGF0aCA9IHBhdGguc3BsaXQoJy8nKTtcbmlmIChzcGxpdFBhdGgubGVuZ3RoID09PSAxICYmIHNwbGl0UGF0aFswXS5sZW5ndGggIT09IDApIHtcbiAgICBwcm9maWxlTmFtZSA9IHNwbGl0UGF0aFswXTtcbn1cbi8vIElmIHByb2ZpbGVOYW1lIGlzIG5vdCBudWxsLCBkcmF3IHRoZSBjaGFydFxuaWYgKHByb2ZpbGVOYW1lICE9PSBudWxsKSB7XG4gICAgY29uc3QgZ3JhcGggPSBuZXcgTGFuZ3VhZ2VEaXNwbGF5KHByb2ZpbGVOYW1lKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRhdGEgPSB2b2lkIDA7XG4vLyBDbGFzcyBmb3IgaGFuZGxpbmcgdGhlIGZldGNoIG9mIHJlcG8gYW5kIGNvbG9yIGRhdGEsIGJlIGl0IGZyb20gY2FjaGUgb3IgdGhlIEFQSVxuLy8gQWxsb3dzIHRoZSBjb250ZW50IHNjcmlwdCB0byBiZSBhZ25vc3RpYyBhcyB0byB3aGVyZSB0aGUgZGF0YSBpcyBjb21pbmcgZnJvbSBhcyB0aGlzIGNsYXNzIHdpbGwgdXNlIHByb21pc2VzXG5jb25zdCBlcnJvcnNfMSA9IHJlcXVpcmUoXCIuL2Vycm9yc1wiKTtcbmNvbnN0IFJFUE9fQ0FDSEVfVEhSRVNIT0xEID0gMzZlNTsgLy8gMSBob3VyXG4vLyBUaGUgcmVwbyBJIHB1bGwgZnJvbSBub3cgaXMgdXBkYXRlZCB3ZWVrbHkgc28gdGhpcyBtYWtlcyBzZW5zZVxuY29uc3QgQ09MT1JfQ0FDSEVfVEhSRVNIT0xEID0gUkVQT19DQUNIRV9USFJFU0hPTEQgKiAyNCAqIDc7IC8vIDcgZGF5c1xuY29uc3QgQ09MT1JfQ0FDSEVfS0VZID0gJ0dIVUxfQ09MT1JTJztcbmNvbnN0IENPTE9SX1VSTCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vb3poL2dpdGh1Yi1jb2xvcnMvbWFzdGVyL2NvbG9ycy5qc29uJztcbmNsYXNzIERhdGEge1xuICAgIGNvbnN0cnVjdG9yKHVzZXJuYW1lLCBpc09yZywgdG9rZW4pIHtcbiAgICAgICAgdGhpcy5yZXBvRGF0YUZyb21DYWNoZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVtcHR5QWNjb3VudCA9IHRydWU7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSB1c2VybmFtZTtcbiAgICAgICAgdGhpcy5pc09yZyA9IGlzT3JnO1xuICAgICAgICB0aGlzLnBlcnNvbmFsVG9rZW4gPSB0b2tlbjtcbiAgICB9XG4gICAgZ2V0RGF0YSgpIHtcbiAgICAgICAgLy8gR2V0cyBib3RoIHRoZSBjb2xvciBkYXRhIGFuZCByZXBvIGRhdGEgYW5kIHJldHVybnMgYSBQcm9taXNlIHRoYXQgd2lsbCByZXNvbHZlIHRvIGdldCBib3RoIG9mIHRoZW1cbiAgICAgICAgLy8gQ2FsbGluZyAudGhlbiBvbiB0aGlzIHNob3VsZCBnZXQgYmFjayBhbiBhcnJheSBvZiB0d28gdmFsdWVzIGNvbG9yIGFuZCByZXBvIGRhdGEgcmVzcGVjdGl2ZWx5XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChbdGhpcy5nZXRDb2xvckRhdGEoKSwgdGhpcy5nZXRSZXBvRGF0YSgpXSk7XG4gICAgfVxuICAgIC8vIEZldGNoZXMgY29sb3IgZGF0YSBmcm9tIGxvY2FsIHN0b3JhZ2UsIG9yIGRvd25sb2FkcyBpdCBhZ2FpbiBpZiBpdCdzIG1vcmUgdGhhbiBhIHdlZWsgb2xkXG4gICAgZ2V0Q29sb3JEYXRhKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IGNvbG9yRGF0YTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhlIGNhY2hlXG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVkRGF0YSA9IHlpZWxkIHRoaXMuY2hlY2tDb2xvckNhY2hlKCk7XG4gICAgICAgICAgICAgICAgY29sb3JEYXRhID0gY2FjaGVkRGF0YS5kYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb2xvckRhdGEgPSB5aWVsZCB0aGlzLmZldGNoQ29sb3JEYXRhKCk7XG4gICAgICAgICAgICAgICAgLy8gQ2FjaGUgdGhlIGRhdGFcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZWRBdCA9IG5ldyBEYXRlKCkudmFsdWVPZigpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0ge1xuICAgICAgICAgICAgICAgICAgICBjYWNoZWRBdCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogY29sb3JEYXRhLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVEYXRhID0ge307XG4gICAgICAgICAgICAgICAgY2FjaGVEYXRhW0NPTE9SX0NBQ0hFX0tFWV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoY2FjaGVEYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgZm91bmQgZGF0YSwgcmVnYXJkbGVzcyBvZiBzb3VyY2VcbiAgICAgICAgICAgIHJldHVybiBjb2xvckRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjaGVja0NvbG9yQ2FjaGUoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2UgdG8gcmV0cmlldmUgdGhlIGtleSBmcm9tIGNhY2hlLCBvciByZWplY3QgaWYgaXQncyBub3QgdGhlcmVcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIHJldHVybiByZWplY3QoKSAvLyBVbmNvbW1lbnQgdGhpcyB0byB0dXJuIG9mZiBjYWNoZSByZWFkcyB3aGVuIGluIGRldmVsb3BtZW50XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW0NPTE9SX0NBQ0hFX0tFWV0sIChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgZGF0YSBpc24ndCB0aGVyZSwgcmVzdWx0IHdpbGwgYmUgYW4gZW1wdHkgb2JqZWN0XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHJlc3VsdCkubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnZXQgdG8gdGhpcyBwb2ludCwgdGhlcmUgd2FzIG5vdGhpbmcgaW4gY2FjaGUgb3IgdGhlIGNhY2hlIHdhcyBpbnZhbGlkXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGNhY2hlZCBvYmplY3QsIHNvIGNoZWNrIHRpbWUgb2YgY2FjaGVcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0gcmVzdWx0W0NPTE9SX0NBQ0hFX0tFWV07XG4gICAgICAgICAgICAgICAgaWYgKG5ldyBEYXRlKCkudmFsdWVPZigpIC0gY2FjaGVkRGF0YS5jYWNoZWRBdCA8IENPTE9SX0NBQ0hFX1RIUkVTSE9MRCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBjYW4gdXNlIHRoZSBjYWNoZWQgdmVyc2lvblxuICAgICAgICAgICAgICAgICAgICAvLyBTZXQgZW1wdHlBY2NvdW50IGZsYWcgdG8gZmFsc2UgaGVyZSB0b29cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eUFjY291bnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoY2FjaGVkRGF0YSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gRmV0Y2ggdGhlIG5ldyBjb2xvciBkYXRhXG4gICAgZmV0Y2hDb2xvckRhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkIGZldGNoKENPTE9SX1VSTCk7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLy8gRmV0Y2hlcyB0aGUgcmVwbyBkYXRhIGVpdGhlciBmcm9tIGNhY2hlIG9yIGZyb20gdGhlIEFQSSBhbmQgcmV0dXJucyBhIFByb21pc2UgZm9yIHRoZSBkYXRhXG4gICAgZ2V0UmVwb0RhdGEoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSB1c2VyJ3MgZGF0YSBpcyBpbiB0aGUgY2FjaGVcbiAgICAgICAgICAgICAgICBjb25zdCBjYWNoZWREYXRhID0geWllbGQgdGhpcy5jaGVja1JlcG9DYWNoZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVwb0RhdGFGcm9tQ2FjaGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY2FjaGVkRGF0YS5kYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gRGF0YSB3YXNuJ3QgaW4gY2FjaGUgc28gZ2V0IG5ldyBkYXRhXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hSZXBvRGF0YSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hlY2tSZXBvQ2FjaGUoKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIHByb21pc2UgdG8gcmV0cmlldmUgdGhlIGtleSBmcm9tIGNhY2hlLCBvciByZWplY3QgaWYgaXQncyBub3QgdGhlcmVcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIC8vIHJldHVybiByZWplY3QoKSAvLyBVbmNvbW1lbnQgdGhpcyB0byB0dXJuIG9mZiBjYWNoZSByZWFkcyB3aGVuIGluIGRldmVsb3BtZW50XG4gICAgICAgICAgICBjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoW3RoaXMudXNlcm5hbWVdLCAocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGRhdGEgaXNuJ3QgdGhlcmUsIHJlc3VsdCB3aWxsIGJlIGFuIGVtcHR5IG9iamVjdFxuICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhyZXN1bHQpLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgZ2V0IHRvIHRoaXMgcG9pbnQsIHRoZXJlIHdhcyBub3RoaW5nIGluIGNhY2hlIG9yIHRoZSBjYWNoZSB3YXMgaW52YWxpZFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgYSBjYWNoZWQgb2JqZWN0LCBzbyBjaGVjayB0aW1lIG9mIGNhY2hlXG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVkRGF0YSA9IHJlc3VsdFt0aGlzLnVzZXJuYW1lXTtcbiAgICAgICAgICAgICAgICBpZiAobmV3IERhdGUoKS52YWx1ZU9mKCkgLSBjYWNoZWREYXRhLmNhY2hlZEF0IDwgUkVQT19DQUNIRV9USFJFU0hPTEQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2UgY2FuIHVzZSB0aGUgY2FjaGVkIHZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgLy8gU2V0IGVtcHR5QWNjb3VudCBmbGFnIHRvIGZhbHNlIGhlcmUgdG9vXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlBY2NvdW50ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKGNhY2hlZERhdGEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIEZldGNoIHJlcG9zaXRvcnkgZGF0YSBmcm9tIHRoZSBBUElcbiAgICBmZXRjaFJlcG9EYXRhKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IHVybCA9IHRoaXMuZ2VuZXJhdGVBUElVUkwoKTtcbiAgICAgICAgICAgIGxldCBsaW5rSGVhZGVyO1xuICAgICAgICAgICAgbGV0IHJlcG9EYXRhID0ge307XG4gICAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5wZXJzb25hbFRva2VuICE9PSBudWxsICYmIHRoaXMucGVyc29uYWxUb2tlbi51c2VybmFtZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGB0b2tlbiAke3RoaXMucGVyc29uYWxUb2tlbi50b2tlbn1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVXNlIFByb21pc2UucmVzb2x2ZSB0byB3YWl0IGZvciB0aGUgcmVzdWx0XG4gICAgICAgICAgICBsZXQgcmVzcG9uc2UgPSB5aWVsZCBmZXRjaCh1cmwsIHsgaGVhZGVycyB9KTtcbiAgICAgICAgICAgIGxpbmtIZWFkZXIgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnbGluaycpO1xuICAgICAgICAgICAgLy8gU3R1bWJsZWQgYWNyb3NzIHRoaXMgbGl0dGxlIGVycm9yIHRvbmlnaHRcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBlcnJvcnNfMS5HSFVMRXJyb3IoYEluY29ycmVjdCBzdGF0dXMgcmVjZWl2ZWQgZnJvbSBHaXRIdWIgQVBJLiBFeHBlY3RlZCAyMDAsIHJlY2VpdmVkOyAke3Jlc3BvbnNlLnN0YXR1c30uIGAgK1xuICAgICAgICAgICAgICAgICAgICAnU2VlIGNvbnNvbGUgZm9yIG1vcmUgZGV0YWlscy4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBkYXRhID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgLy8gRnJvbSB0aGlzIEpTT04gcmVzcG9uc2UsIGNvbXBpbGUgcmVwb0RhdGEgKHRvIHJlZHVjZSBtZW1vcnkgdXNhZ2UpIGFuZCB0aGVuIHNlZSBpZiB0aGVyZSdzIG1vcmUgdG8gZmV0Y2hcbiAgICAgICAgICAgIHJlcG9EYXRhID0gdGhpcy51cGRhdGVSZXBvRGF0YShyZXBvRGF0YSwgZGF0YSk7XG4gICAgICAgICAgICAvLyBOb3cgbG9vcCB0aHJvdWdoIHRoZSBsaW5rIGhlYWRlcnMsIGZldGNoaW5nIG1vcmUgZGF0YSBhbmQgdXBkYXRpbmcgdGhlIHJlcG9zIGRpY3RcbiAgICAgICAgICAgIHVybCA9IHRoaXMuZ2V0TmV4dFVybEZyb21IZWFkZXIobGlua0hlYWRlcik7XG4gICAgICAgICAgICB3aGlsZSAodXJsICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VuZCBhIHJlcXVlc3QgYW5kIHVwZGF0ZSB0aGUgcmVwbyBkYXRhIGFnYWluXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB5aWVsZCBmZXRjaCh1cmwsIHsgaGVhZGVycyB9KTtcbiAgICAgICAgICAgICAgICBsaW5rSGVhZGVyID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2xpbmsnKTtcbiAgICAgICAgICAgICAgICBkYXRhID0geWllbGQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgICAgICAgICAgIHJlcG9EYXRhID0gdGhpcy51cGRhdGVSZXBvRGF0YShyZXBvRGF0YSwgZGF0YSk7XG4gICAgICAgICAgICAgICAgdXJsID0gdGhpcy5nZXROZXh0VXJsRnJvbUhlYWRlcihsaW5rSGVhZGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFN0aWxsIGdvbm5hIHJldHVybiBhIHByb21pc2VcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVwb0RhdGEpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlUmVwb0RhdGEocmVwb0RhdGEsIGpzb24pIHtcbiAgICAgICAgZm9yIChjb25zdCByZXBvIG9mIGpzb24pIHtcbiAgICAgICAgICAgIGlmIChyZXBvLmxhbmd1YWdlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgY291bnQgPSByZXBvRGF0YVtyZXBvLmxhbmd1YWdlXSB8fCAwO1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIHJlcG9EYXRhW3JlcG8ubGFuZ3VhZ2VdID0gY291bnQ7XG4gICAgICAgICAgICB0aGlzLmVtcHR5QWNjb3VudCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXBvRGF0YTtcbiAgICB9XG4gICAgZ2VuZXJhdGVBUElVUkwoKSB7XG4gICAgICAgIC8vIEdlbmVyYXRlIHRoZSBjb3JyZWN0IEFQSSBVUkwgcmVxdWVzdCBnaXZlbiB0aGUgY2lyY3Vtc3RhbmNlcyBvZiB0aGUgcmVxdWVzdFxuICAgICAgICAvLyBDaXJjdW1zdGFuY2VzOiBPcmcgb3IgVXNlciBwYWdlLCBhbmQgaWYgVXNlciBwYWdlLCBpcyBpdCB0aGUgVXNlciB1c2luZyB0aGUgZXh0ZW5zaW9uXG4gICAgICAgIGNvbnN0IHVybEJhc2UgPSAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSc7XG4gICAgICAgIGNvbnN0IHF1ZXJ5ID0gJ3BhZ2U9MSZwZXJfcGFnZT01MCc7XG4gICAgICAgIGxldCB1cmw7XG4gICAgICAgIGlmICh0aGlzLmlzT3JnKSB7XG4gICAgICAgICAgICB1cmwgPSBgJHt1cmxCYXNlfS9vcmdzLyR7dGhpcy51c2VybmFtZX0vcmVwb3M/JHtxdWVyeX1gO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMudXNlcm5hbWUgPT09IHRoaXMucGVyc29uYWxUb2tlbi51c2VybmFtZSkge1xuICAgICAgICAgICAgLy8gU2VuZCB0aGUgcmVxdWVzdCB0byBsaXN0IHRoZSB1c2VyJ3Mgb3duIHJlcG9zXG4gICAgICAgICAgICB1cmwgPSBgJHt1cmxCYXNlfS91c2VyL3JlcG9zPyR7cXVlcnl9JmFmZmlsaWF0aW9uPW93bmVyYDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNlbmQgdGhlIHJlcXVlc3QgdG8gdGhlIG5vcm1hbCB1c2VycyBlbmRwb2ludFxuICAgICAgICAgICAgdXJsID0gYCR7dXJsQmFzZX0vdXNlcnMvJHt0aGlzLnVzZXJuYW1lfS9yZXBvcz8ke3F1ZXJ5fWA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gICAgLy8gSGVscGVyIG1ldGhvZCB0byBnZXQgdGhlIG5leHQgdXJsIHRvIGdvIHRvXG4gICAgZ2V0TmV4dFVybEZyb21IZWFkZXIoaGVhZGVyKSB7XG4gICAgICAgIGlmIChoZWFkZXIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gL1xcPCguKilcXD4vO1xuICAgICAgICAvLyBUaGUgaGVhZGVyIGNhbiBjb250YWluIG1hbnkgVVJMcywgc2VwYXJhdGVkIGJ5IGNvbW1hcywgZWFjaCB3aXRoIGEgcmVsXG4gICAgICAgIC8vIFdlIHdhbnQgb25seSB0aGUgb25lIHRoYXQgY29udGFpbnMgcmVsPVwibmV4dFwiXG4gICAgICAgIGZvciAoY29uc3QgdXJsIG9mIGhlYWRlci5zcGxpdCgnLCAnKSkge1xuICAgICAgICAgICAgaWYgKHVybC5pbmNsdWRlcygncmVsPVwibmV4dFwiJykpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBuZWVkIHRvIHJldHJpdmUgdGhlIGFjdHVhbCBVUkwgcGFydCB1c2luZyByZWdleFxuICAgICAgICAgICAgICAgIHJldHVybiByZWdleC5leGVjKHVybClbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufVxuZXhwb3J0cy5EYXRhID0gRGF0YTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HSFVMRXJyb3IgPSB2b2lkIDA7XG5jbGFzcyBHSFVMRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgICAgICBzdXBlcihtZXNzYWdlKTtcbiAgICAgICAgdGhpcy5uYW1lID0gJ0dIVUxFcnJvcic7XG4gICAgfVxufVxuZXhwb3J0cy5HSFVMRXJyb3IgPSBHSFVMRXJyb3I7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHJlc3VsdCA9IGZuKCk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJjb250ZW50X3NjcmlwdFwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHR9XG5cdH1cblx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRzW2ldXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2dpdGh1Yl91c2VyX2xhbmd1YWdlc1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtnaXRodWJfdXNlcl9sYW5ndWFnZXNcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvclwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9jb250ZW50LnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iXSwic291cmNlUm9vdCI6IiJ9