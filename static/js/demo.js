// 2014年07月17日22:32:43
// demo

$(function(){
   /**
     * 生成矩阵
     * @param h 高
     * @param w 宽
     * @returns {Array}
     */
    function getMap(h, w) {
        var max = h * w,
            map = [],
            row = [],
            t,
            l,
            i,
            dir = 'r';
        for (t = 1; t <= h; t++) {
            row = [];
            for (l = 1; l <= w; l++) {
                row.push(null);
            }
            map.push(row);
        }
        ~function (n, t, l) {
            var next,
                next_t,
                next_l;
            map[t][l] = n;
            switch (dir) {
                case 'r':
                    next = map[t] === undefined ? undefined : map[t][l + 1];
                    next_t = t;
                    next_l = l + 1;
                    break;
                case 'b':
                    next = map[t + 1] === undefined ? undefined : map[t + 1][l];
                    next_t = t + 1;
                    next_l = l;
                    break;
                case 'l':
                    next = map[t] === undefined ? undefined : map[t][l - 1];
                    next_t = t;
                    next_l = l - 1;
                    break;
                case 't':
                    next = map[t - 1] === undefined ? undefined : map[t - 1][l];
                    next_t = t - 1;
                    next_l = l;
                    break;
            }
            if (next !== null) {
                switch (dir) {
                    case 'r':
                        dir = 'b';
                        next = map[t + 1][l];
                        next_t = t + 1;
                        next_l = l;
                        break;
                    case 'b':
                        dir = 'l';
                        next = map[t][l - 1];
                        next_t = t;
                        next_l = l - 1;
                        break;
                    case 'l':
                        dir = 't';
                        next = map[t - 1][l];
                        next_t = t -1;
                        next_l = l;
                        break;
                    case 't':
                        dir = 'r';
                        next = map[t][l + 1];
                        next_t = t;
                        next_l = l + 1;
                        break;
                }
            }
            if (n - 1 > 0) {
                arguments.callee(n - 1, next_t, next_l);
            }
        }(max, 0 ,0);
        return map;
    }
    /**
     *       输出
     * @param map
     */
    function showMap(map) {
        console.log(map);
        var htmlSt = '<table>';
        for (var i = 0, len = map.length; i < len; i++) {
            var trSt = '<tr>'
            for (var j = 0, rowlen = map[i].length; j<rowlen; j++) {
                htmlSt += '<td x="'+i+'"" y="'+j+'">' + map[i][j] + '</td>';
            }
            trSt += '</tr>';
            htmlSt += trSt;
        }
        document.write(htmlSt);
    }
    var a = getMap(3, 3);
    showMap(a);
});
