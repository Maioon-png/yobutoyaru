window.onload = function () {

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const remoteVideosClass = document.getElementsByClassName('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  // const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  // const meta = document.getElementById('js-meta');
  const API_KEY = gon.skyway_key;
  const userName = document.getElementById('user-name').textContent.trim();
  const remoteVideo1 = document.getElementById('js-remote-streams-1');
  const remoteVideo2 = document.getElementById('js-remote-streams-2');
  const remoteVideo3 = document.getElementById('js-remote-streams-3');
  const remoteVideo4 = document.getElementById('js-remote-streams-4');
  const remoteVideo5 = document.getElementById('js-remote-streams-5');

  // タイマー用
  const timerLabel = document.getElementById('timerLabel');
  let status = 0; // 0:停止中 1:動作中
  let time = 0;

  function timer(){
    // ステータスが動作中の場合のみ実行
    if (status == 1) {
        setTimeout(function() {
            time++;

            // 分・秒・ミリ秒を計算
            var hour = Math.floor(time/100/60/60);
            var min = Math.floor(time/100/60);
            var sec = Math.floor(time/100);
            // var mSec = time % 100;

            if (hour < 10) hour  = "0" + hour;
            // 分が１桁の場合は、先頭に０をつける
            if (min < 10) min = "0" + min;

            // 秒が６０秒以上の場合　例）89秒→29秒にする
            if (sec >= 60) sec = sec % 60;

            // 秒が１桁の場合は、先頭に０をつける
            if (sec < 10) sec = "0" + sec;

          // ミリ秒が１桁の場合は、先頭に０をつける
            // if (mSec < 10) mSec = "0" + mSec;

            // タイマーラベルを更新
            timerLabel.innerHTML = hour + ":" + min + ":" + sec;

            // 再びtimer()を呼び出す
            timer();
        }, 10);
    }
}


　//自分の映像と音声をlocalStreamに代入
  const localStream = await navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .catch(console.error);
    
  // localStreamをdiv(localVideo)に挿入
  localVideo.muted = true;
  localVideo.srcObject = localStream;
  localVideo.playsInline = true;
  await localVideo.play().catch(console.error);

  var textMsg = document.getElementsByClassName('my-peer-id')[0];
  // var user_name = document.getElementById(textMsg.id).textContent.trim();

  if (textMsg != null) {
    // var user_name = document.getElementById(textMsg.id).textContent;
    var user_name = document.getElementById(textMsg.id).textContent.trim();
    var myPeer = textMsg.id;
    var peer = new Peer(myPeer, {
      key: API_KEY,
      debug: 3
    });
    
  } else {

  // Peerのインスタンス作成
  // API_KEYを設定
  var peer = new Peer({
    key: API_KEY,
    debug: 3
  });
  
  peer.on('open', () => {
    let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
    let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
    xmlHR.open("POST", "/rooms", true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
    xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定
    xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
    xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
    let hashData = {  // 送信するデータをハッシュ形式で指定
      peer: {peer: peer.id }  // 入力テキストを送信
    };
    let data = JSON.stringify(hashData); // 送信用のjson形式に変換
    xmlHR.send(data);  // sendメソッドでサーバに送信

    xmlHR.onreadystatechange = function() {
      if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
        if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
          // (1) リクエストが成功した場合に行う処理
          let peer = xmlHR.response;    
          document.getElementById('my-id').textContent = peer.nickname;
          alert("peer登録成功！")

        } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
          alert("peer登録失敗")
        }
        // (3) リクエストの成功・失敗に関わらず行う処理
      }
    };
  });
  }

  // 「div(joinTrigger)が押される＆既に接続が始まっていなかったら接続」するリスナーを設置
  joinTrigger.addEventListener('click', () => {
    if (!peer.open ) {
      return;  
    }     
  //部屋に接続するメソッド（joinRoom）
  // sfuをデフォルト指定

    const room = peer.joinRoom(roomId.value, {
      mode: "sfu",
      stream: localStream,
    });

　　//部屋に接続できた時（open）に一度だけdiv(messages)に=== You joined ===を表示
    room.once('open', ( )=> {
      
      // タイマー用
      // 動作中にする
      status = 1;
      time = 0;
      timer();

      peer.listAllPeers(peers => {
        if (peers.length > 6) {
          peer.disconnect();
          alert("満室です！");
        }
      });
      messages.textContent += '=== You joined ===\n';
    });
    
　　//部屋に誰かが接続してきた時（peerJoin）、いつでもdiv(messages)に下記のテキストを表示
    room.on('peerJoin', peerId => {

      let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
      let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
      xmlHR.open("POST", "/rooms/search", true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
      xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定
      xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
      xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
      let hashData = {  // 送信するデータをハッシュ形式で指定
        peer: peerId    // 入力テキストを送信
      };
      let data = JSON.stringify(hashData); // 送信用のjson形式に変換
      xmlHR.send(data);  // sendメソッドでサーバに送信
  
      xmlHR.onreadystatechange = function() {
        if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
          if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
            // (1) リクエストが成功した場合に行う処理
            let other_user = xmlHR.response;    
            messages.textContent += `=== ${other_user.nickname} joined ===\n`;
          } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
            alert("参加者のnickname取得失敗")
          }
          // (3) リクエストの成功・失敗に関わらず行う処理
        }
      };
      
    });

    //重要：　streamの内容に変更があった時（stream）videoタグを作って流す
    room.on('stream', async stream => {
      const newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.playsInline = true;
      // 誰かが退出した時どの人が退出したかわかるように、data-peer-idを付与
      newVideo.setAttribute('data-peer-id', stream.peerId);

      if ( remoteVideo1.children.length === 0 ) {
        remoteVideo1.appendChild(newVideo).setAttribute("width", "200");
        remoteVideo1.setAttribute('data-peer-id', stream.peerId);
      } else if ( remoteVideo2.children.length === 0 ) {
        remoteVideo2.appendChild(newVideo).setAttribute("width", "200");
        remoteVideo2.setAttribute('data-peer-id', stream.peerId);
      } else if ( remoteVideo3.children.length === 0 ) {
        remoteVideo3.appendChild(newVideo).setAttribute("width", "200");
        remoteVideo3.setAttribute('data-peer-id', stream.peerId);
      } else if ( remoteVideo4.children.length === 0 ) {
        remoteVideo4.appendChild(newVideo).setAttribute("width", "200");
        remoteVideo4.setAttribute('data-peer-id', stream.peerId);
      } else if ( remoteVideo5.children.length === 0 ) {
        remoteVideo5.appendChild(newVideo).setAttribute("width", "200");
        remoteVideo5.setAttribute('data-peer-id', stream.peerId);
      } 
      // remoteVideos.appendChild(newVideo).setAttribute("width", "200");
      await newVideo.play().catch(console.error);
    });

    //重要：　誰かがテキストメッセージを送った時、messagesを更新
    room.on('data', ({ data, src }) => {

      let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
      let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
      xmlHR.open("POST", "/rooms/search", true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
      xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定
      xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
      xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
      let hashData = {  // 送信するデータをハッシュ形式で指定
        peer: src    // 入力テキストを送信
      };
      let userdata = JSON.stringify(hashData); // 送信用のjson形式に変換
      xmlHR.send(userdata);  // sendメソッドでサーバに送信
      xmlHR.onreadystatechange = function() {
        if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
          if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
            // (1) リクエストが成功した場合に行う処理
            let userName = xmlHR.response;  
            console.log("MESSAGEOK!");  
            messages.textContent += `${userName.nickname}: ${data}\n`;
          } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
            alert("参加者のnickname取得失敗")
          }
          // (3) リクエストの成功・失敗に関わらず行う処理
        }
      };

      
    });

    // 誰かが退出した場合、div（remoteVideos）内にある、任意のdata-peer-idがついたvideoタグの内容を空にして削除する
    room.on('peerLeave', peerId => {
      console.logh("ここ動かないの？");
      const remoteVideoClass = remoteVideos.querySelector(`[data-peer-id=${peerId}]`);
      const remoteVideo = remoteVideoClass.children[0];
      console.log(remoteVideo); //<video playsinline="" data-peer-id="oQ6B75mxkTVfRE9c" width="200"></video>
　　　　//videoストリームを止める上では定番の書き方らしい。https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();
      remoteVideoClass.removeAttribute("data-peer-id");

      let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
      let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
      xmlHR.open("POST", "/rooms/search", true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
      xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定
      xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
      xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
      let hashData = {  // 送信するデータをハッシュ形式で指定
        peer: peerId    // 入力テキストを送信
      };
      let data = JSON.stringify(hashData); // 送信用のjson形式に変換
      xmlHR.send(data);  // sendメソッドでサーバに送信
      xmlHR.onreadystatechange = function() {
        if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
          if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
            // (1) リクエストが成功した場合に行う処理
            let other_user = xmlHR.response;    
            messages.textContent += `=== ${other_user.nickname} left ===\n`;
          } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
            alert("参加者のnickname取得失敗")
          }
          // (3) リクエストの成功・失敗に関わらず行う処理
        }
      };

      
    });

    // 自分が退出した場合の処理
    room.once('close', () => {
　　　　//メッセージ送信ボタンを押せなくする
      sendTrigger.removeEventListener('click', onClickSend);
　　　　//messagesに== You left ===\nを表示
      messages.textContent += '== You left ===\n';  
　　　　//remoteVideos以下の全てのvideoタグのストリームを停めてから削除
      // console.log(remoteVideosClass);
      // remoteVideosClass.forEach( function(element, index, array) {
      //   array [ index ] = element.children[index]
      // })
      // console.log(remoteVideosClass);
      const arrayRemoteVideos = Array.prototype.slice.call(remoteVideosClass);
      console.log(arrayRemoteVideos);
      arrayRemoteVideos.forEach( function(element, index, array) {
        element.removeAttribute("data-peer-id");
        array [ index ] = element.children[index]
      })
      const newArrayRemoteVideos = arrayRemoteVideos.filter(v => v);
      console.log(newArrayRemoteVideos);
      Array.from(newArrayRemoteVideos).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    // ボタン（sendTrigger）を押すとonClickSendを発動
    sendTrigger.addEventListener('click', onClickSend);
　　// ボタン（leaveTrigger）を押すとroom.close()を発動
    leaveTrigger.addEventListener('click', () => {
      
      // タイマー用
      // 停止中にする
      status = 0;
      console.log(time);
      // timeデータを送信する
      let token = document.getElementsByName("csrf-token")[0].content; //セキュリティトークンの取得
      let xmlHR = new XMLHttpRequest();  // XMLHttpRequestオブジェクトの作成
      xmlHR.open("POST", "/records", true);  // open(HTTPメソッド, URL, 非同期通信[true:default]か同期通信[false]か）
      xmlHR.responseType = "json";  // レスポンスデータをjson形式と指定
      xmlHR.setRequestHeader("Content-Type", "application/json");  // リクエストヘッダーを追加(HTTP通信でJSONを送る際のルール)
      xmlHR.setRequestHeader("X-CSRF-Token", token);  // リクエストヘッダーを追加（セキュリティトークンの追加）
      let hashData = {  // 送信するデータをハッシュ形式で指定
        time: time    // 入力テキストを送信
      };
      let data = JSON.stringify(hashData); // 送信用のjson形式に変換
      xmlHR.send(data);  // sendメソッドでサーバに送信
      xmlHR.onreadystatechange = function() {
        if (xmlHR.readyState === 4) {  // readyStateが4になればデータの読込み完了
          if (xmlHR.status === 200) {  // statusが200の場合はリクエストが成功
            // (1) リクエストが成功した場合に行う処理
            let time = xmlHR.response;    
            console.log("OK");
            console.log(time.time);
          } else {  // statusが200以外の場合はリクエストが適切でなかったとしてエラー表示
            alert("recordへ通信失敗")
          }
          // (3) リクエストの成功・失敗に関わらず行う処理
        }
      };

      
      room.close(), { once: true }});

　　　//テキストメッセージを送る処理
    function onClickSend() {
      room.send(localText.value);
      messages.textContent += `${userName}: ${localText.value}\n`;
      localText.value = '';
    }
  });

  peer.on('error', console.error);
})();
}