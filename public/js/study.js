window.addEventListener('DOMContetLoaded', function() {
    //チェックボックスのHTML要素を取得
    let input_check1 = document.querySelector("input[name=agree]");

    input_check1.addEventListener('chage', function() {
        console.log(this.checked);
    });
});
