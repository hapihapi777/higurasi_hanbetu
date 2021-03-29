'use strict';
{

  document.getElementById('kakera_g1').addEventListener('click', Kasan_kakera_g);
  document.getElementById('kakera_b1').addEventListener('click', Kasan_kakera_bell);
  document.getElementById('kakera_tuika').addEventListener('click', Kasan_kakera_all);
  // カケラ紡ぎのボタン

  document.getElementById('rt_30').addEventListener('click', Kasan_rt30);
  document.getElementById('rt_50').addEventListener('click', Kasan_rt50);
  document.getElementById('rt_90').addEventListener('click', Kasan_rt90);
  document.getElementById('rt_b1').addEventListener('click', Kasan_rt_bell);
  document.getElementById('btn_hazure').addEventListener('click', Kasan_rt_hazure);
  // RTのボタン

  document.getElementById('result').addEventListener('click', Keisan);
  // 計算ボタン

  document.getElementById('kekka').addEventListener('click', Syuusi);
  // 結果ボタン

  let accuracy = 100000000000000;
  let dankai = 6; //6段階設定

  // let kakera_g = parseInt(document.getElementById("kakera_g").value);
  // let kakera_all = parseInt(document.getElementById("kakera_all").value);
  // let kakera_bell = parseInt(document.getElementById("kakera_bell").value);
  // let rt_g = parseInt(document.getElementById("rt_g").value);
  // let rt_bell = parseInt(document.getElementById("rt_bell").value);
  // let rt_hazure = parseInt(document.getElementById("rt_hazure").value);
  // 入力欄

  // let rt_goukei = kakera_g + kakera_all + rt_g;
  // let bell_goukei = kakera_bell + rt_bell;

  let bell_kakuritu = [18.700, 17.880, 17.040, 15.860, 15.090, 14.830]; //共通ベル確率
  let hazure_kakuritu = [69.350, 66.065, 64.695, 61.077, 58.882, 57.996]; //ART中ハズレ確率

  // (ART中)ハズレ(単独ボーナス含む)
  // 1/69.350 (945/65536)
  // 1/66.065 (992/65536)
  // 1/64.695 (1013/65536)
  // 1/61.077 (1073/65536)
  // 1/58.882 (1113/65536)
  // 1/57.996 (1130/65536)
  // 判別用


  // Cure();

  // function Cure() {
  //   let input_1 = document.getElementById("kakera_g");
  //   let input_2 = document.getElementById("kakera_bell");
  //   let input_3 = document.getElementById("rt_g");
  //   let input_4 = document.getElementById("rt_bell");
  //   if (parseInt(input_1.value) === "" || parseInt(input_1.value) < 0) input_1.value = 0;
  //   if (parseInt(input_2.value) === "" || parseInt(input_2.value) < 0) input_2.value = 0;
  //   if (parseInt(input_3.value) === "" || parseInt(input_3.value) < 0) input_3.value = 0;
  //   if (parseInt(input_4.value) === "" || parseInt(input_4.value) < 0) input_4.value = 0;
  // }

  //期待値算出関数(計算ボタンで実行)
  function Keisan() {
    // 入力欄
    let kakera_g = parseInt(document.getElementById("kakera_g").value);
    let kakera_all = parseInt(document.getElementById("kakera_all").value);
    let kakera_bell = parseInt(document.getElementById("kakera_bell").value);
    let rt_g = parseInt(document.getElementById("rt_g").value);
    let rt_bell = parseInt(document.getElementById("rt_bell").value);
    let rt_hazure = parseInt(document.getElementById("rt_hazure").value);

    // 入力欄の合計値
    let rt_goukei = kakera_g + kakera_all + rt_g;
    let bell_goukei = kakera_bell + rt_bell;

    // 確率の表示
    let goukei_kaisuu = bell_goukei + '/ ' + rt_goukei;
    if (rt_goukei < bell_goukei) goukei_kaisuu = "入力値がおかしいです";

    let bell_kakuritu = '1/ ' + Math.round((rt_goukei / bell_goukei) * 1000) / 1000;
    if (rt_goukei < bell_goukei) bell_kakuritu = "";
    if (bell_goukei === 0) bell_kakuritu = '0/ ' + rt_goukei;

    document.getElementById("result_g").textContent = goukei_kaisuu;
    document.getElementById("result_b").textContent = bell_kakuritu;

    let hazure_hyouzi = rt_hazure + '/ ' + rt_g;
    if (rt_g <= rt_hazure) hazure_hyouzi = "入力値がおかしいです";

    let hazure_r = '1/ ' + Math.round((rt_g / rt_hazure) * 1000) / 1000;
    if (rt_g <= rt_hazure) hazure_r = "";
    if (rt_hazure === 0) hazure_r = '0/ ' + rt_goukei;

    document.getElementById("result_g_h").textContent = hazure_hyouzi;
    document.getElementById("result_h_h").textContent = hazure_r;


    // 期待値の表示
    for (let i = 0; i < dankai; i++) {
      document.getElementById("r_" + [i + 1]).textContent = " : " + Hanbetu()[i] + "％";
    }

    console.log(Hanbetu());
  }

  //ボタン
  function Kasan(x, y) {
    document.getElementById(x).value = y + parseInt(document.getElementById(x).value);
  }

  function Kasan_kakera_g() {
    Kasan("kakera_g", 1);
  }

  // 追加時にkakera_gをリセット
  function Kasan_kakera_all() {
    let n = parseInt(document.getElementById('kakera_g').value);
    Kasan("kakera_all", n);
    document.getElementById("kakera_g").value = 0 * n;
  }

  // 加算ボタン
  function Kasan_kakera_bell() {
    Kasan("kakera_bell", 1);
  }

  function Kasan_rt30() {
    Kasan("rt_g", 30);
  }

  function Kasan_rt50() {
    Kasan("rt_g", 50);
  }

  function Kasan_rt90() {
    Kasan("rt_g", 90);
  }

  function Kasan_rt_bell() {
    Kasan("rt_bell", 1);
  }
  function Kasan_rt_hazure() {
    Kasan("rt_hazure", 1);
  }
  // ここまでボタンの関数

  // 収支用関数
  function Syuusi() {
    let tyomedaru = parseInt(document.getElementById("tyomedaru").value);
    let owari = parseInt(document.getElementById("owari").value);

    let n = owari - tyomedaru + "枚";
    if (n == "NaN枚") n = "入力値エラー";
    if (0 < n) n = "+" + n;
    document.getElementById("syuusi").textContent = n;
  }

  // 判別用関数
  function Hanbetu() {
    let kakera_g = parseInt(document.getElementById("kakera_g").value);
    let kakera_all = parseInt(document.getElementById("kakera_all").value);
    let kakera_bell = parseInt(document.getElementById("kakera_bell").value);
    let rt_g = parseInt(document.getElementById("rt_g").value);
    let rt_bell = parseInt(document.getElementById("rt_bell").value);
    let rt_hazure = parseInt(document.getElementById("rt_hazure").value);
    // 入力欄

    let rt_goukei = kakera_g + kakera_all + rt_g;
    let bell_goukei = kakera_bell + rt_bell;
    // 入力欄の合計値


    let bell_kitaiti = GetHiritu(bell_goukei, rt_goukei, bell_kakuritu);
    let hazure_kitaiti = GetHiritu(rt_hazure, rt_g, hazure_kakuritu);

    let goukei_hiritu = [];
    let goukei = 0;

    let result = [];

    for (let i = 0; i < dankai; i++) {
      goukei_hiritu.push(Math.round(((bell_kitaiti[i] * hazure_kitaiti[i])) * 100) / 100);
      goukei += goukei_hiritu[i];
    }

    for (let i = 0; i < dankai; i++) {
      result.push(Math.floor((goukei_hiritu[i] / goukei) * 10000) / 100);
    }

    return result;
  }

  // 比率関数
  function GetHiritu(bunsi, bunbo, array) {

    let setteiti = GetKoyakuKakuritu(array);

    let n = BigInt(bunbo);
    let x = BigInt(bunsi);
    let goukei = 0n;
    let kakuritu = [];
    //nCx * p^x * (1-p)^(n-x)
    for (let i = 0; i < dankai; i++) {
      let item1 = Combi(n, x);
      let item2 = setteiti[i] ** x;
      let item3 = (BigInt(accuracy) - setteiti[i]) ** (n - x);
      kakuritu.push(item1 * item2 * item3);
      goukei += kakuritu[i]
    }

    let hiritu = [];

    for (let i = 0; i < dankai; i++) {
      hiritu.push(Math.round((parseFloat((kakuritu[i] / (goukei / BigInt(accuracy)) * 100n)) / accuracy) * 100) / 100);
    }

    return hiritu;
  }

  // 小役確率の関数
  function GetKoyakuKakuritu(array) {
    let result = [];
    for (let i = 0; i < dankai; i++) {
      result.push(BigInt(Math.floor(1 / array[i] * accuracy)));
    }
    return result;
  }

  // 再帰関数
  function Combi(x, y) {
    y = x - y;
    let val = 0n;

    if (y == 0n) {
      val = 1n;
    } else {
      val = Combi(x - 1n, y - 1n) * x / y;
    }

    return val;
  }
}