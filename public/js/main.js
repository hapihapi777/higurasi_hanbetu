'use strict';
{
  let accuracy = 100000000000000;
  let dankai = 6; //6段階設定

  Button_General();



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
    if (rt_goukei <= bell_goukei) goukei_kaisuu = "入力値がおかしいです";

    let bell_result = '1/ ' + Math.round((rt_goukei / bell_goukei) * 1000) / 1000;
    if (rt_goukei < bell_goukei) bell_result = "";
    if (bell_goukei === 0) bell_result = '0/ ' + rt_goukei;

    document.getElementById("result_g").textContent = goukei_kaisuu;
    document.getElementById("result_b").textContent = bell_result;

    let hazure_hyouzi = rt_hazure + '/ ' + rt_g;
    if (rt_g < rt_hazure) hazure_hyouzi = "入力値がおかしいです";

    let hazure_r = '1/ ' + Math.round((rt_g / rt_hazure) * 1000) / 1000;
    if (rt_g <= rt_hazure) hazure_r = "";
    if (rt_hazure === 0) hazure_r = '0/ ' + rt_g;

    document.getElementById("result_g_h").textContent = hazure_hyouzi;
    document.getElementById("result_h_h").textContent = hazure_r;


    // 期待値の表示
    let result = Hanbetu();
    for (let i = 0; i < dankai; i++) {
      document.getElementById("r_" + [i + 1]).textContent = result[i] + "％";
    }

    console.log(result);
  }

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
    let bell_kakuritu = [18.700, 17.880, 17.040, 15.860, 15.090, 14.830]; //共通ベル確率
    let hazure_kakuritu = [69.350, 66.065, 64.695, 61.077, 58.882, 57.996]; //ART中ハズレ確率

    let num = GetRadio();
    if (num > 0) {
      for (let i = 0; i < num; i++) {
        bell_kakuritu[i] = 1;
        hazure_kakuritu[i] = 1;
      }
    }
    console.log(num);

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
    console.log("ベルのみ：" + bell_kitaiti);
    console.log("ハズレのみ：" + hazure_kitaiti);

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

  function Button_General() {

    Button_Keisan('btn_kakera_g1', 'kakera_g', 1);
    Button_Keisan('btn_kakera_b1', 'kakera_bell', 1);

    GetCount('btn_rt_50', 'rt_g', 50, 'count_50', 'btn_mainasu_50');
    GetCount('btn_rt_90', 'rt_g', 90, 'count_90', 'btn_mainasu_90');
    GetCount('btn_rt_30', 'rt_g', 30, 'count_30', 'btn_mainasu_30');

    Button_Keisan('btn_rt_b1', 'rt_bell', 1);
    Button_Keisan('btn_hazure', 'rt_hazure', 1);

    document.getElementById('btn_kakera_tuika').addEventListener('click', Kasan_kakera_all);
    // カケラ紡ぎのボタン

    document.getElementById('result').addEventListener('click', Keisan);
    // 計算ボタン

    document.getElementById('kekka').addEventListener('click', Syuusi);
    // 結果ボタン
  }



  // 追加時にkakera_gをリセット
  function Kasan_kakera_all() {
    let n = parseInt(document.getElementById('kakera_g').value);
    let m = parseInt(document.getElementById("kakera_all").value);
    document.getElementById("kakera_all").value = m + n;
    document.getElementById("kakera_g").value = 0 * n;
  }


  // 良く使うボタンの関数
  function Button_Keisan(x, y, z) {
    document.getElementById(x).addEventListener('click', function () {
      document.getElementById(y).value = parseInt(document.getElementById(y).value) + z;
    });
  }


  function GetRadio() { // ラジオボタン
    let target = document.getElementById("target");
    let s = parseInt(target.jogai.value);
    console.log(s);
    return s;
  }

  function GetCount(x, y, z, c, m) {
    let n = 0;
    document.getElementById(x).addEventListener('click', function () {
      document.getElementById(y).value = parseInt(document.getElementById(y).value) + z;
      n += 1;
      document.getElementById(c).textContent = n + "回";
      console.log(n);
      return n;
    });
    //     let weightInput = document.getElementById('input#weight');
    // weightInput.disabled = false;
    // document.getElementById(m).disabled = true;
    if (n > 0
      // && z < parseInt(document.getElementById(y).value)
    ) {
      document.getElementById(m).disabled = false;
    }
    document.getElementById(m).addEventListener('click', function () {
      document.getElementById(y).value = parseInt(document.getElementById(y).value) - z;
      n -= 1;
      document.getElementById(c).textContent = n + "回";
      console.log(n);
      return n;
    });
  }


}