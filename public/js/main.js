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
  // RTのボタン

  document.getElementById('result').addEventListener('click', Keisan);
  // 計算ボタン

  document.getElementById('kekka').addEventListener('click', Syuusi);
  // 結果ボタン

  let accuracy = 1000000000000;
  let dankai = 6; //6段階設定

  let bell_kakuritu = [18.70, 17.88, 17.04, 15.86, 15.09, 14.83]; //共通ベル確率
  let hazure_kakuritu = [69.350, 66.065, 64.695, 61.077, 58.882, 57.996]; //ART中ハズレ確率

  // (ART中)ハズレ(単独ボーナス含む)
    // (S1)1/69.350 (945/65536)
    // (S2)1/66.065 (992/65536)
    // (S3)1/64.695 (1013/65536)
    // (S4)1/61.077 (1073/65536)
    // (S5)1/58.882 (1113/65536)
    // (S6)1/57.996 (1130/65536)
  let koyaku_kakuritu_p = [];
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

  function Keisan() {
    let kakera_g = parseInt(document.getElementById("kakera_g").value);
    let kakera_all = parseInt(document.getElementById("kakera_all").value);
    let kakera_bell = parseInt(document.getElementById("kakera_bell").value);
    let rt_g = parseInt(document.getElementById("rt_g").value);
    let rt_bell = parseInt(document.getElementById("rt_bell").value);
    // 入力欄

    let rt_goukei = kakera_g + kakera_all + rt_g;
    let bell_goukei = kakera_bell + rt_bell;
    // 入力欄の合計値

    let goukei_kaisuu = bell_goukei + '/ ' + rt_goukei;
    if (rt_goukei <= bell_goukei) goukei_kaisuu = "入力値がおかしいです";

    let bell_kakuritu = '1/ ' + Math.round((rt_goukei / bell_goukei) * 1000) / 1000;
    if (rt_goukei <= bell_goukei) bell_kakuritu = "";

    document.getElementById("result_g").textContent = goukei_kaisuu;
    document.getElementById("result_b").textContent = bell_kakuritu;

    Hanbetu();
  }

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

  function Syuusi() {
    let tyomedaru = parseInt(document.getElementById("tyomedaru").value);
    let owari = parseInt(document.getElementById("owari").value);

    let n = owari - tyomedaru + "枚";
    if (n == "NaN枚") n = "入力値エラー";
    if (0 < n) n = "+" + n;
    document.getElementById("syuusi").textContent = n;
  }


  function Hanbetu() {
    // console.clear();

    let kakera_g = parseInt(document.getElementById("kakera_g").value);
    let kakera_all = parseInt(document.getElementById("kakera_all").value);
    let kakera_bell = parseInt(document.getElementById("kakera_bell").value);
    let rt_g = parseInt(document.getElementById("rt_g").value);
    let rt_bell = parseInt(document.getElementById("rt_bell").value);

    let rt_goukei = kakera_g + kakera_all + rt_g;
    let bell_goukei = kakera_bell + rt_bell;
    let n = BigInt(rt_goukei);
    let x = BigInt(bell_goukei);

    // if(n < x){
    //   console.log("回転数の方が少ない");
    //   return;
    // }

    // GetKoyakuKakuritu();

    let goukei = 0n;
    let kakuritu = [];
    //nCx * p^x * (1-p)^(n-x)
    for (let i = 0; i < dankai; i++) {
      let item1 = Combi(n, x);
      let item2 = GetKoyakuKakuritu()[i] ** x;
      let item3 = (BigInt(accuracy) - GetKoyakuKakuritu()[i]) ** (n - x);
      kakuritu.push(item1 * item2 * item3);
      goukei += kakuritu[i]
      // console.log(kakuritu[i]);
    }

    let hiritu = [];

    for (let i = 0; i < dankai; i++) {
      hiritu.push(Math.round((parseFloat((kakuritu[i] / (goukei / BigInt(accuracy)) * 100n)) / accuracy) * 100) / 100);
      // console.log(hiritu[i]);
      document.getElementById("r_" + [i + 1]).textContent = " : " + hiritu[i] + "％";
      // test += hiritu[i];
      // console.log(test);
      // DrawGraph(hiritu);
    }
  }

  function GetHiritu(array) {
    GetKoyakuKakuritu(array);

    
  }



  function GetKoyakuKakuritu(array) {
    let result = [];
    // koyaku_kakuritu_p.splice(0);
    // let kakuritu_test = [18.70, 17.88, 17.04, 15.86, 15.09, 14.83];
    // ひぐらし2の共通ベル確率

    // (ART中)ハズレ目
    // (S1)1/69.350 (945/65536)
    // (S2)1/66.065 (992/65536)
    // (S3)1/64.695 (1013/65536)
    // (S4)1/61.077 (1073/65536)
    // (S5)1/58.882 (1113/65536)
    // (S6)1/57.996 (1130/65536)

    for (let i = 0; i < dankai; i++) {
      let id = 'p' + (i + 1);
      // console.log(id);
      result.push(BigInt(Math.floor(1 / array[i] * accuracy)));
      // console.log(koyaku_kakuritu_p[i]);
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