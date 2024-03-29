# 本ページは「海外向け広報用映像制作支援システム」の開発及び公開用GitHubです。<br>
## 本システムについて<br>
海外向け広報用映像制作においては、ローカルテレビ局等と、海外の放送局などの共同制作が総務省の取り組みにより推進しています。そのなかで、「スケジュールの余裕を作り、より映像コンテンツの制度を上げること」が2021年度の資料において課題としてあげられました。当システムは、プロット段階での禁忌用語のチェックと修正提案に加え、絵コンテとビデオコンテの自動が造成性をAIを用いて実現し、当該課題の解決を支援することを目的としています。これにより、映像制作業務の効率化と、海外向け広報用映像の質的向上が期待できます。<br>
具体的な機能は以下のとおりです。<br>
・プロットから、放送禁止用語、表現などを検出し、該当箇所を削除・修正する機能<br>
・絵コンテの画像部分を自動生成する機能<br>
・ビデオコンテを自動生成する機能<br>
## ファイルおよびフォルダについて<br>
### ・現在の作業フォルダについて(2023年10月19日更新)<br>
現在以下のフォルダで主に作業しています。<br>
main<br><br>
アプリケーション実行手順<br>
cd frontendファイル<br>
npm start（フロントエンドサーバーが起動＋UI表示）<br>
(VSCodeに移動)<br>
ターミナル起動<br>
仮想環境に入る（開発中の仮想環境名前はvenv）<br>
cd backned<br>
server.py を実行<br>
### ・Before integration<br>
各自が作成した機能（プログラム）を入れていくフォルダです。<br>
以下のプログラムは東京ゲームショウ用に作成した、Tkinterを用いたタイプです。<br>
proed\Beforeintegration\UI\gui.py<br>
### ・main<br>
最終成果物を保存するフォルダです。<br>
## ライブラリのインストールについて<br>
以下の2つをインストールしてください<br>
・proed\requirements.txtのインストール<br>
・"pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118"をターミナルで実行<br>
## 制作物について（2023年9月4日追記）<br>
### 全体の流れ <br>
入:プロットの文章　.txt file<br>
放送禁止用語を検出する<br>
プロットを再生成<br>
出: 再生成された後のプロット　.txt file<br><br>
プロットを絵コンテにする作業（人）<br>
シーン、情景、セリフ、秒数などの文字を絵コンテに記入（テンプレートに記入）<br><br>
入:絵コンテ　.docx<br>
StableDiffusion画像による生成<br>
絵コンテへの貼り付け<br>
ビデオコンテ生成<br>
出: ビデオコンテ　.mp4 file<br>
出: 絵コンテ　.docx file<br>
