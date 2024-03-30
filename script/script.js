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
                        <input type="text" class="pour-ml ml"> ml
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





    // レシピの変換･変換後レシピの出力





    // ストップウォッチ


});