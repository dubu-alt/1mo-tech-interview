---
title: "SSH 보안과 방화벽"
---

서버에 대한 외부 접근을 제어하는 두 가지, SSH 보안 설정과 방화벽을 함께 정리했다.

## SSH 보안 설정

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

## 방화벽

### UFW (Ubuntu 기본 방화벽)

```bash
# UFW 활성화
ufw enable

# 포트 허용
ufw allow 20022/tcp
ufw allow 15034/tcp

# 상태 확인
ufw status

# 출력 예시
# To                Action  From
# 20022/tcp         ALLOW   Anywhere
# 15034/tcp         ALLOW   Anywhere
```

### firewalld

```bash
# 활성화
systemctl start firewalld
systemctl enable firewalld

# 포트 허용
firewall-cmd --permanent --add-port=20022/tcp
firewall-cmd --permanent --add-port=15034/tcp
firewall-cmd --reload

# 확인
firewall-cmd --list-all
```

### 방화벽의 역할

인바운드 트래픽을 포트 단위로 필터링한다. 허용하지 않은 포트로 들어오는 모든 연결은 차단된다. “필요한 포트만 열어 두는” 최소 허용 원칙이 기본이다.

## 정리

| 항목 | 내용 |
| --- | --- |
| SSH 설정 파일 | `/etc/ssh/sshd_config` |
| SSH 변경 항목 | `Port 20022`, `PermitRootLogin no` |
| SSH 적용 | `sshd -t` → `systemctl restart sshd` → `systemctl status sshd` |
| UFW | `ufw enable`, `ufw allow 20022/tcp`, `ufw allow 15034/tcp`, `ufw status` |
| firewalld | `firewall-cmd --permanent --add-port=...`, `--reload`, `--list-all` |
| 원칙 | 필요한 포트만 열어 두는 최소 허용 |

> 출처: [Codyssey-B1/B4-1](https://github.com/dubu-alt/Codyssey-B1/tree/main/B4-1)
