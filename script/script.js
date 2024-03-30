'use strict';
$(document).ready(function() {
    // 変換前レシピ入力欄の出力
        // 変換前レシピの投数が変化したら入力内容を取得して、投数分だけレシピ入力<input>欄を生成する
        // ただし、2投目まではデフォルトで表示しておき、足りない分を生成･増えすぎたら削除する
    $('#pour-times-input').on('change', function(){
        let pourTimes = $('#pour-times-input').val();
        let currentPourTimes = $('.process-input').children().length;

        if (pourTimes > currentPourTimes) {
            for (let i = currentPourTimes; i < pourTimes; i++) {                
                let processInput = `
                    <div class="${i + 1}st">
                        <label>${i + 1}投目</label>
                        <input type="text" class="minutes">:<input type="text" class="seconds">
                        <input type="text" class="pour-ml four-digits"> ml
                    </div>
                `;
                $('.process-input').append(processInput);
            }
        } else if (pourTimes < currentPourTimes) {
            for (let i = currentPourTimes; i > pourTimes && i > 1; i--) { // i>1 : 1投目は消さない
                $(`.${i}st`).remove();
            }
        }
    });

    // 変換目標入力欄の入力補助
        // 1.豆量と総湯量の両方が入力されると自動的に比率が計算・入力される
        // 2.豆量あるいは総湯量のいずれかが入力された状態で比率が入力されると、もう一方が更新される
    // Todo: 関数化(変換に使う値と変換先のセレクタを引数に取る関数を作成し、それを呼び出す形にする)
    $('#bean-target').on('change', function(){
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let ratio = $('#ratio-target').val();

        if (beanTarget && waterTarget) {
            $('#ratio-target').val((waterTarget / beanTarget).toFixed(1));
        } else if (beanTarget && ratio) {
            $('#water-target').val((beanTarget * ratio).toFixed(1));
        }
    });
    $('#water-target').on('change', function(){
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let ratio = $('#ratio-target').val();

        if (beanTarget && waterTarget) {
            $('#ratio-target').val((waterTarget / beanTarget).toFixed(1));
        } else if (waterTarget && ratio) {
            $('#bean-target').val((waterTarget / ratio).toFixed(1));
        }
    });
    $('#ratio-target').on('change', function(){
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let ratio = $('#ratio-target').val();

        if (beanTarget && ratio) {
            $('#water-target').val((beanTarget * ratio).toFixed(1));
        } else if (waterTarget && ratio) {
            $('#bean-target').val((waterTarget / ratio).toFixed(1));
        }
    });



    // レシピの変換･変換後レシピの出力
        // 変換ボタンを押すと、変換前レシピと変換目標の入力内容を取得し、変換後レシピを出力する
    $('.convert-button').on('click', function(){
        let pourTimes = $('#pour-times-input').val();
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let unconvert_sum_water = $(`.${pourTimes}st`).children('.pour-ml').val();
        let convert_rate = waterTarget / unconvert_sum_water;

        // 変換後の豆量と総湯量を転記
        $('.bean-output').text(beanTarget);
        $('.water-output').text(waterTarget);

        // 変換後のレシピを出力
        let processOutput = `
            <tr>
                <th>経過時間</th>
                <th>注湯量</th>
                <th>総注湯量</th>
            </tr>
        `;
        let totalWater_ml = 0;
        for (let i = 1; i <= pourTimes; i++) {
            let minutes = $(`.${i}st`).children('.minutes').val();
            let seconds = $(`.${i}st`).children('.seconds').val();
            let unconvert_pour_ml = $(`.${i}st`).children('.pour-ml').val();
            let totalWater_ml_buf = totalWater_ml; // ひとつ前の総湯量を記録しておくバッファ
            totalWater_ml = (unconvert_pour_ml * convert_rate).toFixed(1);
            let convert_pour_ml = parseFloat(totalWater_ml - totalWater_ml_buf).toFixed(1);
            processOutput += `
                <tr class="output-recipe-${i}st">
                    <td>${minutes}:${seconds}</td>
                    <td>${convert_pour_ml} ml</td>
                    <td>${totalWater_ml} ml</td>
                </tr>
            `;
        }
        $('.recipe-output').html(processOutput);

    });




    // ストップウォッチ機能


    
    
    // ストップウォッチ部分のトグル機能


});