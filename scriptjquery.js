// var data;
$(document).ready(function () {
    getdata();
    $("#idea, #code").hide();
    // lấy file json
    var data;
    $.getJSON("data.json", data, function (data) {
        control(data);
    });
});
// Kiểm tra người dùng sắp leave pages
//
function control(data) {
    showhp(data) // Hiện mã hp (all)
    $("#tracuuinput").keyup(function (e) {
        e.preventDefault();
        setTimeout(() => {
            $("#ketquatracuu").show();
            searchbar()
        }, 1000);
    });
    $("#cleartkb").click(function (e) {
        e.preventDefault();
        clearMemory();
    });
    buttoncontact();
    // click vào icon search
    $(".fa-search").click(function (e) {
        e.preventDefault();
        goixuli(data);
    });

    // trigger phím enter
    $("#form").keyup(function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            goixuli(data)
        }
    });
}
//xóa memory
function clearMemory() {
    var tietlist = $(".tiet");
    var buttonlist = $(".childbutton");
    for (let i = 0; i < tietlist.length; i++) {
        tietlist[i].innerHTML = "";
    }
    localStorage.clear();
    for (let i = 0; i < buttonlist.length; i++) {
        changeBackgroundButton(".childbutton"+(i+1), "Add", "", ".child" + (i+1), "brown");
        buttonlist[i].disabled = false;
        buttonlist[i].className = "childbutton childbutton"+(i+1);
    }

}

// xóa input value và pass value đó cho xử lí
function goixuli(data) {
    var val = $("#form").val();
    $("#form").val("");
    xuli(val, data);
}

// xử lí input lấy từ form
function xuli(val, data) {

    var count = 0;
    var t = false;
    for (let i = 0; i < data.length; i++) {
        if (data[i]["Mã HP"] == val.toUpperCase()) {
            t = true;
            break;
        }
    };
    if (t) {
        $(".child, .childbutton").remove();
        data.forEach(element => {
            if (element["Mã HP"] == val.toUpperCase()) {
                count++;
                createElement("div", element, count);
            }
        });
        hptrungnhau();
        ngaytrungnhau();
    } else {
        alert("Không tồn tại mã học phần này");
    }
    window.scrollTo({
        top: 2000,
        left: 2000,
        behavior: 'smooth'
    });
}

// Kiểm tra các ngày trong tkb hiện có có trùng hp nào ko
function ngaytrungnhau() {
    var tiet = $(".tiet");
    var childlist = $(".child");
    var buttonlist = $(".childbutton");
    for (let i = 0; i < tiet.length; i++) {
        if (tiet[i].innerHTML != "") {
            let maloptkb = tiet[i].innerHTML.slice(tiet[i].innerHTML.indexOf("-") + 1, tiet[i].innerHTML.indexOf("<"));
            let mahptkb = tiet[i].innerHTML.slice(0, tiet[i].innerHTML.indexOf("-"));
            let thuhienco = tiet[i].className.match(/(\d+)/)[0];
            let vitri = tiet[i].className.slice(tiet[i].className.lastIndexOf(" ") + 1, tiet[i].className.length).match(/(\d+)/)[0];
            for (let j = 0; j < buttonlist.length; j++) {

                let sotiet = parseInt(childlist[5 + 11 * j].innerHTML);
                let thu = parseInt(childlist[6 + 11 * j].innerHTML);
                let tietbd = parseInt(childlist[7 + 11 * j].innerHTML);
                let malop = childlist[0 + 11 * j].innerHTML;
                let mahp = childlist[2 + 11 * j].innerHTML;
                if ((thuhienco == thu) && (tietbd + sotiet >= vitri) && (tietbd <= vitri) && (mahp == mahptkb) && (malop == maloptkb)) {
                    // Chạy dòng for check coi có ai trùng mã lớp thì cho disable luôn
                    for (let k = 0; k < buttonlist.length; k++) {
                        if (malop == childlist[0 + 11 * k].innerHTML) {
                            let buttonlistname = "." + buttonlist[j].className.slice(0, buttonlist[j].className.indexOf(" ")) + (j + 1);
                            $(buttonlistname)[0].className += " active";
                            changeBackgroundButton(buttonlistname, "Delete", "rgb(182, 182, 182)", ".child" + (j + 1), "black");
                        }
                    }
                } else if ((thuhienco == thu) && (tietbd + sotiet >= vitri) && (tietbd <= vitri) && (mahp != mahptkb || malop != maloptkb)) {
                    let malop1 = childlist[0 + 11 * j].innerHTML;
                    for (let k = 0; k < buttonlist.length; k++) {
                        if (childlist[0 + 11 * k].innerHTML == malop1) {
                            buttonlist[k].disabled = true;
                        }
                    }
                }
            }
        }
    }
}
// Kiểm tra các học phần có trùng nhau không
function hptrungnhau() {
    var tiet = $(".tiet");
    var childlist = $(".child");
    var buttonlist = $(".childbutton");
    for (let i = 0; i < tiet.length; i++) {
        let tietcontent = tiet[i].innerHTML;
        if (tietcontent != "") {
            for (let j = 0; j < buttonlist.length; j++) {
                let kihieu = childlist[0 + 11 * j].innerHTML;
                let mahp = childlist[2 + 11 * j].innerHTML;
                if ((mahp == tietcontent.slice(0, tietcontent.indexOf("-")))
                    && (kihieu == tietcontent.slice(tietcontent.indexOf("-") + 1, tietcontent.indexOf("<")))) {
                    let buttonlistname = "." + buttonlist[j].className.slice(0, buttonlist[j].className.indexOf(" ")) + (j + 1);
                    $(buttonlistname)[0].className += " active";
                    changeBackgroundButton(buttonlistname, "Delete", "rgb(182, 182, 182)", ".child" + (j + 1), "black");
                }
            }
        }
    }
    disablebutton();
}

// Tạo các thẻ con và truyền vào displayres
function createElement(tagname, element, vitri) {
    var title = $(".title");   // chọn các tên đầu
    for (let i = 0; i < 12; i++) {   // Tìm coi tên title trùng nhau thì pass vào
        for (part in element) {
            if (part == title[i].innerHTML) {
                $("#displayres").append("<" + tagname + " class=\"child child" + vitri + "\">" + element[part] + "</" + tagname + ">");
            }
        }
    }
    // thêm button vào cuối dãy
    $("#displayres").append("<button class=\"childbutton childbutton" + vitri + "\">" + "Add" + "</button>");
    // Khi click vào button
    $(".childbutton")[vitri - 1].onclick = function () {
        let childlist = $(".child");
        let buttonlist = $(".childbutton");
        for (let i = 0; i < buttonlist.length; i++) {
            // Nếu các lớp có cùng mã lớp sẽ cùng dc bấm 
            if (childlist[1 + 11 * i].innerHTML == childlist[1 + 11 * (vitri - 1)].innerHTML)
                xulibutton(".childbutton" + (i + 1), i + 1);
        }
        disablebutton();
        ngaytrungnhau();
    };
}

// Tắt các button khi phát hiện có nút delete
function disablebutton() {
    var buttonlist = $(".childbutton");
    var t = false
    for (let i = 0; i < buttonlist.length; i++) {
        if (buttonlist[i].innerHTML == "Delete") { t = true; break; }
    }
    if (t) {
        for (let i = 0; i < buttonlist.length; i++) {
            if (buttonlist[i].innerHTML != "Delete") { buttonlist[i].disabled = true; }
        }
    } else {
        for (let i = 0; i < buttonlist.length; i++) {
            buttonlist[i].disabled = false;
        }
    }
}
// Truyền class của button được click vào để đổi màu nền và chữ
function xulibutton(buttonclass, vitri) {
    $(buttonclass).toggleClass(" active");
    var childlist = $(".child");
    var kihieu = childlist[0 + 11 * (vitri - 1)].innerHTML;
    var mahp = childlist[2 + 11 * (vitri - 1)].innerHTML;
    var phong = childlist[3 + 11 * (vitri - 1)].innerHTML;
    var sotiet = parseInt(childlist[5 + 11 * (vitri - 1)].innerHTML);
    var thu = parseInt(childlist[6 + 11 * (vitri - 1)].innerHTML);
    var tietbd = parseInt(childlist[7 + 11 * (vitri - 1)].innerHTML);
    if ($(buttonclass)[0].className.indexOf("active") >= 0) {
        scrolltop();
        changeBackgroundButton(buttonclass, "Delete", "rgb(182, 182, 182)", ".child" + vitri, "black");
        addtoTKB(kihieu, mahp, phong, sotiet, thu, tietbd);
    } else {
        changeBackgroundButton(buttonclass, "Add", "", ".child" + vitri, "brown");
        delfromTKB(sotiet, thu, tietbd);

    }
}

// Đổi màu nền và chữ
function changeBackgroundButton(buttonclass, text, color1, lineclass, color2) {
    $(buttonclass).text(text).css("background", color1);
    $(lineclass).css("color", color2);
}

// Thêm vào TKB
function addtoTKB(kihieu, mahp, phong, sotiet, thu, tietbd) {

    for (let i = 0; i < sotiet; i++) {
        $(".t" + thu + ".tiet" + (tietbd + i)).html(mahp + "-" + kihieu + "<br>" + phong);
    }
}

// Xỏa khỏi TKB
function delfromTKB(sotiet, thu, tietbd) {
    for (let i = 0; i < sotiet; i++) {
        $(".t" + thu + ".tiet" + (tietbd + i)).html("");
    }
}

// buttoncontact
function buttoncontact() {
    $(".fa-envelope").click(function (e) {
        e.preventDefault();
        alert("Gmail: " + $(this).attr("href"));
    })
    $("#buttoncontact").click(function (e) {
        e.preventDefault();
        $("#idea, #code").slideToggle();
    });
}
// thanh search mã hp
function searchbar() {
    var value = $("#tracuuinput").val().toUpperCase();
    var ketquatracuu = $(".ketqua");
    if (value == "") {
        $("#ketquatracuu").hide();
    }
    for (let i = 0; i < ketquatracuu.length; i++) {
        if (ketquatracuu[i].innerHTML.toUpperCase().indexOf(value) > -1) {
            $(".ketqua" + i).show();
        } else $(".ketqua" + i).hide();
    }
}
function showhp(data) {
    var j = -1;
    for (let i = 0; i < data.length - 1; i++) {
        let tenhp = data[i]["Tên học phần"];
        let mahp = data[i]["Mã HP"];
        if (data[i]["Tên học phần"] != data[i + 1]["Tên học phần"]) {
            j++;
            $("#ketquatracuu").append("<div class=\"ketqua ketqua" + j + "\">" + tenhp + " - " + mahp + "</div>");
        }
    }
}
function scrolltop() {
    window.scrollTo(0, 0);
}

// lưu tạm bộ nhớ
$(window).on('beforeunload', function () {
    var tietlist = $(".tiet");
    for (let i = 0; i < tietlist.length; i++) {
        localStorage.setItem('key' + i, tietlist[i].innerHTML);
    }
});
function getdata() {
    var tietlist = $(".tiet");
    for (let i = 0; i < tietlist.length; i++) {
        let data = localStorage.getItem('key' + i);
        if (data != "undefined" && data != "null" && data != null && data != undefined && data.length > 4)
            tietlist[i].innerHTML = data;
    }
}