window.onload = function () {

(async function main() {
  const localVideo = document.getElementById('js-local-stream');
  const joinTrigger = document.getElementById('js-join-trigger');
  const leaveTrigger = document.getElementById('js-leave-trigger');
  const remoteVideos = document.getElementById('js-remote-streams');
  const roomId = document.getElementById('js-room-id');
  const roomMode = document.getElementById('js-room-mode');
  const localText = document.getElementById('js-local-text');
  const sendTrigger = document.getElementById('js-send-trigger');
  const messages = document.getElementById('js-messages');
  // const meta = document.getElementById('js-meta');
  const API_KEY = "8f0613f7-8b39-4b72-bca3-6b39bb8c390d"; 

// 　//同時接続モードがSFUなのかMESHなのかをここで設定
//   const getRoomModeByHash = () => (location.hash === '#sfu' ? 'sfu' : 'mesh');
// 　//divタグに接続モードを挿入
//   roomMode.textContent = getRoomModeByHash();
// 　//接続モードの変更を感知するリスナーを設置
//   window.addEventListener(
//     'hashchange',
//     () => (roomMode.textContent = getRoomModeByHash())
//   );

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
    console.log(user_name);
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
    if (!peer.open) {
      return;
    }
  console.log("4ばんめ");
    
  //部屋に接続するメソッド（joinRoom）
  // sfuをデフォルト指定
    const room = peer.joinRoom(roomId.value, {
      mode: "sfu",
      stream: localStream,
    });

　　//部屋に接続できた時（open）に一度だけdiv(messages)に=== You joined ===を表示
    room.once('open', () => {
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
      remoteVideos.append(newVideo);
      await newVideo.play().catch(console.error);
    });

    //重要：　誰かがテキストメッセージを送った時、messagesを更新
    room.on('data', ({ data, src }) => {
      messages.textContent += `${src}: ${data}\n`;
    });

    // 誰かが退出した場合、div（remoteVideos）内にある、任意のdata-peer-idがついたvideoタグの内容を空にして削除する
    room.on('peerLeave', peerId => {

      const remoteVideo = remoteVideos.querySelector(
        `[data-peer-id=${peerId}]`
      );
　　　　//videoストリームを止める上では定番の書き方らしい。https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop
      remoteVideo.srcObject.getTracks().forEach(track => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();

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
      Array.from(remoteVideos.children).forEach(remoteVideo => {
        remoteVideo.srcObject.getTracks().forEach(track => track.stop());
        remoteVideo.srcObject = null;
        remoteVideo.remove();
      });
    });

    // ボタン（sendTrigger）を押すとonClickSendを発動
    sendTrigger.addEventListener('click', onClickSend);
　　// ボタン（leaveTrigger）を押すとroom.close()を発動
    leaveTrigger.addEventListener('click', () => room.close(), { once: true });

　　　//テキストメッセージを送る処理
    function onClickSend() {
      room.send(localText.value);
      messages.textContent += `${peer.id}: ${localText.value}\n`;
      localText.value = '';
    }
  });

  peer.on('error', console.error);
})();
}