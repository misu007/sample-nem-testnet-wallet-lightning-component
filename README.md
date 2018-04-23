# Sample - NEM Testnet Wallet Lightning Component 


CAUTION: This component is connected to public blockchain of NEM testnet. It is totaly different from the one of NEM mainnet.


## Install

Access to below URL, and follow the navigation to install the unmanaged Package.
_https://login.salesforce.com/packaging/installPackage.apexp?p0=04t7F000004SQyf_


## How to use

* After completing to install, Open NEM app from the App launcher in Lightning.
![Screenshot001](https://github.com/misu007/sample-nem-testnet-wallet-lightning-component/blob/master/for-read-me-001.png?raw=true)
* You can see Nem wallet in the right-hand area in Nem Wallet Tab.
![Screenshot002](https://github.com/misu007/sample-nem-testnet-wallet-lightning-component/blob/master/for-read-me-002.png?raw=true)


## Features

* Showing balance and histories in real-time
* Showing your NEM testnet wallet address and QR image
* Capability to send token

## Architecture

* Private Wallet address and wallet secret data are stored in dedicated fields of User object.
* If there is no wallet address and no secret in the fields, query for generating wallet will be called out to API service and store the data from the response into the dedicated fields.
* Regarding the other features such as getting balance, transaction history and sending token are also working with calling out to API service.
  
  
***
  
# サンプル - NEM(テスト環境)ウォレット Lightningコンポーネント 


注意: このコンポーネントはNEMテストネットに接続して動作します。取引所で購入できるNEMメインネットとは全く異なりますのでご注意ください。


## インストール手順

以下URLにアクセスし、お持ちのSalesforce Developer Editionの環境アカウントにてログインし、ナビゲーションに沿ってインストールを進めます。
_https://login.salesforce.com/packaging/installPackage.apexp?p0=04t7F000004SQyf_


## 使い方

* インストールが完了した後、アプリランチャーからNEMアプリを開きます。
![Screenshot001](https://github.com/misu007/sample-nem-testnet-wallet-lightning-component/blob/master/for-read-me-001.png?raw=true)
* NEMウォレットタブ上の右側にNEMウォレットが表示されます。
![Screenshot002](https://github.com/misu007/sample-nem-testnet-wallet-lightning-component/blob/master/for-read-me-002.png?raw=true)


## 機能

* リアルタイムでの残高/履歴の表示
* 自分のNEM testnet ウォレットアドレス、QRコードの表示
* トークン送信機能

## 仕様

* ウォレットアドレス、暗号化した秘密鍵データはユーザオブジェクトの専用項目に格納されます。
* ユーザのウォレットアドレス、秘密鍵データがない場合、ウォレット生成のためのクエリをAPIサーバに投げ、レスポンスに含まれるウォレット情報をユーザレコードに保存します。
* 残高/履歴確認、トークンの送金に関しても、APIサーバにリクエストを投げることで動作します。

