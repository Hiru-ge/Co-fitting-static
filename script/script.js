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
                    <div class="pour-step${i + 1}">
                        <label>${i + 1}投目</label>
                        <input type="text" class="minutes">:<input type="text" class="seconds">
                        <input type="text" class="pour-ml four-digits"> ml
                    </div>
                `;
                $('.process-input').append(processInput);
            }
        } else if (pourTimes < currentPourTimes) {
            for (let i = currentPourTimes; i > pourTimes && i > 1; i--) { // i>1 : 1投目は消さない
                $(`.pour-step${i}`).remove();
            }
        }
    });

    // 変換目標入力欄の入力補助
        // 1.豆量と総湯量の両方が入力されると自動的に比率が計算・入力される
        // 2.豆量あるいは総湯量のいずれかが入力された状態で比率が入力されると、もう一方が更新される
    // Todo: 比率入力時などに顕著だが、フォームに値が既に入っていると変換がうまくいかない(一旦手動で消さないといけない)ので、新規入力の方を優先して上書きできるようにしたい
    function targetInput_Supporter(waterTarget, beanTarget, ratioTarget) {
        if (beanTarget && waterTarget) {
            $('#ratio-target').val((waterTarget / beanTarget).toFixed(1));
        } else if (beanTarget && ratioTarget) {
            $('#water-target').val((beanTarget * ratioTarget).toFixed(1));
        } else if (waterTarget && ratioTarget) {
            $('#bean-target').val((waterTarget / ratioTarget).toFixed(1));
        }
    }

    $('.input_support').on('change', function(){
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let ratioTarget = $('#ratio-target').val();
        targetInput_Supporter(waterTarget, beanTarget, ratioTarget);
    });


    // レシピの変換･変換後レシピの出力
        // 変換ボタンを押すと、変換前レシピと変換目標の入力内容を取得し、変換後レシピを出力する
    // Todo: 蒸らし固定のON/OFFを反映できるようにする
    // Todo: リファクタリング
    $('.convert-button').on('click', function(){
        event.preventDefault(); // ページ遷移を防ぐ

        // 変換前レシピの入力内容を取得
        let pourTimes = $('#pour-times-input').val();
        let beanTarget = $('#bean-target').val();
        let waterTarget = $('#water-target').val();
        let input_sum_water = $(`.pour-step${pourTimes}`).children('.pour-ml').val();
        let convert_rate = waterTarget / input_sum_water;

        // 変換後の豆量と総湯量を転記
        $('.bean-output').text(beanTarget);
        $('.water-output').text(waterTarget);

        // 変換後のレシピを算出・出力
        let processOutput = `
            <tr>
                <th>経過時間</th>
                <th>注湯量</th>
                <th>総注湯量</th>
            </tr>
        `;
        let totalWater_ml = 0;
        for (let i = 1; i <= pourTimes; i++) {
            let minutes = $(`.pour-step${i}`).children('.minutes').val();
            let seconds = $(`.pour-step${i}`).children('.seconds').val();
            let input_pour_ml = $(`.pour-step${i}`).children('.pour-ml').val();
            // ひとつ前の総湯量を記録しておくバッファ(各投での注湯量を計算するために必要)
            let totalWater_ml_buf = totalWater_ml; 
            totalWater_ml = (input_pour_ml * convert_rate).toFixed(1);
            // 蒸らし固定ONの場合、1投目の総湯量は固定(元レシピの1投目の総湯量と同じ)
            if (i === 1 && $('#steep-check').prop('checked')) {
                totalWater_ml = $(`.pour-step1`).children('.pour-ml').val();
            }

            // 各投での注湯量を計算(総湯量 - ひとつ前の総湯量)
            let convert_pour_ml = parseFloat(totalWater_ml - totalWater_ml_buf).toFixed(1);
            processOutput += `
                <tr class="output-recipe-step${i}">
                    <td>${minutes}:${seconds}</td>
                    <td>${convert_pour_ml} ml</td>
                    <td>${totalWater_ml} ml</td>
                </tr>
            `;
        }
        $('.recipe-output').html(processOutput);

    });




    // ストップウォッチ機能
    // 参考: https://tcd-theme.com/2022/06/javascript-stopwatch.html
    // Todo: 機能改良・リファクタリング
    const time = document.getElementById('time');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    
    // 開始時間
    let startTime;
    // 停止時間
    let stopTime = 0;
    // タイムアウトID
    let timeoutID;
    
    // 時間を表示する関数
    function displayTime() {
      const currentTime = new Date(Date.now() - startTime + stopTime);
      const m = String(currentTime.getMinutes()).padStart(2, '0');
      const s = String(currentTime.getSeconds()).padStart(2, '0');
    
      time.textContent = `${m}:${s}`;
      timeoutID = setTimeout(displayTime, 10);
    }
    
    // スタートボタンがクリックされたら時間を進める
    startButton.addEventListener('click', () => {
      startButton.disabled = true;
      stopButton.disabled = false;
      resetButton.disabled = true;
      startTime = Date.now();
      displayTime();
    });
    
    // ストップボタンがクリックされたら時間を止める
    stopButton.addEventListener('click', function() {
      startButton.disabled = false;
      stopButton.disabled = true;
      resetButton.disabled = false;
      clearTimeout(timeoutID);
      stopTime += (Date.now() - startTime);
    });
    
    // リセットボタンがクリックされたら時間を0に戻す
    resetButton.addEventListener('click', function() {
      startButton.disabled = false;
      stopButton.disabled = true;
      resetButton.disabled = true;
      time.textContent = '00:00';
      stopTime = 0;
    });


    
    
    // ストップウォッチ部分のトグル機能
    // 参考: https://liginc.co.jp/356926
        // Todo:JavaScriptで動かすと負荷がかかるので、CSSでの実装を検討
    $('.timer-item').hide();
    $('.accordion-head').on('click', function() {
        $('.timer-item').slideToggle(300);
    });

    // ページトップへ戻るボタン
    $('.pageTop-button').on('click', function() {
        event.preventDefault();
        $('html, body').animate({scrollTop: 0}, 500);
    });

});