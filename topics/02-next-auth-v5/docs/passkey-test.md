# 패스키 인증 테스트

패스키 인증 테스트 관련한 내용을 정리한 문서다. 패스키 인증 및 WebAuthn에 대한 자세한 내용은 [여기](./webauthn.md)에 정리되어 있다.

## 모바일 테스트

스마트폰에서 로컬 컴퓨터에 있는 개발 서버에 접근하려면 동일 네트워크상에서 로컬 컴퓨터의 IP 주소를 입력해야 한다. 하지만 IP 주소를 입력해 사이트에 들어갈 경우, `window` 객체에 WebAuthn 인증에 필요한 `PublicKeyCredential` 객체가 없어 `WebAuthn is not supported in this browser` 에러가 발생한다.

따라서 모바일에서 패스키를 테스트 하려면 https을 지원하면서 도메인 네임을 통해 개발 서버에 접속해야 하는데, 이를 해결하기 위해 [ngrok](https://ngrok.com/)을 사용했다.

### ngrok

ngrok은 내부 서비스를 외부 트래픽과 안전하게 연결해주는 리버스 프록시 서비스다. 무료 버전과 유료 버전이 있으며 무료 버전을 사용하면 내부 서버를 임의의 도메인과 두시간 동안 연결해 사용할 수 있다.

ngrok을 사용하기 위해선 ngrok 회원가입과 ngrok 설치가 필요하다.

```bash
brew install ngrok # ngrok 설치
ngrok config add-authtoken <auth-token-here> # ngrok 회원가입 후 발급된 auth-token 입력
ngrok http <local-port-here> # 연결할 로컬 포트 입력
```

리버스 프록시 설정 후 포워딩된 URL을 환경 변수 `NEXTAUTH_URL`에 추가해야 정상적으로 인증이 가능하다.

```bash
# env.local
NEXTAUTH_URL=<forwarded-url-here>
```

## QR 코드 테스트

패스키가 없는 기기에서 패스키 인증을 할 때 QR 코드를 통해 패스키를 가지고 있는 스마트폰이나 태블릿으로 인증이 가능하다. 하지만 크롬과 같은 Chromium 기반의 웨일 브라우저에서 iOS 16 버전 기기로 QR 코드 로그인을 시도할 경우 모바일 기기에서 "작업을 완료할 수 없습니다." 에러가 뜨면서 브라우저로 인증 정보를 넘기지 못하는 현상이 재현 되었다.

| Browser | iOS 16 | iOS 18 |
| ------- | :----: | :----: |
| Safari  |   O    |   O    |
| Chrome  |   X    |   O    |
| Whale   |   X    |   O    |
| Firefox |   O    |   O    |

며칠간 관련 내용을 찾아보았으나 아직 원인은 파악하지 못해, 추후 추가 정리 예정이다. 다만, iOS 18 버전에서는 해당 현상이 재현되지 않는 것으로 보아 최신 iOS 버전에서는 해당 현상이 없을 것으로 보인다.
