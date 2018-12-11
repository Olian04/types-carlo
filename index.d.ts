// Type definitions for Carlo 0.9.41
// Project: https://github.com/GoogleChromeLabs/carlo
// Definitions by: Craftingmod <https://github.com/craftingmod>
// Definitions: https://github.com/sdbx/types-carlo
/* tslint:disable */
/*
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Carlo provides Node applications with Google Chrome rendering capabilities,
 * communicates with the locally-installed browser instance using the Puppeteer project,
 * and implements a remote call infrastructure for communication between Node and the browser.
 */
declare module "carlo" {
    import puppeteer, { Page } from "puppeteer"
    /**
     * Enters headless test mode.
     * In the test mode, Puppeteer browser and pages are available via
     * App.browserForTest() and Window.pageForTest() respectively.
     * Please refer to the Puppeteer documentation for details on headless testing.
     */
    export function enterTestMode():void
    /**
     * Launches the browser.
     * @param options Set of configurable options to set on the app.
     * @returns Promise which resolves to the app instance.
     */
    export function launch(options?:Partial<WindowOptions & {
        /**
         * Browser to be used, defaults to `['stable']`
         * 
         * * `'stable'` only uses locally installed stable channel Chrome.
         * 
         * * `'canary'` only uses Chrome SxS aka Canary.
         * 
         * * `'chromium'` downloads local version of Chromium compatible with the Puppeteer used.
         * 
         * * `'rXXXXXX'` a specific Chromium revision is used.
         */
        channel:string[],
        /**
         * Application icon to be used in the system dock.
         * Either buffer containing PNG or a path to the PNG file on the file system.
         * This feature is only available in Chrome M72+.
         * One can use `'canary'` channel to see it in action before M72 hits stable.
         */
        icon:Buffer | string,
        /**
         * Optional parameters to share between Carlo instances.
         * See [Window.paramsForReuse](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#windowparamsforreuse)
         * for details.
         */
        paramsForReuse:any,
        /**
         * Application title.
         */
        title:string,
        /**
         * Path to a [User Data Directory](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md).
         * This folder is created upon the first app launch and contains user settings and Web storage data.
         * Defaults to `'.profile'`.
         */
        userDataDir:string,
        /**
         * Path to a Chromium or Chrome executable to run instead of the automatically located Chrome.
         * If `executablePath` is a relative path, then it is resolved relative to [current working directory](https://nodejs.org/api/process.html#process_process_cwd).
         * Carlo is only guaranteed to work with the latest Chrome stable version.
         */
        executablePath:string,
        /**
         * Additional arguments to pass to the browser instance. The list of Chromium flags can be found
         * [here](https://peter.sh/experiments/chromium-command-line-switches/).
         */
        args:string[],
    }>):Promise<App>
    export class App {
        /**
         * Emitted when the last window closes.
         */
        on(event: "exit", listener:() => void):this
        /**
         * Emitted when the new window opens. This can happen in the following situations
         * 
         * * [App.createWindow](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appcreatewindowoptions)
         * was called.
         * * [carlo.launch](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#carlolaunchoptions)
         * was called from the same or another instance of the Node app.
         * * [window.open](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
         * was called from within the web page.
         */
        on(event: "window", listener:(window:Window) => void):this
        /**
         * Puppeteer browser object for testing.
         * @returns Puppeteer browser object for testing.
         */
        public browserForTest():puppeteer.Browser
        /**
         * Creates a new app window.
         * @param options Set of configurable options to set on the app.
         * @return Promise which resolves to the window instance.
         */
        public createWindow(options?:Partial<WindowOptions>):Promise<Window>
        /**
         * Shortcut to the main window's [Window.evaluate(pageFunction[, ...args])](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#windowevaluatepagefunction-args).
         */
        public evaluate<R extends Serializable | void, P extends Serializable[]>(pageFunction:(...args:P) => R | Promise<R>, ...args:P):Promise<R>
        public evaluate(pageFunction:string):Promise<string>
        public evaluate<R, P extends Serializable[]>(pageFunction:(...args:P) => R | Promise<R>, ...args:P):Promise<void>
        /**
         * Closes the browser window.
         */
        public exit():Promise<void>
        /**
         * The method adds a function called `name` on the pages' `window` object.
         * When called, the function executes `carloFunction` in Node.js and returns a [*Promise*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
         * which resolves to the return value of `carloFunction`.
         * 
         * If the `carloFunction` returns a *Promise*, it will be awaited.
         * > **NOTE** Functions installed via `App.exposeFunction` survive navigations.
         * 
         * [An example of adding an `md5` function into the page](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appexposefunctionname-carlofunction)
         * @param name Name of the function on the window object.
         * @param carloFunction Callback function which will be called in Carlo's context.
         * @returns the result of `carloFunction`
         */
        public exposeFunction<R extends Serializable | void>(name:string, carloFunction:(...args:Serializable[]) => R | Promise<R>):Promise<void>
        /**
         * Shortcut to the main window's [Window.load(uri[, ...params])](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#windowloaduri-params).
         */
        public load(url:string, ...params:Array<Serializable | Handle<any>>):Promise<unknown>
        /**
         * Running app guarantees to have main window.
         * If current main window closes, a next open window becomes the main one.
         * @returns Returns main window.
         */
        public mainWindow():Window
        /**
         * Makes the content of the given folder available to the Chrome web app.
         * 
         * [An example](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appservefolderfolder-prefix)
         * of adding a local www folder along with the `node_modules`
         * @param folder Folder with web content to make available to Chrome.
         * @param prefix Prefix of the URL path to serve from the given folder.
         */
        public serveFolder(folder:string, prefix?:string):void
        /**
         * Handler function is called with every network request in this app.
         * It can abort, continue or fulfill each request. Only single app-wide handler can be registered.
         * @param handler Network handler callback accepting the [HttpRequest](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#class-httprequest) parameter.
         */
        public serveHandler(handler:(request:HttpRequest) => any):void
        /**
         * Fetches Carlo content from the specified origin instead of reading it from the file system,
         * eg `http://localhost:8080`
         * 
         * This mode can be used for the fast development mode available in web frameworks.
         * @param base 
         * @param prefix 
         */
        public serveOrigin(base:string, prefix?:string):void
        /**
         * Specifies image to be used as an app icon in the system dock.
         * > This feature is only available in Chrome M72+. One can use 'canary' channel to see it in action before M72 hits stable.
         * @param image Either buffer containing PNG or a path to the PNG file on the file system.
         */
        public setIcon(image:Buffer | string):void
        /**
         * Running app guarantees to have at least one open window.
         * @returns Returns all currently opened windows.
         */
        public windows():Window[]
    }
    /**
     * Handlers registered via App.serveHandler and Window.serveHandler receive parameter of this upon every network request.
     */
    export class HttpRequest {
        /**
         * Aborts request.
         */
        public abort():Promise<void>
        /**
         * Proceeds with the default behavior for this request. Either serves it from the filesystem or defers to the browser.
         */
        public continue():void
        /**
         * Fulfills the network request with the given data.
         * `'Content-Length'` header is generated in case it is not listed in the headers.
         * @param options 
         */
        public fulfill(options?:Partial<{
            /**
             * HTTP status code (200, 304, etc), defaults to 200.
             */
            status:number,
            /**
             * HTTP response headers.
             */
            headers:{[key in string]:string},
            /**
             * Response body.
             */
            body:Buffer,
        }>):Promise<void>
        /**
         * Network request headers.
         * @returns HTTP headers
         */
        public headers():{[key in string]:string}
        /**
         * HTTP method of this network request (GET, POST, etc).
         * @returns HTTP method
         */
        public method():"GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"
        /**
         * Network request URL.
         * @returns HTTP URL
         */
        public url():string
    }
    export class Window {
        /**
         * Emitted when the window closes.
         */
        on(event: "close", listener:() => void):this
        /**
         * Returns window bounds.
         */
        public bounds():Promise<WindowBounds>
        /**
         * Brings this window to front.
         */
        public bringToFront():Promise<void>
        /**
         * Closes this window.
         */
        public close():Promise<void>
        /**
         * If the function passed to the `Window.evaluate` returns a *Promise*,
         * then `Window.evaluate` would wait for the promise to resolve and return its value.
         * ```javascript
const result = await window.evaluate(() => navigator.userAgent);
console.log(result);  // prints "<UA>" in Node console ```
         * @param pageFunction Function to be evaluated in the page context.
         * @param args Arguments to pass to `pageFunction`.
         */
        public evaluate<R extends Serializable | void, P extends Serializable[]>(pageFunction:(...args:P) => R | Promise<R>, ...args:P):Promise<R>
        /**
         * If the function passed to the `Window.evaluate` returns a *non-Serializable* value,
         * then `Window.evaluate` resolves to *undefined*.
         * @param pageFunction Function to be evaluated in the page context.
         * @param args Arguments to pass to `pageFunction`.
         */
        public evaluate<R, P extends Serializable[]>(pageFunction:(...args:P) => R | Promise<R>, ...args:P):Promise<void>
        /**
         * A string can also be passed in instead of a function
         * ```javascript
console.log(await window.evaluate('1 + 2'));  // prints "3"
const x = 10;
console.log(await window.evaluate(`1 + ${x}`));  // prints "11" ```
         * @param pageFunction A string to execute in window. 
         */
        public evaluate(pageFunction:string):Promise<string>
        /**
         * Same as [App.exposeFunction](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appexposefunctionname-carlofunction),
         * but only applies to the current window.
         * > **NOTE** Functions installed via `Window.exposeFunction` survive navigations.
         * @param name Name of the function on the window object.
         * @param carloFunction Callback function which will be called in Carlo's context.
         */
        public exposeFunction<R extends Serializable | void>(name:string, carloFunction:(...args:Serializable[]) => R | Promise<R>):Promise<void>
        /**
         * Turns the window into the full screen mode.
         * Behavior is platform-specific.
         */
        public fullscreen():Promise<void>
        /**
         * Navigates the Chrome web app to the given `uri`,
         * loads the target page and calls the `load()` function,
         * provided by this page, in its context.
         * @param url Path to the resource relative to the folder passed into [`serveFolder()`](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#windowservefolderfolder-prefix).
         * @param params Optional parameters to pass to the web application. Parameters can be primitive types, <*Array*>, <*Object*> or [rpc](https://github.com/GoogleChromeLabs/carlo/blob/master/rpc/rpc.md) `handles`.
         */
        public load(url:string, ...params:Array<Serializable | Handle<any>>):Promise<unknown>
        /**
         * Maximizes the window. Behavior is platform-specific.
         */
        public maximize():Promise<void>
        /**
         * Minimizes the window. Behavior is platform-specific.
         */
        public minimize():Promise<void>
        /**
         * @return Puppeteer page object for testing.
         */
        public pageForTest():Page
        /**
         * Returns the options.paramsForReuse value passed into the [carlo.launch](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#carlolaunchoptions).
         * 
         * These parameters are useful when Carlo app is started multiple times:
         * * First time the Carlo app is started, it successfully calls `carlo.launch` and opens the main window.
         * * Second time the Carlo app is started, `carlo.launch` fails with the 'browser is already running' exception.
         * * Despite the fact that second call to `carlo.launch` failed, a new window is created in the first Carlo app.
         * This window contains `paramsForReuse` value that was specified in the second (failed) `carlo.launch` call.
         * 
         * This way app can pass initialization parameters such as command line, etc. to the singleton Carlo that owns the browser.
         */
        public paramsForReuse():unknown
        /**
         * Same as [App.serveFolder(folder[, prefix])](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appservefolderfolder-prefix),
         * but only applies to current window.
         * @param folder Folder with web content to make available to Chrome.
         * @param prefix Prefix of the URL path to serve from the given folder.
         */
        public serveFolder(folder:string, prefix?:string):void
        /**
         * Same as [App.serveHandler(handler)](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appservehandlerhandler),
         * but only applies to the current window requests.
         * Only single window-level handler can be installed in window.
         * @param handler 
         */
        public serveHandler(handler:(request:HttpRequest) => any):void
        /**
         * Same as [App.serveOrigin(base[, prefix])](https://github.com/GoogleChromeLabs/carlo/blob/master/API.md#appserveoriginbase-prefix),
         * but only applies to current window.
         * @param base Base to serve web content from.
         * @param prefix Prefix of the URL path to serve from the given folder.
         */
        public serveOrigin(base:string, prefix:string):void
        /**
         * Sets window bounds. Parameters `top`, `left`, `width` and `height` are all optional.
         * Dimension or the offset is only applied when specified.
         * @param bounds 
         */
        public setBounds(bounds:Partial<WindowBounds>):Promise<void>
    }
    export interface WindowOptions {
        /**
         * App window width in pixels.
         */
        width:number,
        /**
         * App window height in pixels.
         */
        height:number,
        /**
         * App window top offset in pixels.
         */
        top:number,
        /**
         * App window left offset in pixels.
         */
        left:number,
        /**
         * Background color using hex notation, defaults to `'#ffffff'`.
         */
        bgcolor:string,
    }
    export interface WindowBounds {
        /**
         * Top offset in pixels.
         */
        top:number,
        /**
         * Left offset in pixels.
         */
        left:number,
        /**
         * Width in pixels.
         */
        width:number,
        /**
         * Height in pixels.
         */
        height:number,
    }
    // my type definetion
    /**
     * Serializable type defintion.
     */
    export type Serializable = string | number | boolean | SerializeObject | SerializeArray;
    /**
     * Serializable - object
     */
    interface SerializeObject {
        [x:string]: Serializable;
    }
    /**
     * Serializable - array
     */
    interface SerializeArray extends Array<Serializable> { }
    /**
     * Pseudo Handle type define
     */
    export type Handle<T extends object> = {
        readonly [P in keyof T]: Functional<T[P]>
    }
    /**
     * https://stackoverflow.com/questions/48196437/creating-mapped-type-to-promisify-return-values
     */
    // Generic Function definition
    type AnyFunction = (...args: any[]) => any;
    // Extracts the type if wrapped by a Promise
    type Unpacked<T> = T extends Promise<infer U> ? U : T;
    // Make function to return Promise.
    type PromisifiedFunction<T extends AnyFunction> =
        T extends (...args:infer P) => infer R ? (...args:P) => Promise<Unpacked<R>> : T
    /**
     * Make variable to promise function, normal function to promise function.
     */
    type Functional<T> =
        T extends AnyFunction ? PromisifiedFunction<T> :
        T extends infer U ? () => Promise<Unpacked<U>> :
        never
}
/*
export type DeepReadonly<T> =
    T extends (infer R)[] ? DeepReadonlyArray<R> :
    T extends Function ? T :
    T extends object ? DeepReadonlyObject<T> :
    T;

interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

type DeepReadonlyObject<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
*/