// #############################################################################
//  SearchEfectApplyTools (JP)
//      CreateDate:2018/12/09
//      Author:sakata678
//       Ver:1.0.0.0
// #############################################################################
// --------------------------------------------------------------------------------------------------------------
// 初期設定
// --------------------------------------------------------------------------------------------------------------
//  EffectsList格納
var effectsName_ALL = app.effects;

// 検索結果格納用配列
var searchEffectsDispName = [];
var searchEffectsMatchName = [];

// 適用対象エフェクト格納用配列
var app_EffectsName = [];

// 画面表示用配列(チェックボックス)
var chk_EffectsName= [];

// チェックボックス表示位置調整用
var chk_down_Pos = 40;

// ページング初期値
var curPage = 1;
var MaxPage = 1;
var MinPage = 1;

// 検索結果件数・表示件数
var resultCnt = 0;
var rowCnt = 0;

// 画面パネル作成
var panel = new Window("palette", "EffectsApplyTool", [0, 0, 325, 420]);

// 画面デザイン定義
panel.add("statictext", [10, 10, 200, 30], "■ エフェクト一括適用ツール");
panel.add("statictext", [20, 30, 220, 40], "検索対象(エフェクト名)");
panel.add("statictext", [20, 90, 200, 30], "検索結果");
var inputText  = panel.add("edittext", [20,50, 220, 70]);
var btn_Search = panel.add("button", [240,45,300,75],"検索");
var btn_Rev = panel.add("button", [80,110,120,130],"<");
var btn_Next = panel.add("button", [200,110,240,130],">");
var btn_Apply = panel.add("button", [20,370,100,400],"適用");
var btn_Close = panel.add("button", [120,370,200,400],"閉じる");

// --------------------------------------------------------------------------------------------------------------
// 初期表示処理
// --------------------------------------------------------------------------------------------------------------
// 画面表示処理
panel.center();
panel.show();

// 初期検索処理
search_result(1,0);

// ページ数描画
panel.add("statictext", [130, 112 ,200, 80], curPage +" / " + MaxPage +" ページ");

// --------------------------------------------------------------------------------------------------------------
// 検索ボタン押下イベント
// --------------------------------------------------------------------------------------------------------------
btn_Search.onClick = function(){
    panel.remove (resultCnt-1+9);
    search_result(1,1);
    panel.add("statictext", [130, 112 ,200, 80], curPage +" / " + MaxPage +" ページ");
 }

// --------------------------------------------------------------------------------------------------------------
// ページ送り(次ページ)ボタン押下イベント
// --------------------------------------------------------------------------------------------------------------
btn_Next.onClick = function(){
    panel.remove (resultCnt-1+9);
    search_result(curPage+1, 2);
    panel.add("statictext", [130, 112 ,200, 80], curPage +" / " + MaxPage +" ページ");
}

// --------------------------------------------------------------------------------------------------------------
// ページ送り(前ページ)ボタン押下イベント
// --------------------------------------------------------------------------------------------------------------
btn_Rev.onClick = function(){
    panel.remove (resultCnt-1+9);
    search_result(curPage-1, 2);
    panel.add("statictext", [130, 112 ,200, 80], curPage +" / " + MaxPage +" ページ");
}

// --------------------------------------------------------------------------------------------------------------
// エフェクト適用ボタン押下イベント
// --------------------------------------------------------------------------------------------------------------
btn_Apply.onClick = function(){
    selectedLayer = app.project.activeItem.selectedLayers;
    for (i=0; i<selectedLayer.length; i++){
        layObj = selectedLayer[i];        
        for (j=0; j< app_EffectsName.length; j++){
            if (chk_EffectsName[j].value == true){
                layObj("Effects").addProperty(app_EffectsName[j]);
            }
        }
    }
}

// --------------------------------------------------------------------------------------------------------------
// 閉じるボタン押下イベント
// --------------------------------------------------------------------------------------------------------------
btn_Close.onClick = function(){
    panel.close();
}

// --------------------------------------------------------------------------------------------------------------
// エフェクト検索処理
// --------------------------------------------------------------------------------------------------------------
function search_result( page_index , initflg) {
    // 検索結果初期化
    if(initflg != 0){
        for (i=0; i < resultCnt; i++){
            panel.remove (9);
        }
    }

    // 変数初期化
    chk_EffectsName = [];
    app_EffectsName = [];
    resultCnt = 0;
    
    // 検索条件入力時
    if(initflg !=2){
        // 検索ボタン押下時のみ初期化
        searchEffectsDispName = [];
        searchEffectsMatchName = [];
        rowCnt = 0;
        
        // 検索条件をもとに検索
        if (inputText.text != ""){
            for(i= 0; i < app.effects.length; i++){
                if (~effectsName_ALL[i].displayName.indexOf(inputText.text)){
                    searchEffectsMatchName.push(effectsName_ALL[i].matchName);
                    searchEffectsDispName.push(effectsName_ALL[i].displayName);
                    rowCnt = rowCnt +1;
                }
            } 
        }
    
        // 検索結果0県の場合
        if (inputText.text == "" || rowCnt == 0) {
            if (initflg == 1) {        
                alert('条件に該当するエフェクトが見つからなかったため、全件表示します。');
            }        
            for(i=0; i < app.effects.length; i++){       
                searchEffectsMatchName.push(effectsName_ALL[i].matchName);
                searchEffectsDispName.push(effectsName_ALL[i].displayName);
                rowCnt = rowCnt +1;
            }   
        }
    }

    // エフェクトリスト描画処理
    for (i= page_index * 10 - 10; i < searchEffectsDispName.length; i++){
            if (resultCnt < 10) {  
                app_EffectsName.push(searchEffectsMatchName[i]);
                chk_EffectsName.push(panel.add("checkbox", [30, 140, 200,160+(chk_down_Pos * resultCnt)], searchEffectsDispName[i]));
                chk_EffectsName[resultCnt].value = false;
                resultCnt = resultCnt + 1;
            }else{
                break;
            }
    }

    // ページングカウンタの更新
    curPage = page_index;
    MaxPage = Math.ceil(rowCnt/10,1);
    
    // 最小ページ数より前に戻れないように制御
    if (curPage == MinPage){
        btn_Rev.enabled =false;
    }else {
        btn_Rev.enabled =true;
    }
 
    // 最大ページ数より先に行かないように制御
    if (curPage == MaxPage){
        btn_Next.enabled =false;
    }else{
        btn_Next.enabled =true;
    }
}


