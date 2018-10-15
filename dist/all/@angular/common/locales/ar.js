"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// THIS CODE IS GENERATED - DO NOT MODIFY
// See angular/tools/gulp-tasks/cldr/extract.js
var u = undefined;
function plural(n) {
    if (n === 0)
        return 0;
    if (n === 1)
        return 1;
    if (n === 2)
        return 2;
    if (n % 100 === Math.floor(n % 100) && n % 100 >= 3 && n % 100 <= 10)
        return 3;
    if (n % 100 === Math.floor(n % 100) && n % 100 >= 11 && n % 100 <= 99)
        return 4;
    return 5;
}
exports.default = [
    'ar', [['ص', 'م'], u, u], [['ص', 'م'], u, ['صباحًا', 'مساءً']],
    [
        ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
        [
            'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس',
            'الجمعة', 'السبت'
        ],
        u, ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
    ],
    u,
    [
        ['ي', 'ف', 'م', 'أ', 'و', 'ن', 'ل', 'غ', 'س', 'ك', 'ب', 'د'],
        [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ],
        u
    ],
    u, [['ق.م', 'م'], u, ['قبل الميلاد', 'ميلادي']], 6, [5, 6],
    ['d\u200f/M\u200f/y', 'dd\u200f/MM\u200f/y', 'd MMMM y', 'EEEE، d MMMM y'],
    ['h:mm a', 'h:mm:ss a', 'h:mm:ss a z', 'h:mm:ss a zzzz'], ['{1} {0}', u, u, u],
    [
        '.', ',', ';', '\u200e%\u200e', '\u200e+', '\u200e-', 'E', '×', '‰', '∞',
        'ليس رقمًا', ':'
    ],
    ['#,##0.###', '#,##0%', '¤ #,##0.00', '#E0'], 'ج.م.\u200f', 'جنيه مصري', {
        'AED': ['د.إ.\u200f'],
        'ARS': [u, 'AR$'],
        'AUD': ['AU$'],
        'BBD': [u, 'BB$'],
        'BHD': ['د.ب.\u200f'],
        'BMD': [u, 'BM$'],
        'BND': [u, 'BN$'],
        'BSD': [u, 'BS$'],
        'BZD': [u, 'BZ$'],
        'CAD': ['CA$'],
        'CLP': [u, 'CL$'],
        'CNY': ['CN¥'],
        'COP': [u, 'CO$'],
        'CUP': [u, 'CU$'],
        'DOP': [u, 'DO$'],
        'DZD': ['د.ج.\u200f'],
        'EGP': ['ج.م.\u200f', 'E£'],
        'FJD': [u, 'FJ$'],
        'GBP': ['£', 'UK£'],
        'GYD': [u, 'GY$'],
        'HKD': ['HK$'],
        'IQD': ['د.ع.\u200f'],
        'IRR': ['ر.إ.'],
        'JMD': [u, 'JM$'],
        'JOD': ['د.أ.\u200f'],
        'JPY': ['JP¥'],
        'KWD': ['د.ك.\u200f'],
        'KYD': [u, 'KY$'],
        'LBP': ['ل.ل.\u200f', 'L£'],
        'LYD': ['د.ل.\u200f'],
        'MAD': ['د.م.\u200f'],
        'MRO': ['أ.م.\u200f'],
        'MXN': ['MX$'],
        'NZD': ['NZ$'],
        'OMR': ['ر.ع.\u200f'],
        'QAR': ['ر.ق.\u200f'],
        'SAR': ['ر.س.\u200f'],
        'SBD': [u, 'SB$'],
        'SDD': ['د.س.\u200f'],
        'SDG': ['ج.س.'],
        'SRD': [u, 'SR$'],
        'SYP': ['ل.س.\u200f', '£'],
        'THB': ['฿'],
        'TND': ['د.ت.\u200f'],
        'TTD': [u, 'TT$'],
        'TWD': ['NT$'],
        'USD': ['US$'],
        'UYU': [u, 'UY$'],
        'XXX': ['***'],
        'YER': ['ر.ي.\u200f']
    },
    plural
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vbG9jYWxlcy9hci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUF5QztBQUN6QywrQ0FBK0M7QUFFL0MsSUFBTSxDQUFDLEdBQUcsU0FBUyxDQUFDO0FBRXBCLGdCQUFnQixDQUFTO0lBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUM7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEVBQUU7UUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvRSxJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxFQUFFO1FBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEYsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsa0JBQWU7SUFDYixJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQ7UUFDRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNuQztZQUNFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRO1lBQ3BELFFBQVEsRUFBRSxPQUFPO1NBQ2xCO1FBQ0QsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDO0tBQy9EO0lBQ0QsQ0FBQztJQUNEO1FBQ0UsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUM1RDtZQUNFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTztZQUNuRCxPQUFPLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVE7U0FDekQ7UUFDRCxDQUFDO0tBQ0Y7SUFDRCxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixDQUFDO0lBQzFFLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5RTtRQUNFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUc7UUFDeEUsV0FBVyxFQUFFLEdBQUc7S0FDakI7SUFDRCxDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQUU7UUFDdkUsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3JCLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ2QsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNkLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDO1FBQzNCLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztRQUNuQixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNkLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDZixLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDZCxLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDO1FBQzNCLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3JCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNkLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNkLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztRQUNyQixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3JCLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3JCLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUNmLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUM7UUFDakIsS0FBSyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQztRQUMxQixLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUM7UUFDWixLQUFLLEVBQUUsQ0FBQyxZQUFZLENBQUM7UUFDckIsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztRQUNqQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDZCxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDZCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO1FBQ2pCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztRQUNkLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQztLQUN0QjtJQUNELE1BQU07Q0FDUCxDQUFDIn0=