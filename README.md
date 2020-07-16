# ヨブトヤル

ユーザー同士でビデオ通話を繋げて、<br>
リアルタイムに一緒に黙々と作業会や勉強をするためのアプリです。
<br>
<br>

## :question: なぜ作ったのか

家で一人で勉強や作業をしていて、なかなか集中が出来なかったり、<br>
やる気が沸かない日ってどうしてもありますよね。<br>
そんな時はカフェや図書館に行ったり、あるいは友人と動画を繋げて一緒に作業会をしたりしていました。<br>
しかし、コロナの影響で外出が出来なくなり、また毎回友人に付き合ってもらうのもいたたまれなく、「同じ悩みを持つ者同士で集まって、交流するわけでもなく黙々と一緒に作業ができたらいいのに・・・・！」と思い、このアプリを作成しました。
<br>
<br>

## :globe_with_meridians: URL
https://yobutoyaru.herokuapp.com/
<br>
<br>

## :eyes: DEMO
<img src="https://user-images.githubusercontent.com/61342566/87677493-c9afbe00-c7b4-11ea-8516-c0083eee5e2d.png" width=70%>
<img src="https://user-images.githubusercontent.com/61342566/87676448-97519100-c7b3-11ea-829a-eb2519c454cb.png" width=70%>
<img src="https://user-images.githubusercontent.com/61342566/87676488-a46e8000-c7b3-11ea-8872-ddfa86567a48.png" width=70%>
<br>
<br>

## :wrench: 使用技術(開発環境)
### フロントエンド
* Haml
* Sass
* JavaScript

### バックエンド
* Ruby 2.5.1
* Rails 5.2.4.3

### Web API
* SkyWay API
* webRTC

### インフラストラクチャー
* Mysql
* Heroku


## :point_up: 工夫したポイント
ビデオ通話機能で、[SkyWay](https://webrtc.ecl.ntt.com/)というWeb APIを使用しました。<br>
Web APIに触れてみたい！という思いとJavaScriptを使うことで導入が出来る、
ということで今回使用しました。
<br>
また、SkyWayからユーザーを識別するために発行されるPeerIDというIDを<br>
アプリ内のユーザー情報を紐付けて管理をしています。<br>
そうすることでjoin/leave時やコメント送信時にPeerIDではなくユーザーニックネームが表示されたり、各ユーザーのjoin時間を測定し、累計時間をDBで保存出来るようにしました。
<br>
<br>

## :pencil: 今後実装したい機能
・学習のモチベーションを上げるために作業時間のランキング機能

