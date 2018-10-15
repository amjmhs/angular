"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var browser_util_1 = require("../testing/src/browser_util");
{
    describe('BrowserDetection', function () {
        var browsers = [
            {
                name: 'Chrome',
                ua: 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: true,
                isOldChrome: false
            },
            {
                name: 'Chrome mobile',
                ua: 'Mozilla/5.0 (Linux; Android 5.1.1; D5803 Build/23.4.A.0.546) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.133 Mobile Safari/537.36',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Firefox',
                ua: 'Mozilla/5.0 (X11; Linux i686; rv:40.0) Gecko/20100101 Firefox/40.0',
                isFirefox: true,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: false,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'IE9',
                ua: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0; SLCC2; .NET CLR 2.0.50727)',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: true,
                isWebkit: false,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'IE10',
                ua: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0; .NET4.0E; .NET4.0C)',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: true,
                isWebkit: false,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'IE11',
                ua: 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; rv:11.0) like Gecko',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: true,
                isWebkit: false,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'IEMobile',
                ua: 'Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 520) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: true,
                isWebkit: false,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Edge',
                ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136',
                isFirefox: false,
                isAndroid: false,
                isEdge: true,
                isIE: false,
                isWebkit: false,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Android4.1',
                ua: 'Mozilla/5.0 (Linux; U; Android 4.1.1; en-us; Android SDK built for x86 Build/JRO03H) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                isFirefox: false,
                isAndroid: true,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Android4.2',
                ua: 'Mozilla/5.0 (Linux; U; Android 4.2; en-us; Android SDK built for x86 Build/JOP40C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                isFirefox: false,
                isAndroid: true,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Android4.3',
                ua: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; Android SDK built for x86 Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                isFirefox: false,
                isAndroid: true,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Android4.4',
                ua: 'Mozilla/5.0 (Linux; Android 4.4.2; Android SDK built for x86 Build/KK) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: true
            },
            {
                name: 'Safari7',
                ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/7.1.7 Safari/537.85.16',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'Safari8',
                ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.12 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.12',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'iOS7',
                ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D167 Safari/9537.53',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: true,
                isSlow: true,
                isChromeDesktop: false,
                isOldChrome: false
            },
            {
                name: 'iOS8',
                ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H141 Safari/600.1.4',
                isFirefox: false,
                isAndroid: false,
                isEdge: false,
                isIE: false,
                isWebkit: true,
                isIOS7: false,
                isSlow: false,
                isChromeDesktop: false,
                isOldChrome: false
            }
        ];
        browsers.forEach(function (browser) {
            it("should detect " + browser['name'], function () {
                var bd = new browser_util_1.BrowserDetection(browser['ua']);
                expect(bd.isFirefox).toBe(browser['isFirefox']);
                expect(bd.isAndroid).toBe(browser['isAndroid']);
                expect(bd.isEdge).toBe(browser['isEdge']);
                expect(bd.isIE).toBe(browser['isIE']);
                expect(bd.isWebkit).toBe(browser['isWebkit']);
                expect(bd.isIOS7).toBe(browser['isIOS7']);
                expect(bd.isSlow).toBe(browser['isSlow']);
                expect(bd.isChromeDesktop).toBe(browser['isChromeDesktop']);
                expect(bd.isOldChrome).toBe(browser['isOldChrome']);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl91dGlsX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3Rlc3QvYnJvd3Nlcl91dGlsX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCw0REFBNkQ7QUFFN0Q7SUFDRSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFFM0IsSUFBTSxRQUFRLEdBQUc7WUFDZjtnQkFDRSxJQUFJLEVBQUUsUUFBUTtnQkFDZCxFQUFFLEVBQUUseUdBQXlHO2dCQUM3RyxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxLQUFLO2dCQUNiLGVBQWUsRUFBRSxJQUFJO2dCQUNyQixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxlQUFlO2dCQUNyQixFQUFFLEVBQUUsK0lBQStJO2dCQUNuSixTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxLQUFLO2dCQUNiLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSxvRUFBb0U7Z0JBQ3hFLFNBQVMsRUFBRSxJQUFJO2dCQUNmLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsS0FBSztnQkFDYixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsS0FBSztnQkFDWCxFQUFFLEVBQUUsNEZBQTRGO2dCQUNoRyxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLFFBQVEsRUFBRSxLQUFLO2dCQUNmLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxJQUFJO2dCQUNaLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLEVBQUUsRUFBRSw2RkFBNkY7Z0JBQ2pHLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLElBQUk7Z0JBQ1osZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE1BQU07Z0JBQ1osRUFBRSxFQUFFLDBGQUEwRjtnQkFDOUYsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsSUFBSTtnQkFDWixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsVUFBVTtnQkFDaEIsRUFBRSxFQUFFLDZNQUE2TTtnQkFDak4sU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTtnQkFDVixRQUFRLEVBQUUsS0FBSztnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsSUFBSTtnQkFDWixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixFQUFFLEVBQUUsbUlBQW1JO2dCQUN2SSxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxLQUFLO2dCQUNmLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxLQUFLO2dCQUNiLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixFQUFFLEVBQUUsOEpBQThKO2dCQUNsSyxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLElBQUk7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLElBQUk7Z0JBQ1osZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLEVBQUUsRUFBRSw0SkFBNEo7Z0JBQ2hLLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixTQUFTLEVBQUUsSUFBSTtnQkFDZixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsSUFBSTtnQkFDWixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsWUFBWTtnQkFDbEIsRUFBRSxFQUFFLDRKQUE0SjtnQkFDaEssU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFNBQVMsRUFBRSxJQUFJO2dCQUNmLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxJQUFJO2dCQUNaLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxZQUFZO2dCQUNsQixFQUFFLEVBQUUsZ0tBQWdLO2dCQUNwSyxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxLQUFLO2dCQUNiLE1BQU0sRUFBRSxLQUFLO2dCQUNiLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsSUFBSTthQUNsQjtZQUNEO2dCQUNFLElBQUksRUFBRSxTQUFTO2dCQUNmLEVBQUUsRUFBRSx3SEFBd0g7Z0JBQzVILFNBQVMsRUFBRSxLQUFLO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsRUFBRSxFQUFFLHdIQUF3SDtnQkFDNUgsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsS0FBSztnQkFDWCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsS0FBSztnQkFDYixlQUFlLEVBQUUsS0FBSztnQkFDdEIsV0FBVyxFQUFFLEtBQUs7YUFDbkI7WUFDRDtnQkFDRSxJQUFJLEVBQUUsTUFBTTtnQkFDWixFQUFFLEVBQUUseUlBQXlJO2dCQUM3SSxTQUFTLEVBQUUsS0FBSztnQkFDaEIsU0FBUyxFQUFFLEtBQUs7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLO2dCQUNiLElBQUksRUFBRSxLQUFLO2dCQUNYLFFBQVEsRUFBRSxJQUFJO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLE1BQU0sRUFBRSxJQUFJO2dCQUNaLGVBQWUsRUFBRSxLQUFLO2dCQUN0QixXQUFXLEVBQUUsS0FBSzthQUNuQjtZQUNEO2dCQUNFLElBQUksRUFBRSxNQUFNO2dCQUNaLEVBQUUsRUFBRSx3SUFBd0k7Z0JBQzVJLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixTQUFTLEVBQUUsS0FBSztnQkFDaEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsSUFBSSxFQUFFLEtBQUs7Z0JBQ1gsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsZUFBZSxFQUFFLEtBQUs7Z0JBQ3RCLFdBQVcsRUFBRSxLQUFLO2FBQ25CO1NBQ0YsQ0FBQztRQUVGLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUE2QjtZQUM3QyxFQUFFLENBQUMsbUJBQWlCLE9BQU8sQ0FBRSxNQUFNLENBQUcsRUFBRTtnQkFDdEMsSUFBTSxFQUFFLEdBQUcsSUFBSSwrQkFBZ0IsQ0FBUyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdkQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUM5QyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7Z0JBQzVELE1BQU0sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztDQUNKIn0=