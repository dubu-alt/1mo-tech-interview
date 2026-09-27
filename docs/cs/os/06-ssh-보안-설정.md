---
title: "SSH 보안 설정"
---

### SSH란

원격 서버에 암호화된 연결로 접속하는 프로토콜이다. 기본 포트는 22번.

### 설정 파일

```
/etc/ssh/sshd_config
```

### 이번 미션에서 변경할 항목

```bash
# 포트 변경
Port 20022

# 루트 로그인 차단
PermitRootLogin no
```

### 설정 적용

```bash
# 설정 파일 문법 검사
sshd -t

# SSH 서비스 재시작
systemctl restart sshd

# 서비스 상태 확인
systemctl status sshd
```

### 왜 포트를 바꾸고 루트를 차단하는가

기본 포트 22번은 자동화된 해킹 도구(봇)의 주요 공격 대상이다. 포트를 바꾸면 무차별 공격 시도를 대폭 줄일 수 있다. 루트는 시스템 전체 권한을 가지므로 원격에서 직접 접근 가능하면 침해 시 피해가 치명적이다.

---


> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)