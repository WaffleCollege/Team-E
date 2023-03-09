'use strict'

//window.addEventListener('DOMContetLoaded', function() {
    //チェックボックスのHTML要素を取得
    //let input_check1 = document.querySelector("input[name=agree]");

   // input_check1.addEventListener('chage', function() {
        //console.log(this.checked);
    //});
//});


//データを保存
//localStorage.setItem('check', 'checked')
//console.log(localStorage.getItem('check'))
const checkboxstyle = document.querySelector("checkbox-style");
const check1 = document.querySelector("check1");





//checkboxの保存
let checkboxElements = document.getElementsByName("check");
let CEContents = checkboxElements.length;
let btnElements;
let btnLoad;

window.onload = function() {

   //チェックボックスの読み込み
   for (let i = 0; i < CEContents; i++ ) {
     btnElements = checkboxElements[i];
     btnLoad = JSON.parse(localStorage.getItem("check_checked" + btnElements));
     if (btnLoad == true) {
     btnElements = checkboxElements[i];
     btnElements.checked = true;
     }
   } 
};

 //チェックボックスの保存
function btn() {
    for (let i = 0; i < CEContents; i++) {
        btnElements = checkboxElements[i];
        //コンソールを開いてこの文字列を確認
        console.log("check_checked" + btnElements);

        if (btnElements.checked == true) {
            localStorage.setItem("check_checked" + i, JSON.stringify(true));
        } else {
            localStorage.setItem("check_checked" + i, JSON.stringify(false));
        }
    }
}


//これは違う機能
//function btn() {
    //if (document.getElementById("check1").checked) {
      //  alert("onに変更されました");
   // } else {
    //    alert("offに変更されました");
    //}
//}



//checkbox全てにチェックがついたら表示させる