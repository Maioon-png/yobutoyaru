# TaskWith

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
https://taskwith.herokuapp.com/
<br>
<br>

## :eyes: DEMO
<!-- ![Topページ](https://user-images.githubusercontent.com/61342566/87677493-c9afbe00-c7b4-11ea-8516-c0083eee5e2d.png)
![Roomページ](https://user-images.githubusercontent.com/61342566/87676448-97519100-c7b3-11ea-829a-eb2519c454cb.png)
![Recordページ](https://user-images.githubusercontent.com/61342566/87676488-a46e8000-c7b3-11ea-8872-ddfa86567a48.png) -->
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
ユーザーがビデオ通話にjoinするとSkyWayからユーザーを識別するための<br>
Peer IDというIDが与えられます。<br>
接続の度に新規に発行されてしまうのですが、このIDをアプリケーションのユーザー情報と紐付けて保存し、管理出来るようにしました。<br>
そうすることで各ユーザーのjoin時間を測定し、累計時間をDBで保存出来るようにしました。
<br>
<br>

## :pencil: 課題や今後実装したい機能

