// ページを読み込んだとき、該当するaタグのみ色を変える
window.onload = function () {
    const ul = document.getElementById("c-stepper");
    const li = ul.children;
    console.log(li);

    for (let i = 0; i < li.length; i++) {
        if (li[i].className == "is-current") {
            li[i].className = "c-stepper__item";
        }
    }

    const path = location.pathname.split("/");
    const item = document.getElementById("item" + path[1]);
    item.className = "is-current";
}
