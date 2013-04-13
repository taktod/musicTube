mp4データを再生して音楽を楽しむ。
とりあえず、html5でどこまでできるかがんばってみた。

名称:
MusicTube(version sencha)

作成経緯:
iOS6.1になってAppleの更新より、videoデータのバックグラウンド再生が別アプリに移動したりしたときに止められました。
→音楽を聴きながらいろいろしていたのに困った
→せっかくだからhtml5でなんとかしよう。
→audioタグの再生で内容が音楽データなら問題がないことがわかった。
→http proxyの技術をつかったらどうにかできそうなのでなんとかした。
→アクセスとコントロールが面倒なのでjqmobiでとりあえず作った。
→動作が芳しくないのでsencha touch用のプログラムに書き直してみた。(今ココ)

作者情報:
taktod
poepoemix@hotmail.com
http://twitter.com/taktod
http://poepoemix.blogspot.jp/

ライセンス:
GPLv3とします。
基本的にsencha touchのGPLに準拠するので、僕個人としては、このプログラムを作成するにあたって作成したサーバーサイドのプログラムもGPLでいった方がいいかと思います。
ただし、このプログラムを作成するにあたって作成したわけでないAPIサーバーはGPLである必要はありません。(たとえば利用しているyoutubeAPIなどはGPLではないと思う。)

公開アプリケーション:
http://taktodtools.appspot.com/musicTube/index.html

利用サーバーについて:
ホストサーバー
google app engine: 静的ファイルの保持
APIサーバー
youtube API: youtubeのデータを参照
musicTubeM4a: youtubeデータのproxyサーバー

特徴:
・m4a mp3のデータをベースにしたaudio再生を実行することでiOS6.1以降のiOS端末でも、バックグラウンド再生できるようになっています。
・mp4をベースにした動作の場合は、従来のyoutubeと同じくアプリを変更するとバックグラウンド再生ができなくなります。
・バックグラウンド再生を実施するためにjavascriptの使い方をいろいろと調整しています。
ただしまだまだ未熟な部分があります。
・なるべくNativeのアプリみたいにさくさくっと使いたいのでいろんなところに調整を加えてあります。
　Ext.data.Listが重くて使えないのでMusicTube.view.ui.Listを使っている
　スキンの動的きりかえをコンパイル後のプログラムで実施させるために、LocalStorageの内容を書き換えを実施する。
　senchaコマンドのバージョン管理が気に入らないので自力でLocalStorageを書き換えることをやっている
　MercuryのFullScreen状態でも別のwindowでリンクを開きたいのでリンク動作に手を加えてある。
等々

今後やっておきたいこと:
・ランダム再生をサポートしたい。
・MercuryやSlepnirで下部にLayerが重なってプレーヤーがそのままいじれないので、なんとかしたい。
・viewportのAutoMaximizeを撤廃したい。
・secretの部分の紹介ビデオつくっておきたい。
・とりあえず検索が現状は単純に30件だけなのでもっと使いやすくしたい。
(拡張検索用のアイコンは追加済みだけど実装してない)
・近場にいる人に曲リストを送る方法を構築しておきたい。
(Websocketを使うか？(*1)があるのでどうしようかまよってる。)
・sencha-SlideNavigationの動作がちと重いのでなんとかしておきたい。

おそらくな、使い方:
senchaコマンドを利用して生成プログラムをつくっていますが、gitで公開する場合どこまで公開すればよいのか、少々わからなかったので
あたらしくsenchaコマンドでプロジェクトをつくったときの差分を公開してあります。
1:以下のプログラムを準備する。
Sencha Cmd v3.0.2.288
touch-2.1.1(僕のところでは、GPLバージョンを利用しています)
2:senchaコマンドでプロジェクトを作成する
$ sencha generate app MusicTube ../MusicTube
3:musicTubeのgithubのデータをDLしてくる。
4:コマンドで作成したプログラムに上書きする。

注意点:
gitのデータを見てもらえればわかりますが、sencha touchのリソースデータもいじってますので
単純にgenerateコマンドで生成したプロジェクト上でgit pullしてもconflictが発生してしまいます。
adlatisのコードやgoogle analyticsのコードをindex.htmlにいれてありますので、修正してください。
