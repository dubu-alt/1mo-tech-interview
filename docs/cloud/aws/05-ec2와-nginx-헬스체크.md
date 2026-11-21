---
title: "EC2와 Nginx 헬스체크"
sidebar: "EC2와 Nginx 헬스체크"
---

VPC 안에 서버를 띄우고 웹 서버를 올린 뒤, 밖에서 살아 있는지 확인하는 과정을 정리했습니다.

## EC2와 AMI

**EC2**는 AWS의 가상 서버입니다. 만들 때 고르는 것은 크게 세 가지입니다.

| 고를 것 | 뜻 | B3-1에서 |
|---|---|---|
| AMI | 서버에 깔 OS 이미지 | Ubuntu 22.04 LTS |
| 인스턴스 타입 | CPU·메모리 크기 | t2.micro (프리 티어) |
| 위치 | 어느 서브넷, 어느 보안 그룹 | 퍼블릭 서브넷, cloud-lab-web-sg |

디스크는 EBS 볼륨으로 붙는데, B3-1에서는 8GB gp3를 쓰고 인스턴스를 지우면 볼륨도 같이 지워지게(`DeleteOnTermination`) 했습니다.

## 키 페어와 SSH

**키 페어**는 공개키와 개인키 쌍입니다. AWS가 서버에 공개키를 넣어 두고 내 컴퓨터는 개인키(`.pem`)로 SSH 접속합니다.

```bash
chmod 400 my-cloud-key.pem               # 나만 읽을 수 있게
ssh -i my-cloud-key.pem ubuntu@<퍼블릭IP>   # Ubuntu AMI의 기본 사용자는 ubuntu
```

개인키 파일을 다른 사람도 읽을 수 있으면 SSH가 키 사용을 거부합니다. B3-1에서 `Permission denied (publickey)`가 났던 원인이 이 권한 문제였습니다.

## User Data로 Nginx 자동 설치

**User Data**는 EC2가 처음 켜질 때 한 번 실행되는 스크립트입니다. B3-1에서는 여기에 Nginx 설치, 기본 페이지("Hello Cloud!"), `/health` 설정을 넣어서 서버에 들어가지 않고도 웹 서버가 준비되게 했습니다.

```nginx
location /health {
    access_log off;
    return 200 'OK';
    add_header Content-Type text/plain;
}
```

## 헬스체크

**헬스체크**는 서버가 정상인지 정해진 주소로 확인하는 것입니다. 브라우저로 페이지를 보는 것은 사람이 눈으로 확인해야 하지만 헬스체크는 상태 코드와 응답으로 프로그램이 판단할 수 있습니다.

```bash
curl -s -o /dev/null -w "%{http_code}" http://<퍼블릭IP>/health   # 200
curl -s http://<퍼블릭IP>/health                                  # OK
```

로드 밸런서(ALB)도 같은 방식으로 대상 서버의 헬스체크 주소를 주기적으로 불러 보고 실패한 서버에는 요청을 보내지 않습니다.

## 면접에서 나올 만한 질문

### Q. 헬스체크 엔드포인트는 왜 따로 만드나요?

검증을 자동화할 수 있게 설계했는지 봅니다.

> 사람이 브라우저로 확인하는 방식은 자동화할 수 없습니다. `/health`가 항상 200과 `OK`를 돌려주게 해 두면 스크립트나 모니터링 도구가 상태 코드만 보고 성공과 실패를 판단할 수 있습니다. 로드 밸런서도 이 주소로 서버 상태를 확인해서 죽은 서버를 빼기 때문에 실무 구조를 미리 연습하는 의미도 있었습니다. B3-1에서는 Nginx 설정 몇 줄로 만들었고 접근 로그는 남기지 않게 했습니다.

### 꼬리질문

- 지금 `/health`는 Nginx만 살아 있으면 OK를 줍니다. 충분한가요?
  → 웹 서버가 살아 있는지만 알 수 있습니다. 뒤에 앱 서버나 DB가 있다면 그쪽까지 확인하는 헬스체크가 따로 필요합니다.
- SSH 접속에서 `Permission denied (publickey)`가 나면 무엇을 보나요?
  → 개인키 파일 권한(400), AMI에 맞는 사용자 이름(Ubuntu는 `ubuntu`), 인스턴스에 연결된 키 페어가 맞는지 순서대로 봅니다.

> 출처: [Codyssey-B1/B3-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B3-1)
